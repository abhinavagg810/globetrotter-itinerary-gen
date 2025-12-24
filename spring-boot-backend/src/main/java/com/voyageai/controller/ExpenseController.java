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
        return ResponseEntity.ok(expenseService.getExpensesByItinerary(user, itineraryId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ExpenseDTO> getExpense(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(expenseService.getExpense(user, id));
    }

    @PostMapping
    @Operation(summary = "Create a new expense")
    public ResponseEntity<ExpenseDTO> createExpense(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateExpenseRequest request
    ) {
        return ResponseEntity.ok(expenseService.createExpense(user, request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense")
    public ResponseEntity<ExpenseDTO> updateExpense(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody CreateExpenseRequest request
    ) {
        return ResponseEntity.ok(expenseService.updateExpense(user, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<Void> deleteExpense(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        expenseService.deleteExpense(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/itinerary/{itineraryId}/settlements")
    @Operation(summary = "Get all settlements for an itinerary")
    public ResponseEntity<List<SettlementDTO>> getSettlements(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(expenseService.getSettlements(user, itineraryId));
    }

    @PostMapping("/settlements")
    @Operation(summary = "Create a settlement")
    public ResponseEntity<SettlementDTO> createSettlement(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateSettlementRequest request
    ) {
        return ResponseEntity.ok(expenseService.createSettlement(user, request));
    }

    @DeleteMapping("/settlements/{id}")
    @Operation(summary = "Delete a settlement")
    public ResponseEntity<Void> deleteSettlement(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        expenseService.deleteSettlement(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/itinerary/{itineraryId}/balances")
    @Operation(summary = "Calculate balances for all participants")
    public ResponseEntity<List<ParticipantBalanceDTO>> getBalances(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(expenseService.calculateBalances(user, itineraryId));
    }
}
