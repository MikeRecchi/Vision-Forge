import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, Loader2, Download, CheckCircle, Smartphone, Monitor, ChevronRight, ChevronDown, AlertCircle, FileImage, Settings, Key, X, Languages, Film, Camera, Zap, History, Palette, Wind, Search, Moon, Square, Box, Sparkles, Clock, Copy, RotateCcw, Trash2, Layers, Minimize, Tv, Cloud, ExternalLink, Play, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gifshot from 'gifshot';
import { translations, Language } from './translations';
import { VIDEO_STYLES, VideoStyle } from './constants';

interface HistoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  model: string;
  timestamp: number;
  expired?: boolean;
  parameters: {
    aspectRatio: string;
    resolution: string;
    duration?: string;
    style?: string;
    stabilization?: boolean;
  };
}

export default function App() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("A professional photo of a futuristic city at sunset, cinematic lighting, highly detailed");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [prompt, setPrompt] = useState("A smooth cinematic drone shot flying through the city streets, 5 seconds long, high definition");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [originalRatio, setOriginalRatio] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "generate">("upload");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [publicVideoUrl, setPublicVideoUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [selectedImageModel, setSelectedImageModel] = useState("gemini-3.1-flash");
  const [imageResolution, setImageResolution] = useState("Auto");
  const [selectedVideoModel, setSelectedVideoModel] = useState("veo-3.1-lite");
  const [videoDuration, setVideoDuration] = useState("5s");
  const [videoResolution, setVideoResolution] = useState("Auto");
  const [detectedRes, setDetectedRes] = useState({ video: "720p", image: "HD" });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [editingBaseImage, setEditingBaseImage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGeminiValidating, setIsGeminiValidating] = useState(false);
  const [isOpenAIValidating, setIsOpenAIValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState({ gemini: null as boolean | null, openai: null as boolean | null });
  
  // GIF Settings
  const [gifAspectRatio, setGifAspectRatio] = useState("16:9");
  const [gifResolution, setGifResolution] = useState("480");
  const [gifFrameRate, setGifFrameRate] = useState("10");
  const [stabilization, setStabilization] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>(VIDEO_STYLES[0]);

  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<'overview' | 'features' | 'models' | 'ratios' | 'privacy'>('overview');
  const [showCreativeSettings, setShowCreativeSettings] = useState(false);
  const [showAdvancedVideoSettings, setShowAdvancedVideoSettings] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setUserApiKey(savedKey);
    const savedOpenAI = localStorage.getItem('openai_api_key');
    if (savedOpenAI) setOpenaiApiKey(savedOpenAI);

    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }

    // Screen Resolution Detection
    const detectResolution = () => {
      const width = window.screen.width * (window.devicePixelRatio || 1);
      const height = window.screen.height * (window.devicePixelRatio || 1);
      const maxDim = Math.max(width, height);

      let vRes = "720p";
      let iRes = "HD";

      if (maxDim >= 3840) {
        vRes = "4k";
        iRes = "4K";
      } else if (maxDim >= 2560) {
        vRes = "1080p";
        iRes = "2K";
      } else if (maxDim >= 1920) {
        vRes = "1080p";
        iRes = "HD";
      } else if (maxDim <= 1000) {
        vRes = "480p";
        iRes = "SD";
      }

      setDetectedRes({ video: vRes, image: iRes });
    };

    detectResolution();

    const savedHistory = localStorage.getItem('generation_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const cleaned = Array.isArray(parsed) ? parsed.map((item: any) => {
          if (item.type === 'video' && item.url && item.url.startsWith('blob:')) {
            return { ...item, expired: true };
          }
          return item;
        }) : [];
        setHistory(cleaned);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10 items
    setHistory(updatedHistory);
    try {
      localStorage.setItem('generation_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('generation_history');
  };

  const useHistoryItem = (item: HistoryItem) => {
    if (item.type === 'image') {
      setImagePrompt(item.prompt);
      setAspectRatio(item.parameters.aspectRatio);
      setSelectedImageModel(item.model);
      setImageResolution(item.parameters.resolution);
      setInputMode('generate');
    } else {
      setPrompt(item.prompt);
      setAspectRatio(item.parameters.aspectRatio);
      setSelectedVideoModel(item.model);
      setVideoResolution(item.parameters.resolution);
      if (item.parameters.duration) {
        if (["5s", "10s", "15s", "30s"].includes(item.parameters.duration)) {
          setVideoDuration(item.parameters.duration);
          setIsCustomDuration(false);
        } else {
          setVideoDuration("5s");
          setIsCustomDuration(true);
          setCustomDurationValue(item.parameters.duration.replace('s', ''));
        }
      }
      if (item.parameters.stabilization !== undefined) setStabilization(item.parameters.stabilization);
    }
    
    if (item.parameters.style) {
      const style = VIDEO_STYLES.find(s => s.label === item.parameters.style);
      if (style) setSelectedStyle(style);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
    setShowLanguageMenu(false);
  };

  const clearGeminiKey = () => {
    setUserApiKey("");
    localStorage.removeItem('gemini_api_key');
    setValidationStatus(prev => ({ ...prev, gemini: null }));
  };

  const clearOpenAIKey = () => {
    setOpenaiApiKey("");
    localStorage.removeItem('openai_api_key');
    setValidationStatus(prev => ({ ...prev, openai: null }));
  };

  const validateGemini = async () => {
    setIsGeminiValidating(true);
    try {
      const resp = await fetch("/api/verify-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiKey: userApiKey })
      });
      const data = await resp.json();
      setValidationStatus(prev => ({...prev, gemini: data.gemini}));
      if (!data.gemini && userApiKey) alert(`Gemini key validation failed: ${data.geminiError}`);
    } catch (e) {
      console.error(e);
      alert("Validation request failed.");
    } finally {
      setIsGeminiValidating(false);
    }
  };

  const validateOpenAI = async () => {
    setIsOpenAIValidating(true);
    try {
      const resp = await fetch("/api/verify-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openaiKey: openaiApiKey })
      });
      const data = await resp.json();
      setValidationStatus(prev => ({...prev, openai: data.openai}));
      if (!data.openai && openaiApiKey) alert(`OpenAI key validation failed: ${data.openaiError}`);
    } catch (e) {
      console.error(e);
      alert("Validation request failed.");
    } finally {
      setIsOpenAIValidating(false);
    }
  };

  const saveApiKey = (key: string) => {
    setUserApiKey(key);
    setValidationStatus(prev => ({...prev, gemini: null}));
    localStorage.setItem('gemini_api_key', key);
  };

  const saveOpenaiKey = (key: string) => {
    setOpenaiApiKey(key);
    setValidationStatus(prev => ({...prev, openai: null}));
    localStorage.setItem('openai_api_key', key);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectRatioString = (ratio: string) => {
    const parts = ratio.split(':');
    if (parts.length === 2) {
      return `${parts[0]}/${parts[1]}`;
    }
    return '16/9';
  };

  const handleGenerateImage = async () => {
    if (!userApiKey) {
      setError("Please add your Gemini API key in Settings.");
      setShowSettings(true);
      return;
    }
    
    setIsGeneratingImage(true);
    setImageError(null);
    setError(null);
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (userApiKey) headers["x-gemini-key"] = userApiKey;
      if (openaiApiKey) headers["x-openai-key"] = openaiApiKey;

      const finalImagePrompt = `${imagePrompt}${selectedStyle.promptSuffix}`;

      const body: any = { 
        prompt: finalImagePrompt, 
        aspectRatio, 
        model: selectedImageModel,
        resolution: imageResolution === "Auto" ? detectedRes.image : imageResolution 
      };

      if (isEditMode && editingBaseImage) {
        body.image = editingBaseImage;
      }

      const resp = await fetch("/api/generate-image", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const contentType = resp.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await resp.text();
        console.error("Non-JSON response from server (image):", text);
        if (text.includes("Cookie check") || text.includes("Authenticate") || text.includes("aistudio") || text.includes("<html") || text.includes("<!doctype")) {
          throw new Error((t as any).errorIframeCookie);
        }
        if (text.includes("application starts") || text.includes("Starting Server")) {
          throw new Error((t as any).errorServerRestarting);
        }
        throw new Error((t as any).errorUnexpectedResponseImage);
      }

      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      setPreview(data.image);
      if (isEditMode) {
        setIsEditMode(false);
      }
      
      saveToHistory({
        type: 'image',
        url: data.image,
        prompt: imagePrompt,
        model: selectedImageModel,
        parameters: {
          aspectRatio,
          resolution: imageResolution === "Auto" ? detectedRes.image : imageResolution,
          style: selectedStyle.label
        }
      });

      const res = await fetch(data.image);
      const blob = await res.blob();
      const file = new File([blob], "generated_frame.png", { type: data.mimeType });
      setImage(file);
    } catch (err: any) {
      setImageError(err.message);
      setError(err.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreview(url);

      // Detect original aspect ratio and map to nearest supported
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const currentRatio = w / h;
        
        const supported = [
          { name: "16:9", value: 16 / 9 },
          { name: "3:2", value: 3 / 2 },
          { name: "4:3", value: 4 / 3 },
          { name: "1:1", value: 1 / 1 },
          { name: "4:5", value: 0.8 },
          { name: "3:4", value: 3 / 4 },
          { name: "2:3", value: 2 / 3 },
          { name: "9:16", value: 9 / 16 }
        ];

        let closest = supported[0];
        let minDiff = Math.abs(currentRatio - closest.value);

        for (const s of supported) {
          const diff = Math.abs(currentRatio - s.value);
          if (diff < minDiff) {
            minDiff = diff;
            closest = s;
          }
        }

        setOriginalRatio(closest.name);
        setAspectRatio(closest.name);
      };
      img.src = url;
    }
  };

  const handleGenerate = async () => {
    if (!userApiKey) {
      setError("Please add your Gemini API key in Settings.");
      setShowSettings(true);
      return;
    }
    
    setIsGenerating(true);
    setVideoUrl(null);
    setGifUrl(null);
    setError(null);
    setProgress(0);
    setStatusText(t.loadingMessages[0]);

    try {
      const formData = new FormData();
      const finalPrompt = `${prompt}${selectedStyle.promptSuffix}`;
      formData.append('prompt', finalPrompt);
      formData.append('aspectRatio', aspectRatio);
      formData.append('model', selectedVideoModel);
      formData.append('resolution', videoResolution === "Auto" ? detectedRes.video : videoResolution);
      formData.append('stabilization', stabilization.toString());
      const finalDuration = isCustomDuration ? `${customDurationValue || "5"}s` : videoDuration;
      formData.append('duration', finalDuration);
      if (image) {
        formData.append('image', image);
      }

      const headers: any = {};
      if (userApiKey) headers["x-gemini-key"] = userApiKey;

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response from server:", text);
        if (text.includes("Cookie check") || text.includes("Authenticate") || text.includes("aistudio") || text.includes("<html") || text.includes("<!doctype")) {
          throw new Error((t as any).errorIframeCookie);
        }
        if (text.includes("application starts") || text.includes("Starting Server")) {
          throw new Error((t as any).errorServerRestarting);
        }
        throw new Error((t as any).errorUnexpectedResponseVideo);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      startPolling(data.operationName, data.provider);
    } catch (err: any) {
      setError(err.message);
      setIsGenerating(false);
    }
  };

  const startPolling = (opName: string, provider: string) => {
    let messageIndex = 0;
    let interval = setInterval(async () => {
      try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (userApiKey) headers["x-gemini-key"] = userApiKey;

        const response = await fetch('/api/video-status', {
          method: 'POST',
          headers,
          body: JSON.stringify({ operationName: opName, provider }),
          credentials: 'include',
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response during polling:", text);
          if (text.includes("Cookie check") || text.includes("Authenticate") || text.includes("aistudio") || text.includes("<html") || text.includes("<!doctype")) {
            throw new Error((t as any).errorIframeCookie);
          }
          if (text.includes("application starts") || text.includes("Starting Server")) {
            throw new Error((t as any).errorServerRestartingStatus);
          }
          throw new Error((t as any).errorUnexpectedResponseStatus);
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        if (data.done) {
          clearInterval(interval);
          downloadVideo(opName, provider, data.video_url);
        } else {
          // Update message
          const messages = t.loadingMessages;
          messageIndex = (messageIndex + 1) % messages.length;
          setStatusText(messages[messageIndex]);
          setProgress((prev) => Math.min(prev + 2, 98));
        }
      } catch (err: any) {
        clearInterval(interval);
        setError(err.message);
        setIsGenerating(false);
      }
    }, 10000); // Poll every 10 seconds as video generation is slow
  };

  const downloadVideo = async (opName: string, provider: string, videoUrl?: string) => {
    setStatusText(t.downloadingVideo);
    setProgress(100);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (userApiKey) headers["x-gemini-key"] = userApiKey;

      const response = await fetch('/api/video-download', {
        method: 'POST',
        headers,
        body: JSON.stringify({ operationName: opName, provider, videoUrl }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to download video");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setPublicVideoUrl(videoUrl || null);

      saveToHistory({
        type: 'video',
        url: url,
        prompt: prompt,
        model: selectedVideoModel,
        parameters: {
          aspectRatio,
          resolution: videoResolution === "Auto" ? detectedRes.video : videoResolution,
          duration: isCustomDuration ? `${customDurationValue || "5"}s` : videoDuration,
          stabilization,
          style: selectedStyle.label
        }
      });

      setIsGenerating(false);
    } catch (err: any) {
      setError(err.message);
      setIsGenerating(false);
    }
  };

  const handleExportGif = () => {
    if (!videoUrl) return;
    setIsExportingGif(true);
    setError(null);
    setGifUrl(null);

    const width = parseInt(gifResolution);
    const [rw, rh] = gifAspectRatio.split(':').map(Number);
    const height = Math.round((width / rw) * rh);
    
    const fps = parseInt(gifFrameRate);
    const videoSeconds = isCustomDuration ? (parseFloat(customDurationValue) || 15) : (parseFloat(videoDuration.replace('s', '')) || 5);
    const numFrames = Math.round(videoSeconds * fps);

    gifshot.createGIF({
      video: [videoUrl],
      gifWidth: width,
      gifHeight: height,
      numFrames: numFrames,
      sampleInterval: 5,
      interval: 1 / fps,
    }, (obj: any) => {
      if (!obj.error) {
        setGifUrl(obj.image);
      } else {
        setError("Failed to create GIF: " + obj.errorMsg);
      }
      setIsExportingGif(false);
    });
  };



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 selection:bg-emerald-500/30 relative overflow-x-hidden font-sans">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Settings Modal/Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500" title={(t as any).tooltips.apiSettings}>
                    <Key className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">{t.settingsTitle}</h2>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">{t.geminiKey}</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="password"
                      value={userApiKey}
                      onChange={(e) => saveApiKey(e.target.value)}
                      placeholder="Enter your API key..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                    <button 
                      onClick={validateGemini}
                      disabled={isGeminiValidating}
                      className="bg-slate-800 text-slate-300 font-bold p-4 rounded-2xl hover:bg-slate-700 transition-all text-xs flex items-center justify-center shrink-0"
                    >
                      {isGeminiValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={clearGeminiKey}
                      className="text-red-500 font-bold bg-slate-800 p-4 rounded-2xl hover:bg-slate-700 transition-all text-xs shrink-0"
                      title={t.clearGeminiKey}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {validationStatus.gemini === true && <span className="text-emerald-500 text-xs block pl-1">✓ {t.keyValid}</span>}
                  {validationStatus.gemini === false && <span className="text-red-500 text-xs block pl-1">✗ {t.keyInvalid}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">{t.openaiKey}</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => saveOpenaiKey(e.target.value)}
                      placeholder="Enter OpenAI key..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                    <button 
                      onClick={validateOpenAI}
                      disabled={isOpenAIValidating}
                      className="bg-slate-800 text-slate-300 font-bold p-4 rounded-2xl hover:bg-slate-700 transition-all text-xs flex items-center justify-center shrink-0"
                    >
                      {isOpenAIValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={clearOpenAIKey}
                      className="text-red-500 font-bold bg-slate-800 p-4 rounded-2xl hover:bg-slate-700 transition-all text-xs shrink-0"
                      title={t.clearOpenAIKey}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {validationStatus.openai === true && <span className="text-emerald-500 text-xs block pl-1">✓ {t.keyValid}</span>}
                  {validationStatus.openai === false && <span className="text-red-500 text-xs block pl-1">✗ {t.keyInvalid}</span>}
                </div>

                <div className="pt-4 space-y-4">
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {t.saveChanges}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDocumentation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setShowDocumentation(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      {(t as any).documentation?.title || "Application Documentation"}
                    </h2>
                    <p className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wide uppercase">
                      Vision Forge • {(t as any).documentation?.subtitle || "User Guide"}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowDocumentation(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col md:flex-row gap-6 overflow-hidden flex-1">
                {/* Desktop Sidebar / Mobile Top bar */}
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-3 md:pb-0 md:w-56 shrink-0 md:border-r md:border-white/5 pr-0 md:pr-4">
                  {[
                    { id: 'overview', label: (t as any).documentation?.tabs?.overview || "Overview", icon: Sparkles },
                    { id: 'features', label: (t as any).documentation?.tabs?.features || "Core Features", icon: Layers },
                    { id: 'models', label: (t as any).documentation?.tabs?.models || "AI Models", icon: Film },
                    { id: 'ratios', label: (t as any).documentation?.tabs?.ratios || "Aspect Ratios", icon: Monitor },
                    { id: 'privacy', label: (t as any).documentation?.tabs?.privacy || "Privacy & API", icon: Key }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeDocTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDocTab(tab.id as any)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-all whitespace-nowrap shrink-0 text-left ${
                          isActive 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-500/5" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                        }`}
                      >
                        <TabIcon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Content Panel */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-slate-300 text-sm leading-relaxed pb-4">
                  {activeDocTab === 'overview' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        {(t as any).documentation?.overview?.title || "Welcome to Vision Forge"}
                      </h3>
                      <p>
                        {(t as any).documentation?.overview?.text || ""}
                      </p>
                      <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {(t as any).documentation?.overview?.specialTitle || "What makes this app special?"}
                        </h4>
                        <ul className="list-none space-y-2 pl-0">
                          <li className="flex items-start gap-2 text-xs">
                            <span className="text-emerald-500 mt-1">✦</span>
                            <span>{(t as any).documentation?.overview?.special1 || ""}</span>
                          </li>
                          <li className="flex items-start gap-2 text-xs">
                            <span className="text-emerald-500 mt-1">✦</span>
                            <span>{(t as any).documentation?.overview?.special2 || ""}</span>
                          </li>
                          <li className="flex items-start gap-2 text-xs">
                            <span className="text-emerald-500 mt-1">✦</span>
                            <span>{(t as any).documentation?.overview?.special3 || ""}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'features' && (
                    <div className="space-y-4 font-sans">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-400" />
                        {(t as any).documentation?.features?.title || "Core Features"}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-white text-sm mb-1">{(t as any).documentation?.features?.item1Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.features?.item1Text || ""}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-white text-sm mb-1">{(t as any).documentation?.features?.item2Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.features?.item2Text || ""}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-white text-sm mb-1">{(t as any).documentation?.features?.item3Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.features?.item3Text || ""}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-white text-sm mb-1">{(t as any).documentation?.features?.item4Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.features?.item4Text || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'models' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Film className="w-5 h-5 text-emerald-400" />
                        {(t as any).documentation?.models?.title || "Generative AI Models"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {(t as any).documentation?.models?.intro || ""}
                      </p>

                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                          <span className="font-bold text-emerald-400">{(t as any).documentation?.models?.item1Title || "Google Veo 3.1 & 2.0"}</span>
                          <p className="text-slate-400 mt-1">{(t as any).documentation?.models?.item1Text || ""}</p>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                          <span className="font-bold text-emerald-400">{(t as any).documentation?.models?.item2Title || "Google Imagen 3"}</span>
                          <p className="text-slate-400 mt-1">{(t as any).documentation?.models?.item2Text || ""}</p>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                          <span className="font-bold text-emerald-400">{(t as any).documentation?.models?.item3Title || "Gemini 3.1 Flash Image"}</span>
                          <p className="text-slate-400 mt-1">{(t as any).documentation?.models?.item3Text || ""}</p>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                          <span className="font-bold text-emerald-400">{(t as any).documentation?.models?.item4Title || "OpenAI Series"}</span>
                          <p className="text-slate-400 mt-1">{(t as any).documentation?.models?.item4Text || ""}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'ratios' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-emerald-400" />
                        {(t as any).documentation?.ratios?.title || "Optimized Crop Formats"}
                      </h3>
                      <p>
                        {(t as any).documentation?.ratios?.intro || ""}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex items-center gap-3">
                          <div className="p-2 rounded bg-slate-900 font-bold text-emerald-400 w-12 text-center">16:9</div>
                          <div>
                            <span className="font-bold block text-white">{(t as any).documentation?.ratios?.item1Title || ""}</span>
                            <span className="text-slate-500">{(t as any).documentation?.ratios?.item1Text || ""}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex items-center gap-3">
                          <div className="p-2 rounded bg-slate-900 font-bold text-emerald-400 w-12 text-center">9:16</div>
                          <div>
                            <span className="font-bold block text-white">{(t as any).documentation?.ratios?.item2Title || ""}</span>
                            <span className="text-slate-500">{(t as any).documentation?.ratios?.item2Text || ""}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex items-center gap-3">
                          <div className="p-2 rounded bg-slate-900 font-bold text-emerald-400 w-12 text-center">1:1</div>
                          <div>
                            <span className="font-bold block text-white">{(t as any).documentation?.ratios?.item3Title || ""}</span>
                            <span className="text-slate-500">{(t as any).documentation?.ratios?.item3Text || ""}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex items-center gap-3">
                          <div className="p-2 rounded bg-slate-900 font-bold text-emerald-400 w-12 text-center">21:9</div>
                          <div>
                            <span className="font-bold block text-white">{(t as any).documentation?.ratios?.item4Title || ""}</span>
                            <span className="text-slate-500">{(t as any).documentation?.ratios?.item4Text || ""}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'privacy' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-emerald-400" />
                        {(t as any).documentation?.privacy?.title || "Privacy, Vault & Safety Rules"}
                      </h3>
                      <p>
                        {(t as any).documentation?.privacy?.intro || ""}
                      </p>

                      <div className="space-y-3 text-xs text-slate-400">
                        <div className="flex gap-2">
                          <span className="text-emerald-500 mt-0.5">✔</span>
                          <div>
                            <span className="font-bold text-white block">{(t as any).documentation?.privacy?.item1Title || ""}</span>
                            <span>{(t as any).documentation?.privacy?.item1Text || ""}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-emerald-500 mt-0.5">✔</span>
                          <div>
                            <span className="font-bold text-white block">{(t as any).documentation?.privacy?.item2Title || ""}</span>
                            <span>{(t as any).documentation?.privacy?.item2Text || ""}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center shrink-0">
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  Google Gemini & OpenAI Power • Vision Forge
                </span>
                <button
                  onClick={() => setShowDocumentation(false)}
                  className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  {(t as any).documentation?.close || "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
          >
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setSelectedPreview(null)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
            >
              <img 
                src={selectedPreview} 
                alt="Full preview" 
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-white/10"
              />
              <button 
                onClick={() => setSelectedPreview(null)}
                className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <a 
                  href={selectedPreview} 
                  download="download.png"
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-slate-950 rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-400 transition-all whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  {t.downloadImage}
                </a>
                <button 
                  onClick={() => {
                    setEditingBaseImage(selectedPreview);
                    setIsEditMode(true);
                    setInputMode("generate");
                    setSelectedPreview(null);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm backdrop-blur-md transition-all whitespace-nowrap"
                >
                  <Palette className="w-4 h-4" />
                  {(t as any).editImage}
                </button>
                <button 
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                    setOriginalRatio(null);
                    setSelectedPreview(null);
                    if (isEditMode) {
                      setIsEditMode(false);
                      setEditingBaseImage(null);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm backdrop-blur-md transition-all whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  {(t as any).deleteImage}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Video className="w-4 h-4" />
              {t.heroBadge}
            </div>
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent font-display leading-tight py-2">
              {t.title}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
              {t.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative" ref={languageDropdownRef}>
              <button 
                onClick={() => setShowLanguageMenu(prev => !prev)}
                className={`p-3 rounded-2xl bg-slate-900 border text-slate-400 hover:text-white transition-all flex items-center gap-2 ${showLanguageMenu ? "border-emerald-500/30 text-white" : "border-slate-800"}`}
                title={(t as any).tooltips.language}
              >
                <Languages className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{language}</span>
              </button>
              <div className={`absolute top-full right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all z-20 ${showLanguageMenu ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                {(Object.entries(translations) as [Language, any][]).map(([lang, data]) => {
                  const flags: Record<Language, string> = {
                    en: "https://flagcdn.com/w20/us.png",
                    de: "https://flagcdn.com/w20/de.png",
                    fr: "https://flagcdn.com/w20/fr.png",
                    it: "https://flagcdn.com/w20/it.png",
                    es: "https://flagcdn.com/w20/es.png",
                    pt: "https://flagcdn.com/w20/pt.png",
                    pl: "https://flagcdn.com/w20/pl.png",
                    sk: "https://flagcdn.com/w20/sk.png"
                  };
                  return (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors hover:bg-slate-800 flex items-center gap-2 ${language === lang ? "text-emerald-400 bg-emerald-500/5" : "text-slate-400"}`}
                    >
                      <img src={flags[lang]} width="20" height="auto" alt={`${lang} flag`} className="rounded-sm" />
                      <span>{lang.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button 
              onClick={() => window.open(window.location.href, '_blank')}
              className="p-3 rounded-2xl border bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 shadow-lg"
              title={(t as any).openNewTabTooltip}
            >
              <ExternalLink className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold uppercase">{(t as any).openNewTab}</span>
            </button>
            <button 
              onClick={() => setShowDocumentation(true)}
              className="p-3 rounded-2xl border bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 shadow-lg"
              title={(t as any).documentation?.button || "Documentation"}
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold uppercase">{(t as any).documentation?.button || "Documentation"}</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className={`p-3 rounded-2xl border transition-all ${userApiKey ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"}`}
              title={(t as any).tooltips.apiSettings}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Controls - Left Side */}
          <div className="lg:col-span-4 space-y-6">
            {/* Base Image Card */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-3xl shadow-xl relative overflow-hidden group ring-1 ring-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              
              <section className="space-y-6 relative z-10">
                <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <button 
                    onClick={() => setInputMode("upload")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${inputMode === "upload" ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    {t.modeUpload}
                  </button>
                  <button 
                    onClick={() => setInputMode("generate")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${inputMode === "generate" ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    {t.modeGenerate}
                  </button>
                </div>

                {/* Creative Controls Accordion */}
                <div className="space-y-4">
                  <button 
                    onClick={() => setShowCreativeSettings(!showCreativeSettings)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                        <Palette className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{(t as any).creativeSettings}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showCreativeSettings ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showCreativeSettings && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.aspectRatio}</label>
                              {originalRatio && inputMode === "upload" && (
                                <button 
                                  onClick={() => setAspectRatio(originalRatio)}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${aspectRatio === originalRatio ? "bg-emerald-500/10 text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                  {t.matchOriginal}: {originalRatio}
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                              {[
                                { val: "16:9", icon: <Monitor className="w-4 h-4" /> },
                                { val: "9:16", icon: <Smartphone className="w-4 h-4" /> },
                                { val: "1:1", icon: <div className="w-3 h-3 border-2 border-current rounded-sm" /> },
                                { val: "4:5", icon: <Smartphone className="w-4 h-4 rotate-90" /> },
                                { val: "21:9", icon: <Monitor className="w-4 h-4 scale-x-125" /> },
                                { val: "4:3", icon: <Monitor className="w-4 h-4 opacity-70" /> },
                              ].map((item) => (
                                <button 
                                  key={item.val}
                                  onClick={() => setAspectRatio(item.val)}
                                  className={`flex flex-col items-start gap-2 p-3 rounded-2xl border transition-all relative overflow-hidden group/ratio ${aspectRatio === item.val ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5" : "bg-slate-950/50 border-white/5 hover:border-white/10"}`}
                                  title={(t as any).ratioLabels[item.val]}
                                >
                                  <div className={`p-2 rounded-lg transition-colors ${aspectRatio === item.val ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-400 group-hover/ratio:text-slate-200"}`}>
                                    {item.icon}
                                  </div>
                                  <div className="flex flex-col items-start text-left">
                                    <span className={`text-[10px] font-bold tracking-tight ${aspectRatio === item.val ? "text-emerald-400" : "text-slate-100"}`}>
                                      {item.val}
                                    </span>
                                    <span className="text-[7px] text-slate-500 font-medium truncate w-full">{(t as any).ratioLabels[item.val]}</span>
                                  </div>
                                  {aspectRatio === item.val && (
                                    <motion.div 
                                      layoutId="ratio-highlight"
                                      className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                                      initial={false}
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Style Selector */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{(t as any).visualStyles}</label>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {VIDEO_STYLES.map((style) => {
                                const Icon = { 
                                  Film, Camera, Zap, History, Palette, Wind, Search, Moon, Square, Box, Sparkles, 
                                  Layers, Minimize, Tv, Cloud 
                                }[style.icon] as any || Video;
                                return (
                                  <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style)}
                                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${selectedStyle.id === style.id ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20" : "bg-slate-950/50 border-white/5 hover:border-white/10"}`}
                                    title={style.promptSuffix ? `${style.label}: ${style.promptSuffix}` : style.label}
                                  >
                                    <div className={`p-1.5 rounded-lg ${selectedStyle.id === style.id ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className={`text-[8px] font-bold text-center leading-tight truncate w-full ${selectedStyle.id === style.id ? "text-emerald-400" : "text-slate-500"}`}>
                                      {((t as any).styleLabels?.[style.id]) || style.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {inputMode === "upload" ? t.baseImage : t.imagePrompt} <span className="text-[10px] text-slate-600 normal-case font-medium">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-2">
                       <select 
                         value={imageResolution}
                         onChange={(e) => setImageResolution(e.target.value)}
                         className="bg-slate-950 border border-slate-800 rounded-lg text-[10px] py-1 px-2 text-slate-400 outline-none focus:border-emerald-500 transition-colors"
                         title={imageResolution === "Auto" ? (t as any).tooltips.resolutionAuto : (t as any).tooltips.imageResolution}
                       >
                         <option value="Auto">{(t as any).auto} ({detectedRes.image})</option>
                         <option value="SD">SD</option>
                         <option value="HD">HD</option>
                         <option value="2K">2K</option>
                         <option value="4K">4K</option>
                       </select>
                       <select 
                         value={selectedImageModel}
                         onChange={(e) => setSelectedImageModel(e.target.value)}
                         className="bg-slate-950 border border-slate-800 rounded-lg text-[10px] py-1 px-2 text-slate-400 outline-none focus:border-emerald-500 transition-colors"
                         title={(t as any).tooltips.model}
                       >
                         {Object.entries((t as any).imageModelLabels || {}).map(([val, label]) => (
                           <option key={val} value={val}>{label as string}</option>
                         ))}
                       </select>
                       {preview && (
                         <button onClick={() => { setImage(null); setPreview(null); }} className="text-xs text-slate-500 hover:text-white transition-colors">{t.clear}</button>
                       )}
                    </div>
                  </div>

                    {inputMode === "generate" && (
                    <div className="space-y-3">
                      {isEditMode && editingBaseImage && (
                        <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/30 ring-2 ring-emerald-500/10">
                               <img src={editingBaseImage} alt="Base" className="w-full h-full object-cover" />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">{(t as any).editMode}</span>
                               <select 
                                 value={selectedImageModel}
                                 onChange={(e) => setSelectedImageModel(e.target.value)}
                                 className="bg-transparent border-none text-[10px] font-bold text-emerald-500/70 outline-none p-0 cursor-pointer hover:text-emerald-400 transition-colors"
                               >
                                 {Object.entries((t as any).imageModelLabels || {}).map(([val, label]) => (
                                   <option key={val} value={val} className="bg-slate-950 text-slate-300 font-sans">{label as string}</option>
                                 ))}
                               </select>
                             </div>
                          </div>
                          <button 
                            onClick={() => {
                              setIsEditMode(false);
                              setEditingBaseImage(null);
                            }}
                            className="p-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[9px] font-bold text-emerald-500/80 hover:text-emerald-400 transition-all uppercase tracking-wider"
                          >
                            {(t as any).exitEditMode}
                          </button>
                        </div>
                      )}
                      <textarea 
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none min-h-[80px] resize-none leading-relaxed transition-all"
                        placeholder={t.imagePlaceholder}
                      />
                      <button
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage || !imagePrompt}
                        className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
                      >
                        {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {isGeneratingImage ? t.generating : t.modeGenerate}
                      </button>

                      {imageError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed space-y-3"
                        >
                          <div className="font-bold flex items-center gap-2 uppercase tracking-wider">
                            <AlertCircle className="w-3 h-3" />
                            {imageError.toLowerCase().includes("limit") || imageError.toLowerCase().includes("kvóta") || imageError.toLowerCase().includes("demand") || imageError.toLowerCase().includes("dopyt") || imageError.toLowerCase().includes("aborted") ? (imageError.toLowerCase().includes("demand") || imageError.toLowerCase().includes("dopyt") ? "High Demand" : "Limit Exceeded") : "Generation Error"}
                          </div>
                          <p className="whitespace-pre-wrap">{imageError}</p>
                          
                          {(imageError.toLowerCase().includes("cookie check") || imageError.toLowerCase().includes("prístup") || imageError.toLowerCase().includes("cookie") || imageError.toLowerCase().includes("iframe")) && (
                            <button
                              onClick={() => window.open(window.location.href, '_blank')}
                              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-md"
                            >
                              <ExternalLink className="w-3" />
                              {(t as any).openNewTabButton}
                            </button>
                          )}

                          {(imageError.toLowerCase().includes("openai") || imageError.toLowerCase().includes("replicate") || imageError.toLowerCase().includes("limit") || imageError.toLowerCase().includes("demand") || imageError.toLowerCase().includes("aborted")) && selectedImageModel !== "imagen-3" && (
                            <button
                              onClick={() => {
                                setSelectedImageModel("imagen-3");
                                setImageError(null);
                                handleGenerateImage();
                              }}
                              className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                              <Zap className="w-3 h-3" />
                              Try stable Google Imagen 3
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}
                  
                  <div 
                    onClick={() => inputMode === "upload" && fileInputRef.current?.click()}
                    style={{ aspectRatio: getAspectRatioString(aspectRatio) }}
                    className={`relative rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 transition-all overflow-hidden group ${inputMode === "upload" ? "hover:bg-slate-950 hover:border-emerald-500/50 cursor-pointer" : ""}`}
                  >
                    {preview ? (
                      <div className="w-full h-full" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPreview(preview);
                      }}>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-2">
                          <a 
                            href={preview} 
                            download="base_frame.png"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-lg backdrop-blur-sm border border-slate-700 shadow-xl flex items-center justify-center"
                            title={t.downloadImage}
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBaseImage(preview);
                              setIsEditMode(true);
                              if (inputMode === "upload") {
                                setInputMode("generate");
                              }
                              // Focus textarea if possible or just scroll
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="p-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-lg backdrop-blur-sm border border-emerald-500/30 shadow-xl flex items-center justify-center"
                            title={(t as any).editImage}
                          >
                            <Palette className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setImage(null);
                              setPreview(null);
                              setOriginalRatio(null);
                              if (isEditMode) {
                                setIsEditMode(false);
                                setEditingBaseImage(null);
                              }
                            }}
                            className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm border border-red-500/30 shadow-xl flex items-center justify-center"
                            title={(t as any).deleteImage}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                        <div className="p-4 rounded-full bg-slate-900 group-hover:bg-emerald-500/10 transition-colors">
                          <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <span className="text-slate-500 text-sm font-medium px-4 text-center">
                          {inputMode === "upload" ? t.uploadPlaceholder : t.comingSoon}
                        </span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Video Production Card */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-3xl shadow-xl relative overflow-hidden group ring-1 ring-white/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              
              <section className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">{t.videoDescription}</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none min-h-[160px] resize-none leading-relaxed transition-all shadow-inner"
                    placeholder={t.videoPlaceholder}
                  />
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => setShowAdvancedVideoSettings(!showAdvancedVideoSettings)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{(t as any).videoSettings}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showAdvancedVideoSettings ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showAdvancedVideoSettings && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.modelPlaceholder}</label>
                              <select 
                                value={selectedVideoModel}
                                onChange={(e) => setSelectedVideoModel(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-xl text-[10px] py-3 px-4 text-slate-300 outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                                title={(t as any).tooltips.model}
                              >
                                {Object.entries((t as any).videoModelLabels || {}).map(([val, label]) => (
                                  <option key={val} value={val}>{label as string}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{(t as any).videoResolution}</label>
                              <select 
                                value={videoResolution}
                                onChange={(e) => setVideoResolution(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/5 rounded-xl text-[10px] py-3 px-4 text-slate-300 outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                                title={videoResolution === "Auto" ? (t as any).tooltips.resolutionAuto : (t as any).tooltips.resolution}
                              >
                                <option value="Auto">{(t as any).auto} ({detectedRes.video})</option>
                                <option value="480p">480p (Fast)</option>
                                <option value="720p">720p (HD)</option>
                                <option value="1080p">1080p (Full HD)</option>
                                <option value="4k">4K (Premium)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.videoDuration}</label>
                            <div className="space-y-2">
                              <div 
                                className="flex bg-slate-950/50 p-1 rounded-xl border border-white/5 gap-1"
                                title={(t as any).tooltips.duration}
                              >
                                {["5s", "10s", "15s", "30s"].map((dur) => (
                                  <button 
                                    key={dur}
                                    onClick={() => {
                                      setVideoDuration(dur);
                                      setIsCustomDuration(false);
                                    }}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${!isCustomDuration && videoDuration === dur ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" : "text-slate-500 hover:text-slate-300"}`}
                                  >
                                    {dur}
                                  </button>
                                ))}
                                <button 
                                  onClick={() => {
                                    setIsCustomDuration(true);
                                    if (!customDurationValue) {
                                      setCustomDurationValue("15");
                                    }
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${isCustomDuration ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/20" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                  {t.customDuration}
                                </button>
                              </div>
                              {isCustomDuration && (
                                <div className="space-y-4 p-4 bg-slate-950/40 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                      {language === 'sk' ? 'Vlastné trvanie' : 'Custom Duration'}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                      {customDurationValue || "5"} s
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-slate-500 font-mono">1s</span>
                                    <input 
                                      type="range" 
                                      min="1" 
                                      max="30" 
                                      value={customDurationValue ? parseInt(customDurationValue, 10) : 5}
                                      onChange={(e) => setCustomDurationValue(e.target.value)}
                                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                    <span className="text-[10px] text-slate-500 font-mono">30s</span>
                                  </div>

                                  <div className="flex items-center bg-slate-950/50 border border-white/5 rounded-xl overflow-hidden group focus-within:border-emerald-500 transition-colors">
                                    <span className="text-[9px] text-slate-500 pl-3 font-semibold uppercase tracking-wider">
                                      {language === 'sk' ? 'Presná sekunda:' : 'Exact second:'}
                                    </span>
                                    <input 
                                      type="text"
                                      value={customDurationValue}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        if (val === "") {
                                          setCustomDurationValue("");
                                          return;
                                        }
                                        const num = parseInt(val, 10);
                                        if (num > 30) {
                                          setCustomDurationValue("30");
                                        } else {
                                          setCustomDurationValue(val);
                                        }
                                      }}
                                      onBlur={() => {
                                        if (customDurationValue === "") {
                                          setCustomDurationValue("1");
                                        } else {
                                          const num = parseInt(customDurationValue, 10);
                                          if (num < 1) {
                                            setCustomDurationValue("1");
                                          }
                                        }
                                      }}
                                      placeholder={t.customDurationPlaceholder}
                                      className="w-full bg-transparent text-[10px] py-1.5 px-3 text-white outline-none text-right font-mono"
                                    />
                                    <span className="text-[10px] text-slate-500 pr-3 uppercase font-bold font-mono">s</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-2">
                            <button 
                              onClick={() => setStabilization(!stabilization)}
                              className="flex items-center gap-3 group/stab text-left"
                            >
                              <div 
                                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${stabilization ? "bg-emerald-500" : "bg-slate-800"}`}
                                title={(t as any).tooltips.stabilization}
                              >
                                <motion.div 
                                  animate={{ x: stabilization ? 22 : 2 }}
                                  initial={false}
                                  className="absolute inset-y-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                              </div>
                              <div>
                                <span className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">{(t as any).videoStabilization}</span>
                                <span className="block text-[8px] text-slate-500">{(t as any).stabilizationDescription}</span>
                              </div>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="group w-full relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-white/20 text-slate-950 font-bold py-6 rounded-[2.5rem] transition-all duration-500 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="tracking-tight text-lg">{t.directingSequence}</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-tight text-lg">{t.startProduction}</span>
                    <ChevronRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Visualization - Right Side */}
          <div className="lg:col-span-8 space-y-12">
             <div className="relative group">
                <div className="absolute -inset-20 bg-emerald-500/10 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div 
                  style={{ aspectRatio: getAspectRatioString(aspectRatio) }}
                  className="relative bg-slate-900/40 rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all duration-700 ring-1 ring-white/5 max-h-[70vh]"
                >
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div 
                        key="generating"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                      >
                        <div className="relative mb-12">
                           <div className="absolute inset-0 bg-emerald-500/30 blur-3xl animate-pulse" />
                           <div className="relative w-32 h-32 rounded-full border-4 border-emerald-500/10 flex items-center justify-center">
                              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                           </div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-mono font-bold text-emerald-500">
                             {progress}%
                           </div>
                        </div>
                        <div className="space-y-6">
                           <h2 className="text-3xl font-extrabold text-white font-display tracking-tight">{statusText || t.generating}</h2>
                           <div className="w-64 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                              />
                           </div>
                        </div>
                      </motion.div>
                    ) : videoUrl ? (
                      <motion.div 
                        key="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full"
                      >
                         <video 
                           src={videoUrl} 
                           controls 
                           autoPlay 
                           loop 
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute top-6 right-6 flex gap-3">
                            <a 
                              href={videoUrl} 
                              download="nature_sequence.mp4"
                              className="p-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl transition-all backdrop-blur-xl border border-white/20 shadow-2xl group/btn"
                              title="Download MP4"
                            >
                              <Video className="w-5 h-5" />
                            </a>
                            <button
                              onClick={handleExportGif}
                              disabled={isExportingGif}
                              className="p-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl transition-all backdrop-blur-xl border border-white/20 shadow-2xl disabled:opacity-50 group/btn"
                              title="Generate GIF"
                            >
                              {isExportingGif ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileImage className="w-5 h-5" />}
                            </button>

                            {gifUrl && (
                              <a 
                                href={gifUrl} 
                                download="nature_sequence.gif"
                                className="p-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
                                title="Download GIF"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            )}
                         </div>
                      </motion.div>
                    ) : error ? (
                      <motion.div 
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                      >
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/50 rounded-full flex items-center justify-center mb-6">
                           <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t.errorTitle}</h3>
                        <p className="text-red-400 text-sm mb-8 max-w-md leading-relaxed whitespace-pre-wrap">
                          {error}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          {(error.toLowerCase().includes("cookie check") || error.toLowerCase().includes("prístup") || error.toLowerCase().includes("cookie") || error.toLowerCase().includes("iframe")) && (
                            <button 
                              onClick={() => window.open(window.location.href, '_blank')}
                              className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {(t as any).openNewTabButton}
                            </button>
                          )}

                          <button 
                            onClick={handleGenerate} 
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-white/90 text-slate-950 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-white/5 active:scale-95"
                          >
                            <RotateCcw className="w-4 h-4" />
                            {t.retryProduction}
                          </button>

                          {(error.toLowerCase().includes("openai") || error.toLowerCase().includes("sora") || error.toLowerCase().includes("limit") || error.toLowerCase().includes("demand") || error.toLowerCase().includes("aborted") || error.toLowerCase().includes("invalid") || error.toLowerCase().includes("požiadavka")) && selectedVideoModel.includes("sora") && (
                            <button
                              onClick={() => {
                                setSelectedVideoModel("veo-3.1-lite");
                                setError(null);
                                // We don't automatically generate because video generation is expensive/slow
                              }}
                              className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-2xl text-sm font-bold transition-all"
                            >
                              <Zap className="w-4 h-4" />
                              Switch to Google Veo
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center mb-6 border border-slate-800">
                          <Video className={`w-8 h-8 ${prompt ? "text-emerald-500 animate-pulse" : "text-slate-700"}`} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">{t.awaitingInstructions}</h3>
                        <p className="text-slate-600 text-sm max-w-xs">{t.uploadFirst}</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
             </div>

             {videoUrl && (
               <div className="space-y-6">
                 {/* Success Message */}
                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl"
                 >
                   <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32" />
                   <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div className="space-y-2 text-center md:text-left relative z-10">
                      <h3 className="text-xl font-bold text-white">{t.productionFinished}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {t.productionDescription}
                      </p>
                   </div>
                 </motion.div>

                 {/* GIF Creator Settings */}
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl space-y-6"
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                         <FileImage className="w-5 h-5" />
                       </div>
                       <h3 className="text-lg font-bold">{(t as any).gifSettings}</h3>
                     </div>
                     <button
                        onClick={handleExportGif}
                        disabled={isExportingGif}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${isExportingGif ? "bg-slate-800 text-slate-500" : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20"}`}
                      >
                        {isExportingGif ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {(t as any).gifProcessing}
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            {t.exportGif}
                          </>
                        )}
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{(t as any).gifAspectRatio}</label>
                       <select 
                         value={gifAspectRatio}
                         onChange={(e) => setGifAspectRatio(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[10px] text-slate-300 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                       >
                         {["16:9", "9:16", "1:1", "4:3", "3:2"].map(ratio => (
                           <option key={ratio} value={ratio}>{ratio}</option>
                         ))}
                       </select>
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{(t as any).gifResolution}</label>
                       <select 
                         value={gifResolution}
                         onChange={(e) => setGifResolution(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[10px] text-slate-300 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                       >
                         <option value="320">320px (Mobile-friendly)</option>
                         <option value="480">480px (Standard)</option>
                         <option value="640">640px (High Quality)</option>
                         <option value="800">800px (Large)</option>
                       </select>
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{(t as any).gifFrameRate}</label>
                       <select 
                         value={gifFrameRate}
                         onChange={(e) => setGifFrameRate(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[10px] text-slate-300 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                       >
                         <option value="5">5 FPS (Small file)</option>
                         <option value="10">10 FPS (Dynamic)</option>
                         <option value="15">15 FPS (Smooth)</option>
                         <option value="20">20 FPS (Fluid)</option>
                       </select>
                     </div>
                   </div>

                   {gifUrl && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="pt-4 flex flex-col items-center gap-4"
                     >
                        <div className="relative group/gif overflow-hidden rounded-2xl border border-blue-500/30">
                          <img src={gifUrl} alt="Exported GIF" className="max-w-full h-auto" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/gif:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                             <a 
                               href={gifUrl} 
                               download="exported_animation.gif"
                               className="px-6 py-3 bg-white text-slate-950 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-110"
                             >
                               <Download className="w-4 h-4" />
                               {t.downloadImage}
                             </a>
                          </div>
                        </div>
                     </motion.div>
                   )}
                 </motion.div>
               </div>
             )}
          </div>
        </motion.div>

        {/* Generation History Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8 pb-20"
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 text-emerald-400">
                 <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">{(t as any).historyTitle}</h2>
                <p className="text-slate-500 text-sm">Review your cinematic creations</p>
              </div>
            </div>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
              >
                <Trash2 className="w-4 h-4" />
                {(t as any).clearHistory}
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-20 text-center backdrop-blur-3xl">
              <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
                <Clock className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">{(t as any).historyEmpty}</h3>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {history.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="group relative bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 ring-1 ring-white/5"
                  >
                  <div 
                    className="relative overflow-hidden cursor-pointer"
                    style={{ aspectRatio: item.parameters.aspectRatio.replace(':', '/') }}
                    onClick={() => {
                        if (item.type === 'video') {
                          if (item.expired) {
                            setError("Platnosť dočasného prepojenia na video vypršala z dôvodu obnovenia stránky. Parametre a popis môžete opätovne použiť kliknutím na tlačidlo 'Použiť parametre' nižšie.");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            return;
                          }
                          setVideoUrl(item.url);
                        } else {
                          setPreview(item.url);
                          setSelectedPreview(item.url);
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {item.type === 'video' ? (
                      item.expired ? (
                        <div className="w-full h-full bg-slate-950/80 border border-white/5 flex flex-col items-center justify-center p-6 text-center select-none">
                           <Film className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
                           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Dočasný súbor vypršal</span>
                           <span className="text-[8px] text-slate-600 mt-1.5 uppercase font-bold">Relácia ukončená</span>
                        </div>
                      ) : (
                        <video 
                          src={item.url} 
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                          muted 
                          onMouseOver={e => {
                            const video = e.target as HTMLVideoElement;
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                              playPromise.catch(() => {
                                // Ignore play/pause interruption errors gracefully
                              });
                            }
                          }} 
                          onMouseOut={e => { 
                            const video = e.target as HTMLVideoElement;
                            video.pause(); 
                            video.currentTime = 0; 
                          }} 
                          onError={(e) => { (e.target as any).style.display = 'none'; }} 
                        />
                      )
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="History" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${item.type === 'video' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}>
                        {item.type === 'video' ? (t as any).historyTypeVideo : (t as any).historyTypeImage}
                      </span>
                    </div>

                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                      {item.prompt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                       <span className="px-2 py-1 rounded-lg bg-slate-950/50 border border-white/5 text-[9px] font-bold text-slate-500">{item.model}</span>
                       <span className="px-2 py-1 rounded-lg bg-slate-950/50 border border-white/5 text-[9px] font-bold text-slate-500">{item.parameters.aspectRatio}</span>
                       <span className="px-2 py-1 rounded-lg bg-slate-950/50 border border-white/5 text-[9px] font-bold text-slate-500">{item.parameters.resolution}</span>
                       {item.parameters.duration && <span className="px-2 py-1 rounded-lg bg-slate-950/50 border border-white/5 text-[9px] font-bold text-slate-500">{item.parameters.duration}</span>}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button 
                        onClick={() => useHistoryItem(item)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white text-slate-400 hover:text-slate-950 border border-white/5 transition-all text-[10px] font-bold"
                        title={(t as any).useParameters}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {(t as any).useParameters}
                      </button>
                      {item.type === 'image' && (
                        <button 
                          onClick={() => {
                            setEditingBaseImage(item.url);
                            setIsEditMode(true);
                            setInputMode("generate");
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 transition-all"
                          title={(t as any).editImage}
                        >
                          <Palette className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.prompt);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500 text-slate-400 hover:text-slate-950 border border-white/5 transition-all"
                        title={(t as any).copyPrompt}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
