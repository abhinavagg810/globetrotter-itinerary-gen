package com.voyageai.service;

import com.voyageai.dto.itinerary.*;
import com.voyageai.entity.*;
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
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final ItineraryDayRepository itineraryDayRepository;
    private final ActivityRepository activityRepository;
    private final TripParticipantRepository participantRepository;

    public List<ItineraryDTO> getUserItineraries(User user) {
        log.info("Fetching itineraries for user: {}", user.getId());
        return itineraryRepository.findByUserIdOrParticipantUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ItineraryDTO getItinerary(UUID id, User user) {
        Itinerary itinerary = findItineraryWithAccess(id, user);
        return mapToDetailedDTO(itinerary);
    }

    @Transactional
    public ItineraryDTO createItinerary(CreateItineraryRequest request, User user) {
        log.info("Creating itinerary for user: {}", user.getId());

        Itinerary itinerary = Itinerary.builder()
                .user(user)
                .name(request.getName())
                .destinations(request.getDestinations().toArray(new String[0]))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelType(request.getTravelType())
                .status("planning")
                .build();

        itinerary = itineraryRepository.save(itinerary);

        // Add owner as first participant
        TripParticipant ownerParticipant = TripParticipant.builder()
                .itinerary(itinerary)
                .user(user)
                .name(user.getFullName() != null ? user.getFullName() : "Trip Owner")
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .build();
        participantRepository.save(ownerParticipant);

        log.info("Itinerary created: {}", itinerary.getId());
        return mapToDTO(itinerary);
    }

    @Transactional
    public ItineraryDTO updateItinerary(UUID id, UpdateItineraryRequest request, User user) {
        Itinerary itinerary = findItineraryAsOwner(id, user);

        if (request.getName() != null) {
            itinerary.setName(request.getName());
        }
        if (request.getDestinations() != null) {
            itinerary.setDestinations(request.getDestinations().toArray(new String[0]));
        }
        if (request.getStartDate() != null) {
            itinerary.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            itinerary.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            itinerary.setStatus(request.getStatus());
        }
        if (request.getTravelType() != null) {
            itinerary.setTravelType(request.getTravelType());
        }
        if (request.getImageUrl() != null) {
            itinerary.setImageUrl(request.getImageUrl());
        }

        itinerary = itineraryRepository.save(itinerary);
        return mapToDTO(itinerary);
    }

    @Transactional
    public void deleteItinerary(UUID id, User user) {
        Itinerary itinerary = findItineraryAsOwner(id, user);
        log.info("Deleting itinerary: {}", id);
        itineraryRepository.delete(itinerary);
    }

    @Transactional
    public ItineraryDTO saveGeneratedItinerary(SaveGeneratedItineraryRequest request, User user) {
        log.info("Saving generated itinerary for user: {}", user.getId());

        Itinerary itinerary = Itinerary.builder()
                .user(user)
                .name(request.getName())
                .destinations(request.getDestinations().toArray(new String[0]))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelType(request.getTravelType())
                .imageUrl(request.getImageUrl())
                .status("planning")
                .build();

        itinerary = itineraryRepository.save(itinerary);

        // Save days and activities from the days field
        for (GeneratedItineraryDTO.GeneratedDayDTO dayDTO : request.getDays()) {
            ItineraryDay day = ItineraryDay.builder()
                    .itinerary(itinerary)
                    .dayNumber(dayDTO.getDayNumber())
                    .date(java.time.LocalDate.parse(dayDTO.getDate()))
                    .location(dayDTO.getLocation())
                    .notes(dayDTO.getNotes())
                    .build();

            day = itineraryDayRepository.save(day);

            if (dayDTO.getActivities() != null) {
                for (GeneratedItineraryDTO.GeneratedActivityDTO actDTO : dayDTO.getActivities()) {
                    Activity activity = Activity.builder()
                            .itineraryDay(day)
                            .title(actDTO.getTitle())
                            .description(actDTO.getDescription())
                            .location(actDTO.getLocation())
                            .category(actDTO.getCategory())
                            .startTime(actDTO.getStartTime() != null ? java.time.LocalTime.parse(actDTO.getStartTime()) : null)
                            .endTime(actDTO.getEndTime() != null ? java.time.LocalTime.parse(actDTO.getEndTime()) : null)
                            .cost(actDTO.getCost() != null ? java.math.BigDecimal.valueOf(actDTO.getCost()) : null)
                            .build();
                    activityRepository.save(activity);
                }
            }
        }

        // Add owner as participant
        TripParticipant ownerParticipant = TripParticipant.builder()
                .itinerary(itinerary)
                .user(user)
                .name(user.getFullName() != null ? user.getFullName() : "Trip Owner")
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .build();
        participantRepository.save(ownerParticipant);

        return mapToDetailedDTO(itineraryRepository.findById(itinerary.getId()).orElseThrow());
    }

    // Helper methods
    private Itinerary findItineraryWithAccess(UUID id, User user) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(user.getId()) &&
            !itineraryRepository.isParticipant(id, user.getId())) {
            throw new ForbiddenException("You don't have access to this itinerary");
        }

        return itinerary;
    }

    private Itinerary findItineraryAsOwner(UUID id, User user) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        if (!itinerary.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Only the owner can perform this action");
        }

        return itinerary;
    }

    private ItineraryDTO mapToDTO(Itinerary itinerary) {
        return ItineraryDTO.builder()
                .id(itinerary.getId())
                .name(itinerary.getName())
                .destinations(List.of(itinerary.getDestinations()))
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .status(itinerary.getStatus())
                .travelType(itinerary.getTravelType())
                .imageUrl(itinerary.getImageUrl())
                .createdAt(itinerary.getCreatedAt())
                .updatedAt(itinerary.getUpdatedAt())
                .build();
    }

    private ItineraryDTO mapToDetailedDTO(Itinerary itinerary) {
        ItineraryDTO dto = mapToDTO(itinerary);
        
        List<ItineraryDayDTO> days = itineraryDayRepository.findByItineraryIdOrderByDayNumber(itinerary.getId())
                .stream()
                .map(this::mapDayToDTO)
                .collect(Collectors.toList());
        
        dto.setDays(days);
        return dto;
    }

    private ItineraryDayDTO mapDayToDTO(ItineraryDay day) {
        List<ActivityDTO> activities = activityRepository.findByItineraryDayIdOrderByStartTime(day.getId())
                .stream()
                .map(this::mapActivityToDTO)
                .collect(Collectors.toList());

        return ItineraryDayDTO.builder()
                .id(day.getId())
                .dayNumber(day.getDayNumber())
                .date(day.getDate())
                .location(day.getLocation())
                .notes(day.getNotes())
                .activities(activities)
                .build();
    }

    private ActivityDTO mapActivityToDTO(Activity activity) {
        return ActivityDTO.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .location(activity.getLocation())
                .category(activity.getCategory())
                .startTime(activity.getStartTime())
                .endTime(activity.getEndTime())
                .cost(activity.getCost())
                .bookingStatus(activity.getBookingStatus())
                .build();
    }
}
