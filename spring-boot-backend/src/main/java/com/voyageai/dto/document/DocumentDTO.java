package com.voyageai.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private UUID id;
    private UUID itineraryId;
    private UUID userId;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private int fileSize;
    private String documentType;
    private String providerName;
    private String bookingReference;
    private String ocrStatus;
    private BigDecimal ocrConfidence;
    private Map<String, Object> extractedData;
    private BigDecimal amount;
    private String currency;
    private LocalDate eventDate;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
