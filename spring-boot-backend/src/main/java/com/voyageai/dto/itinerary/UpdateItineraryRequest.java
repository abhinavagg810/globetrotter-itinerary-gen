package com.voyageai.dto.itinerary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItineraryRequest {
    private String name;
    private List<String> destinations;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String travelType;
    private String imageUrl;
}
