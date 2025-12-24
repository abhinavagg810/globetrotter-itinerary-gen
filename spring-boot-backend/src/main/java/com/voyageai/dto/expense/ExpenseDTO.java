package com.voyageai.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private UUID id;
    private UUID itineraryId;
    private UUID paidByParticipantId;
    private String paidByName;
    private BigDecimal amount;
    private String currency;
    private String category;
    private String description;
    private LocalDate date;
    private String receiptUrl;
    private String splitType;
    private LocalDateTime createdAt;
    private List<ExpenseSplitDTO> splits;
}
