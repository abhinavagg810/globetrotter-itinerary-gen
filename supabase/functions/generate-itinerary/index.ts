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
    const { fromLocation, destinations, travelType, fromDate, toDate } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

    const systemPrompt = `You are an expert travel planner AI. Generate detailed, realistic travel itineraries with accurate pricing and helpful information. Always respond with valid JSON only, no markdown or explanations.`;

    const userPrompt = `Create a detailed ${numberOfDays}-day ${travelType} travel itinerary from ${fromLocation} to ${destinations.join(", ")}.

Travel dates: ${fromDate} to ${toDate}

Generate a comprehensive JSON response with this EXACT structure:
{
  "tripName": "A catchy name for the trip",
  "summary": "A 2-3 sentence overview of the trip",
  "estimatedBudget": {
    "total": number (in INR),
    "breakdown": {
      "flights": number,
      "accommodation": number,
      "activities": number,
      "food": number,
      "transportation": number,
      "miscellaneous": number
    },
    "perPerson": number,
    "currency": "INR"
  },
  "importantInfo": {
    "localCurrency": { "code": "string", "name": "string", "symbol": "string", "exchangeRate": "string vs INR" },
    "timezone": { "name": "string", "offset": "string", "differenceFromIST": "string" },
    "language": "string",
    "emergencyNumbers": { "police": "string", "ambulance": "string", "tourist": "string" },
    "bestTimeToVisit": "string",
    "visaRequirements": "string for Indian passport holders",
    "travelTips": ["tip1", "tip2", "tip3"]
  },
  "weather": {
    "temperature": { "min": number, "max": number, "unit": "°C" },
    "condition": "string",
    "humidity": "string",
    "packingTips": ["item1", "item2", "item3"]
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme/focus",
      "location": "City/Area name",
      "activities": [
        {
          "id": "unique-id",
          "time": "HH:MM",
          "endTime": "HH:MM",
          "title": "Activity name",
          "description": "2-3 sentence description",
          "type": "flight|hotel|activity|restaurant",
          "price": number (in INR, 0 if free),
          "location": "Specific location/address",
          "bookingStatus": "available",
          "tips": "Any helpful tip",
          "rating": number (1-5),
          "duration": "estimated duration"
        }
      ]
    }
  ],
  "recommendations": {
    "mustTry": ["food/experience 1", "food/experience 2"],
    "avoidances": ["thing to avoid 1"],
    "localCustoms": ["custom 1", "custom 2"]
  }
}

Important guidelines:
- Include realistic flight times and prices for Indian carriers
- Hotel prices should be per night in INR
- Include a mix of free and paid activities
- Restaurant prices should be for a meal for 2
- First day should include arrival/flight, last day should include departure
- Make activities appropriate for ${travelType} travel style
- Include local experiences and hidden gems
- Provide accurate local currency and timezone information`;

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

    // Parse the JSON response
    let itinerary;
    try {
      itinerary = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON response from AI");
    }

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
