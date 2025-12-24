package com.voyageai.dto.itinerary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityRequest {
    
    @NotNull(message = "Itinerary day ID is required")
    private UUID itineraryDayId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;
    private String category;
    private BigDecimal cost;
    private String bookingStatus;
}
