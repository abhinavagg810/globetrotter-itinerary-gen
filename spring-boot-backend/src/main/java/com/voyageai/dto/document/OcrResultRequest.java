package com.voyageai.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OcrResultRequest {
    private String status;
    private Double confidence;
    private Map<String, Object> extractedData;
}
