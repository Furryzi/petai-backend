import express from "express";
import Replicate from "replicate";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ✅ Working route with /api/ prefix for Vercel
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro", // stable model ID
      {
        input: {
          prompt: prompt,
        },
      }
    );

    res.json({ result: output });
  } catch (error) {
    console.error("❌ Error generating image:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

// For local test
app.get("/", (req, res) => {
  res.send("✅ PetAI Backend is running!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
