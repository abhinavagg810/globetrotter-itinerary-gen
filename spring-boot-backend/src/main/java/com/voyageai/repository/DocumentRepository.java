package com.voyageai.repository;

import com.voyageai.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    
    List<Document> findByItineraryIdOrderByCreatedAtDesc(UUID itineraryId);
    
    List<Document> findByItineraryIdAndDocumentType(UUID itineraryId, String documentType);
    
    List<Document> findByUserId(UUID userId);
    
    void deleteByItineraryId(UUID itineraryId);
}
