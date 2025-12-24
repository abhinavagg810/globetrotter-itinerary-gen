package com.voyageai.dto.expense;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class CreateSettlementRequest {
    
    @NotNull(message = "Itinerary ID is required")
    private UUID itineraryId;
    
    @NotNull(message = "From participant ID is required")
    private UUID fromParticipantId;
    
    @NotNull(message = "To participant ID is required")
    private UUID toParticipantId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    private String currency;
    private String notes;
}
