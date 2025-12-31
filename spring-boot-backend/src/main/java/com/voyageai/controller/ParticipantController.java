package com.voyageai.controller;

import com.voyageai.dto.participant.*;
import com.voyageai.entity.User;
import com.voyageai.service.ParticipantService;
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
@RequestMapping("/api/participants")
@RequiredArgsConstructor
@Tag(name = "Participants", description = "Trip participant management")
@SecurityRequirement(name = "bearerAuth")
public class ParticipantController {

    private final ParticipantService participantService;

    @GetMapping("/itinerary/{itineraryId}")
    @Operation(summary = "Get all participants for an itinerary")
    public ResponseEntity<List<ParticipantDTO>> getParticipants(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(participantService.getParticipants(itineraryId, user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get participant by ID")
    public ResponseEntity<ParticipantDTO> getParticipant(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(participantService.getParticipant(id, user));
    }

    @PostMapping("/itinerary/{itineraryId}")
    @Operation(summary = "Add a participant to an itinerary")
    public ResponseEntity<ParticipantDTO> addParticipant(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId,
            @Valid @RequestBody AddParticipantRequest request
    ) {
        return ResponseEntity.ok(participantService.addParticipant(itineraryId, request, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a participant")
    public ResponseEntity<ParticipantDTO> updateParticipant(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateParticipantRequest request
    ) {
        return ResponseEntity.ok(participantService.updateParticipant(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove a participant from an itinerary")
    public ResponseEntity<Void> removeParticipant(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        participantService.removeParticipant(id, user);
        return ResponseEntity.noContent().build();
    }
}
