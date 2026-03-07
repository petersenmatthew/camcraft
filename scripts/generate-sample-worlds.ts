import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

// Load .env.local
const envPath = path.join(process.cwd(), ".env");
const envContent = await readFile(envPath, "utf-8");
const apiKeyMatch = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
if (!apiKeyMatch) {
  console.error("GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}
const apiKey = apiKeyMatch[1].trim();

const BASE_PROMPT =
  "Generate a Google Street View photo. This must be a proper equirectangular projection for spherical 360° viewing — the left and right edges connect seamlessly, horizontal lines near the equator stay straight, and the top/bottom show natural polar stretching. No fisheye, no barrel distortion, no mirroring. Photorealistic, sharp, modern digital camera quality. All people and vehicles frozen in place (no motion blur).";

function isSet(val: string | undefined): val is string {
  return !!val && val !== "Default";
}

function buildPrompt(params: Record<string, string>): string {
  const detailParts: string[] = [];
  if (isSet(params.location)) detailParts.push(`Location: ${params.location}`);
  if (isSet(params.timeOfDay)) detailParts.push(`Time of day: ${params.timeOfDay}`);
  if (isSet(params.decade) && params.decade !== "Today") {
    detailParts.push(
      `The cars, clothing, store signs, advertisements, and street furniture in the scene should all be from the ${params.decade}. Everything else about the image — the camera, resolution, projection, and lighting — is identical to a 2024 Google Street View capture`
    );
  }
  if (isSet(params.placeType)) detailParts.push(`Setting: a ${params.placeType}`);
  if (isSet(params.weather)) detailParts.push(`Weather: ${params.weather}`);
  if (isSet(params.crowd)) detailParts.push(`Crowd level: ${params.crowd}`);

  let prompt = detailParts.length === 0 ? BASE_PROMPT : `${BASE_PROMPT}\n\n${detailParts.join(". ")}.`;

  const decadeNum = parseInt(params.decade);
  if (isSet(params.decade) && params.decade !== "Today" && !isNaN(decadeNum) && decadeNum < 2000) {
    prompt += "\n\nRemember: equirectangular projection only. No fisheye, no barrel distortion, no mirrored reflections at top/bottom. No UI elements, no watermarks, no interface overlays — raw photograph only.";
  }

  return prompt;
}

async function generate(params: Record<string, string>): Promise<Buffer> {
  const prompt = buildPrompt(params);
  console.log(`  Prompt: ${prompt.slice(0, 120)}...`);

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            imageSize: "4K",
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts || !Array.isArray(parts)) {
    throw new Error("Unexpected Gemini response format");
  }

  const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);
  if (!imagePart?.inlineData) {
    throw new Error("Gemini did not return an image");
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}

const WORLDS = [
  {
    filename: "new-york-1980s.jpg",
    params: {
      location: "New York City, USA",
      timeOfDay: "afternoon",
      decade: "1980s",
      placeType: "street",
      weather: "clear",
      crowd: "busy",
    },
  },
];

const outDir = path.join(process.cwd(), "public", "sample-worlds");
await mkdir(outDir, { recursive: true });

for (const world of WORLDS) {
  console.log(`\nGenerating: ${world.filename}`);
  try {
    const buf = await generate(world.params);
    const outPath = path.join(outDir, world.filename);
    await writeFile(outPath, buf);
    console.log(`  Saved ${(buf.length / 1024).toFixed(0)} KB → ${outPath}`);
  } catch (e) {
    console.error(`  FAILED: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  }
}

console.log("\nAll 5 sample worlds generated successfully.");
