import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      fromLocation, 
      destinations, 
      travelType, 
      fromDate, 
      toDate, 
      travelingWith,
      travelVibes,
      budget,
      domesticOrInternational,
      tripDuration,
      needsDestinationHelp
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    // Limit trip duration to avoid response truncation
    const maxDays = Math.min(numberOfDays, 7);

    const companionContext = travelingWith ? `Traveling with: ${travelingWith}.` : '';
    const vibesContext = travelVibes?.length > 0 ? `Travel vibes: ${travelVibes.join(', ')}.` : '';
    const budgetContext = budget ? `Budget level: ${budget}.` : '';
    const travelTypeContext = domesticOrInternational ? `${domesticOrInternational} travel.` : '';

    const systemPrompt = `You are an expert travel planner. Create practical travel itineraries with real places and realistic prices in USD. Always respond with valid, parseable JSON only - no markdown, no explanations, no code blocks.`;

    const destinationText = needsDestinationHelp 
      ? `Suggest a destination matching: ${vibesContext} ${budgetContext} ${travelTypeContext}`
      : `Destination: ${destinations.join(", ")}`;

    // Simplified prompt for faster, more reliable responses
    const userPrompt = `Create a ${maxDays}-day travel itinerary as JSON.

Trip: From ${fromLocation} to ${destinationText}
Dates: ${fromDate} to ${toDate}
${companionContext} ${vibesContext} ${budgetContext}

IMPORTANT: Generate REAL, DESTINATION-SPECIFIC information:
- visaRequirements: Include SPECIFIC visa rules for travelers from ${fromLocation} visiting the destination (e.g., "Indian passport holders need a visa on arrival valid for 30 days" or "No visa required for stays up to 90 days for US citizens")
- localCurrency: Use the ACTUAL local currency with real exchange rates
- timezone: Use the ACTUAL timezone of the destination
- emergencyNumbers: Use REAL emergency numbers for that country

Return this exact JSON structure:
{
  "tripName": "Creative trip name",
  "destination": "Main destination",
  "summary": "2-3 sentence trip overview",
  "estimatedBudget": {
    "total": 2500,
    "breakdown": {"flights": 800, "accommodation": 700, "activities": 400, "food": 400, "transportation": 100, "miscellaneous": 100},
    "perPerson": 2500,
    "currency": "USD",
    "budgetLevel": "moderate"
  },
  "importantInfo": {
    "localCurrency": {"code": "XXX", "name": "Currency Name", "symbol": "$", "exchangeRate": "1 USD = X"},
    "timezone": {"name": "TZ", "offset": "UTC+X", "differenceFromOrigin": "X hours ahead/behind ${fromLocation}"},
    "language": "Primary language",
    "emergencyNumbers": {"police": "XXX", "ambulance": "XXX", "tourist": "XXX"},
    "bestTimeToVisit": "Best months to visit",
    "visaRequirements": "SPECIFIC visa requirements for travelers from ${fromLocation} - include visa type, duration, cost if applicable",
    "travelTips": ["Tip 1", "Tip 2", "Tip 3"]
  },
  "weather": {
    "temperature": {"min": 15, "max": 25, "unit": "°C"},
    "condition": "Weather description for ${fromDate} to ${toDate}",
    "humidity": "Medium",
    "packingTips": ["Item 1", "Item 2", "Item 3"]
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme",
      "location": "Area name",
      "activities": [
        {
          "id": "unique-id",
          "time": "09:00",
          "endTime": "11:00",
          "title": "Activity name",
          "description": "Brief description",
          "type": "flight|hotel|activity|restaurant",
          "price": 50,
          "location": "Address",
          "bookingStatus": "available",
          "tips": "Helpful tip",
          "rating": 4.5,
          "duration": "2 hours",
          "bookingRequired": false
        }
      ]
    }
  ],
  "recommendations": {
    "mustTry": ["Experience 1", "Experience 2"],
    "hiddenGems": ["Place 1", "Place 2"],
    "avoidances": ["Avoid 1"],
    "localCustoms": ["Custom 1"],
    "photoSpots": ["Spot 1"]
  },
  "practicalInfo": {
    "transportation": "How to get around",
    "simCard": "Internet options",
    "safety": "Safety tips",
    "tipping": "Tipping customs"
  }
}

Rules:
- Day 1: Include arrival flight and hotel check-in
- Last day: Include departure activities
- 3-5 activities per day with realistic times
- Use real restaurant and attraction names
- All prices in USD
- Generate exactly ${maxDays} days
- CRITICAL: visaRequirements MUST be specific to travelers from ${fromLocation}`;

    console.log("Generating itinerary for:", { fromLocation, destinations, numberOfDays: maxDays, travelVibes, budget });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let itinerary;
    try {
      // Clean the content before parsing
      let cleanContent = content.trim();
      
      // Remove markdown code blocks if present
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      itinerary = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Content length:", content.length);
      console.error("First 500 chars:", content.substring(0, 500));
      console.error("Last 500 chars:", content.substring(content.length - 500));
      
      // Try to extract JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          itinerary = JSON.parse(jsonMatch[0]);
          console.log("Successfully parsed extracted JSON");
        } catch (e) {
          console.error("Failed to parse extracted JSON:", e);
          throw new Error("Invalid JSON response from AI");
        }
      } else {
        throw new Error("Invalid JSON response from AI");
      }
    }

    // Validate required fields
    if (!itinerary.tripName || !itinerary.days || !Array.isArray(itinerary.days)) {
      console.error("Missing required fields in itinerary:", Object.keys(itinerary));
      throw new Error("Incomplete itinerary data");
    }

    console.log("Successfully generated itinerary:", itinerary.tripName, "with", itinerary.days.length, "days");

    return new Response(JSON.stringify(itinerary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate itinerary" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
