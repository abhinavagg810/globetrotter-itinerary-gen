package com.voyageai.service;

import com.voyageai.dto.participant.*;
import com.voyageai.entity.*;
import com.voyageai.exception.BadRequestException;
import com.voyageai.exception.ForbiddenException;
import com.voyageai.exception.ResourceNotFoundException;
import com.voyageai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParticipantService {

    private final TripParticipantRepository participantRepository;
    private final ItineraryRepository itineraryRepository;
    private final UserRepository userRepository;

    public List<ParticipantDTO> getParticipants(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);
        return participantRepository.findByItineraryId(itineraryId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ParticipantDTO getParticipant(UUID participantId, User user) {
        TripParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));
        validateAccess(participant.getItinerary().getId(), user);
        return mapToDTO(participant);
    }

    @Transactional
    public ParticipantDTO addParticipant(UUID itineraryId, AddParticipantRequest request, User user) {
        validateOwnerAccess(itineraryId, user);

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (request.getEmail() != null && participantRepository.existsByItineraryIdAndEmail(itineraryId, request.getEmail())) {
            throw new BadRequestException("Participant with this email already exists");
        }

        TripParticipant participant = TripParticipant.builder()
                .itinerary(itinerary)
                .name(request.getName())
                .email(request.getEmail())
                .avatarUrl(request.getAvatarUrl())
                .build();

        // Link to user if email matches
        if (request.getEmail() != null) {
            userRepository.findByEmail(request.getEmail())
                    .ifPresent(participant::setUser);
        }

        participant = participantRepository.save(participant);
        log.info("Participant added: {} to itinerary: {}", participant.getId(), itineraryId);
        
        return mapToDTO(participant);
    }

    @Transactional
    public ParticipantDTO updateParticipant(UUID participantId, UpdateParticipantRequest request, User user) {
        TripParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));

        validateOwnerAccess(participant.getItinerary().getId(), user);

        if (request.getName() != null) {
            participant.setName(request.getName());
        }
        if (request.getEmail() != null) {
            participant.setEmail(request.getEmail());
        }
        if (request.getAvatarUrl() != null) {
            participant.setAvatarUrl(request.getAvatarUrl());
        }

        participant = participantRepository.save(participant);
        return mapToDTO(participant);
    }

    @Transactional
    public void removeParticipant(UUID participantId, User user) {
        TripParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));

        validateOwnerAccess(participant.getItinerary().getId(), user);

        // Check if participant has any expenses or is the owner
        if (participant.getUser() != null && 
            participant.getUser().getId().equals(participant.getItinerary().getUser().getId())) {
            throw new BadRequestException("Cannot remove the trip owner as a participant");
        }

        participantRepository.delete(participant);
        log.info("Participant removed: {}", participantId);
    }

    // Helper methods
    private void validateAccess(UUID itineraryId, User user) {
        if (!itineraryRepository.isOwner(itineraryId, user.getId()) &&
            !itineraryRepository.isParticipant(itineraryId, user.getId())) {
            throw new ForbiddenException("You don't have access to this itinerary");
        }
    }

    private void validateOwnerAccess(UUID itineraryId, User user) {
        if (!itineraryRepository.isOwner(itineraryId, user.getId())) {
            throw new ForbiddenException("Only the owner can manage participants");
        }
    }

    private ParticipantDTO mapToDTO(TripParticipant participant) {
        return ParticipantDTO.builder()
                .id(participant.getId())
                .itineraryId(participant.getItinerary().getId())
                .userId(participant.getUser() != null ? participant.getUser().getId() : null)
                .name(participant.getName())
                .email(participant.getEmail())
                .avatarUrl(participant.getAvatarUrl())
                .totalPaid(participant.getTotalPaid())
                .totalOwed(participant.getTotalOwed())
                .balance(participant.getTotalPaid().subtract(participant.getTotalOwed()))
                .createdAt(participant.getCreatedAt())
                .build();
    }
}
