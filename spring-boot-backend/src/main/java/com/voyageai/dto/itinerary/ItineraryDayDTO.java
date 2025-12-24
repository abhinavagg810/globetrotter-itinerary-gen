package com.voyageai.dto.itinerary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryDayDTO {
    private UUID id;
    private UUID itineraryId;
    private int dayNumber;
    private LocalDate date;
    private String location;
    private String notes;
    private List<ActivityDTO> activities;
}
