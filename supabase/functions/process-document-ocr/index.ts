import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExtractedData {
  booking_reference?: string;
  provider_name?: string;
  amount?: number;
  currency?: string;
  event_date?: string;
  flight_number?: string;
  departure_airport?: string;
  arrival_airport?: string;
  departure_time?: string;
  arrival_time?: string;
  hotel_name?: string;
  check_in?: string;
  check_out?: string;
  address?: string;
  passenger_name?: string;
  confirmation_number?: string;
  [key: string]: string | number | undefined;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, fileUrl, documentType, fileBase64 } = await req.json();
    
    if (!documentId) {
      throw new Error("Document ID is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Update document status to processing
    await supabase
      .from("documents")
      .update({ ocr_status: "processing" })
      .eq("id", documentId);

    console.log(`Processing document ${documentId} of type ${documentType}`);

    // Build the prompt based on document type
    const typePrompts: Record<string, string> = {
      flight: `Extract flight booking details including:
- Booking reference/PNR
- Airline name
- Flight number
- Departure airport (code and name)
- Arrival airport (code and name)
- Departure date and time
- Arrival date and time
- Passenger name(s)
- Ticket price/amount and currency
- Seat number if visible
- Class of service`,
      
      hotel: `Extract hotel booking details including:
- Confirmation number
- Hotel name
- Hotel address
- Check-in date and time
- Check-out date and time
- Guest name(s)
- Room type
- Total amount and currency
- Number of nights
- Booking reference`,
      
      restaurant: `Extract restaurant bill details including:
- Restaurant name
- Address
- Date and time
- Total bill amount and currency
- Number of guests if visible
- Items ordered if visible
- Tax amount
- Tip/service charge if any`,
      
      activity: `Extract activity/tour booking details including:
- Booking reference
- Activity/tour name
- Provider/company name
- Date and time
- Location/address
- Number of participants
- Total amount and currency
- Duration`,
      
      visa: `Extract visa document details including:
- Visa type
- Country
- Validity dates
- Passport number
- Issue date
- Expiry date`,
      
      insurance: `Extract travel insurance details including:
- Policy number
- Insurance provider
- Coverage dates
- Coverage amount
- Premium paid
- Insured person name`,
      
      other: `Extract all relevant booking and travel document details including:
- Any reference numbers
- Dates
- Amounts and currency
- Names
- Locations
- Provider information`
    };

    const extractionPrompt = typePrompts[documentType] || typePrompts.other;

    const systemPrompt = `You are an expert OCR and document analysis AI. Your task is to extract structured data from travel-related documents.

Rules:
1. Only return valid JSON, no markdown or explanations
2. Use null for fields that cannot be determined
3. Dates should be in ISO 8601 format (YYYY-MM-DD)
4. Times should be in 24-hour format (HH:MM)
5. Currency amounts should be numbers without symbols
6. Be precise and accurate - only extract what you can clearly identify
7. If the image is unclear or unreadable, return an error field explaining why`;

    const userPrompt = `Analyze this travel document image and extract the following information:

${extractionPrompt}

Return a JSON object with the extracted data. Use snake_case for field names.
Include a "confidence" field (0-100) indicating how confident you are in the extraction.
Include an "extracted_text" field with key text from the document.

Example response format:
{
  "booking_reference": "ABC123",
  "provider_name": "Airline Name",
  "amount": 450.00,
  "currency": "USD",
  "event_date": "2025-01-15",
  "confidence": 85,
  "extracted_text": "Key visible text from document...",
  ...other relevant fields
}`;

    let aiResponse;
    
    if (fileBase64) {
      // If we have base64 image data, use vision API
      aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: [
                { type: "text", text: userPrompt },
                { 
                  type: "image_url", 
                  image_url: { 
                    url: fileBase64.startsWith("data:") ? fileBase64 : `data:image/jpeg;base64,${fileBase64}`
                  } 
                }
              ]
            },
          ],
          response_format: { type: "json_object" },
        }),
      });
    } else {
      // Fallback: Use text-based extraction with URL hint
      aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `${userPrompt}\n\nNote: Unable to process the image directly. Please provide a template response structure for a ${documentType} document that the user can manually fill in.`
            },
          ],
          response_format: { type: "json_object" },
        }),
      });
    }

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        await supabase
          .from("documents")
          .update({ ocr_status: "failed", extracted_data: { error: "Rate limit exceeded" } })
          .eq("id", documentId);
        
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      await supabase
        .from("documents")
        .update({ ocr_status: "failed", extracted_data: { error: "AI processing failed" } })
        .eq("id", documentId);
      
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let extractedData: ExtractedData;
    try {
      extractedData = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      
      await supabase
        .from("documents")
        .update({ 
          ocr_status: "failed", 
          extracted_data: { error: "Failed to parse extraction results", raw: content } 
        })
        .eq("id", documentId);
      
      throw new Error("Invalid JSON response from AI");
    }

    const confidence = extractedData.confidence || 0;

    // Update document with extracted data
    const { error: updateError } = await supabase
      .from("documents")
      .update({
        ocr_status: "completed",
        ocr_confidence: confidence,
        extracted_data: extractedData,
        booking_reference: extractedData.booking_reference || extractedData.confirmation_number,
        provider_name: extractedData.provider_name || extractedData.hotel_name || extractedData.airline,
        amount: extractedData.amount || extractedData.total_amount || extractedData.price,
        currency: extractedData.currency || "USD",
        event_date: extractedData.event_date || extractedData.departure_date || extractedData.check_in,
      })
      .eq("id", documentId);

    if (updateError) {
      console.error("Failed to update document:", updateError);
      throw new Error("Failed to save extraction results");
    }

    console.log(`Successfully processed document ${documentId} with ${confidence}% confidence`);

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        extractedData,
        confidence,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing document:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to process document" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
