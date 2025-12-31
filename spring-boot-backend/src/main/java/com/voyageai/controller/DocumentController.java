package com.voyageai.controller;

import com.voyageai.dto.document.*;
import com.voyageai.entity.User;
import com.voyageai.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
        return ResponseEntity.ok(documentService.getDocuments(itineraryId, user));
    }

    @GetMapping("/itinerary/{itineraryId}/type/{documentType}")
    @Operation(summary = "Get documents by type for an itinerary")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByType(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId,
            @PathVariable String documentType
    ) {
        return ResponseEntity.ok(documentService.getDocumentsByType(itineraryId, documentType, user));
    }

    @PostMapping(value = "/itinerary/{itineraryId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a document")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @AuthenticationPrincipal User user,
            @PathVariable UUID itineraryId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType
    ) throws IOException {
        return ResponseEntity.ok(documentService.uploadDocument(itineraryId, file, documentType, user));
    }

    @PutMapping("/{id}/ocr-result")
    @Operation(summary = "Update document OCR result")
    public ResponseEntity<DocumentDTO> updateOcrResult(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody OcrResultRequest request
    ) {
        return ResponseEntity.ok(documentService.updateDocumentOcrResult(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<Void> deleteDocument(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        documentService.deleteDocument(id, user);
        return ResponseEntity.noContent().build();
    }
}
