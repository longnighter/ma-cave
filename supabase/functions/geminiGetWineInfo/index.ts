import { serve } from "serve"
import { corsHeaders } from "shared/cors.ts"

serve(async (req) => {

  // Handle CORS for security (required by Supabase)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { name } = await req.json() // This line reads data from the request
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

  const text = `Donne moi les informations sur ce vin : ${name}. 
  Réponds en français. La propriété 'bestTimeToDrink' doit être l'année de départ et de fin de la période d'apogée du vin. 
  Essaye de me donner une fourchette assez précise (idéalement 4 ou 5 ans d'écart).
  'name' doit être le nom complet du vin. 'domain' doit être le domaine.`
  const requestData = {
        "contents": [
            {
                "parts":[
                    { 
                        "text": text
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "OBJECT",
                "properties": {
                    "domain": {"type": "STRING"},
                    "appellation": { "type": "STRING" },
                    "bestToDrink": { "type": "ARRAY", "minItems": 2, "maxItems": 2, "items": { "type": "INTEGER" } },
                    "grape": { "type": "ARRAY", "minItems": 1, "maxItems": 4, "items": { "type": "STRING" } },
                    "region":{"type":"STRING"},
                    "tastingNotes": { "type": "ARRAY", "minItems": 1, "maxItems": 10, "items": { "type": "STRING" } },
                    "year": {"type": "STRING"},
                    "name": {"type": "STRING"}
                }
            }
        }
  }
  // try {
  //   // 4. Make the REQUEST to the Gemini API
  //   const geminiResponse = await fetch(`${GEMINI_API_URL}`, {
  //     method: 'POST',
  //     headers: { 
  //       'Content-Type': 'application/json',
  //       "X-goog-api-key": GEMINI_API_KEY
  //     },
  //     //body: JSON.stringify(requestData),
  //     body: JSON.stringify(requestData)
  //   });

  //   if (!geminiResponse.ok) {
  //     throw new Error(`Gemini API responded with status ${geminiResponse.status}`);
  //   }
    
  //   const geminiData = await geminiResponse.json();
  //   const jsonText = geminiData.candidates[0].content.parts[0].text;
  //   const wineInfo = JSON.parse(jsonText);

  //   // 5. Send the RESPONSE from Gemini back to our mobile app
  //   return new Response(
  //     JSON.stringify(wineInfo),
  //     { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  //   );

  // } 
  try {
    const wineInfo = {
      "appellation": "Bourgogne Côte Chalonnaise",
      "bestToDrink": [
          2024,
          2028
      ],
      "grape": [
          "Pinot Noir"
      ],
      "region": "Bourgogne",
      "tastingNotes": [
          "Notes de fruits rouges (cerise, framboise)",
          "Légèrement épicé",
          "Tannins souples",
          "Belle fraîcheur"
      ],
      "year": 2022
    }
    return new Response(
      JSON.stringify(wineInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  catch (error) {
    // Handle any errors that occur
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})