export interface VideoStyle {
  id: string;
  label: string;
  promptSuffix: string;
  icon: string;
  previewUrl?: string;
}

export const VIDEO_STYLES: VideoStyle[] = [
  {
    id: "none",
    label: "Žiadny",
    promptSuffix: "",
    icon: "Square"
  },
  {
    id: "cinematic",
    label: "Cinematic",
    promptSuffix: ", high contrast, dramatic lighting, shot on 35mm film, anamorphic lenses, cinematic color grading",
    icon: "Film"
  },
  {
    id: "photorealistic",
    label: "Hyper-Realistický",
    promptSuffix: ", ultra-detailed, 8k resolution, photorealistic, intricate textures, ray tracing, sharp focus",
    icon: "Camera"
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    promptSuffix: ", neon lights, futuristic architecture, synthwave aesthetic, high contrast blue and pink lighting, dark mood",
    icon: "Zap"
  },
  {
    id: "vintage",
    label: "Vintage Film",
    promptSuffix: ", 16mm film grain, muted colors, light leaks, slight flicker, nostalgic retro aesthetic",
    icon: "History"
  },
  {
    id: "anime",
    label: "Anime Ghibli",
    promptSuffix: ", Studio Ghibli style, hand-drawn animation, vibrant colors, lush landscapes, soft painting textures",
    icon: "Palette"
  },
  {
    id: "drone",
    label: "Dronový Záber",
    promptSuffix: ", aerial perspective, smooth sweeping motion, wide angle drone shot, majestic view",
    icon: "Wind"
  },
  {
    id: "macro",
    label: "Makro Detail",
    promptSuffix: ", extreme close-up, shallow depth of field, bokeh background, microscopic detail, soft natural lighting",
    icon: "Search"
  },
  {
    id: "noir",
    label: "Film Noir",
    promptSuffix: ", black and white, dramatic shadows, mysterious atmosphere, gritty texture, high contrast",
    icon: "Moon"
  },
  {
    id: "disney-animation",
    label: "Disney Animácia",
    promptSuffix: ", modern Disney animation style, Pixar inspired, 3D animated movie aesthetic, bright expressive eyes, smooth stylized surfaces, whimsical lighting, vibrant colors, masterpiece, cinematic render",
    icon: "Sparkles"
  },
  {
    id: "abstract",
    label: "Abstraktný",
    promptSuffix: ", abstract art style, non-representational, geometric shapes, fluid forms, conceptual, avant-garde, expressive colors",
    icon: "Layers"
  },
  {
    id: "minimalist",
    label: "Minimalistický",
    promptSuffix: ", minimal aesthetic, clean lines, simple composition, negative space, limited color palette, elegant simplicity, uncluttered",
    icon: "Minimize"
  },
  {
    id: "documentary",
    label: "Dokumentárny",
    promptSuffix: ", documentary film style, handheld camera, raw footage, natural lighting, journalistic aesthetic, realistic textures, candid moments",
    icon: "Tv"
  },
  {
    id: "surrealist",
    label: "Surrealistický",
    promptSuffix: ", surrealism, dreamlike atmosphere, bizarre imagery, Salvador Dali inspired, melting objects, impossible geometry, subconscious elements, ethereal lighting",
    icon: "Cloud"
  },
  {
    id: "digital-art",
    label: "3D Digitálne Umenie",
    promptSuffix: ", hyperrealistic digital art, 3D render, CGI, octane render, unreal engine 5, volumetric lighting, masterpiece, sharp focus",
    icon: "Box"
  }
];
