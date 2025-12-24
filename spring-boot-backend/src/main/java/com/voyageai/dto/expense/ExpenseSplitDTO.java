package com.voyageai.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSplitDTO {
    private UUID id;
    private UUID expenseId;
    private UUID participantId;
    private String participantName;
    private BigDecimal amount;
}
