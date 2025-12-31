package com.voyageai.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementDTO {
    private UUID id;
    private UUID itineraryId;
    private UUID fromParticipantId;
    private String fromParticipantName;
    private UUID toParticipantId;
    private String toParticipantName;
    private BigDecimal amount;
    private String currency;
    private String notes;
    private OffsetDateTime settledAt;
}
