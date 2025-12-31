package com.voyageai.dto.itinerary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryDTO {
    private UUID id;
    private UUID userId;
    private String name;
    private List<String> destinations;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String travelType;
    private String imageUrl;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<ItineraryDayDTO> days;
}
