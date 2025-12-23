package com.voyageai.repository;

import com.voyageai.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    
    List<Activity> findByItineraryDayIdOrderByStartTime(UUID itineraryDayId);
    
    void deleteByItineraryDayId(UUID itineraryDayId);
}
