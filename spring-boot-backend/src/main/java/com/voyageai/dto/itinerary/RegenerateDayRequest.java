package com.voyageai.dto.itinerary;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegenerateDayRequest {
    
    @NotNull(message = "Day ID is required")
    private UUID dayId;
    
    private String preferences;
    private String focus;
}
