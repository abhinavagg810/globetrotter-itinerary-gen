package com.voyageai.dto.expense;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateExpenseRequest {
    
    @NotNull(message = "Itinerary ID is required")
    private UUID itineraryId;
    
    @NotNull(message = "Paid by participant ID is required")
    private UUID paidByParticipantId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotBlank(message = "Currency is required")
    private String currency;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String description;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    private String receiptUrl;
    private String splitType;
    private List<ExpenseSplitRequest> splits;
}
