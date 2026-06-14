import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  const openaiEnvKey = process.env.OPENAI_API_KEY;

  const getAiClient = (req: express.Request) => {
    const userKey = req.headers["x-gemini-key"] as string;
    if (!userKey) {
      throw new Error("Missing Gemini API key. Please provide it in settings.");
    }
    return new GoogleGenAI({
      apiKey: userKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
        timeout: 120000,
      },
    });
  };

  const getOpenAIClient = (req: express.Request) => {
    const userKey = req.headers["x-openai-key"] as string;
    if (!userKey) {
      throw new Error("Missing OpenAI API key. Please provide it in settings.");
    }
    return new OpenAI({ apiKey: userKey });
  };

  const mapToSupportedRatio = (ratio: string, isVideo = false) => {
    const supported = isVideo ? ["16:9", "9:16"] : ["16:9", "9:16", "1:1", "3:4", "4:3"];
    if (supported.includes(ratio)) return ratio;
    
    // Map others to closest supported for the API
    const ratioMap: { [key: string]: string } = {
      "3:2": isVideo ? "16:9" : "16:9",
      "2:3": isVideo ? "9:16" : "9:16",
      "4:5": isVideo ? "9:16" : "3:4",
      "21:9": "16:9", // Fallback if list above somehow fails
      "3:4": isVideo ? "9:16" : "3:4",
      "4:3": isVideo ? "16:9" : "4:3",
      "1:1": isVideo ? "16:9" : "1:1"
    };
    return ratioMap[ratio] || "16:9";
  };

  const handleAIError = (error: any, provider: string, model?: string) => {
    console.error(`${provider} error${model ? ` (${model})` : ''}:`, error);
    
    let message = error.message || "Neznáma chyba pri komunikácii s AI.";
    let status = 500;

    // Check for common error patterns
    const errorStr = JSON.stringify(error).toLowerCase();
    const messageStr = message.toLowerCase();
    const errorName = (error.name || "").toLowerCase();

    if (messageStr.includes("api key") || messageStr.includes("invalid_api_key") || messageStr.includes("unauthorized") || messageStr.includes("401")) {
      status = 401;
      message = `CHYBA KĽÚČA: API kľúč pre ${provider} nie je platný alebo chýba. Prosím, skontrolujte nastavenia (ikona ozubeného kolieska) a uistite sa, že ste vložili správny kľúč pre ${provider}.`;
    } else if (messageStr.includes("quota") || messageStr.includes("rate limit") || messageStr.includes("429") || messageStr.includes("credit") || messageStr.includes("insufficient_quota") || messageStr.includes("billing") || messageStr.includes("hard limit")) {
      status = 429;
      message = `LIMIT PREKROČENÝ: Váš účet u ${provider} dosiahol limit (billing/quota). Prosím skontrolujte si stav kreditu alebo nastavené limity u poskytovateľa, prípadne použite iný model (napr. Google Imagen 3), ktorý je často dostupný okamžite.`;
    } else if (messageStr.includes("safety") || messageStr.includes("blocked") || messageStr.includes("content_filter") || messageStr.includes("policy")) {
      status = 400;
      message = `BEZPEČNOSTNÝ FILTER: Váš dopyt bol zablokovaný bezpečnostnými pravidlami poskytovateľa ${provider}. Skúste preformulovať zadanie tak, aby neobsahovalo nevhodný alebo chránený obsah.`;
    } else if (messageStr.includes("invalid_request_error") || errorStr.includes("invalid_request_error") || messageStr.includes("invalid parameters")) {
      status = 400;
      message = `NEPLATNÁ POŽIADAVKA: Model ${provider}${model ? ` (${model})` : ''} nepodporuje toto zadanie alebo kombináciu parametrov (napr. dĺžku, pomer strán alebo priložený obrázok). Skúste zmeniť nastavenia alebo preformulovať prompt.`;
    } else if (errorName.includes("abort") || messageStr.includes("timeout") || messageStr.includes("deadline") || messageStr.includes("undici.error.und_err") || messageStr.includes("aborted") || messageStr.includes("abort") || errorStr.includes("aborted")) {
      status = 504;
      message = `ČASOVÝ LIMIT / PRERUŠENIE: Generovanie trvalo príliš dlho alebo bolo prerušené (AbortError). Skúste to prosím znova o chvíľu, prípadne znížte náročnosť (rozlíšenie/dĺžku).`;
    } else if (messageStr.includes("high demand") || messageStr.includes("503") || messageStr.includes("unavailable") || errorStr.includes("503") || (error.status === 503)) {
      status = 503;
      message = `VYSOKÝ DOPYT: Tento model je momentálne preťažený (vysoký záujem). Skúste to prosím znova o niekoľko sekúnd alebo minút, prípadne prepnite na iný model (napr. Google Imagen 3).`;
    } else if (messageStr.includes("fetch failed") || messageStr.includes("network")) {
      status = 503;
      message = `SIEŤOVÁ CHYBA: Nepodarilo sa spojiť so serverom ${provider}. Skontrolujte svoje internetové pripojenie alebo skúste zmeniť model.`;
    }

    return { status, message };
  };

  app.post("/api/verify-keys", async (req, res) => {
    try {
      const { geminiKey, openaiKey } = req.body;
      const results = { gemini: false, openai: false, geminiError: "", openaiError: "" };

      if (geminiKey) {
        try {
          const ai = new GoogleGenAI({ 
            apiKey: geminiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
              timeout: 10000,
            }
          });
          await ai.models.list();
          results.gemini = true;
        } catch (e: any) {
          console.error("Gemini validation failed:", e);
          results.geminiError = e.message || "Failed to validate Gemini key";
        }
      } else {
        results.geminiError = "Missing Gemini API key";
      }

      if (openaiKey) {
        try {
          const openai = new OpenAI({ apiKey: openaiKey });
          await openai.models.list();
          results.openai = true;
        } catch (e: any) {
          console.error("OpenAI validation failed:", e);
          results.openaiError = e.message || "Failed to validate OpenAI key";
        }
      } else {
        results.openaiError = "Missing OpenAI API key";
      }

      res.json(results);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Validation error" });
    }
  });

  // 0. Generate base image
  app.post("/api/generate-image", async (req, res) => {
    const { model, image } = req.body;
    const provider = (model && (model.startsWith("gpt") || model.startsWith("dall-e"))) ? "OpenAI" : "Google";
    try {
      const { prompt, aspectRatio, resolution } = req.body;
      
      let finalPrompt = prompt || "A professional cinematic landscape, highly detailed, masterpieces";

      // --- SMART PROMPT SYNTHESIS (for Image Editing) ---
      if (image && typeof image === "string" && image.startsWith("data:image")) {
        console.log("Image Edit Mode: Synthesizing enhanced prompt using Gemini 1.5 Flash...");
        try {
          const ai = getAiClient(req);
          
          const base64Data = image.split(",")[1];
          const mimeType = image.split(";")[0].split(":")[1];

          const synthesisPrompt = `
            You are a professional AI image prompting architect. 
            I have a base image and I want to modify it with this instruction: "${prompt}".
            
            1. Describe accurately what is in the base image.
            2. Apply the requested changes while PRESERVING the original composition, style, and core elements.
            3. Output ONLY a single, highly detailed, professional prompt (in English) that describes the FINAL intended image.
            4. The prompt should be suitable for high-end models like Imagen 3 or Flux.1.
            5. Do not include any preamble, just the prompt.
          `;

          const result = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [{
              parts: [
                { text: synthesisPrompt },
                { 
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                  }
                }
              ]
            }]
          });

          const synthesized = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (synthesized) {
            console.log("Synthesized Prompt:", synthesized);
            finalPrompt = synthesized;
          }
        } catch (e) {
          console.error("Smart Prompt synthesis failed, falling back to original prompt", e);
        }
      }

      const resolutionSuffix = resolution ? `, ${resolution} resolution, extremely high detail` : "";
      finalPrompt = `${finalPrompt}${resolutionSuffix}`;

      // Sanitize the prompt to replace trademark words (like puma) with animal synonyms to bypass Google's/OpenAI's false-positive brand filters
      if (finalPrompt) {
        finalPrompt = finalPrompt.replace(/\bpuma\b/gi, "cougar");
        finalPrompt = finalPrompt.replace(/\bpumy\b/gi, "cougars");
        finalPrompt = finalPrompt.replace(/\bpum\b/gi, "cougars");
      }

      if (model === "gpt-image-1.5" || model === "gpt-image-2" || model === "dall-e-3" || model === "dall-e-2") {
        const openai = getOpenAIClient(req);
        if (!openai) throw new Error("OpenAI API kľúč nebol nájdený v nastaveniach ani v prostredí.");

        const openAIModel = (model === "gpt-image-2" || model === "gpt-image-2-preview") ? "gpt-image-2" : 
                            (model === "gpt-image-1.5" || model === "gpt-image-1.5-preview") ? "gpt-image-1.5" : 
                            model;
        
        let size: any = "1024x1024";
        if (model === "dall-e-3") {
          size = aspectRatio === "1:1" ? "1024x1024" : aspectRatio === "16:9" ? "1792x1024" : "1024x1792";
        } else if (model === "dall-e-2") {
          size = resolution === "SD" ? "512x512" : "1024x1024";
        } else if (model === "gpt-image-2" || model === "gpt-image-1.5") {
          size = aspectRatio === "1:1" ? "1024x1024" : aspectRatio === "16:9" ? "1536x1024" : "1024x1536";
        }

        let quality: any = undefined;
        if (model === "dall-e-3") {
          quality = (resolution === "2K" || resolution === "4K") ? "hd" : "standard";
        } else if (model === "gpt-image-2" || model === "gpt-image-1.5") {
          if (resolution === "SD") quality = "low";
          else if (resolution === "HD") quality = "medium";
          else if (resolution === "2K" || resolution === "4K") quality = "high";
          else quality = "auto";
        }

        console.log(`OpenAI: Generujem obrázok cez model ${openAIModel} (pomer: ${aspectRatio}, rozlíšenie: ${resolution}, kvalita: ${quality})`);
        
        try {
          const response = await openai.images.generate({
            model: openAIModel,
            prompt: finalPrompt,
            n: 1,
            size,
            quality,
          } as any);

          const imageData = response.data[0];
          if (!imageData) {
            console.error(`OpenAI Response for ${model}:`, JSON.stringify(response));
            throw new Error(`Model ${model} nevrátil žiadne výsledky.`);
          }

          let base64 = "";
          let mimeType = "image/png";

          if (imageData.url) {
            const imgResp = await fetch(imageData.url);
            const buffer = await imgResp.arrayBuffer();
            base64 = Buffer.from(buffer).toString('base64');
            mimeType = imgResp.headers.get('content-type') || 'image/png';
          } else if (imageData.b64_json) {
            base64 = imageData.b64_json;
          } else {
            throw new Error(`Model ${model} nevrátil žiadne dáta (ani URL, ani Base64).`);
          }

          return res.json({ 
            image: `data:${mimeType};base64,${base64}`,
            mimeType,
            base64
          });
        } catch (err: any) {
          const { status, message } = handleAIError(err, "OpenAI", model);
          throw new Error(JSON.stringify({ status, message }));
        }
      }


      const ai = getAiClient(req);
      const googleModelCode = (model === "gemini-3.1-flash") ? "gemini-3.1-flash-image-preview" : 
                            (model === "imagen-3") ? "gemini-3-pro-image-preview" :
                            "gemini-2.5-flash-image";
      
      console.log(`Google: Generujem obrázok cez model ${googleModelCode}`);
      
      try {
        const response = await ai.models.generateContent({
          model: googleModelCode,
          contents: {
            parts: [{ text: finalPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: mapToSupportedRatio(aspectRatio),
              imageSize: (resolution === "2K" || resolution === "4K") ? "2K" : "1K"
            },
          },
        });

        const candidate = response.candidates?.[0];
        if (!candidate) throw new Error("Google AI nevrátilo žiadne výsledky.");

        const parts = candidate.content?.parts;
        if (!parts || !Array.isArray(parts)) {
          console.error("Google AI response structure unexpected:", JSON.stringify(response));
          const finishReason = candidate.finishReason || "unknown";
          throw new Error(`Google AI nevrátilo žiadne dáta (Dôvod ukončenia: ${finishReason}). Skontrolujte, či váš prompt neblokujú bezpečnostné filtre.`);
        }

        for (const part of parts) {
          if (part.inlineData) {
            return res.json({ 
              image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
              mimeType: part.inlineData.mimeType,
              base64: part.inlineData.data
            });
          }
        }
        throw new Error("V odpovedi Google modelu sa nenašli žiadne obrazové dáta.");
      } catch (err: any) {
        const { status, message } = handleAIError(err, "Google", googleModelCode);
        throw new Error(JSON.stringify({ status, message }));
      }
    } catch (error: any) {
      let finalMessage = error.message;
      let finalStatus = 500;

      try {
        // Attempt to parse out our structured error
        if (typeof error.message === 'string' && error.message.includes('{')) {
          const parsed = JSON.parse(error.message);
          if (parsed.status && parsed.message) {
            finalStatus = parsed.status;
            finalMessage = parsed.message;
          } else if (parsed.error && parsed.error.message) {
            finalMessage = parsed.error.message;
          }
        }
      } catch (e) {
        // Fallback to our helper if it wasn't already caught by one of the specific blocks
        const { status, message } = handleAIError(error, provider, model);
        finalStatus = status;
        finalMessage = message;
      }

      res.status(finalStatus).json({ error: finalMessage });
    }
  });

  // 1. Start generation
  app.post("/api/generate-video", upload.single("image"), async (req: any, res: any) => {
    const { model } = req.body;
    const provider = "Google";
    try {
      const { prompt, aspectRatio, resolution, duration, stabilization } = req.body;
      const isStabilized = stabilization === "true";
      const imageFile = req.file;

      const stabilizedPrompt = isStabilized 
        ? `${prompt || ""}. Extremely stabilized cinematic camera, perfectly smooth motion, no shaky movement, gimbal quality.`.trim()
        : prompt;

      // Sanitize the prompt to replace trademark words (like puma) with animal synonyms to bypass Google's false-positive brand filters
      let finalPrompt = stabilizedPrompt || "";
      if (finalPrompt) {
        finalPrompt = finalPrompt.replace(/\bpuma\b/gi, "cougar");
        finalPrompt = finalPrompt.replace(/\bpumy\b/gi, "cougars");
        finalPrompt = finalPrompt.replace(/\bpum\b/gi, "cougars");
      }

      const ai = getAiClient(req);
      const googleModelCode = "veo-3.1-lite-generate-preview";

      const config: any = {
        numberOfVideos: 1,
        resolution: resolution || "720p",
        aspectRatio: mapToSupportedRatio(aspectRatio, true),
      };

      const payload: any = {
        model: googleModelCode,
        prompt: finalPrompt || `A professional cinematic drone shot moving through a beautiful scene, high quality, ${duration || "5s"} long`,
        config,
      };

      if (imageFile) {
        payload.image = {
          imageBytes: imageFile.buffer.toString("base64"),
          mimeType: imageFile.mimetype,
        };
      }

      try {
        const operation = await ai.models.generateVideos(payload);
        if (!operation || !operation.name) {
          throw new Error("Nepodarilo sa spustiť generovanie videa - chýba názov operácie.");
        }
        res.json({ operationName: operation.name, provider: "google" });
      } catch (err: any) {
        const { status, message } = handleAIError(err, "Google", googleModelCode);
        throw new Error(JSON.stringify({ status, message }));
      }
    } catch (error: any) {
      let finalMessage = error.message;
      let finalStatus = 500;

      try {
        if (typeof error.message === 'string' && error.message.includes('{')) {
          const parsed = JSON.parse(error.message);
          if (parsed.status && parsed.message) {
            finalStatus = parsed.status;
            finalMessage = parsed.message;
          } else if (parsed.error && parsed.error.message) {
            finalMessage = parsed.error.message;
          }
        }
      } catch (e) {
        const { status, message } = handleAIError(error, provider, model);
        finalStatus = status;
        finalMessage = message;
      }

      res.status(finalStatus).json({ error: finalMessage });
    }
  });

  // 2. Poll status
  app.post("/api/video-status", async (req: any, res: any) => {
    try {
      const { operationName, provider } = req.body;
      
      if (provider !== "google") {
        throw new Error("Nepodporovaný poskytovateľ videa.");
      }

      const ai = getAiClient(req);
      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });

      // Check for Google platform errors
      if (updated.error) {
        return res.json({ error: updated.error.message || "Chyba počas generovania videa na strane Google API." });
      }

      // Check for Responsible AI (RAI) filters / brand guardrails
      if (updated.response?.raiMediaFilteredCount > 0) {
        const reasons = updated.response.raiMediaFilteredReasons?.join(" \n") || "";
        let SlovakMsg = "Generovanie videa bolo zablokované bezpečnostnými pravidlami spoločnosti Google (ochrana autorských práv, značiek tretích strán alebo citlivý obsah).";
        if (reasons) {
          SlovakMsg += ` Detaily: ${reasons}`;
        }
        return res.json({ error: SlovakMsg });
      }

      // If done, check if we actually have media
      if (updated.done && (!updated.response?.generatedVideos || updated.response.generatedVideos.length === 0)) {
        return res.json({ error: "Generovanie prebehlo, ale server nevrátil žiadne video. Váš prompt mohol naraziť na automatické filtre obsahu alebo autorských práv." });
      }

      return res.json({ done: updated.done, status: updated.metadata });
    } catch (error: any) {
      console.error("Error polling video status:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Download
  app.post("/api/video-download", async (req: any, res: any) => {
    try {
      const { operationName, provider } = req.body;
      
      if (provider !== "google") {
        throw new Error("Nepodporovaný poskytovateľ videa.");
      }

      const ai = getAiClient(req);
      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      
      console.log("DEBUG: updated response:", JSON.stringify(updated, null, 2));

      if (updated.error) {
        return res.status(400).json({ error: updated.error.message || "Chyba na strane Google API." });
      }

      if (updated.response?.raiMediaFilteredCount > 0) {
        const reasons = updated.response.raiMediaFilteredReasons?.join(" \n") || "";
        let SlovakMsg = "Generovanie videa bolo zablokované bezpečnostnými pravidlami spoločnosti Google (ochrana autorských práv, značiek tretích strán alebo citlivý obsah).";
        if (reasons) {
          SlovakMsg += ` Detaily: ${reasons}`;
        }
        return res.status(400).json({ error: SlovakMsg });
      }
      
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.status(404).json({ 
          error: "Súbor videa nebol v odpovedi servera nájdený. Pravdepodobne bol zablokovaný bezpečnostnými filtrami."
        });
      }

      const currentKey = (req.headers['x-gemini-key'] as string) || "";
      const videoRes = await fetch(uri, { headers: { "x-goog-api-key": currentKey } });
      if (!videoRes.ok) throw new Error(`Failed to fetch video: ${videoRes.statusText}`);
      
      res.setHeader("Content-Type", "video/mp4");
      if (!videoRes.body) throw new Error("No body found in video response");
      const reader = videoRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      return res.end();
    } catch (error: any) {
      console.error("Error downloading video:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Global error handler to ensure JSON responses
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Express Global Error:", err);
    res.status(err.status || 500).json({ 
      error: err.message || "Interná chyba servera",
      details: process.env.NODE_ENV !== "production" ? err.stack : undefined 
    });
  });
}

startServer();
