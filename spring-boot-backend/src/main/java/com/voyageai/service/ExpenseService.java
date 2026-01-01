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

    public List<ExpenseDTO> getExpensesByItinerary(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);
        return expenseRepository.findByItineraryIdOrderByDateDesc(itineraryId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ExpenseDTO getExpense(UUID expenseId, User user) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        
        validateAccess(expense.getItinerary().getId(), user);
        return mapToDTO(expense);
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
                .receiptUrl(request.getReceiptUrl())
                .build();

        expense = expenseRepository.save(expense);

        // Update payer's total paid
        paidBy.setTotalPaid(paidBy.getTotalPaid().add(request.getAmount()));
        participantRepository.save(paidBy);

        // Create splits
        if (request.getSplits() != null && !request.getSplits().isEmpty()) {
            for (ExpenseSplitRequest splitReq : request.getSplits()) {
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

        // Revert old payer's total paid if payer is changing
        TripParticipant oldPaidBy = expense.getPaidByParticipant();
        BigDecimal oldAmount = expense.getAmount();

        if (request.getPaidByParticipantId() != null && !request.getPaidByParticipantId().equals(oldPaidBy.getId())) {
            // Revert old payer
            oldPaidBy.setTotalPaid(oldPaidBy.getTotalPaid().subtract(oldAmount));
            participantRepository.save(oldPaidBy);

            // Set new payer
            TripParticipant newPaidBy = participantRepository.findById(request.getPaidByParticipantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));
            expense.setPaidByParticipant(newPaidBy);
            newPaidBy.setTotalPaid(newPaidBy.getTotalPaid().add(request.getAmount() != null ? request.getAmount() : oldAmount));
            participantRepository.save(newPaidBy);
        } else if (request.getAmount() != null && !request.getAmount().equals(oldAmount)) {
            // Update payer's total paid with the difference
            BigDecimal difference = request.getAmount().subtract(oldAmount);
            oldPaidBy.setTotalPaid(oldPaidBy.getTotalPaid().add(difference));
            participantRepository.save(oldPaidBy);
        }

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
        if (request.getSplitType() != null) {
            expense.setSplitType(request.getSplitType());
        }
        if (request.getReceiptUrl() != null) {
            expense.setReceiptUrl(request.getReceiptUrl());
        }

        // Handle splits update
        if (request.getSplits() != null) {
            // Revert old splits
            for (ExpenseSplit oldSplit : expenseSplitRepository.findByExpenseId(expenseId)) {
                TripParticipant participant = oldSplit.getParticipant();
                participant.setTotalOwed(participant.getTotalOwed().subtract(oldSplit.getAmount()));
                participantRepository.save(participant);
            }
            expenseSplitRepository.deleteByExpenseId(expenseId);

            // Create new splits
            for (ExpenseSplitRequest splitReq : request.getSplits()) {
                TripParticipant participant = participantRepository.findById(splitReq.getParticipantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));

                ExpenseSplit split = ExpenseSplit.builder()
                        .expense(expense)
                        .participant(participant)
                        .amount(splitReq.getAmount())
                        .build();
                expenseSplitRepository.save(split);

                participant.setTotalOwed(participant.getTotalOwed().add(splitReq.getAmount()));
                participantRepository.save(participant);
            }
        }

        expense = expenseRepository.save(expense);
        log.info("Expense updated: {}", expenseId);
        return mapToDTO(expense);
    }

    @Transactional
    public void deleteExpense(UUID expenseId, User user) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        
        validateOwnerAccess(expense.getItinerary().getId(), user);

        // Revert payer's total paid
        TripParticipant paidBy = expense.getPaidByParticipant();
        paidBy.setTotalPaid(paidBy.getTotalPaid().subtract(expense.getAmount()));
        participantRepository.save(paidBy);

        // Revert splits
        for (ExpenseSplit split : expenseSplitRepository.findByExpenseId(expenseId)) {
            TripParticipant participant = split.getParticipant();
            participant.setTotalOwed(participant.getTotalOwed().subtract(split.getAmount()));
            participantRepository.save(participant);
        }

        // Delete splits first
        expenseSplitRepository.deleteByExpenseId(expenseId);
        
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
                        .participantName(p.getName())
                        .totalPaid(p.getTotalPaid())
                        .totalOwed(p.getTotalOwed())
                        .balance(p.getTotalPaid().subtract(p.getTotalOwed()))
                        .build())
                .collect(Collectors.toList());

        return ExpenseSummaryDTO.builder()
                .itineraryId(itineraryId)
                .totalExpenses(total != null ? total : BigDecimal.ZERO)
                .currency("INR")
                .expenseCount(expenseRepository.findByItineraryIdOrderByDateDesc(itineraryId).size())
                .expensesByCategory(categoryBreakdown)
                .participantBalances(balances)
                .build();
    }

    // Settlements
    public List<SettlementDTO> getSettlements(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);
        return settlementRepository.findByItineraryIdOrderBySettledAtDesc(itineraryId)
                .stream()
                .map(this::mapSettlementToDTO)
                .collect(Collectors.toList());
    }

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
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .notes(request.getNotes())
                .build();

        settlement = settlementRepository.save(settlement);

        // Update balances - from pays to, so from's paid increases and to's owed decreases
        from.setTotalPaid(from.getTotalPaid().add(request.getAmount()));
        to.setTotalOwed(to.getTotalOwed().subtract(request.getAmount()));
        participantRepository.save(from);
        participantRepository.save(to);

        log.info("Settlement created: {} for itinerary: {}", settlement.getId(), itineraryId);
        return mapSettlementToDTO(settlement);
    }

    @Transactional
    public void deleteSettlement(UUID settlementId, User user) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found"));
        
        validateOwnerAccess(settlement.getItinerary().getId(), user);

        // Revert balances
        TripParticipant from = settlement.getFromParticipant();
        TripParticipant to = settlement.getToParticipant();
        
        from.setTotalPaid(from.getTotalPaid().subtract(settlement.getAmount()));
        to.setTotalOwed(to.getTotalOwed().add(settlement.getAmount()));
        participantRepository.save(from);
        participantRepository.save(to);

        settlementRepository.delete(settlement);
        log.info("Settlement deleted: {}", settlementId);
    }

    public List<ParticipantBalanceDTO> calculateBalances(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);
        
        List<TripParticipant> participants = participantRepository.findByItineraryId(itineraryId);
        
        return participants.stream()
                .map(p -> ParticipantBalanceDTO.builder()
                        .participantId(p.getId())
                        .participantName(p.getName())
                        .totalPaid(p.getTotalPaid())
                        .totalOwed(p.getTotalOwed())
                        .balance(p.getTotalPaid().subtract(p.getTotalOwed()))
                        .build())
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
                .receiptUrl(expense.getReceiptUrl())
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
