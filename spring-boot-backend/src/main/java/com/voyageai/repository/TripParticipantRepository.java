package com.voyageai.repository;

import com.voyageai.entity.TripParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripParticipantRepository extends JpaRepository<TripParticipant, UUID> {
    
    List<TripParticipant> findByItineraryId(UUID itineraryId);
    
    Optional<TripParticipant> findByItineraryIdAndUserId(UUID itineraryId, UUID userId);
    
    boolean existsByItineraryIdAndEmail(UUID itineraryId, String email);
    
    void deleteByItineraryId(UUID itineraryId);
}
