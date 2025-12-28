package com.voyageai.dto.participant;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddParticipantRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String email;
    private String avatarUrl;
}
