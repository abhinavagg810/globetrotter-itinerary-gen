package com.voyageai.dto.participant;

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
public class ParticipantDTO {
    private UUID id;
    private UUID itineraryId;
    private UUID userId;
    private String name;
    private String email;
    private String avatarUrl;
    private BigDecimal totalPaid;
    private BigDecimal totalOwed;
    private BigDecimal balance;
    private OffsetDateTime createdAt;
}
