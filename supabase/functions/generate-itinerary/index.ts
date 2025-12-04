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

    // Build context for better AI understanding
    const companionContext = travelingWith ? `Traveling with: ${travelingWith}.` : '';
    const vibesContext = travelVibes?.length > 0 ? `Travel vibes: ${travelVibes.join(', ')}.` : '';
    const budgetContext = budget ? `Budget level: ${budget}.` : '';
    const travelTypeContext = domesticOrInternational ? `${domesticOrInternational} travel.` : '';

    const systemPrompt = `You are an expert international travel planner with extensive knowledge of destinations worldwide. You create detailed, practical, and culturally-aware travel itineraries. Your recommendations are based on real places, accurate local information, and current travel norms.

Key principles:
- Provide realistic pricing in USD (convert mentally for global accessibility)
- Include specific, real restaurant names, attractions, and hotels
- Consider local customs, dress codes, and cultural sensitivities
- Account for realistic travel times between locations
- Include mix of popular attractions and local hidden gems
- Provide practical tips that experienced travelers would know

Always respond with valid JSON only, no markdown formatting or explanations.`;

    const destinationText = needsDestinationHelp 
      ? `Help suggest the best destination based on preferences: ${vibesContext} ${budgetContext} ${travelTypeContext}`
      : `Destination(s): ${destinations.join(", ")}`;

    const userPrompt = `Create a comprehensive ${numberOfDays}-day travel itinerary.

**Trip Details:**
- Departing from: ${fromLocation}
- ${destinationText}
- Travel dates: ${fromDate} to ${toDate}
${companionContext}
${vibesContext}
${budgetContext}

**Generate a detailed JSON response with this structure:**
{
  "tripName": "Creative, memorable trip name",
  "destination": "Primary destination name",
  "summary": "3-4 sentence engaging overview of the trip highlighting key experiences",
  "estimatedBudget": {
    "total": number (in USD),
    "breakdown": {
      "flights": number,
      "accommodation": number,
      "activities": number,
      "food": number,
      "transportation": number,
      "miscellaneous": number
    },
    "perPerson": number,
    "currency": "USD",
    "budgetLevel": "budget|moderate|luxury|premium"
  },
  "importantInfo": {
    "localCurrency": {
      "code": "3-letter code",
      "name": "Full currency name",
      "symbol": "Currency symbol",
      "exchangeRate": "Approximate rate vs USD"
    },
    "timezone": {
      "name": "Timezone abbreviation",
      "offset": "UTC offset",
      "differenceFromOrigin": "Difference from ${fromLocation} timezone"
    },
    "language": "Primary language(s) spoken",
    "emergencyNumbers": {
      "police": "Local police number",
      "ambulance": "Emergency medical",
      "tourist": "Tourist helpline if available"
    },
    "bestTimeToVisit": "Best months and why",
    "visaRequirements": "Visa info for major nationalities",
    "travelTips": ["5 practical local tips for first-time visitors"]
  },
  "weather": {
    "temperature": { "min": number, "max": number, "unit": "°C" },
    "condition": "Expected weather description",
    "humidity": "Low/Medium/High with percentage",
    "packingTips": ["5 essential items to pack for this weather"]
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "theme": "Descriptive day theme",
      "location": "Area/neighborhood name",
      "activities": [
        {
          "id": "unique-id-string",
          "time": "HH:MM",
          "endTime": "HH:MM",
          "title": "Specific activity/place name",
          "description": "Detailed 2-3 sentence description with what to expect",
          "type": "flight|hotel|activity|restaurant",
          "price": number (in USD, 0 if free),
          "location": "Specific address or landmark",
          "bookingStatus": "available",
          "tips": "Insider tip for this activity",
          "rating": number (4.0-5.0 realistic rating),
          "duration": "Estimated duration",
          "bookingRequired": true|false,
          "dressCode": "Any dress requirements if applicable"
        }
      ]
    }
  ],
  "recommendations": {
    "mustTry": ["5 must-try foods/experiences unique to this destination"],
    "hiddenGems": ["3 off-the-beaten-path places locals love"],
    "avoidances": ["3 common tourist traps or things to avoid"],
    "localCustoms": ["4 important cultural customs and etiquette"],
    "photoSpots": ["3 best places for photos/Instagram"]
  },
  "practicalInfo": {
    "transportation": "Best ways to get around",
    "simCard": "SIM card/internet recommendations",
    "safety": "Safety considerations and tips",
    "tipping": "Local tipping customs"
  }
}

**Important Guidelines:**
- Day 1 should include arrival with realistic flight times
- Last day should include departure preparations
- Include 4-6 activities per day with realistic scheduling
- Add meal recommendations (breakfast, lunch, dinner) with specific restaurant names
- Hotel should appear only on check-in/check-out days
- Consider travel time between activities (don't overschedule)
- Prices should reflect the ${budget || 'moderate'} budget level
- Make activities appropriate for ${travelingWith || 'general travelers'}
- Include local experiences that match these vibes: ${travelVibes?.join(', ') || 'balanced exploration'}
- All restaurant suggestions should be real, well-reviewed places
- Include both popular spots and local favorites`;

    console.log("Generating itinerary for:", { fromLocation, destinations, numberOfDays, travelVibes, budget });

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
      itinerary = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON response from AI");
    }

    console.log("Successfully generated itinerary:", itinerary.tripName);

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
