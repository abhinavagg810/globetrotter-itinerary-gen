package com.voyageai.dto.participant;

import jakarta.validation.constraints.NotBlank;
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
public class CreateParticipantRequest {
    
    @NotNull(message = "Itinerary ID is required")
    private UUID itineraryId;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String email;
    private String avatarUrl;
    private UUID userId;
}
