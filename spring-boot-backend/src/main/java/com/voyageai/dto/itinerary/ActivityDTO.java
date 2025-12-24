package com.voyageai.dto.itinerary;

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
public class ActivityDTO {
    private UUID id;
    private UUID itineraryDayId;
    private String title;
    private String description;
    private String location;
    private LocalTime startTime;
    private LocalTime endTime;
    private String category;
    private BigDecimal cost;
    private String bookingStatus;
}
