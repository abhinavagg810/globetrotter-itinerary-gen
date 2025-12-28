package com.voyageai.dto.itinerary;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegenerateDayRequest {
    
    @NotNull(message = "Day number is required")
    private Integer dayNumber;
    
    @NotNull(message = "Date is required")
    private String date;
    
    private String location;
    private String changeRequest;
    private String destination;
    private List<String> travelVibes;
    private String travelingWith;
    private String preferences;
    private String focus;
}
