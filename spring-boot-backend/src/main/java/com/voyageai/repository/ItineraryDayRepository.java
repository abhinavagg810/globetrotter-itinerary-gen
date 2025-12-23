package com.voyageai.repository;

import com.voyageai.entity.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, UUID> {
    
    List<ItineraryDay> findByItineraryIdOrderByDayNumber(UUID itineraryId);
    
    void deleteByItineraryId(UUID itineraryId);
}
