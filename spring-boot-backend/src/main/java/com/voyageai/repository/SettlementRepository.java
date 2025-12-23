package com.voyageai.repository;

import com.voyageai.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {
    
    List<Settlement> findByItineraryIdOrderBySettledAtDesc(UUID itineraryId);
    
    List<Settlement> findByFromParticipantIdOrToParticipantId(UUID fromParticipantId, UUID toParticipantId);
    
    void deleteByItineraryId(UUID itineraryId);
}
