package com.voyageai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.voyageai.dto.ai.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    @Value("${ai.api-key}")
    private String apiKey;

    @Value("${ai.model}")
    private String model;

    @Value("${ai.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeneratedItineraryDTO generateItinerary(GenerateItineraryRequest request) {
        log.info("Generating itinerary for destinations: {}", request.getDestinations());

        String systemPrompt = buildSystemPrompt();
        String userPrompt = buildUserPrompt(request);

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            ));
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 4000);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    baseUrl + "/chat/completions",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode responseJson = objectMapper.readTree(response.getBody());
            String content = responseJson.path("choices").get(0).path("message").path("content").asText();

            // Clean and parse JSON
            content = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
            
            return objectMapper.readValue(content, GeneratedItineraryDTO.class);

        } catch (Exception e) {
            log.error("Failed to generate itinerary: {}", e.getMessage());
            throw new RuntimeException("Failed to generate itinerary", e);
        }
    }

    public RegeneratedDayDTO regenerateDay(RegenerateDayRequest request) {
        log.info("Regenerating day {} for location: {}", request.getDayNumber(), request.getLocation());

        String systemPrompt = "You are a travel planning assistant. Regenerate activities for a specific day based on user feedback.";
        String userPrompt = buildRegenerateDayPrompt(request);

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            ));
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 2000);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    baseUrl + "/chat/completions",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode responseJson = objectMapper.readTree(response.getBody());
            String content = responseJson.path("choices").get(0).path("message").path("content").asText();

            content = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();

            return objectMapper.readValue(content, RegeneratedDayDTO.class);

        } catch (Exception e) {
            log.error("Failed to regenerate day: {}", e.getMessage());
            throw new RuntimeException("Failed to regenerate day", e);
        }
    }

    private String buildSystemPrompt() {
        return """
            You are an expert travel planner AI. Generate detailed, realistic travel itineraries in JSON format.
            
            Your itineraries should include:
            - Practical timing with realistic durations
            - Local recommendations and hidden gems
            - Budget-conscious options where appropriate
            - Cultural tips and local customs
            - Transportation suggestions between activities
            
            Always respond with valid JSON only, no additional text.
            """;
    }

    private String buildUserPrompt(GenerateItineraryRequest request) {
        return String.format("""
            Create a travel itinerary with the following details:
            
            Destinations: %s
            Start Date: %s
            End Date: %s
            Travel Type: %s
            Budget: %s %s
            Interests: %s
            Accommodation Preference: %s
            Pace: %s
            
            Return a JSON object with this structure:
            {
              "tripName": "string",
              "days": [
                {
                  "dayNumber": number,
                  "date": "YYYY-MM-DD",
                  "location": "string",
                  "notes": "string",
                  "activities": [
                    {
                      "title": "string",
                      "description": "string",
                      "location": "string",
                      "category": "string",
                      "startTime": "HH:MM",
                      "endTime": "HH:MM",
                      "cost": number
                    }
                  ]
                }
              ]
            }
            """,
                String.join(", ", request.getDestinations()),
                request.getStartDate(),
                request.getEndDate(),
                request.getTravelType(),
                request.getBudget(),
                request.getCurrency(),
                String.join(", ", request.getInterests()),
                request.getAccommodationPreference(),
                request.getPace()
        );
    }

    private String buildRegenerateDayPrompt(RegenerateDayRequest request) {
        return String.format("""
            Regenerate activities for Day %d at %s.
            
            Current activities:
            %s
            
            User feedback/change request:
            %s
            
            Please generate new activities that address the user's feedback.
            Return JSON with this structure:
            {
              "dayNumber": %d,
              "date": "%s",
              "location": "%s",
              "notes": "string",
              "activities": [
                {
                  "title": "string",
                  "description": "string",
                  "location": "string",
                  "category": "string",
                  "startTime": "HH:MM",
                  "endTime": "HH:MM",
                  "cost": number
                }
              ]
            }
            """,
                request.getDayNumber(),
                request.getLocation(),
                request.getCurrentActivities(),
                request.getChangeRequest(),
                request.getDayNumber(),
                request.getDate(),
                request.getLocation()
        );
    }
}
