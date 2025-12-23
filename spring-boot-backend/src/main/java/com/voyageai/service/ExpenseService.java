package com.voyageai.service;

import com.voyageai.dto.expense.*;
import com.voyageai.entity.*;
import com.voyageai.exception.ForbiddenException;
import com.voyageai.exception.ResourceNotFoundException;
import com.voyageai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final ItineraryRepository itineraryRepository;
    private final TripParticipantRepository participantRepository;
    private final SettlementRepository settlementRepository;

    public List<ExpenseDTO> getExpenses(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);
        return expenseRepository.findByItineraryIdOrderByDateDesc(itineraryId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExpenseDTO createExpense(UUID itineraryId, CreateExpenseRequest request, User user) {
        validateAccess(itineraryId, user);
        
        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));
        
        TripParticipant paidBy = participantRepository.findById(request.getPaidByParticipantId())
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));

        Expense expense = Expense.builder()
                .itinerary(itinerary)
                .paidByParticipant(paidBy)
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .category(request.getCategory())
                .description(request.getDescription())
                .date(request.getDate())
                .splitType(request.getSplitType())
                .build();

        expense = expenseRepository.save(expense);

        // Update payer's total paid
        paidBy.setTotalPaid(paidBy.getTotalPaid().add(request.getAmount()));
        participantRepository.save(paidBy);

        // Create splits
        if (request.getSplits() != null && !request.getSplits().isEmpty()) {
            for (CreateExpenseSplitRequest splitReq : request.getSplits()) {
                TripParticipant participant = participantRepository.findById(splitReq.getParticipantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));

                ExpenseSplit split = ExpenseSplit.builder()
                        .expense(expense)
                        .participant(participant)
                        .amount(splitReq.getAmount())
                        .build();
                expenseSplitRepository.save(split);

                // Update participant's total owed
                participant.setTotalOwed(participant.getTotalOwed().add(splitReq.getAmount()));
                participantRepository.save(participant);
            }
        } else {
            // Equal split among all participants
            List<TripParticipant> participants = participantRepository.findByItineraryId(itineraryId);
            BigDecimal splitAmount = request.getAmount().divide(
                    BigDecimal.valueOf(participants.size()), 2, RoundingMode.HALF_UP);

            for (TripParticipant participant : participants) {
                ExpenseSplit split = ExpenseSplit.builder()
                        .expense(expense)
                        .participant(participant)
                        .amount(splitAmount)
                        .build();
                expenseSplitRepository.save(split);

                participant.setTotalOwed(participant.getTotalOwed().add(splitAmount));
                participantRepository.save(participant);
            }
        }

        log.info("Expense created: {} for itinerary: {}", expense.getId(), itineraryId);
        return mapToDTO(expense);
    }

    @Transactional
    public ExpenseDTO updateExpense(UUID expenseId, UpdateExpenseRequest request, User user) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        
        validateOwnerAccess(expense.getItinerary().getId(), user);

        if (request.getAmount() != null) {
            expense.setAmount(request.getAmount());
        }
        if (request.getCurrency() != null) {
            expense.setCurrency(request.getCurrency());
        }
        if (request.getCategory() != null) {
            expense.setCategory(request.getCategory());
        }
        if (request.getDescription() != null) {
            expense.setDescription(request.getDescription());
        }
        if (request.getDate() != null) {
            expense.setDate(request.getDate());
        }

        expense = expenseRepository.save(expense);
        return mapToDTO(expense);
    }

    @Transactional
    public void deleteExpense(UUID expenseId, User user) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        
        validateOwnerAccess(expense.getItinerary().getId(), user);

        // Revert totals
        TripParticipant paidBy = expense.getPaidByParticipant();
        paidBy.setTotalPaid(paidBy.getTotalPaid().subtract(expense.getAmount()));
        participantRepository.save(paidBy);

        for (ExpenseSplit split : expenseSplitRepository.findByExpenseId(expenseId)) {
            TripParticipant participant = split.getParticipant();
            participant.setTotalOwed(participant.getTotalOwed().subtract(split.getAmount()));
            participantRepository.save(participant);
        }

        expenseRepository.delete(expense);
        log.info("Expense deleted: {}", expenseId);
    }

    public ExpenseSummaryDTO getExpenseSummary(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);

        BigDecimal total = expenseRepository.getTotalExpenses(itineraryId);
        List<Object[]> byCategory = expenseRepository.getExpensesByCategory(itineraryId);
        List<TripParticipant> participants = participantRepository.findByItineraryId(itineraryId);

        Map<String, BigDecimal> categoryBreakdown = new HashMap<>();
        for (Object[] row : byCategory) {
            categoryBreakdown.put((String) row[0], (BigDecimal) row[1]);
        }

        List<ParticipantBalanceDTO> balances = participants.stream()
                .map(p -> ParticipantBalanceDTO.builder()
                        .participantId(p.getId())
                        .name(p.getName())
                        .totalPaid(p.getTotalPaid())
                        .totalOwed(p.getTotalOwed())
                        .balance(p.getTotalPaid().subtract(p.getTotalOwed()))
                        .build())
                .collect(Collectors.toList());

        return ExpenseSummaryDTO.builder()
                .totalExpenses(total != null ? total : BigDecimal.ZERO)
                .categoryBreakdown(categoryBreakdown)
                .participantBalances(balances)
                .build();
    }

    // Settlements
    @Transactional
    public SettlementDTO createSettlement(UUID itineraryId, CreateSettlementRequest request, User user) {
        validateAccess(itineraryId, user);

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        TripParticipant from = participantRepository.findById(request.getFromParticipantId())
                .orElseThrow(() -> new ResourceNotFoundException("From participant not found"));
        TripParticipant to = participantRepository.findById(request.getToParticipantId())
                .orElseThrow(() -> new ResourceNotFoundException("To participant not found"));

        Settlement settlement = Settlement.builder()
                .itinerary(itinerary)
                .fromParticipant(from)
                .toParticipant(to)
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .notes(request.getNotes())
                .build();

        settlement = settlementRepository.save(settlement);

        // Update balances
        from.setTotalPaid(from.getTotalPaid().add(request.getAmount()));
        to.setTotalOwed(to.getTotalOwed().add(request.getAmount()));
        participantRepository.save(from);
        participantRepository.save(to);

        log.info("Settlement created: {} for itinerary: {}", settlement.getId(), itineraryId);
        return mapSettlementToDTO(settlement);
    }

    public List<SettlementDTO> getSettlements(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);
        return settlementRepository.findByItineraryIdOrderBySettledAtDesc(itineraryId)
                .stream()
                .map(this::mapSettlementToDTO)
                .collect(Collectors.toList());
    }

    // Helper methods
    private void validateAccess(UUID itineraryId, User user) {
        if (!itineraryRepository.isOwner(itineraryId, user.getId()) &&
            !itineraryRepository.isParticipant(itineraryId, user.getId())) {
            throw new ForbiddenException("You don't have access to this itinerary");
        }
    }

    private void validateOwnerAccess(UUID itineraryId, User user) {
        if (!itineraryRepository.isOwner(itineraryId, user.getId())) {
            throw new ForbiddenException("Only the owner can perform this action");
        }
    }

    private ExpenseDTO mapToDTO(Expense expense) {
        List<ExpenseSplitDTO> splits = expenseSplitRepository.findByExpenseId(expense.getId())
                .stream()
                .map(s -> ExpenseSplitDTO.builder()
                        .id(s.getId())
                        .participantId(s.getParticipant().getId())
                        .participantName(s.getParticipant().getName())
                        .amount(s.getAmount())
                        .build())
                .collect(Collectors.toList());

        return ExpenseDTO.builder()
                .id(expense.getId())
                .itineraryId(expense.getItinerary().getId())
                .paidByParticipantId(expense.getPaidByParticipant().getId())
                .paidByParticipantName(expense.getPaidByParticipant().getName())
                .amount(expense.getAmount())
                .currency(expense.getCurrency())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .date(expense.getDate())
                .splitType(expense.getSplitType())
                .splits(splits)
                .createdAt(expense.getCreatedAt())
                .build();
    }

    private SettlementDTO mapSettlementToDTO(Settlement settlement) {
        return SettlementDTO.builder()
                .id(settlement.getId())
                .itineraryId(settlement.getItinerary().getId())
                .fromParticipantId(settlement.getFromParticipant().getId())
                .fromParticipantName(settlement.getFromParticipant().getName())
                .toParticipantId(settlement.getToParticipant().getId())
                .toParticipantName(settlement.getToParticipant().getName())
                .amount(settlement.getAmount())
                .currency(settlement.getCurrency())
                .notes(settlement.getNotes())
                .settledAt(settlement.getSettledAt())
                .build();
    }
}
