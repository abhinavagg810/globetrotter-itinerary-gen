package com.voyageai.dto.itinerary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class SaveGeneratedItineraryRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Destinations are required")
    private List<String> destinations;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private String travelType;
    private String imageUrl;
    
    @NotNull(message = "Days are required")
    private List<GeneratedItineraryDTO.GeneratedDayDTO> days;
    
    private GeneratedItineraryDTO generatedItinerary;
}
