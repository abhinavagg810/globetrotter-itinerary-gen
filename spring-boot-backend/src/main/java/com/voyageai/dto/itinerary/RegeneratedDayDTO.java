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
public class RegeneratedDayDTO {
    private Integer dayNumber;
    private String date;
    private String location;
    private List<ActivityDTO> activities;
    private String notes;
}
