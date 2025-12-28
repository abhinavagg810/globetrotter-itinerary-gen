package com.voyageai.dto.itinerary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedItineraryDTO {
    private String name;
    private List<String> destinations;
    private String startDate;
    private String endDate;
    private String travelType;
    private List<GeneratedDayDTO> days;
    private String imageUrl;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeneratedDayDTO {
        private Integer dayNumber;
        private String date;
        private String location;
        private List<GeneratedActivityDTO> activities;
        private String notes;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeneratedActivityDTO {
        private String title;
        private String description;
        private String startTime;
        private String endTime;
        private String location;
        private String category;
        private Double cost;
    }
}
