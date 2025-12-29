package com.voyageai.controller;

import com.voyageai.dto.expense.*;
import com.voyageai.entity.User;
import com.voyageai.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Tag(name = "Expenses", description = "Expense tracking and splitting")
@SecurityRequirement(name = "bearerAuth")
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/itinerary/{itineraryId}")
    @Operation(summary = "Get all expenses for an itinerary")
    public ResponseEntity<List<ExpenseDTO>> getExpenses(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(expenseService.getExpensesByItinerary(itineraryId, user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ExpenseDTO> getExpense(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(expenseService.getExpense(id, user));
    }

    @PostMapping("/itinerary/{itineraryId}")
    @Operation(summary = "Create a new expense")
    public ResponseEntity<ExpenseDTO> createExpense(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId,
            @Valid @RequestBody CreateExpenseRequest request
    ) {
        return ResponseEntity.ok(expenseService.createExpense(itineraryId, request, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense")
    public ResponseEntity<ExpenseDTO> updateExpense(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExpenseRequest request
    ) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<Void> deleteExpense(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        expenseService.deleteExpense(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/itinerary/{itineraryId}/settlements")
    @Operation(summary = "Get all settlements for an itinerary")
    public ResponseEntity<List<SettlementDTO>> getSettlements(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(expenseService.getSettlements(itineraryId, user));
    }

    @PostMapping("/itinerary/{itineraryId}/settlements")
    @Operation(summary = "Create a settlement")
    public ResponseEntity<SettlementDTO> createSettlement(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId,
            @Valid @RequestBody CreateSettlementRequest request
    ) {
        return ResponseEntity.ok(expenseService.createSettlement(itineraryId, request, user));
    }

    @DeleteMapping("/settlements/{id}")
    @Operation(summary = "Delete a settlement")
    public ResponseEntity<Void> deleteSettlement(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        expenseService.deleteSettlement(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/itinerary/{itineraryId}/balances")
    @Operation(summary = "Calculate balances for all participants")
    public ResponseEntity<List<ParticipantBalanceDTO>> getBalances(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(expenseService.calculateBalances(itineraryId, user));
    }

    @GetMapping("/itinerary/{itineraryId}/summary")
    @Operation(summary = "Get expense summary for an itinerary")
    public ResponseEntity<ExpenseSummaryDTO> getExpenseSummary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(expenseService.getExpenseSummary(itineraryId, user));
    }
}
