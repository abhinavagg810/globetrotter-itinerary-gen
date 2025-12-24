package com.voyageai.controller;

import com.voyageai.dto.itinerary.*;
import com.voyageai.entity.User;
import com.voyageai.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/itineraries")
@RequiredArgsConstructor
@Tag(name = "Itineraries", description = "Trip itinerary management")
@SecurityRequirement(name = "bearerAuth")
public class ItineraryController {

    private final ItineraryService itineraryService;

    @GetMapping
    @Operation(summary = "Get all itineraries for current user")
    public ResponseEntity<List<ItineraryDTO>> getAllItineraries(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(itineraryService.getAllItineraries(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get itinerary by ID")
    public ResponseEntity<ItineraryDTO> getItinerary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(itineraryService.getItinerary(user, id));
    }

    @PostMapping
    @Operation(summary = "Create a new itinerary")
    public ResponseEntity<ItineraryDTO> createItinerary(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateItineraryRequest request
    ) {
        return ResponseEntity.ok(itineraryService.createItinerary(user, request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an itinerary")
    public ResponseEntity<ItineraryDTO> updateItinerary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateItineraryRequest request
    ) {
        return ResponseEntity.ok(itineraryService.updateItinerary(user, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an itinerary")
    public ResponseEntity<Void> deleteItinerary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        itineraryService.deleteItinerary(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate an AI-powered itinerary")
    public ResponseEntity<ItineraryDTO> generateItinerary(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GenerateItineraryRequest request
    ) {
        return ResponseEntity.ok(itineraryService.generateItinerary(user, request));
    }

    @PostMapping("/days/{dayId}/regenerate")
    @Operation(summary = "Regenerate a specific day using AI")
    public ResponseEntity<ItineraryDayDTO> regenerateDay(
            @AuthenticationPrincipal User user,
            @PathVariable UUID dayId,
            @Valid @RequestBody RegenerateDayRequest request
    ) {
        return ResponseEntity.ok(itineraryService.regenerateDay(user, dayId, request));
    }

    @PostMapping("/activities")
    @Operation(summary = "Add an activity to a day")
    public ResponseEntity<ActivityDTO> addActivity(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateActivityRequest request
    ) {
        return ResponseEntity.ok(itineraryService.addActivity(user, request));
    }

    @DeleteMapping("/activities/{activityId}")
    @Operation(summary = "Delete an activity")
    public ResponseEntity<Void> deleteActivity(
            @AuthenticationPrincipal User user,
            @PathVariable UUID activityId
    ) {
        itineraryService.deleteActivity(user, activityId);
        return ResponseEntity.noContent().build();
    }
}
