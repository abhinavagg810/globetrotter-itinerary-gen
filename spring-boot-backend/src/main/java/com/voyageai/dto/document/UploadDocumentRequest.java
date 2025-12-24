package com.voyageai.dto.document;

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
public class UploadDocumentRequest {
    
    @NotNull(message = "Itinerary ID is required")
    private UUID itineraryId;
    
    @NotBlank(message = "Document type is required")
    private String documentType;
    
    private String providerName;
    private String bookingReference;
}
