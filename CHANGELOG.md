# 📋 Changelog

All notable changes to the **Vision Forge** project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-06-15
### Changed
- **Refined Backup Messaging (All Languages)**: Removed specific mentions of *"Imagen & Veo"* from Google Drive background backup descriptions across all 8 supported languages (English, Slovak, German, French, Italian, Spanish, Portuguese, Polish). Now accurately represents that **all** user generated visual assets and videos (including OpenAI models) are safely backed up in the cloud.
- **Sleeker Ko-Fi Layout**: Shrunk all donation support buttons throughout the app by **33%** (scaled down by one-third) for a much sleeker, more professional, and less distracting appearance.
- **Header Alignment**: Repositioned the support button in the page header so that its top edge is perfectly flush/aligned with the *"Poháňané Google Gemini a OpenAI"* badge to create a balanced, high-fidelity visual grid.
- **Micro-cleanups in Documentation**: Removed redundant/cluttering support buttons inside the "Overview" tab of the Documentation modal to improve readability and visual hierarchy.
- **Semantic Versioning**: Standardized application release tracking, reflecting versions in `package.json` and in the custom UI interface.

---

## [1.1.0] - 2026-06-12
### Added
- **Google Drive Backup Integration**: Secure background synchronizations for high-resolution images, base frames, and finished `.mp4` cinematic sequences to your personal Google Drive profile.
- **Auto Cloud Backup Toggle**: A convenient option to run automated backups in the background immediately after a design is synthesized.
- **Cloud Storage Explorer**: Added a responsive container tab inside the central panel to list, filter, download, or safely delete files currently present on the user's remote drive.
- **Multi-language Localization**: Expanded visual translation boundaries to support **8 languages** with rapid live switching:
  - English (`en`), Slovak (`sk`), German (`de`), French (`fr`), Italian (`it`), Spanish (`es`), Portuguese (`pt`), Polish (`pl`).

---

## [1.0.0] - 2026-06-01
### Added
- **Dual Creation Workspace**: Seamless support for both Text-to-Video (Generate) and Image-to-Video (Upload) creation pipelines.
- **Multimodal AI Integrations**: Built-in support for Google Veo (3.1 Lite & 2.0), Google Imagen 3, Gemini 3.1 Flash Image, and OpenAI GPT image models.
- **Creative Art Styling**: 13 pre-coded designer presets (Cinematic, Photorealistic, Cyberpunk, Ghibli, 3D Render, Film Noir, etc.).
- **Aspect Ratios**: Deep support for responsive aspect ratio configurations including 16:9, 9:16, 1:1, 4:5, 4:3, 21:9, and 3:2.
- **Local History Database**: Sandboxed browser tracking of generation logs, parameters, and metadata with instantaneous prompt presets loading.
- **GIF Optimization Engine**: Integrated on-the-fly video to loopable `.gif` export suite using `gifshot`.
- **API Secret Key Vault**: Built-in, zero-server-leak browser key manager with local validation.
