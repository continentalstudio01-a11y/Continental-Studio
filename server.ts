import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and large file uploads (e.g. photos in base64)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Continental Studio BioSite", version: "1.0.0" });
  });

  // In-memory audio store for uploads and AI generated tracks
  const audioStore = new Map<string, { buffer: Buffer; mimeType: string; filename: string }>();

  // Serve stored audio files
  app.get("/api/audio-store/:id", (req, res) => {
    const audio = audioStore.get(req.params.id);
    if (!audio) {
      return res.status(404).send("Áudio não encontrado");
    }
    res.setHeader("Content-Type", audio.mimeType || "audio/mp3");
    res.setHeader("Content-Length", audio.buffer.length);
    res.setHeader("Accept-Ranges", "bytes");
    return res.send(audio.buffer);
  });

  // Music Generation Endpoint using Lyria
  app.post("/api/generate-music", async (req, res) => {
    try {
      const { prompt, model = "lyria-3-clip-preview" } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Por favor, informe um prompt com o estilo ou descrição da música." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "A chave GEMINI_API_KEY não foi encontrada nas variáveis do servidor."
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const selectedModel = model === "lyria-3-pro-preview" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";

      console.log(`[Lyria Music AI] Gerando trilha com ${selectedModel}... Prompt: "${prompt}"`);

      const responseStream = await ai.models.generateContentStream({
        model: selectedModel,
        contents: prompt
      });

      let audioBase64 = "";
      let mimeType = "audio/wav";
      let lyrics = "";

      for await (const chunk of responseStream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;

        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      if (!audioBase64) {
        return res.status(500).json({ error: "Não foi possível gerar a faixa de áudio com a IA." });
      }

      const audioBuffer = Buffer.from(audioBase64, "base64");
      const audioId = `lyria-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      audioStore.set(audioId, {
        buffer: audioBuffer,
        mimeType,
        filename: `${audioId}.wav`
      });

      const audioUrl = `/api/audio-store/${audioId}`;

      return res.json({
        success: true,
        audioUrl,
        mimeType,
        lyrics,
        modelUsed: selectedModel,
        prompt,
        title: prompt.length > 35 ? prompt.slice(0, 35) + "..." : prompt,
        duration: selectedModel === "lyria-3-pro-preview" ? "Trilha Completa" : "0:30"
      });
    } catch (err: any) {
      console.error("[Lyria Music AI Error]:", err);
      return res.status(500).json({
        error: err.message || "Erro durante o processamento da música pela IA Lyria."
      });
    }
  });

  // Simple in-memory file upload handler for user customer photos
  app.post("/api/upload", (req, res) => {
    try {
      const { filename, fileData } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      return res.json({
        success: true,
        url: fileData.startsWith("data:") ? fileData : `data:image/jpeg;base64,${fileData}`,
        filename: filename || "uploaded_photo.jpg",
        uploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Erro ao processar imagem" });
    }
  });

  // Dedicated Audio File Upload Endpoint
  app.post("/api/upload-audio", (req, res) => {
    try {
      const { filename, fileData, mimeType } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Nenhum arquivo de áudio enviado" });
      }

      const cleanBase64 = fileData.includes(",") ? fileData.split(",")[1] : fileData;
      const audioBuffer = Buffer.from(cleanBase64, "base64");
      const audioMime = mimeType || "audio/mp3";
      const audioId = `audio-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      audioStore.set(audioId, {
        buffer: audioBuffer,
        mimeType: audioMime,
        filename: filename || "musica.mp3"
      });

      const audioUrl = `/api/audio-store/${audioId}`;

      return res.json({
        success: true,
        url: audioUrl,
        audioId,
        filename: filename || "musica_uploaded.mp3",
        mimeType: audioMime,
        uploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("[Audio Upload Error]:", err);
      return res.status(500).json({ error: err.message || "Erro ao processar upload de áudio" });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Continental Studio] Server rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Erro ao iniciar servidor:", err);
});
