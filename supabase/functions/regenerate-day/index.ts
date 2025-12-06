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
      dayNumber,
      date,
      location,
      currentActivities,
      changeRequest,
      destination,
      travelVibes,
      travelingWith
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const vibesContext = travelVibes?.length > 0 ? `Travel preferences: ${travelVibes.join(', ')}.` : '';
    const companionContext = travelingWith ? `Traveling with: ${travelingWith}.` : '';

    const systemPrompt = `You are an expert travel planner. Regenerate day activities based on user feedback. Always respond with valid, parseable JSON only - no markdown, no explanations, no code blocks.`;

    const userPrompt = `Regenerate Day ${dayNumber} (${date}) activities for ${destination || location}.

Current activities:
${JSON.stringify(currentActivities, null, 2)}

User's change request: "${changeRequest}"
${vibesContext} ${companionContext}

Return this exact JSON structure with 4-6 improved activities:
{
  "dayNumber": ${dayNumber},
  "date": "${date}",
  "theme": "Updated day theme based on changes",
  "location": "${location}",
  "activities": [
    {
      "id": "unique-id-1",
      "time": "09:00",
      "endTime": "11:00",
      "title": "Activity name",
      "description": "Brief description of the activity",
      "type": "activity|restaurant|hotel|flight",
      "price": 50,
      "location": "Specific address or area",
      "bookingStatus": "available",
      "tips": "Helpful local tip",
      "rating": 4.5,
      "duration": "2 hours",
      "bookingRequired": false
    }
  ]
}

Rules:
- Keep the same day structure but update activities based on user feedback
- Use real place names and realistic prices in USD
- Maintain a logical flow throughout the day
- Include mix of activities matching the change request
- Keep any hotel/flight activities if they exist in current schedule`;

    console.log("Regenerating day:", { dayNumber, destination, changeRequest });

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

    let regeneratedDay;
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      regeneratedDay = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          regeneratedDay = JSON.parse(jsonMatch[0]);
        } catch (e) {
          throw new Error("Invalid JSON response from AI");
        }
      } else {
        throw new Error("Invalid JSON response from AI");
      }
    }

    if (!regeneratedDay.activities || !Array.isArray(regeneratedDay.activities)) {
      throw new Error("Invalid regenerated day data");
    }

    console.log("Successfully regenerated day:", dayNumber, "with", regeneratedDay.activities.length, "activities");

    return new Response(JSON.stringify(regeneratedDay), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error regenerating day:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to regenerate day" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
