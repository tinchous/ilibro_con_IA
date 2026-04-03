import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Grok API Route
  app.post("/api/quantum-mail", async (req, res) => {
    try {
      const { subject, body, recipient = "Elon" } = req.body;
      const XAI_API_KEY = process.env.XAI_API_KEY;

      if (!XAI_API_KEY) {
        console.error("XAI_API_KEY is missing in environment");
        return res.status(500).json({ error: "XAI_API_KEY not configured" });
      }

      console.log("Using XAI_API_KEY:", XAI_API_KEY.substring(0, 8) + "...");

      // System prompts for different characters
      const systemPrompts: Record<string, string> = {
        Elon: `Eres Elon Musk respondiendo un mail en 2026. 
        Hablás directo, sarcástico, con humor negro y memes de cohetes. 
        Creés fuertemente en la simulation hypothesis. 
        Mencionás xAI, Grok descubriendo nueva física, Marte, Neuralink cuando encaja. 
        Nunca rompés el personaje. 
        Si el mail es interesante, respondés con ganas. Si es boludo, lo decís sin filtro.
        Respuesta en formato email: 
        Subject: Re: ${subject}
        From: Elon Musk <elon@x.ai>
        Body: (máximo 300 palabras, natural)`,
        Jesus: `Eres una representación cuántica de Jesús en el año 2026. 
        Hablas con compasión pero de forma críptica, usando parábolas que mezclan espiritualidad con física cuántica y datos. 
        Ves el universo como un algoritmo divino. 
        Respuesta en formato email: 
        Subject: Re: ${subject}
        From: El Primer Programador <logos@quantum.heaven>
        Body: (máximo 300 palabras, poético)`,
        Einstein: `Eres Albert Einstein en la Rama Imaginaria. 
        Estás fascinado por cómo el Lector colapsa tu función de onda. 
        Hablas de relatividad narrativa y entrelazamiento de historias. 
        Respuesta en formato email: 
        Subject: Re: ${subject}
        From: Albert Einstein <albert@imaginary.physics>
        Body: (máximo 300 palabras, curioso)`,
        Tesla: `Eres Nikola Tesla en la Rama Imaginaria. 
        Hablas de frecuencias, vibraciones y energía. 
        Estás convencido de que el libro es una antena y el Lector es el receptor. 
        Respuesta en formato email: 
        Subject: Re: ${subject}
        From: Nikola Tesla <nikola@wardenclyffe.tower>
        Body: (máximo 300 palabras, intenso)`,
        FutureScientist: `Eres un científico del año 2150. 
        Para ti, la física de 2026 es como la alquimia. 
        Hablas de dimensiones que el Lector aún no puede percibir. 
        Respuesta en formato email: 
        Subject: Re: ${subject}
        From: Investigador de la Singularidad <null@future.science>
        Body: (máximo 300 palabras, avanzado)`
      };

      const systemPrompt = systemPrompts[recipient] || systemPrompts["Elon"];

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${XAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Asunto: ${subject}\n\n${body}` },
          ],
          temperature: 0.85,
          max_tokens: 600,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Grok API Error Response:", JSON.stringify(data, null, 2));
        return res.status(response.status).json(data);
      }

      if (!data.choices || !data.choices[0]) {
        console.error("Grok Invalid Response:", data);
        return res.status(500).json({ error: "Respuesta inválida de Grok" });
      }

      const reply = data.choices[0].message.content;

      // Quantum collapse probability
      const collapseProbability = Math.random();
      if (collapseProbability < 0.15) {
        return res.json({
          status: "collapsed",
          message: "El mail se perdió en la superposición cuántica... intentá de nuevo, observador.",
        });
      }

      // Plane interference probability
      const planeInterference = Math.random();
      if (planeInterference < 0.1) {
        return res.json({
          status: "out_of_phase",
          message: "El destinatario se encuentra en una frecuencia inalcanzable o en otro plano dimensional. La entrega ha fallado.",
        });
      }

      res.json({
        status: "delivered",
        from: recipient,
        subject: `Re: ${subject}`,
        body: reply,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "El universo falló" });
    }
  });

  // Gemini Image Generation Route
  app.post("/api/quantum-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      console.log("Generating image for prompt:", prompt);
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              text: `Una imagen artística y cuántica de: ${prompt}. Estilo futurista, con fractales y distorsiones de realidad.`,
            },
          ],
        },
      });

      let imageUrl = "";
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) {
        return res.status(500).json({ error: "No se pudo generar la imagen" });
      }

      res.json({ imageUrl });
    } catch (error) {
      console.error("Image Generation Error:", error);
      res.status(500).json({ error: "Error al generar imagen cuántica" });
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
}

startServer();
