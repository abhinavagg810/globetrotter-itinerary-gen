package com.voyageai.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSummaryDTO {
    private UUID itineraryId;
    private BigDecimal totalExpenses;
    private String currency;
    private int expenseCount;
    private Map<String, BigDecimal> expensesByCategory;
    private List<ParticipantBalanceDTO> participantBalances;
}
