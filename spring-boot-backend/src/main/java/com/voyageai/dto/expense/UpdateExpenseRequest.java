package com.voyageai.dto.expense;

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
public class UpdateExpenseRequest {
    private UUID paidByParticipantId;

    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private String currency;

    private String category;

    private String description;

    private LocalDate date;

    private String splitType;

    private String receiptUrl;

    private List<ExpenseSplitRequest> splits;
}
