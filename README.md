# 🌋 Vision Forge — User Documentation & Feature Guide

Welcome to **Vision Forge**, an advanced cinematic AI creation application that transforms text prompts or static images into breathtaking generated sequences. The application combines the technological power of leading models from **Google (Gemini/Veo/Imagen)** and **OpenAI** into a single intuitive, visually polished, and responsive environment.

---

## 🚀 Core Architectural Features

The **Vision Forge** application offers a comprehensive suite of tools for directors, designers, and creatives. Below is a detailed overview and description of its key capabilities:

### 1. Dual Input Mode
- **Generate (Text-to-Video)**:
  Allows you to create a video from a pure text description. Based on your image prompt, the AI first generates a highly detailed asset using Imagen, and then animates it into a cinematic, moving video.
- **Upload (Image-to-Video)**:
  Allows you to upload your own image directly from your device using drag-and-drop or by clicking the upload area. The application automatically detects and respects the aspect ratio of the original design to avoid distortion during video creation.

### 2. Wide Selection of Leading AI Models
You can tailor your projects by choosing specialized models:
- **Video Models**:
  - `Google Veo 3.1 Lite`: The latest, optimized model for generating smooth, high-fidelity cinematic scenes with realistic physical motion.
  - `Google Veo 2.0`: A stable and efficient model for various animations and transitions.
- **Image Models**:
  - `Google Imagen 3`: A state-of-the-art model for generating realistic, detailed, and aesthetically complex images from text instructions.
  - `Gemini 3.1 Flash Image`: A fast and reliable model combining contextual prompt adherence with rapid rendering.
  - `OpenAI GPT Image 1.5 & GPT Image 2`: Alternative models for different types of text interpretation and visual styles.

### 3. Tailored Aspect Ratios
Vision Forge is fully prepared to create content for any platform, supporting the following crop formats:
- **16:9** — The standard for YouTube, presentations, and traditional widescreen media.
- **9:16** — Vertical smartphone orientation tailored specifically for mobile-first content (TikTok, Instagram Reels, YouTube Shorts).
- **1:1** — A symmetric, balanced layout ideal for Instagram posts and profile feeds.
- **4:5** — An extended portrait crop optimized for social feeds.
- **4:3** — A classic ratio for traditional presentation styles or retro visuals.
- **21:9** — An immersive ultrawide Cinemascope format bringing a premium film aesthetic to your screens.
- **3:2** — The standard ratio for classic fine-art photography.

### 4. Creative & Cinematic Styles
With a single click, you can transform the overall aesthetic of your generated visuals using thirteen pre-configured artistic styles that automatically enhance and optimize your prompt:
- **Cinematic**: Dramatic film lighting, depth of field, and color grade.
- **Photorealistic**: Incredible texture details, realistic light reflections, and authentic real-world fidelity.
- **Cyberpunk**: A futurism-inspired setting saturated with neon lights, retro-technologies, and dark urban environments.
- **Vintage Film**: A nostalgic touch featuring film grain and warm, analog color tones.
- **Anime Ghibli**: The classic, hand-drawn aesthetic of the legendary Japanese dynamic animation studio.
- **Drone Shot**: A breathtaking bird's-eye view perspective with sweeping, majestic camera pans.
- **Macro**: Extreme close-up with precise focus on micro-structures and tiny details.
- **Film Noir**: A dark, high-contrast, black-and-white aesthetic highlighting dramatic shadows.
- **Disney/Pixar**: Magical 3D family animation aesthetics featuring friendly, expressive characters.
- **3D Digital Art**: Modern three-dimensional renders with abstract geometry.
- **Minimalist & Abstract**: Pure simplicity, clean shapes, raw emotion, and custom color harmonies.
- **Documentary & Surrealist**: Honest documentary-style realism or dreamlike, limitless surreal concepts.

### 5. Advanced Video Parameters
- **Custom Duration**: Specify the exact runtime in seconds to suit your visual pacing.
- **Video Resolution**: Choose between standard output resolutions with an intelligent **Auto** mode that adapts to your screen layout.
- **Video Stabilization**: An advanced hardware-simulation filter that actively smooths camera shakes to deliver sleek, stable cinematic pans.

### 6. Export and Download Controls
- **GIF Export Engine**: An integrated conversion module (utilizing the `gifshot` library) that quickly packs your generated video into a web-optimized, looping `.gif` container. You can adjust the target FPS, resolution, and crop ratio on-the-fly.
- **Video Downloads**: Download the final generated high-quality `.mp4` video directly to your device with a single click.

### 7. Local History & Creative Vault
- Every successful generation is immediately saved in your local **Generation History**.
- The archive securely preserves the media itself alongside its core metadata: the original text description, selected model, output resolution, custom duration, and style configurations.
- Use the **Use parameters** option to instantly reload a past configuration back into your primary workspace panel for fast, iterative improvements.

### 8. Google Drive Cloud Backup Integration
- **Background Backups**: Securely back up your generated images, custom base designs, and full `.mp4` cinematic sequences to your personal Google Drive in the background.
- **Auto Cloud Backup**: When enabled, newly generated assets and films are automatically uploaded to Google Drive as soon as they are successfully synthesized.
- **Dedicated Cloud Storage Tab**: Filter between your "Local History" (offline-first browser state) and "Google Drive Cloud Backups" (an interactive explorer showing all backed-up assets inside your dedicated folder).
- **File Management & Sharing**: Open any backed-up video or image directly in Google Drive with a single click, or safely delete files from your cloud backup repository from inside the Vision Forge interface.

### 9. Privacy & Token Safety
- **Laid-back API Config**: The application runs directly on your own API keys for **Google Gemini** and **OpenAI**.
- **LocalStorage Storage**: Your secret developer API keys are stored exclusively inside your browser's sandboxed `localStorage` environment and never leave your local workspace—ensuring 100% protection and peace of mind.

---

## 🛠️ Sandbox, Iframe & Cookie Troubleshooting

Since the preview application may reside within a sandboxed development environment iframe or learning platform, some strict, modern browsers could block the necessary third-party cookies or pop-up requests.

**Vision Forge** has built-in features to easily bypass these limits:
- **"New Tab" Redirect**: Located at the top right of the application header. A single click opens the application in a standalone browser tab, immediately bypassing any sandboxed iframe blocks and guaranteeing full feature operations.
- **Multilingual Support**: Switch layouts instantly using the customizable language selector dropdown (supporting 8 languages including English, Slovak, German, French, and Spanish). This ensures local instructions match your visual workflow while carrying over all application states.

---

*Bring your creative imagination to life and render your first cinematic sequence with Vision Forge today!*
