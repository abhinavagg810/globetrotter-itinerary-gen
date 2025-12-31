package com.voyageai.service;

import com.voyageai.dto.document.*;
import com.voyageai.entity.*;
import com.voyageai.exception.ForbiddenException;
import com.voyageai.exception.ResourceNotFoundException;
import com.voyageai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ItineraryRepository itineraryRepository;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public List<DocumentDTO> getDocuments(UUID itineraryId, User user) {
        validateAccess(itineraryId, user);
        return documentRepository.findByItineraryIdOrderByCreatedAtDesc(itineraryId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getDocumentsByType(UUID itineraryId, String documentType, User user) {
        validateAccess(itineraryId, user);
        return documentRepository.findByItineraryIdAndDocumentType(itineraryId, documentType)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DocumentDTO uploadDocument(UUID itineraryId, MultipartFile file, String documentType, User user) throws IOException {
        validateAccess(itineraryId, user);

        Itinerary itinerary = itineraryRepository.findById(itineraryId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found"));

        // Generate unique file key
        String fileKey = String.format("%s/%s/%s-%s",
                itineraryId,
                user.getId(),
                UUID.randomUUID(),
                file.getOriginalFilename());

        // Upload to S3
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));

        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileKey);

        // Save document record
        Document document = Document.builder()
                .itinerary(itinerary)
                .user(user)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize((int) file.getSize())
                .fileUrl(fileUrl)
                .documentType(documentType)
                .ocrStatus("pending")
                .build();

        document = documentRepository.save(document);
        log.info("Document uploaded: {} for itinerary: {}", document.getId(), itineraryId);

        return mapToDTO(document);
    }

    @Transactional
    public DocumentDTO updateDocumentOcrResult(UUID documentId, OcrResultRequest request, User user) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only update your own documents");
        }

        document.setOcrStatus(request.getStatus());
        if (request.getConfidence() != null) {
            document.setOcrConfidence(BigDecimal.valueOf(request.getConfidence()));
        }
        document.setExtractedData(request.getExtractedData());

        if (request.getExtractedData() != null) {
            Map<String, Object> data = request.getExtractedData();
            if (data.containsKey("providerName")) {
                document.setProviderName((String) data.get("providerName"));
            }
            if (data.containsKey("bookingReference")) {
                document.setBookingReference((String) data.get("bookingReference"));
            }
        }

        document = documentRepository.save(document);
        return mapToDTO(document);
    }

    @Transactional
    public void deleteDocument(UUID documentId, User user) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only delete your own documents");
        }

        // Delete from S3
        try {
            String key = extractKeyFromUrl(document.getFileUrl());
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteRequest);
        } catch (Exception e) {
            log.warn("Failed to delete file from S3: {}", e.getMessage());
        }

        documentRepository.delete(document);
        log.info("Document deleted: {}", documentId);
    }

    // Helper methods
    private void validateAccess(UUID itineraryId, User user) {
        if (!itineraryRepository.isOwner(itineraryId, user.getId()) &&
            !itineraryRepository.isParticipant(itineraryId, user.getId())) {
            throw new ForbiddenException("You don't have access to this itinerary");
        }
    }

    private String extractKeyFromUrl(String url) {
        return url.substring(url.indexOf(".com/") + 5);
    }

    private DocumentDTO mapToDTO(Document document) {
        return DocumentDTO.builder()
                .id(document.getId())
                .itineraryId(document.getItinerary().getId())
                .userId(document.getUser().getId())
                .fileName(document.getFileName())
                .fileType(document.getFileType())
                .fileSize(document.getFileSize())
                .fileUrl(document.getFileUrl())
                .documentType(document.getDocumentType())
                .providerName(document.getProviderName())
                .bookingReference(document.getBookingReference())
                .eventDate(document.getEventDate())
                .amount(document.getAmount())
                .currency(document.getCurrency())
                .ocrStatus(document.getOcrStatus())
                .ocrConfidence(document.getOcrConfidence())
                .extractedData(document.getExtractedData())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }
}
