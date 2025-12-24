package com.voyageai.controller;

import com.voyageai.dto.document.*;
import com.voyageai.entity.User;
import com.voyageai.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "Document management and OCR processing")
@SecurityRequirement(name = "bearerAuth")
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/itinerary/{itineraryId}")
    @Operation(summary = "Get all documents for an itinerary")
    public ResponseEntity<List<DocumentDTO>> getDocuments(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId
    ) {
        return ResponseEntity.ok(documentService.getDocumentsByItinerary(user, itineraryId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get document by ID")
    public ResponseEntity<DocumentDTO> getDocument(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(documentService.getDocument(user, id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a document")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file,
            @RequestParam("itineraryId") UUID itineraryId,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "providerName", required = false) String providerName,
            @RequestParam(value = "bookingReference", required = false) String bookingReference
    ) {
        UploadDocumentRequest request = UploadDocumentRequest.builder()
                .itineraryId(itineraryId)
                .documentType(documentType)
                .providerName(providerName)
                .bookingReference(bookingReference)
                .build();
        return ResponseEntity.ok(documentService.uploadDocument(user, file, request));
    }

    @PostMapping("/{id}/process-ocr")
    @Operation(summary = "Process document with OCR")
    public ResponseEntity<DocumentDTO> processOcr(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(documentService.processOcr(user, id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<Void> deleteDocument(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        documentService.deleteDocument(user, id);
        return ResponseEntity.noContent().build();
    }
}
