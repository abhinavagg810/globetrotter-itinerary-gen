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
        return ResponseEntity.ok(itineraryService.getUserItineraries(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get itinerary by ID")
    public ResponseEntity<ItineraryDTO> getItinerary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(itineraryService.getItinerary(id, user));
    }

    @PostMapping
    @Operation(summary = "Create a new itinerary")
    public ResponseEntity<ItineraryDTO> createItinerary(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateItineraryRequest request
    ) {
        return ResponseEntity.ok(itineraryService.createItinerary(request, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an itinerary")
    public ResponseEntity<ItineraryDTO> updateItinerary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateItineraryRequest request
    ) {
        return ResponseEntity.ok(itineraryService.updateItinerary(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an itinerary")
    public ResponseEntity<Void> deleteItinerary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        itineraryService.deleteItinerary(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/save-generated")
    @Operation(summary = "Save a generated itinerary")
    public ResponseEntity<ItineraryDTO> saveGeneratedItinerary(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SaveGeneratedItineraryRequest request
    ) {
        return ResponseEntity.ok(itineraryService.saveGeneratedItinerary(request, user));
    }
}
