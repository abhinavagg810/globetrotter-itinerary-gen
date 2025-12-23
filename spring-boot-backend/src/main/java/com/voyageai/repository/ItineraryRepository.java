package com.voyageai.repository;

import com.voyageai.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, UUID> {
    
    List<Itinerary> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    @Query("SELECT i FROM Itinerary i LEFT JOIN i.participants p WHERE i.user.id = :userId OR p.user.id = :userId ORDER BY i.createdAt DESC")
    List<Itinerary> findByUserIdOrParticipantUserId(UUID userId);
    
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Itinerary i WHERE i.id = :itineraryId AND i.user.id = :userId")
    boolean isOwner(UUID itineraryId, UUID userId);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM TripParticipant p WHERE p.itinerary.id = :itineraryId AND p.user.id = :userId")
    boolean isParticipant(UUID itineraryId, UUID userId);
}
