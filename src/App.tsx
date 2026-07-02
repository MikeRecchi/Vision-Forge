import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, Loader2, Download, CheckCircle, Smartphone, Monitor, ChevronRight, ChevronDown, AlertCircle, FileImage, Settings, Key, X, Languages, Film, Camera, Zap, History, Palette, Wind, Search, Moon, Square, Box, Sparkles, Clock, Copy, RotateCcw, Trash2, Layers, Minimize, Tv, Cloud, ExternalLink, Play, BookOpen, Heart, RefreshCw, HelpCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gifshot from 'gifshot';
import { translations, Language } from './translations';
// @ts-ignore
import kofiButtonImg from './assets/images/kofi_button_1781474671190.jpg';
// @ts-ignore
import appLogoImg from './assets/images/vision_forge_logo_1781644125884.jpg';
import { VIDEO_STYLES, VideoStyle } from './constants';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logoutDrive, 
  uploadFileToDrive, 
  listDriveFiles, 
  deleteDriveFile, 
  getAccessToken,
  setAccessToken,
  getOrCreateFolder
} from './googleDrive';

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
    generationDuration?: number;
  };
}

const dashboardTranslations = {
  en: {
    title: "Real-time API Status Dashboard",
    latency: "Latency",
    uptime: "Uptime",
    status: "Status",
    operational: "Operational",
    unconfigured: "Not Configured",
    degraded: "Degraded",
    failed: "Error",
    lastCheck: "Last Check",
    runCheck: "Run latency & health check",
    history: "Latency History",
    historyAwaiting: "Run check to plot latency telemetry",
    checking: "Checking...",
    never: "Never",
    ms: "ms",
    verified: "Verified",
    failedStatus: "Failed",
    healthCheckBtn: "Test Connection",
    bothHealthy: "All APIs operational",
    issuesDetected: "Issues detected",
    noKeysTitle: "Awaiting API credentials",
    modelName: "Model",
    genDuration: "Generation Time",
    timestamp: "Generated At",
    resolution: "Resolution",
    aspectRatio: "Aspect Ratio",
    videoLength: "Video Length",
    style: "Style",
    sec: "s",
    noMetadata: "No metadata available",
    telemetryTitle: "Generation Telemetry",
    toggleTelemetry: "Toggle telemetry overlay",
    promptTitle: "Prompt"
  },
  de: {
    title: "Echtzeit-API-Status-Dashboard",
    latency: "Latenz",
    uptime: "Verfügbarkeit",
    status: "Status",
    operational: "Betriebsbereit",
    unconfigured: "Nicht konfiguriert",
    degraded: "Eingeschränkt",
    failed: "Fehler",
    lastCheck: "Letzter Test",
    runCheck: "Latenz & Zustand prüfen",
    history: "Latenzverlauf",
    historyAwaiting: "Prüfung starten, um Latenz-Telemetrie anzuzeigen",
    checking: "Prüfe...",
    never: "Nie",
    ms: "ms",
    verified: "Verifiziert",
    failedStatus: "Fehlgeschlagen",
    healthCheckBtn: "Verbindung testen",
    bothHealthy: "Alle APIs betriebsbereit",
    issuesDetected: "Probleme erkannt",
    noKeysTitle: "Warte auf API-Schlüssel",
    modelName: "Modell",
    genDuration: "Generierungszeit",
    timestamp: "Generiert am",
    resolution: "Auflösung",
    aspectRatio: "Seitenverhältnis",
    videoLength: "Videolänge",
    style: "Stil",
    sec: "s",
    noMetadata: "Keine Metadaten verfügbar",
    telemetryTitle: "Generierungs-Telemetrie",
    toggleTelemetry: "Telemetrie-Overlay umschalten",
    promptTitle: "Prompt"
  },
  fr: {
    title: "Tableau de bord du statut de l'API en temps réel",
    latency: "Latence",
    uptime: "Disponibilité",
    status: "Statut",
    operational: "Opérationnel",
    unconfigured: "Non configuré",
    degraded: "Dégradé",
    failed: "Erreur",
    lastCheck: "Dernière vérification",
    runCheck: "Vérifier la latence et l'état",
    history: "Historique de latence",
    historyAwaiting: "Lancer le test pour tracer la télémétrie de latence",
    checking: "Vérification...",
    never: "Jamais",
    ms: "ms",
    verified: "Vérifié",
    failedStatus: "Échoué",
    healthCheckBtn: "Tester la connexion",
    bothHealthy: "Toutes les API sont opérationnelles",
    issuesDetected: "Problèmes détectés",
    noKeysTitle: "En attente des clés API",
    modelName: "Modèle",
    genDuration: "Durée de génération",
    timestamp: "Généré à",
    resolution: "Résolution",
    aspectRatio: "Format d'image",
    videoLength: "Durée de la vidéo",
    style: "Style",
    sec: "s",
    noMetadata: "Aucune métadonnée disponible",
    telemetryTitle: "Télémétrie de génération",
    toggleTelemetry: "Basculer l'affichage de la télémétrie",
    promptTitle: "Prompt"
  },
  it: {
    title: "Tabella di controllo stato API in tempo reale",
    latency: "Latenza",
    uptime: "Disponibilità",
    status: "Stato",
    operational: "Operativo",
    unconfigured: "Non configurato",
    degraded: "Degradato",
    failed: "Errore",
    lastCheck: "Ultimo controllo",
    runCheck: "Verifica latenza e stato di salute",
    history: "Cronologia latenza",
    historyAwaiting: "Esegui controllo per tracciare la telemetria di latenza",
    checking: "Verifica in corso...",
    never: "Mai",
    ms: "ms",
    verified: "Verificato",
    failedStatus: "Fallito",
    healthCheckBtn: "Testa connessione",
    bothHealthy: "Tutte le API sono operative",
    issuesDetected: "Problemi rilevati",
    noKeysTitle: "In attesa delle chiavi API",
    modelName: "Modello",
    genDuration: "Tempo di generazione",
    timestamp: "Generato il",
    resolution: "Risoluzione",
    aspectRatio: "Rapporto d'aspetto",
    videoLength: "Durata video",
    style: "Stile",
    sec: "s",
    noMetadata: "Nessun metadato disponibile",
    telemetryTitle: "Telemetria di generazione",
    toggleTelemetry: "Attiva/disattiva overlay telemetria",
    promptTitle: "Prompt"
  },
  es: {
    title: "Tablero de estado de API en tiempo real",
    latency: "Latencia",
    uptime: "Disponibilidad",
    status: "Estado",
    operational: "Operativo",
    unconfigured: "No configurado",
    degraded: "Degradado",
    failed: "Error",
    lastCheck: "Última comprobación",
    runCheck: "Comprobar latencia y estado",
    history: "Historial de latencia",
    historyAwaiting: "Ejecutar comprobación para graficar telemetría",
    checking: "Comprobando...",
    never: "Nunca",
    ms: "ms",
    verified: "Verificado",
    failedStatus: "Fallido",
    healthCheckBtn: "Probar conexión",
    bothHealthy: "Todas las API están operativas",
    issuesDetected: "Problemas detectados",
    noKeysTitle: "Esperando credenciales de API",
    modelName: "Modelo",
    genDuration: "Tiempo de generación",
    timestamp: "Generado el",
    resolution: "Resolución",
    aspectRatio: "Relación de aspecto",
    videoLength: "Duración del video",
    style: "Estilo",
    sec: "s",
    noMetadata: "No hay metadatos disponibles",
    telemetryTitle: "Telemetría de generación",
    toggleTelemetry: "Alternar superposición de telemetría",
    promptTitle: "Prompt"
  },
  pt: {
    title: "Painel de status da API em tempo real",
    latency: "Latência",
    uptime: "Tempo de atividade",
    status: "Status",
    operational: "Operacional",
    unconfigured: "Não configurado",
    degraded: "Degradado",
    failed: "Erro",
    lastCheck: "Última verificação",
    runCheck: "Verificar latência e integridade",
    history: "Histórico de latência",
    historyAwaiting: "Executar verificação para exibir telemetria de latência",
    checking: "Verificando...",
    never: "Nunca",
    ms: "ms",
    verified: "Verificado",
    failedStatus: "Falhou",
    healthCheckBtn: "Testar conexão",
    bothHealthy: "Todas as APIs estão operacionais",
    issuesDetected: "Problemas detectados",
    noKeysTitle: "Aguardando credenciais de API",
    modelName: "Modelo",
    genDuration: "Tempo de geração",
    timestamp: "Gerado em",
    resolution: "Resolução",
    aspectRatio: "Proporção de tela",
    videoLength: "Duração do vídeo",
    style: "Estilo",
    sec: "s",
    noMetadata: "Nenhum metadato disponível",
    telemetryTitle: "Telemetria de geração",
    toggleTelemetry: "Alternar sobreposição de telemetria",
    promptTitle: "Prompt"
  },
  pl: {
    title: "Panel stanu API w czasie rzeczywistym",
    latency: "Opóźnienie",
    uptime: "Niezawodność",
    status: "Status",
    operational: "Działa",
    unconfigured: "Nieskonfigurowane",
    degraded: "Spowolnione",
    failed: "Błąd",
    lastCheck: "Ostatni test",
    runCheck: "Uruchom test opóźnienia i stanu",
    history: "Historia opóźnień",
    historyAwaiting: "Uruchom test, aby narysować telemetrię opóźnień",
    checking: "Sprawdzanie...",
    never: "Nigdy",
    ms: "ms",
    verified: "Zweryfikowano",
    failedStatus: "Nieudane",
    healthCheckBtn: "Testuj połączenie",
    bothHealthy: "Wszystkie interfejsy API działają",
    issuesDetected: "Wykryto problemy",
    noKeysTitle: "Oczekiwanie na klucze API",
    modelName: "Model",
    genDuration: "Czas generowania",
    timestamp: "Wygenerowano o",
    resolution: "Rozdzielczość",
    aspectRatio: "Proporcje obrazu",
    videoLength: "Długość wideo",
    style: "Styl",
    sec: "s",
    noMetadata: "Brak dostępnych metadanych",
    telemetryTitle: "Telemetria generowania",
    toggleTelemetry: "Przełącz nakładkę telemetryczną",
    promptTitle: "Prompt"
  },
  sk: {
    title: "Stav API v reálnom čase",
    latency: "Latencia",
    uptime: "Dostupnosť",
    status: "Stav",
    operational: "Plne funkčné",
    unconfigured: "Nenastavené",
    degraded: "Spomalené",
    failed: "Chyba",
    lastCheck: "Posledný test",
    runCheck: "Spustiť test latencie a zdravia",
    history: "História latencie",
    historyAwaiting: "Spustite test na zobrazenie latencie",
    checking: "Testujem...",
    never: "Nikdy",
    ms: "ms",
    verified: "Overené",
    failedStatus: "Zlyhalo",
    healthCheckBtn: "Testovať pripojenie",
    bothHealthy: "Všetky API sú funkčné",
    issuesDetected: "Zistené problémy",
    noKeysTitle: "Čaká sa na zadanie kľúčov",
    modelName: "Model",
    genDuration: "Trvanie generovania",
    timestamp: "Čas vygenerovania",
    resolution: "Rozlíšenie",
    aspectRatio: "Pomer strán",
    videoLength: "Dĺžka videa",
    style: "Štýl",
    sec: "s",
    noMetadata: "Metadáta nie sú dostupné",
    telemetryTitle: "Telemetria generovania",
    toggleTelemetry: "Prepnúť zobrazenie telemetrie",
    promptTitle: "Popis (Prompt)"
  }
};

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
  const [changelogs, setChangelogs] = useState<any[]>([]);
  const [isChangelogLoading, setIsChangelogLoading] = useState(false);
  const [isGeneratingChangelog, setIsGeneratingChangelog] = useState(false);
  const [changelogMessage, setChangelogMessage] = useState<any | null>(null);
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
  const [validationStatus, setValidationStatus] = useState<{
    gemini: boolean | null;
    openai: boolean | null;
    geminiError?: string;
    openaiError?: string;
    geminiErrorCode?: string | number;
    openaiErrorCode?: string | number;
  }>({ gemini: null, openai: null });

  const [apiMetrics, setApiMetrics] = useState<{
    gemini: {
      latencyHistory: number[];
      uptime: number;
      checksCount: number;
      successCount: number;
      lastCheck: string | null;
      status: "operational" | "degraded" | "failed" | "unconfigured";
      latency: number | null;
    };
    openai: {
      latencyHistory: number[];
      uptime: number;
      checksCount: number;
      successCount: number;
      lastCheck: string | null;
      status: "operational" | "degraded" | "failed" | "unconfigured";
      latency: number | null;
    };
  }>({
    gemini: {
      latencyHistory: [],
      uptime: 100,
      checksCount: 0,
      successCount: 0,
      lastCheck: null,
      status: "unconfigured",
      latency: null,
    },
    openai: {
      latencyHistory: [],
      uptime: 100,
      checksCount: 0,
      successCount: 0,
      lastCheck: null,
      status: "unconfigured",
      latency: null,
    }
  });
  
  const [activeVideoMetadata, setActiveVideoMetadata] = useState<{
    model: string;
    generationDuration?: number;
    timestamp: number;
    resolution?: string;
    aspectRatio?: string;
    duration?: string;
    style?: string;
    prompt?: string;
  } | null>(null);

  const [showMetadataOverlay, setShowMetadataOverlay] = useState(true);
  const [showStatusDashboard, setShowStatusDashboard] = useState(false);
  const generationStartTimeRef = useRef<number | null>(null);
  
  // GIF Settings
  const [gifAspectRatio, setGifAspectRatio] = useState("16:9");
  const [gifResolution, setGifResolution] = useState("480");
  const [gifFrameRate, setGifFrameRate] = useState("10");
  const [stabilization, setStabilization] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>(VIDEO_STYLES[0]);

  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyGuide, setShowKeyGuide] = useState(false);
  const [keyGuideTab, setKeyGuideTab] = useState<'gemini' | 'openai'>('gemini');
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<'overview' | 'features' | 'models' | 'ratios' | 'styles' | 'privacy' | 'drive' | 'changelog'>('overview');
  const [showCreativeSettings, setShowCreativeSettings] = useState(false);
  const [showAdvancedVideoSettings, setShowAdvancedVideoSettings] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Google Drive states and functions
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveFolderId, setDriveFolderId] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState<{ [itemId: string]: boolean }>({});
  const [isDownloadingFromDrive, setIsDownloadingFromDrive] = useState<{ [fileId: string]: boolean }>({});
  const [uploadedDriveIds, setUploadedDriveIds] = useState<{ [itemId: string]: { id: string, link: string } }>({});
  const [autoUploadToDrive, setAutoUploadToDrive] = useState(false);
  const [driveTermsAccepted, setDriveTermsAccepted] = useState(false);
  const [driveTermsError, setDriveTermsError] = useState(false);

  // Error Logs State and Actions (positioned here so block-scoped driveUser is defined)
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [showLogsDashboard, setShowLogsDashboard] = useState(false);
  const [logsFilter, setLogsFilter] = useState<string>("all");
  const [activeLogId, setActiveLogId] = useState<string | null>(null);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Slack & Email Integration state
  const [sendingSlackLogId, setSendingSlackLogId] = useState<string | null>(null);
  const [slackSendStatus, setSlackSendStatus] = useState<{ [logId: string]: "success" | "error" | null }>({});

  const getOrCreateVisitorId = (): string => {
    let id = localStorage.getItem('visitor_error_logging_id');
    if (!id) {
      id = `anon-${Math.floor(Math.random() * 100000000)}-${Date.now().toString(36)}`;
      localStorage.setItem('visitor_error_logging_id', id);
    }
    return id;
  };

  const reportErrorToServer = async (type: string, message: string, stack: string = "", extraInfo: any = {}) => {
    try {
      // Ignorujeme neškodné a očakávané chyby vývojového servera (WebSocket, HMR, Vite)
      const lowercaseMsg = (message || "").toLowerCase();
      const lowercaseStack = (stack || "").toLowerCase();
      
      const isBenignDevError = 
        lowercaseMsg.includes("websocket") || 
        lowercaseMsg.includes("vite") ||
        lowercaseMsg.includes("hmr") ||
        lowercaseStack.includes("@vite/client") ||
        lowercaseStack.includes("websocket");

      if (isBenignDevError) {
        // Tieto chyby sú vo vývojovom prostredí normálne, keďže HMR je platformou vypnuté
        return;
      }

      const visitorId = getOrCreateVisitorId();
      const userEmail = driveUser?.email || `Anonymný (${visitorId.slice(0, 15)})`;
      const systemInfo = {
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        language: language,
        ...extraInfo
      };

      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message,
          stack,
          url: window.location.href,
          userEmail,
          userId: visitorId,
          systemInfo
        })
      });
      
      // Auto-refresh logs if open
      if (showLogsDashboard) {
        fetchLogsFromServer();
      }
    } catch (err) {
      console.error("Failed to report error to server:", err);
    }
  };

  const fetchLogsFromServer = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setUserLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs from server:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  const clearLogsOnServer = async () => {
    try {
      const res = await fetch("/api/logs", { method: "DELETE" });
      if (res.ok) {
        setUserLogs([]);
        setActiveLogId(null);
      }
    } catch (err) {
      console.error("Failed to clear logs on server:", err);
    }
  };

  const markAllLogsAsRead = async () => {
    try {
      const res = await fetch("/api/logs/mark-all-read", { method: "POST" });
      if (res.ok) {
        setUserLogs(prev => prev.map(log => ({ ...log, status: "read" })));
      }
    } catch (err) {
      console.error("Failed to mark all logs as read:", err);
    }
  };

  const exportLogsToJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `vision_forge_diagnostic_logs_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Failed to export logs:", err);
    }
  };

  const copyLogToClipboard = (log: any) => {
    try {
      const text = `
VISION FORGE DIAGNOSTIC LOG
===========================
ID: ${log.id}
Timestamp: ${new Date(log.timestamp).toLocaleString()}
Type: ${log.type}
Message: ${log.message}
URL: ${log.url}
User: ${log.userEmail} (ID: ${log.userId})

SYSTEM INFO:
------------
${JSON.stringify(log.systemInfo, null, 2)}

STACK TRACE:
------------
${log.stack || "No stack trace provided."}
`;
      navigator.clipboard.writeText(text.trim());
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch (err) {
      console.error("Failed to copy log:", err);
    }
  };

  const shareLogToSlack = async (log: any) => {
    setSendingSlackLogId(log.id);
    setSlackSendStatus(prev => ({ ...prev, [log.id]: null }));
    try {
      const res = await fetch("/api/logs/slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log
        })
      });
      
      if (res.ok) {
        setSlackSendStatus(prev => ({ ...prev, [log.id]: "success" }));
        setTimeout(() => {
          setSlackSendStatus(prev => ({ ...prev, [log.id]: null }));
        }, 3000);
      } else {
        const errorData = await res.json();
        console.error("Slack error feedback:", errorData.error);
        setSlackSendStatus(prev => ({ ...prev, [log.id]: "error" }));
        alert(errorData.error || (language === 'sk' ? "Odoslanie na Slack zlyhalo." : "Failed to send to Slack."));
      }
    } catch (err: any) {
      console.error("Failed to send log to Slack:", err);
      setSlackSendStatus(prev => ({ ...prev, [log.id]: "error" }));
      alert(err.message || (language === 'sk' ? "Odoslanie na Slack zlyhalo." : "Failed to send to Slack."));
    } finally {
      setSendingSlackLogId(null);
    }
  };

  const triggerTestError = async () => {
    try {
      const mockMessage = `Test Error: Manuálna simulácia chybového logu pre overenie Slack webhooku.`;
      const mockStack = `Error: ${mockMessage}\n    at triggerTestError (src/App.tsx:685:12)\n    at HTMLButtonElement.onClick (src/App.tsx:2360:45)`;
      await reportErrorToServer("Simulated Client Test Error", mockMessage, mockStack, {
        simulated: true,
        testEnvironment: "AI Studio Live Preview",
        triggeredBy: driveUser?.email || "Anonymný Užívateľ"
      });
      // Fetch fresh logs so it appears immediately
      await fetchLogsFromServer();
    } catch (err) {
      console.error("Failed to trigger test error:", err);
    }
  };

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const errorMsg = event.message || "Unknown error";
      const errorStack = event.error?.stack || "No stack trace available";
      reportErrorToServer("Client Runtime Error", errorMsg, errorStack, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      let msg = "Unhandled Promise Rejection";
      let stack = "";
      if (reason instanceof Error) {
        msg = reason.message;
        stack = reason.stack || "";
      } else if (reason) {
        try {
          msg = typeof reason === 'object' ? JSON.stringify(reason) : String(reason);
        } catch {
          msg = String(reason);
        }
      }
      reportErrorToServer("Client Promise Rejection", msg, stack);
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    fetchLogsFromServer();

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [driveUser, language]);

  useEffect(() => {
    if (showLogsDashboard) {
      fetchLogsFromServer();
    }
  }, [showLogsDashboard]);

  const fetchDriveFiles = async (token: string) => {
    setIsDriveLoading(true);
    try {
      const files = await listDriveFiles(token);
      setDriveFiles(files);
      try {
        const folderId = await getOrCreateFolder(token);
        setDriveFolderId(folderId);
      } catch (folderErr) {
        console.error("Failed to find or create Drive folder:", folderErr);
      }
    } catch (e: any) {
      console.error("Failed to load files from Google Drive:", e);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleDriveLogin = async () => {
    if (!driveTermsAccepted) {
      setDriveTermsError(true);
      return;
    }
    setDriveTermsError(false);
    try {
      const result = await googleSignIn();
      if (result) {
        setDriveUser(result.user);
        setDriveToken(result.accessToken);
        fetchDriveFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error("Google Drive connection failed:", err);
      setError(language === 'sk' ? `Pripojenie k disku zlyhalo: ${err.message}` : `Google Drive connection failed: ${err.message}`);
    }
  };

  const handleDriveLogout = async () => {
    await logoutDrive();
    setDriveUser(null);
    setDriveToken(null);
    setDriveFolderId(null);
    setDriveFiles([]);
  };

  const saveItemToDrive = async (item: HistoryItem) => {
    const token = driveToken || getAccessToken();
    if (!token) {
      setError(language === 'sk' ? "Najprv sa prihláste do služby Google Drive." : "Please connect to Google Drive first.");
      return;
    }

    setIsUploadingToDrive(prev => ({ ...prev, [item.id]: true }));
    try {
      const extension = item.type === 'video' ? 'mp4' : 'png';
      const cleanPrompt = item.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_') || 'creation';
      const fileName = `VisionForge_${cleanPrompt}_${Date.now()}.${extension}`;
      const mimeType = item.type === 'video' ? 'video/mp4' : 'image/png';

      const uploadResult = await uploadFileToDrive(token, fileName, mimeType, item.url);
      
      setUploadedDriveIds(prev => ({ 
        ...prev, 
        [item.id]: { id: uploadResult.id, link: uploadResult.webViewLink } 
      }));

      // Refresh files list
      fetchDriveFiles(token);
    } catch (err: any) {
      console.error("Failed to upload to Google Drive:", err);
      setError(language === 'sk' ? `Nahrávanie na disk zlyhalo: ${err.message}` : `Drive upload failed: ${err.message}`);
    } finally {
      setIsUploadingToDrive(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const deleteItemFromDrive = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm(
      language === 'sk' 
        ? `Naozaj chcete vymazať súbor "${fileName}" z Google Drive? Táto akcia je nezvratná.`
        : `Are you sure you want to delete "${fileName}" from Google Drive? This action cannot be undone.`
    );
    if (!confirmed) return;

    const token = driveToken || getAccessToken();
    if (!token) return;

    try {
      await deleteDriveFile(token, fileId);
      // Refresh the files
      fetchDriveFiles(token);
    } catch (err: any) {
      console.error("Failed to delete from Google Drive:", err);
      setError(language === 'sk' ? `Zmazanie z disku zlyhalo: ${err.message}` : `Drive deletion failed: ${err.message}`);
    }
  };

  const downloadFromDrive = async (fileId: string, fileName: string, mimeType: string) => {
    const token = driveToken || getAccessToken();
    if (!token) {
      setError(language === 'sk' ? "Najprv sa prihláste do služby Google Drive." : "Please connect to Google Drive first.");
      return;
    }

    setIsDownloadingFromDrive(prev => ({ ...prev, [fileId]: true }));
    try {
      const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error(language === 'sk' ? "Nepodarilo sa stiahnuť súbor z Google Drive." : "Failed to download file from Google Drive.");
      }
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("Failed to download from Google Drive:", err);
      setError(language === 'sk' ? `Sťahovanie z disku zlyhalo: ${err.message}` : `Drive download failed: ${err.message}`);
    } finally {
      setIsDownloadingFromDrive(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const driveTranslations: any = {
    en: {
      driveTabLocal: "Local History",
      driveTabCloud: "Google Drive Cloud Backups",
      driveConnectBtn: "Connect Google Drive",
      driveConnectedAs: "Connected to Google Drive as",
      driveDisconnect: "Disconnect",
      driveFolder: "Folder",
      driveOpenFolderBtn: "Open Creations Folder",
      driveAutoBackup: "Auto Cloud Backup",
      driveAutoBackupDesc: "Automatically back up newly generated frames and cinematic sequences",
      driveUploadBtn: "Save to Drive",
      driveUploading: "Saving...",
      driveSaved: "Saved to Drive",
      driveOpenLink: "Open in Drive",
      driveDeleteBtn: "Delete",
      driveDescription: "Securely backup your premium creations to your personal Google Drive in the background.",
      driveEmptyCloud: "No backed up assets found. Save any creation to Google Drive to list it here.",
      driveLoading: "Connecting to Google Drive container...",
      driveDownloadBtn: "Download",
      driveTermsAgreePrefix: "I agree to the processing of data in accordance with the",
      privacyPolicyGDPR: "Privacy Policy (GDPR)",
      driveTermsAnd: "and",
      termsOfServiceCheck: "Terms of Service",
      driveTermsErrorHeader: "⚠️ Check the box to agree to the policy!",
      driveTermsErrorTab: "⚠️ You must accept the terms to connect Google Drive!"
    },
    sk: {
      driveTabLocal: "Lokálna história",
      driveTabCloud: "Zálohy Google Disk",
      driveConnectBtn: "Pripojiť Google Disk",
      driveConnectedAs: "Pripojené k disku Google ako",
      driveDisconnect: "Odpojiť",
      driveFolder: "Priečinok",
      driveOpenFolderBtn: "Otvoriť priečinok výtvorov",
      driveAutoBackup: "Automatické zálohovanie",
      driveAutoBackupDesc: "Automaticky zálohovať novovygenerované snímky a filmové sekvencie",
      driveUploadBtn: "Uložiť na Disk",
      driveUploading: "Ukladá sa...",
      driveSaved: "Uložené na Disku",
      driveOpenLink: "Otvoriť Disk",
      driveDeleteBtn: "Zmazať",
      driveDescription: "Bezpečne zálohujte svoje prémiové výtvory na svoj osobný Google Disk v pozadí.",
      driveEmptyCloud: "Nenašli sa žiadne zálohované súbory. Uložte ľubovoľný výtvor do cloudu a zobrazí sa tu.",
      driveLoading: "Pripája sa k úložisku Google Disk...",
      driveDownloadBtn: "Stiahnuť",
      driveTermsAgreePrefix: "Súhlasím so spracovaním údajov v súlade so",
      privacyPolicyGDPR: "Zásadami ochrany osobných údajov (GDPR)",
      driveTermsAnd: "a",
      termsOfServiceCheck: "Všeobecnými zmluvnými podmienkami",
      driveTermsErrorHeader: "⚠️ Pre prihlásenie začiarknite súhlas!",
      driveTermsErrorTab: "⚠️ Pre pripojenie musíte označiť súhlas s podmienkami!"
    },
    de: {
      driveTabLocal: "Lokaler Verlauf",
      driveTabCloud: "Google Drive-Sicherungen",
      driveConnectBtn: "Google Drive verbinden",
      driveConnectedAs: "Mit Google Drive verbunden als",
      driveDisconnect: "Trennen",
      driveFolder: "Ordner",
      driveOpenFolderBtn: "Kreations-Ordner öffnen",
      driveAutoBackup: "Automatische Cloud-Sicherung",
      driveAutoBackupDesc: "Neu generierte Bilder und Filmsequenzen automatisch sichern",
      driveUploadBtn: "In Drive speichern",
      driveUploading: "Wird gespeichert...",
      driveSaved: "In Drive gespeichert",
      driveOpenLink: "In Drive öffnen",
      driveDeleteBtn: "Löschen",
      driveDescription: "Sichern Sie Ihre hochwertigen Kreationen im Hintergrund sicher auf Ihrem Google Drive.",
      driveEmptyCloud: "Keine gesicherten Dateien gefunden. Speichern Sie eine Kreation in Drive, um sie hier aufzulisten.",
      driveLoading: "Verbindung mit Google Drive wird geladen...",
      driveDownloadBtn: "Herunterladen",
      driveTermsAgreePrefix: "Ich stimme der Datenverarbeitung gemäß der",
      privacyPolicyGDPR: "Datenschutzerklärung (DSGVO)",
      driveTermsAnd: "und den",
      termsOfServiceCheck: "Allgemeinen Geschäftsbedingungen",
      driveTermsErrorHeader: "⚠️ Bitte aktivieren Sie das Kontrollkästchen, um zuzustimmen!",
      driveTermsErrorTab: "⚠️ Sie müssen die Bedingungen akzeptieren, um Google Drive zu verbinden!"
    },
    fr: {
      driveTabLocal: "Historique local",
      driveTabCloud: "Sauvegardes Google Drive",
      driveConnectBtn: "Connecter Google Drive",
      driveConnectedAs: "Connecté à Google Drive en tant que",
      driveDisconnect: "Déconnecter",
      driveFolder: "Dossier",
      driveOpenFolderBtn: "Ouvrir le dossier des créations",
      driveAutoBackup: "Sauvegarde cloud automatique",
      driveAutoBackupDesc: "Sauvegarder automatiquement les nouvelles images et séquences générées",
      driveUploadBtn: "Enregistrer sur Drive",
      driveUploading: "Enregistrement...",
      driveSaved: "Enregistré sur Drive",
      driveOpenLink: "Ouvrir dans Drive",
      driveDeleteBtn: "Supprimer",
      driveDescription: "Sauvegardez en toute sécurité vos créations premium sur votre Google Drive personnel en arrière-plan.",
      driveEmptyCloud: "Aucun fichier sauvegardé trouvé. Enregistrez une création sur Google Drive pour l'afficher ici.",
      driveLoading: "Connexion au conteneur Google Drive...",
      driveDownloadBtn: "Télécharger",
      driveTermsAgreePrefix: "J'accepte le traitement des données conformément à la",
      privacyPolicyGDPR: "Politique de confidentialité (RGPD)",
      driveTermsAnd: "et aux",
      termsOfServiceCheck: "Conditions d'utilisation",
      driveTermsErrorHeader: "⚠️ Veuillez cocher la case pour accepter la politique !",
      driveTermsErrorTab: "⚠️ Vous devez accepter les conditions pour connecter Google Drive !"
    },
    it: {
      driveTabLocal: "Cronologia locale",
      driveTabCloud: "Backup di Google Drive",
      driveConnectBtn: "Connetti Google Drive",
      driveConnectedAs: "Connesso a Google Drive come",
      driveDisconnect: "Disconnetti",
      driveFolder: "Cartella",
      driveOpenFolderBtn: "Apri cartella creazioni",
      driveAutoBackup: "Backup cloud automatico",
      driveAutoBackupDesc: "Salva automaticamente in background le nuove immagini e sequenze video generate",
      driveUploadBtn: "Salva su Drive",
      driveUploading: "Salvataggio...",
      driveSaved: "Salvato su Drive",
      driveOpenLink: "Apri in Drive",
      driveDeleteBtn: "Elimina",
      driveDescription: "Esegui il backup sicuro delle tue creazioni premium sul tuo Google Drive personale in background.",
      driveEmptyCloud: "Nessun file di backup trovato. Salva una creazione su Google Drive per visualizzarla qui.",
      driveLoading: "Connessione in corso a Google Drive...",
      driveDownloadBtn: "Scarica",
      driveTermsAgreePrefix: "Acconsento al tratamento dei dati in conformità con l'",
      privacyPolicyGDPR: "Informativa sulla privacy (GDPR)",
      driveTermsAnd: "e i",
      termsOfServiceCheck: "Termini di servizio",
      driveTermsErrorHeader: "⚠️ Seleziona la casella per accettare l'informativa!",
      driveTermsErrorTab: "⚠️ Devi accettare i termini per connettere Google Drive!"
    },
    es: {
      driveTabLocal: "Historial local",
      driveTabCloud: "Copias de seguridad de Google Drive",
      driveConnectBtn: "Conectar Google Drive",
      driveConnectedAs: "Conectado a Google Drive como",
      driveDisconnect: "Desconectar",
      driveFolder: "Carpeta",
      driveOpenFolderBtn: "Abrir carpeta de creaciones",
      driveAutoBackup: "Copia de seguridad automática",
      driveAutoBackupDesc: "Guarda automáticamente las nuevas imágenes y secuencias cinematográficas generadas",
      driveUploadBtn: "Guardar en Drive",
      driveUploading: "Guardando...",
      driveSaved: "Guardado en Drive",
      driveOpenLink: "Abrir en Drive",
      driveDeleteBtn: "Eliminar",
      driveDescription: "Realiza copias de seguridad de forma segura de tus creaciones premium en tu Google Drive personal en segundo plano.",
      driveEmptyCloud: "No se encontraron archivos respaldados. Guarda cualquier creación en Google Drive para verla aquí.",
      driveLoading: "Conectando al contenedor de Google Drive...",
      driveDownloadBtn: "Descargar",
      driveTermsAgreePrefix: "Acepto el procesamiento de datos de acuerdo con la",
      privacyPolicyGDPR: "Política de privacidad (RGPD)",
      driveTermsAnd: "y los",
      termsOfServiceCheck: "Términos de servicio",
      driveTermsErrorHeader: "⚠️ ¡Marca la casilla para aceptar la política!",
      driveTermsErrorTab: "⚠️ ¡Debes aceptar los términos para conectar Google Drive!"
    },
    pt: {
      driveTabLocal: "Histórico local",
      driveTabCloud: "Backups do Google Drive",
      driveConnectBtn: "Conectar ao Google Drive",
      driveConnectedAs: "Conectado ao Google Drive como",
      driveDisconnect: "Desconectar",
      driveFolder: "Pasta",
      driveOpenFolderBtn: "Abrir pasta de criações",
      driveAutoBackup: "Backup automático na nuvem",
      driveAutoBackupDesc: "Salva automaticamente as novas imagens e sequências geradas no Drive",
      driveUploadBtn: "Salvar no Drive",
      driveUploading: "Salvando...",
      driveSaved: "Salvo no Drive",
      driveOpenLink: "Abrir no Drive",
      driveDeleteBtn: "Excluir",
      driveDescription: "Faça backup de forma segura de suas criações premium no seu Google Drive pessoal em segundo plano.",
      driveEmptyCloud: "Nenhum arquivo de backup encontrado. Salve qualquer criação no Google Drive para listá-la aqui.",
      driveLoading: "Conectando ao Google Drive...",
      driveDownloadBtn: "Baixar",
      driveTermsAgreePrefix: "Concordo com o processamento de dados de acordo com a",
      privacyPolicyGDPR: "Política de Privacidade (RGPD)",
      driveTermsAnd: "e os",
      termsOfServiceCheck: "Termos de Serviço",
      driveTermsErrorHeader: "⚠️ Marque a caixa para concordar com a política!",
      driveTermsErrorTab: "⚠️ Deve aceitar os termos para se conectar ao Google Drive!"
    },
    pl: {
      driveTabLocal: "Lokalna historia",
      driveTabCloud: "Kopie zapasowe Google Drive",
      driveConnectBtn: "Połącz z Google Drive",
      driveConnectedAs: "Połączono z Google Drive jako",
      driveDisconnect: "Rozłącz",
      driveFolder: "Folder",
      driveOpenFolderBtn: "Otwórz folder kreacji",
      driveAutoBackup: "Automatyczna kopia zapasowa",
      driveAutoBackupDesc: "Automatycznie zapisuj nowo wygenerowane obrazy i sekwencje filmowe",
      driveUploadBtn: "Zapisz na Drive",
      driveUploading: "Zapisywanie...",
      driveSaved: "Zapisano na Drive",
      driveOpenLink: "Otvórz w Drive",
      driveDeleteBtn: "Usuń",
      driveDescription: "Bezpiecznie zapisuj swoje wyjątkowe kreacje na osobistym dysku Google Drive w tle.",
      driveEmptyCloud: "Nie znaleziono zapisanych plików. Zapisz dowolne dzieło na Google Drive, aby je tu zobaczyć.",
      driveLoading: "Łączenie z Google Drive...",
      driveDownloadBtn: "Pobierz",
      driveTermsAgreePrefix: "Zgadzam się na przetwarzanie danych zgodnie z",
      privacyPolicyGDPR: "Polityką prywatności (RODO)",
      driveTermsAnd: "oraz",
      termsOfServiceCheck: "Regulaminem świadczenia usług",
      driveTermsErrorHeader: "⚠️ Zaznacz pole, aby zaakceptować politykę!",
      driveTermsErrorTab: "⚠️ Musisz zaakceptować regulamin, aby połączyć się z Dyskiem Google!"
    }
  };

  const [activeHistoryTab, setActiveHistoryTab] = useState<'local' | 'drive'>('local');
  const dt = driveTranslations[language] || driveTranslations['sk'] || driveTranslations['en'];
  const t = translations[language];

  const fetchChangelog = async (forceGenerate: boolean = false) => {
    if (forceGenerate) {
      setIsGeneratingChangelog(true);
      setChangelogMessage(null);
    } else {
      setIsChangelogLoading(true);
    }
    
    try {
      const geminiHeader: any = userApiKey ? { "x-gemini-key": userApiKey } : {};
      const url = forceGenerate ? "/api/changelog/generate" : "/api/changelog";
      const options = forceGenerate ? {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...geminiHeader
        }
      } : {
        method: "GET",
        headers: {
          ...geminiHeader
        }
      };
      
      const res = await fetch(url, options);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || (language === 'sk' ? "Nepodarilo sa spracovať požiadavku." : "Failed to process request."));
      }
      
      if (data.releases) {
        setChangelogs(data.releases);
      }
      
      if (data.message) {
        setChangelogMessage(data.message);
      }
    } catch (e: any) {
      console.error("Error with changelog:", e);
      if (forceGenerate) {
        setChangelogMessage(language === 'sk' ? `Chyba: ${e.message}` : `Error: ${e.message}`);
      }
    } finally {
      setIsChangelogLoading(false);
      setIsGeneratingChangelog(false);
    }
  };

  useEffect(() => {
    if (showDocumentation && activeDocTab === 'changelog') {
      fetchChangelog();
    }
  }, [showDocumentation, activeDocTab]);

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

    // Load Drive auto-upload preference
    const savedAutoUpload = localStorage.getItem('drive_auto_upload');
    if (savedAutoUpload === 'true') {
      setAutoUploadToDrive(true);
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

    // Initialize Google Drive Authentication state listener
    const unsubscribe = initAuth(
      (user, token) => {
        setDriveUser(user);
        setDriveToken(token);
        fetchDriveFiles(token);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    setApiMetrics(prev => ({
      gemini: {
        ...prev.gemini,
        status: userApiKey ? (prev.gemini.status === "unconfigured" ? "operational" : prev.gemini.status) : "unconfigured"
      },
      openai: {
        ...prev.openai,
        status: openaiApiKey ? (prev.openai.status === "unconfigured" ? "operational" : prev.openai.status) : "unconfigured"
      }
    }));
  }, [userApiKey, openaiApiKey]);

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
        if (["5s", "6s", "8s"].includes(item.parameters.duration)) {
          setVideoDuration(item.parameters.duration);
          setIsCustomDuration(false);
        } else {
          setVideoDuration("5s");
          setIsCustomDuration(false);
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
    setValidationStatus(prev => ({ 
      ...prev, 
      gemini: null, 
      geminiError: undefined, 
      geminiErrorCode: undefined 
    }));
    setApiMetrics(prev => ({
      ...prev,
      gemini: {
        latencyHistory: [],
        uptime: 100,
        checksCount: 0,
        successCount: 0,
        lastCheck: null,
        status: "unconfigured",
        latency: null
      }
    }));
  };

  const clearOpenAIKey = () => {
    setOpenaiApiKey("");
    localStorage.removeItem('openai_api_key');
    setValidationStatus(prev => ({ 
      ...prev, 
      openai: null, 
      openaiError: undefined, 
      openaiErrorCode: undefined 
    }));
    setApiMetrics(prev => ({
      ...prev,
      openai: {
        latencyHistory: [],
        uptime: 100,
        checksCount: 0,
        successCount: 0,
        lastCheck: null,
        status: "unconfigured",
        latency: null
      }
    }));
  };

  const validateGemini = async () => {
    setIsGeminiValidating(true);
    const startTime = performance.now();
    try {
      const resp = await fetch("/api/verify-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiKey: userApiKey })
      });
      const duration = Math.round(performance.now() - startTime);
      const data = await resp.json();
      
      setValidationStatus(prev => ({
        ...prev, 
        gemini: data.gemini,
        geminiError: data.geminiError,
        geminiErrorCode: data.geminiErrorCode
      }));

      // Update apiMetrics
      setApiMetrics(prev => {
        const isSuccess = !!data.gemini;
        const history = isSuccess 
          ? [...prev.gemini.latencyHistory, duration].slice(-10)
          : prev.gemini.latencyHistory;
        const newChecks = prev.gemini.checksCount + 1;
        const newSuccess = prev.gemini.successCount + (isSuccess ? 1 : 0);
        const calcUptime = Math.round((newSuccess / newChecks) * 1000) / 10;
        
        return {
          ...prev,
          gemini: {
            latencyHistory: history,
            uptime: calcUptime,
            checksCount: newChecks,
            successCount: newSuccess,
            lastCheck: new Date().toLocaleTimeString(),
            status: !userApiKey ? "unconfigured" : (isSuccess ? (duration > 1500 ? "degraded" : "operational") : "failed"),
            latency: isSuccess ? duration : null
          }
        };
      });

      if (!data.gemini && userApiKey) {
        console.warn(`[API Key Validation] Gemini Key Failed. Code: ${data.geminiErrorCode || 'N/A'}. Message: ${data.geminiError}`);
        alert(`Gemini key validation failed (Error Code: ${data.geminiErrorCode || 'N/A'}): ${data.geminiError}`);
      } else if (data.gemini) {
        console.log(`[API Key Validation] Gemini Key Verified Successfully.`);
      }
    } catch (e: any) {
      console.error("[API Key Validation] Gemini request error:", e);
      alert(`Validation request failed: ${e.message || 'Unknown network error'}`);
      
      setApiMetrics(prev => {
        const newChecks = prev.gemini.checksCount + 1;
        const calcUptime = Math.round((prev.gemini.successCount / newChecks) * 1000) / 10;
        return {
          ...prev,
          gemini: {
            ...prev.gemini,
            checksCount: newChecks,
            uptime: calcUptime,
            status: "failed",
            lastCheck: new Date().toLocaleTimeString(),
            latency: null
          }
        };
      });
    } finally {
      setIsGeminiValidating(false);
    }
  };

  const validateOpenAI = async () => {
    setIsOpenAIValidating(true);
    const startTime = performance.now();
    try {
      const resp = await fetch("/api/verify-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openaiKey: openaiApiKey })
      });
      const duration = Math.round(performance.now() - startTime);
      const data = await resp.json();
      
      setValidationStatus(prev => ({
        ...prev, 
        openai: data.openai,
        openaiError: data.openaiError,
        openaiErrorCode: data.openaiErrorCode
      }));

      // Update apiMetrics
      setApiMetrics(prev => {
        const isSuccess = !!data.openai;
        const history = isSuccess 
          ? [...prev.openai.latencyHistory, duration].slice(-10)
          : prev.openai.latencyHistory;
        const newChecks = prev.openai.checksCount + 1;
        const newSuccess = prev.openai.successCount + (isSuccess ? 1 : 0);
        const calcUptime = Math.round((newSuccess / newChecks) * 1000) / 10;
        
        return {
          ...prev,
          openai: {
            latencyHistory: history,
            uptime: calcUptime,
            checksCount: newChecks,
            successCount: newSuccess,
            lastCheck: new Date().toLocaleTimeString(),
            status: !openaiApiKey ? "unconfigured" : (isSuccess ? (duration > 1500 ? "degraded" : "operational") : "failed"),
            latency: isSuccess ? duration : null
          }
        };
      });

      if (!data.openai && openaiApiKey) {
        console.warn(`[API Key Validation] OpenAI Key Failed. Code: ${data.openaiErrorCode || 'N/A'}. Message: ${data.openaiError}`);
        alert(`OpenAI key validation failed (Error Code: ${data.openaiErrorCode || 'N/A'}): ${data.openaiError}`);
      } else if (data.openai) {
        console.log(`[API Key Validation] OpenAI Key Verified Successfully.`);
      }
    } catch (e: any) {
      console.error("[API Key Validation] OpenAI request error:", e);
      alert(`Validation request failed: ${e.message || 'Unknown network error'}`);
      
      setApiMetrics(prev => {
        const newChecks = prev.openai.checksCount + 1;
        const calcUptime = Math.round((prev.openai.successCount / newChecks) * 1000) / 10;
        return {
          ...prev,
          openai: {
            ...prev.openai,
            checksCount: newChecks,
            uptime: calcUptime,
            status: "failed",
            lastCheck: new Date().toLocaleTimeString(),
            latency: null
          }
        };
      });
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

      // Background auto upload to Google Drive if connected and active
      if (autoUploadToDrive) {
        const token = driveToken || getAccessToken();
        if (token) {
          const extension = 'png';
          const cleanPrompt = imagePrompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_') || 'image';
          const fileName = `VisionForge_${cleanPrompt}_${Date.now()}.${extension}`;
          uploadFileToDrive(token, fileName, 'image/png', data.image)
            .then(() => fetchDriveFiles(token))
            .catch(e => console.error("Auto-backup image failed:", e));
        }
      }

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
    generationStartTimeRef.current = Date.now();
    setActiveVideoMetadata(null);
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

      const genDuration = generationStartTimeRef.current 
        ? Math.round((Date.now() - generationStartTimeRef.current) / 100) / 10 
        : undefined;

      const metadata = {
        model: selectedVideoModel,
        generationDuration: genDuration,
        timestamp: Date.now(),
        resolution: videoResolution === "Auto" ? detectedRes.video : videoResolution,
        aspectRatio,
        duration: isCustomDuration ? `${customDurationValue || "5"}s` : videoDuration,
        style: selectedStyle.label,
        prompt: prompt
      };

      setActiveVideoMetadata(metadata);

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
          style: selectedStyle.label,
          generationDuration: genDuration
        }
      });

      // Background auto upload to Google Drive if connected and active
      if (autoUploadToDrive) {
        const token = driveToken || getAccessToken();
        if (token) {
          const extension = 'mp4';
          const cleanPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_') || 'video';
          const fileName = `VisionForge_${cleanPrompt}_${Date.now()}.${extension}`;
          uploadFileToDrive(token, fileName, 'video/mp4', url)
            .then(() => fetchDriveFiles(token))
            .catch(e => console.error("Auto-backup video failed:", e));
        }
      }

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
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
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

              <div className="space-y-6 overflow-y-auto flex-1 pr-1.5 -mr-1.5 custom-scrollbar">
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
                  {validationStatus.gemini === false && (
                    <div className="mt-1.5 p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-[11px] text-red-400/90 space-y-1.5">
                      <span className="font-semibold block text-red-400">✗ {t.keyInvalid}</span>
                      {validationStatus.geminiErrorCode && (
                        <div className="font-mono text-[10px] bg-red-950/30 px-2 py-1 rounded border border-red-500/10 inline-block">
                          <span className="text-slate-400">Error Code:</span> <span className="text-red-300 font-bold">{validationStatus.geminiErrorCode}</span>
                        </div>
                      )}
                      {validationStatus.geminiError && (
                        <p className="text-slate-400 text-[10.5px] leading-relaxed break-words">{validationStatus.geminiError}</p>
                      )}
                    </div>
                  )}
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
                  {validationStatus.openai === false && (
                    <div className="mt-1.5 p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-[11px] text-red-400/90 space-y-1.5">
                      <span className="font-semibold block text-red-400">✗ {t.keyInvalid}</span>
                      {validationStatus.openaiErrorCode && (
                        <div className="font-mono text-[10px] bg-red-950/30 px-2 py-1 rounded border border-red-500/10 inline-block">
                          <span className="text-slate-400">Error Code:</span> <span className="text-red-300 font-bold">{validationStatus.openaiErrorCode}</span>
                        </div>
                      )}
                      {validationStatus.openaiError && (
                        <p className="text-slate-400 text-[10.5px] leading-relaxed break-words">{validationStatus.openaiError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Real-time API Status Dashboard Accordion */}
                <div className="border border-slate-800/80 bg-slate-950/40 rounded-[2rem] overflow-hidden shadow-inner relative group">
                  {/* Accordion Header Trigger */}
                  <button
                    type="button"
                    onClick={() => setShowStatusDashboard(!showStatusDashboard)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          apiMetrics.gemini.status === 'operational' && apiMetrics.openai.status === 'operational' ? 'bg-emerald-400' :
                          apiMetrics.gemini.status === 'failed' || apiMetrics.openai.status === 'failed' ? 'bg-red-400' :
                          'bg-slate-400'
                        }`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${
                          apiMetrics.gemini.status === 'operational' && apiMetrics.openai.status === 'operational' ? 'bg-emerald-500' :
                          apiMetrics.gemini.status === 'failed' || apiMetrics.openai.status === 'failed' ? 'bg-red-500' :
                          'bg-slate-500'
                        }`}></span>
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {dashboardTranslations[language as keyof typeof dashboardTranslations]?.title || dashboardTranslations.en.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {!showStatusDashboard && (
                        <span className="text-[10px] font-semibold text-slate-500">
                          {apiMetrics.gemini.status === 'operational' && apiMetrics.openai.status === 'operational' 
                            ? (dashboardTranslations[language as keyof typeof dashboardTranslations]?.bothHealthy || dashboardTranslations.en.bothHealthy)
                            : (apiMetrics.gemini.status === 'failed' || apiMetrics.openai.status === 'failed' 
                              ? (dashboardTranslations[language as keyof typeof dashboardTranslations]?.issuesDetected || dashboardTranslations.en.issuesDetected)
                              : (dashboardTranslations[language as keyof typeof dashboardTranslations]?.unconfigured || dashboardTranslations.en.unconfigured))
                          }
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showStatusDashboard ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {showStatusDashboard && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/40">
                          {/* Manual trigger Button row */}
                          <div className="flex items-center justify-end">
                            {(userApiKey || openaiApiKey) && (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (userApiKey) await validateGemini();
                                  if (openaiApiKey) await validateOpenAI();
                                }}
                                disabled={isGeminiValidating || isOpenAIValidating}
                                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-emerald-500/5 hover:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10"
                                title={dashboardTranslations[language as keyof typeof dashboardTranslations]?.runCheck || dashboardTranslations.en.runCheck}
                              >
                                {isGeminiValidating || isOpenAIValidating ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-3 h-3" />
                                )}
                                {dashboardTranslations[language as keyof typeof dashboardTranslations]?.healthCheckBtn || dashboardTranslations.en.healthCheckBtn}
                              </button>
                            )}
                          </div>

                          {/* Grid for Gemini and OpenAI */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Gemini Status Panel */}
                            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-3.5 space-y-3 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[11px] font-bold text-slate-300">Gemini</span>
                                  {/* Pulsing state indicator */}
                                  <div className="flex items-center gap-1.5">
                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                      apiMetrics.gemini.status === 'unconfigured' ? 'bg-slate-600' :
                                      apiMetrics.gemini.status === 'operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' :
                                      apiMetrics.gemini.status === 'degraded' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse' :
                                      'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse'
                                    }`} />
                                    <span className="text-[9px] font-semibold text-slate-500">
                                      {apiMetrics.gemini.status === 'unconfigured' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.unconfigured || dashboardTranslations.en.unconfigured)}
                                      {apiMetrics.gemini.status === 'operational' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.operational || dashboardTranslations.en.operational)}
                                      {apiMetrics.gemini.status === 'degraded' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.degraded || dashboardTranslations.en.degraded)}
                                      {apiMetrics.gemini.status === 'failed' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.failed || dashboardTranslations.en.failed)}
                                    </span>
                                  </div>
                                </div>

                                {/* Telemetry Metrics */}
                                <div className="grid grid-cols-2 gap-2 text-left pt-1">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tight block">
                                      {dashboardTranslations[language as keyof typeof dashboardTranslations]?.latency || dashboardTranslations.en.latency}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-slate-300">
                                      {apiMetrics.gemini.latency ? `${apiMetrics.gemini.latency} ms` : '--'}
                                    </span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tight block">
                                      {dashboardTranslations[language as keyof typeof dashboardTranslations]?.uptime || dashboardTranslations.en.uptime}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-slate-300">
                                      {apiMetrics.gemini.status === 'unconfigured' ? '--' : `${apiMetrics.gemini.uptime}%`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Sparkline History / Status Bar */}
                              <div className="pt-2 border-t border-slate-800/40">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[9px] font-medium text-slate-500">
                                    {dashboardTranslations[language as keyof typeof dashboardTranslations]?.history || dashboardTranslations.en.history}
                                  </span>
                                  <span className="text-[8px] font-mono text-slate-600">
                                    {apiMetrics.gemini.lastCheck ? `${dashboardTranslations[language as keyof typeof dashboardTranslations]?.lastCheck || dashboardTranslations.en.lastCheck}: ${apiMetrics.gemini.lastCheck}` : (dashboardTranslations[language as keyof typeof dashboardTranslations]?.never || dashboardTranslations.en.never)}
                                  </span>
                                </div>
                                {apiMetrics.gemini.latencyHistory.length > 0 ? (
                                  <div className="flex items-end gap-[3px] h-[18px] pt-1.5 justify-start">
                                    {apiMetrics.gemini.latencyHistory.map((lat, idx) => {
                                      const heightPercent = Math.min(100, Math.max(20, (lat / 1200) * 100));
                                      return (
                                        <div 
                                          key={idx} 
                                          className={`w-[6px] rounded-t-[1px] transition-all ${
                                            lat > 1500 ? 'bg-amber-500' : 'bg-emerald-500/60 hover:bg-emerald-400'
                                          }`} 
                                          style={{ height: `${heightPercent}%` }}
                                          title={`${lat}ms`}
                                        />
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-[8.5px] text-slate-600 block leading-tight italic">
                                    {userApiKey ? (dashboardTranslations[language as keyof typeof dashboardTranslations]?.historyAwaiting || dashboardTranslations.en.historyAwaiting) : (dashboardTranslations[language as keyof typeof dashboardTranslations]?.unconfigured || dashboardTranslations.en.unconfigured)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* OpenAI Status Panel */}
                            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-3.5 space-y-3 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[11px] font-bold text-slate-300">OpenAI</span>
                                  {/* Pulsing state indicator */}
                                  <div className="flex items-center gap-1.5">
                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                      apiMetrics.openai.status === 'unconfigured' ? 'bg-slate-600' :
                                      apiMetrics.openai.status === 'operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' :
                                      apiMetrics.openai.status === 'degraded' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse' :
                                      'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse'
                                    }`} />
                                    <span className="text-[9px] font-semibold text-slate-500">
                                      {apiMetrics.openai.status === 'unconfigured' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.unconfigured || dashboardTranslations.en.unconfigured)}
                                      {apiMetrics.openai.status === 'operational' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.operational || dashboardTranslations.en.operational)}
                                      {apiMetrics.openai.status === 'degraded' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.degraded || dashboardTranslations.en.degraded)}
                                      {apiMetrics.openai.status === 'failed' && (dashboardTranslations[language as keyof typeof dashboardTranslations]?.failed || dashboardTranslations.en.failed)}
                                    </span>
                                  </div>
                                </div>

                                {/* Telemetry Metrics */}
                                <div className="grid grid-cols-2 gap-2 text-left pt-1">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tight block">
                                      {dashboardTranslations[language as keyof typeof dashboardTranslations]?.latency || dashboardTranslations.en.latency}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-slate-300">
                                      {apiMetrics.openai.latency ? `${apiMetrics.openai.latency} ms` : '--'}
                                    </span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tight block">
                                      {dashboardTranslations[language as keyof typeof dashboardTranslations]?.uptime || dashboardTranslations.en.uptime}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-slate-300">
                                      {apiMetrics.openai.status === 'unconfigured' ? '--' : `${apiMetrics.openai.uptime}%`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Sparkline History / Status Bar */}
                              <div className="pt-2 border-t border-slate-800/40">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[9px] font-medium text-slate-500">
                                    {dashboardTranslations[language as keyof typeof dashboardTranslations]?.history || dashboardTranslations.en.history}
                                  </span>
                                  <span className="text-[8px] font-mono text-slate-600">
                                    {apiMetrics.openai.lastCheck ? `${dashboardTranslations[language as keyof typeof dashboardTranslations]?.lastCheck || dashboardTranslations.en.lastCheck}: ${apiMetrics.openai.lastCheck}` : (dashboardTranslations[language as keyof typeof dashboardTranslations]?.never || dashboardTranslations.en.never)}
                                  </span>
                                </div>
                                {apiMetrics.openai.latencyHistory.length > 0 ? (
                                  <div className="flex items-end gap-[3px] h-[18px] pt-1.5 justify-start">
                                    {apiMetrics.openai.latencyHistory.map((lat, idx) => {
                                      const heightPercent = Math.min(100, Math.max(20, (lat / 1200) * 100));
                                      return (
                                        <div 
                                          key={idx} 
                                          className={`w-[6px] rounded-t-[1px] transition-all ${
                                            lat > 1500 ? 'bg-amber-500' : 'bg-emerald-500/60 hover:bg-emerald-400'
                                          }`} 
                                          style={{ height: `${heightPercent}%` }}
                                          title={`${lat}ms`}
                                        />
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-[8.5px] text-slate-600 block leading-tight italic">
                                    {openaiApiKey ? (dashboardTranslations[language as keyof typeof dashboardTranslations]?.historyAwaiting || dashboardTranslations.en.historyAwaiting) : (dashboardTranslations[language as keyof typeof dashboardTranslations]?.unconfigured || dashboardTranslations.en.unconfigured)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Context footer when no keys entered */}
                          {!userApiKey && !openaiApiKey && (
                            <p className="text-[10px] text-slate-500 text-center leading-relaxed pt-1.5">
                              {dashboardTranslations[language as keyof typeof dashboardTranslations]?.noKeysTitle || dashboardTranslations.en.noKeysTitle}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User & Server Error Logging Dashboard Accordion */}
                <div className="border border-slate-800/80 bg-slate-950/40 rounded-[2rem] overflow-hidden shadow-inner relative group mt-4">
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => setShowLogsDashboard(!showLogsDashboard)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        {userLogs.some(l => l.status === 'unread') && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-400"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${
                          userLogs.length > 0 ? (userLogs.some(l => l.status === 'unread') ? 'bg-rose-500' : 'bg-amber-500') : 'bg-slate-500'
                        }`}></span>
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                        {language === 'sk' ? "Diagnostika a Chybové logy" : "Diagnostics & Error Logs"}
                        {userLogs.length > 0 && (
                          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-400 font-mono">
                            {userLogs.length}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {!showLogsDashboard && userLogs.length > 0 && (
                        <span className="text-[10px] font-semibold text-rose-400">
                          {userLogs.some(l => l.status === 'unread') 
                            ? (language === 'sk' ? "Nové chyby!" : "New errors!") 
                            : (language === 'sk' ? "Záznam chýb" : "Errors logged")
                          }
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showLogsDashboard ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {showLogsDashboard && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/40">
                          {/* Controls / Filter row */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setLogsFilter("all")}
                                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                                  logsFilter === "all" 
                                    ? "bg-slate-800 text-white border-slate-700" 
                                    : "bg-slate-900/40 text-slate-400 border-white/5 hover:bg-slate-900/60"
                                }`}
                              >
                                {language === 'sk' ? "Všetky" : "All"} ({userLogs.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => setLogsFilter("client")}
                                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                                  logsFilter === "client" 
                                    ? "bg-slate-800 text-white border-slate-700" 
                                    : "bg-slate-900/40 text-slate-400 border-white/5 hover:bg-slate-900/60"
                                }`}
                              >
                                {language === 'sk' ? "Klientské" : "Client"} ({userLogs.filter(l => l.type.includes("Client")).length})
                              </button>
                              <button
                                type="button"
                                onClick={() => setLogsFilter("server")}
                                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                                  logsFilter === "server" 
                                    ? "bg-slate-800 text-white border-slate-700" 
                                    : "bg-slate-900/40 text-slate-400 border-white/5 hover:bg-slate-900/60"
                                }`}
                              >
                                {language === 'sk' ? "Serverové API" : "Server API"} ({userLogs.filter(l => l.type.includes("Server")).length})
                              </button>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Simulate test error */}
                              <button
                                type="button"
                                onClick={triggerTestError}
                                className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                title={language === 'sk' ? "Generovať testovaciu chybu pre overenie Slacku" : "Generate test error to verify Slack"}
                              >
                                <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse" />
                                {language === 'sk' ? "Simulovať chybu" : "Simulate Error"}
                              </button>

                              {userLogs.length > 0 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={markAllLogsAsRead}
                                    className="text-[10px] text-slate-400 hover:text-slate-300 font-medium flex items-center gap-1 bg-slate-900/60 border border-white/5 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                                    title={language === 'sk' ? "Označiť všetky ako prečítané" : "Mark all as read"}
                                  >
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    {language === 'sk' ? "Prečítané" : "Mark Read"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={exportLogsToJSON}
                                    className="text-[10px] text-slate-400 hover:text-slate-300 font-medium flex items-center gap-1 bg-slate-900/60 border border-white/5 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                                    title={language === 'sk' ? "Exportovať logy do JSON" : "Export logs to JSON"}
                                  >
                                    <Download className="w-3 h-3 text-sky-400" />
                                    {language === 'sk' ? "Export" : "Export"}
                                  </button>
                                  {showDeleteConfirm ? (
                                    <div className="flex items-center gap-1 bg-rose-950/40 border border-rose-500/30 rounded-lg p-0.5">
                                      <span className="text-[9px] text-rose-300 px-1 font-medium">{(t as any).confirmDelete || "Confirm?"}</span>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          await clearLogsOnServer();
                                          setShowDeleteConfirm(false);
                                        }}
                                        className="text-[9px] text-white bg-rose-600 hover:bg-rose-500 px-1.5 py-0.5 rounded font-bold cursor-pointer"
                                      >
                                        {(t as any).yes || "Yes"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="text-[9px] text-slate-400 hover:text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                                      >
                                        {(t as any).no || "No"}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setShowDeleteConfirm(true)}
                                      className="text-[10px] text-slate-400 hover:text-rose-400 font-medium flex items-center gap-1 bg-slate-900/60 border border-white/5 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                                      title={(t as any).clearLogs || "Clear all logs"}
                                    >
                                      <Trash2 className="w-3 h-3 text-rose-400" />
                                      {(t as any).clear || "Clear"}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Logs List Container */}
                          <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                            {logsLoading && userLogs.length === 0 ? (
                              <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                                <span className="text-xs">{language === 'sk' ? "Načítavam logy..." : "Loading logs..."}</span>
                              </div>
                            ) : userLogs.length === 0 ? (
                              <div className="text-center py-8 border border-dashed border-slate-800/60 rounded-2xl bg-slate-950/20 space-y-2">
                                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                                <p className="text-xs font-semibold text-slate-300">
                                  {language === 'sk' ? "Systém beží bez problémov" : "No problems detected"}
                                </p>
                                <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                                  {language === 'sk' 
                                    ? "Chyby sa tu automaticky zaznamenajú pre diagnostické účely." 
                                    : "Errors will be automatically recorded here for diagnostic purposes."
                                  }
                                </p>
                              </div>
                            ) : (
                              (() => {
                                const filtered = userLogs.filter(log => {
                                  if (logsFilter === "client") return log.type.includes("Client");
                                  if (logsFilter === "server") return log.type.includes("Server");
                                  return true;
                                });

                                if (filtered.length === 0) {
                                  return (
                                    <div className="text-center py-6 text-slate-500 text-xs">
                                      {language === 'sk' ? "Žiadne logy pre vybraný filter." : "No logs for selected filter."}
                                    </div>
                                  );
                                }

                                return filtered.map((log) => {
                                  const isExpanded = activeLogId === log.id;
                                  const formattedTime = new Date(log.timestamp).toLocaleTimeString(language === 'sk' ? 'sk-SK' : 'en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                  });
                                  
                                  const isClient = log.type.includes("Client");

                                  return (
                                    <div 
                                      key={log.id} 
                                      className={`border transition-all rounded-2xl text-left ${
                                        log.status === 'unread' 
                                          ? 'border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10' 
                                          : isExpanded 
                                            ? 'border-slate-700 bg-slate-900/40' 
                                            : 'border-slate-800/40 bg-slate-900/20 hover:bg-slate-900/40'
                                      }`}
                                    >
                                      {/* Log Header */}
                                      <div 
                                        onClick={() => {
                                          setActiveLogId(isExpanded ? null : log.id);
                                          // Mark read on click
                                          if (log.status === 'unread') {
                                            setUserLogs(prev => prev.map(l => l.id === log.id ? { ...l, status: 'read' } : l));
                                          }
                                        }}
                                        className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                                      >
                                        <div className="flex items-start gap-2.5 min-w-0">
                                          <div className="flex flex-col items-center gap-1 pt-0.5">
                                            <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">
                                              {formattedTime}
                                            </span>
                                            {log.status === 'unread' && (
                                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                            )}
                                          </div>

                                          <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                isClient 
                                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                              }`}>
                                                {log.type}
                                              </span>
                                              <span className="text-[10px] text-slate-400 font-mono font-medium truncate max-w-[150px]" title={log.userEmail}>
                                                {log.userEmail}
                                              </span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-200 truncate leading-tight">
                                              {log.message}
                                            </p>
                                          </div>
                                        </div>

                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform flex-shrink-0 mt-1 ${isExpanded ? "rotate-180 text-slate-300" : ""}`} />
                                      </div>

                                      {/* Log Expand Panel */}
                                      <AnimatePresence>
                                        {isExpanded && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden border-t border-slate-800/60"
                                          >
                                            <div className="p-4 space-y-3.5 text-left text-xs bg-slate-950/40">
                                              {/* Message Display */}
                                              <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                                                  {language === 'sk' ? "Detaily správy" : "Message details"}
                                                </span>
                                                <p className="text-xs text-rose-300 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 font-medium whitespace-pre-wrap select-text leading-relaxed">
                                                  {log.message}
                                                </p>
                                              </div>

                                              {/* URL context */}
                                              {log.url && (
                                                <div className="space-y-1">
                                                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                                                    {language === 'sk' ? "Kontext / URL" : "Context / URL"}
                                                  </span>
                                                  <code className="text-[10px] font-mono bg-slate-900/80 px-2 py-1 rounded block truncate border border-white/5 select-all text-slate-400">
                                                    {log.url}
                                                  </code>
                                                </div>
                                              )}

                                              {/* System Info Grid */}
                                              {log.systemInfo && Object.keys(log.systemInfo).length > 0 && (
                                                <div className="space-y-1">
                                                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                                                    {language === 'sk' ? "Systémové parametre" : "System specs"}
                                                  </span>
                                                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/30 p-3 rounded-xl border border-white/5 font-mono text-slate-400">
                                                    {Object.entries(log.systemInfo).map(([key, val]: [string, any]) => (
                                                      <div key={key} className="truncate">
                                                        <span className="text-slate-500 font-bold">{key}:</span> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}

                                              {/* Stack trace */}
                                              {log.stack && (
                                                <div className="space-y-1">
                                                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                                                    {language === 'sk' ? "Zásobník volaní (Stack Trace)" : "Stack Trace"}
                                                  </span>
                                                  <pre className="text-[10px] font-mono bg-slate-900/90 text-slate-400 p-3.5 rounded-xl border border-white/5 overflow-x-auto max-h-[160px] select-all custom-scrollbar whitespace-pre text-left leading-relaxed shadow-inner">
                                                    {log.stack}
                                                  </pre>
                                                </div>
                                              )}

                                              {/* Action Share & Copy Buttons Bar */}
                                              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/40">
                                                <div className="flex items-center gap-2">
                                                  {/* Slack Share Button */}
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      shareLogToSlack(log);
                                                    }}
                                                    disabled={sendingSlackLogId === log.id}
                                                    className={`text-[10.5px] font-bold flex items-center gap-1.5 border px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm ${
                                                      slackSendStatus[log.id] === "success"
                                                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                                                        : slackSendStatus[log.id] === "error"
                                                          ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                                                          : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-white/5"
                                                    }`}
                                                    title={(t as any).sendErrorReport || "Send error report"}
                                                  >
                                                    {sendingSlackLogId === log.id ? (
                                                      <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                                                        {language === 'sk' ? "Odosielam..." : "Sending..."}
                                                      </>
                                                    ) : slackSendStatus[log.id] === "success" ? (
                                                      <>
                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                                        {language === 'sk' ? "Odoslané!" : "Sent!"}
                                                      </>
                                                    ) : slackSendStatus[log.id] === "error" ? (
                                                      <>
                                                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                                        {language === 'sk' ? "Zlyhalo!" : "Failed!"}
                                                      </>
                                                    ) : (
                                                      <>
                                                        <svg className="w-3.5 h-3.5 text-slate-400 fill-current" viewBox="0 0 24 24">
                                                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.522h-2.52a2.528 2.528 0 0 1-2.522-2.522zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.042zm10.134 3.781a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522h-2.522v-2.522zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.521-2.52V5.043a2.528 2.528 0 0 1 2.521-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.041zm-3.781 10.134a2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.521h5.043a2.528 2.528 0 0 1 2.52 2.521v5.043a2.528 2.528 0 0 1-2.52 2.52h-5.043z"/>
                                                        </svg>
                                                        {(t as any).sendError || "Send Error"}
                                                      </>
                                                    )}
                                                  </button>
                                                </div>

                                                {/* Copy Button */}
                                                <button
                                                  type="button"
                                                  onClick={() => copyLogToClipboard(log)}
                                                  className="text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                                                >
                                                  {copiedLogId === log.id ? (
                                                    <>
                                                      <CheckCircle className="w-3.5 h-3.5" />
                                                      {language === 'sk' ? "Skopírované!" : "Copied!"}
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Copy className="w-3.5 h-3.5" />
                                                      {language === 'sk' ? "Kopírovať diagnózu" : "Copy Diagnostic Info"}
                                                    </>
                                                  )}
                                                </button>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                });
                              })()
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Interactive API Key Help Guide */}
                <div className="border border-slate-800/80 bg-slate-950/45 rounded-2xl p-4 space-y-3 transition-all">
                  <button 
                    type="button"
                    onClick={() => setShowKeyGuide(!showKeyGuide)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      {(t as any).documentation?.privacy?.guideTitle || "How to Obtain API Keys"}
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                      {showKeyGuide ? "Hide" : "Show"}
                    </span>
                  </button>

                  {showKeyGuide && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="space-y-3 pt-2 border-t border-slate-800/50 overflow-hidden"
                    >
                      {/* Tabs */}
                      <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-850">
                        <button
                          type="button"
                          onClick={() => setKeyGuideTab('gemini')}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                            keyGuideTab === 'gemini' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Gemini
                        </button>
                        <button
                          type="button"
                          onClick={() => setKeyGuideTab('openai')}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                            keyGuideTab === 'openai' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          OpenAI
                        </button>
                      </div>

                      {/* Step content */}
                      {keyGuideTab === 'gemini' ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300">
                              {((t as any).documentation?.privacy?.geminiTitle) || "Google Gemini API Key"}
                            </span>
                            <a 
                              href="https://aistudio.google.com/api-keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              aistudio.google.com/api-keys <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <ol className="space-y-1.5 text-[11px] text-slate-400 list-decimal list-inside leading-relaxed pl-1">
                            {((t as any).documentation?.privacy?.geminiSteps || []).map((step: string, sIdx: number) => (
                              <li key={sIdx} className="marker:text-emerald-500 marker:font-bold">
                                <span className="text-slate-300 ml-1">{step}</span>
                              </li>
                            ))}
                          </ol>
                          {((t as any).documentation?.privacy?.geminiTip) && (
                            <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/90 rounded-xl p-2.5 mt-2.5 text-[10.5px] leading-relaxed">
                              {((t as any).documentation?.privacy?.geminiTip)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300">
                              {((t as any).documentation?.privacy?.openaiTitle) || "OpenAI API Key"}
                            </span>
                            <a 
                              href="https://platform.openai.com/api-keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              platform.openai.com <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <ol className="space-y-1.5 text-[11px] text-slate-400 list-decimal list-inside leading-relaxed pl-1">
                            {((t as any).documentation?.privacy?.openaiSteps || []).map((step: string, sIdx: number) => (
                              <li key={sIdx} className="marker:text-emerald-500 marker:font-bold">
                                <span className="text-slate-300 ml-1">{step}</span>
                              </li>
                            ))}
                          </ol>
                          {((t as any).documentation?.privacy?.openaiTip) && (
                            <div className="bg-amber-500/5 border border-amber-500/10 text-amber-400/90 rounded-xl p-2.5 mt-2.5 text-[10.5px] leading-relaxed">
                              {((t as any).documentation?.privacy?.openaiTip)}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
               </div>
              </div>

               <div className="pt-4 mt-4 border-t border-slate-800 shrink-0">
                 <button 
                   onClick={() => setShowSettings(false)}
                   className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                 >
                   {t.saveChanges}
                 </button>
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
                    { 
                      id: 'styles', 
                      label: (() => {
                        switch(language) {
                          case 'sk': return "Kinematografické štýly";
                          case 'de': return "Kinematografische Stile";
                          case 'fr': return "Styles cinématographiques";
                          case 'it': return "Stili cinematografici";
                          case 'es': return "Estilos cinematográficos";
                          case 'pt': return "Estilos cinematográficos";
                          case 'pl': return "Style filmowe";
                          default: return "Cinematic Styles";
                        }
                      })(), 
                      icon: Palette 
                    },
                    { id: 'privacy', label: (t as any).documentation?.tabs?.privacy || "Privacy & API", icon: Key },
                    { id: 'drive', label: (t as any).documentation?.tabs?.drive || "Google Drive", icon: Cloud },
                    { id: 'changelog', label: language === 'sk' ? "Changelog" : "Changelog", icon: History }
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

                  {/* Persistent Ko-fi box in sidebar (only on desktop) */}
                  <div className="hidden md:flex flex-col gap-3 mt-auto pt-4 border-t border-white/5">
                    <div className="p-3.5 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col gap-3 items-center text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {language === 'sk' ? "Podporte prácu" : "Support My Work"}
                      </span>
                      <a
                        href="https://ko-fi.com/C1W320AXYA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-slate-700 shadow-md active:scale-95 w-full max-w-[93px]"
                        title={(t as any).donateTooltip || "Support on Ko-fi"}
                      >
                        <img
                          src={kofiButtonImg}
                          alt="Support me on Ko-fi"
                          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          referrerPolicy="no-referrer"
                        />
                      </a>
                      <p className="text-[10px] text-slate-400 leading-relaxed px-1">
                        {language === 'sk'
                          ? "Vision Forge je nezávislý projekt. Prispejte na kávu pre vývojára!"
                          : "Vision Forge is an independent project. Buy me a coffee!"}
                      </p>
                    </div>
                  </div>
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
                    <div className="space-y-4 font-sans animate-fadeIn">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-400" />
                        {language === 'sk' ? "Prehľad všetkých funkcií" : "Full Features Directory"}
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                        {[
                          {
                            id: 1,
                            icon: Upload,
                            titleEn: "1. Dual Input Mode",
                            titleSk: "1. Duálny režim vstupu",
                            textEn: "Switch between 'Generate' (Text-to-Video where high-fidelity image is created using Imagen first) and 'Upload' (Image-to-Video mode). The aspect ratio of your upload is automatically detected and respected to ensure consistent motion.",
                            textSk: "Prepínajte medzi režimom 'Generovať' (Text-to-Video, kde sa podkladový obrázok najprv vytvorí pomocou Imagen 3) a režimom 'Nahrať' (Image-to-Video). Rozpoznanie pomeru strán nahraného obrázka chráni vaše diela pred deformáciou."
                          },
                          {
                            id: 2,
                            icon: Sparkles,
                            titleEn: "2. Wide Selection of Leading AI Models",
                            titleSk: "2. Široký výber špičkových modelov",
                            textEn: "Tailor projects with premium video models (Google Veo 3.1 Lite & 2.0) and high-quality image engines (Google Imagen 3, Gemini 3.1 Flash, OpenAI GPT Image series) depending on your needs.",
                            textSk: "Vyberte si špecializované video modely (Google Veo 3.1 Lite & 2.0) a obrazové motory (Google Imagen 3, Gemini 3.1 Flash, séria OpenAI GPT Image) presne pre požiadavky vášho projektu."
                          },
                          {
                            id: 3,
                            icon: Monitor,
                            titleEn: "3. Tailored Aspect Ratios",
                            titleSk: "3. Prispôsobené pomery strán",
                            textEn: "Perfectly prepared for any platform with layout presets like 16:9 (YouTube), 9:16 (TikTok/Reels), 1:1 (Square), 4:5 (Social feeds), 4:3 (Retro/Presentations), 21:9 (CinemaScope), and 3:2 (Photography).",
                            textSk: "Pripravte obsah pre ľubovoľnú platformu vďaka podpore formátov 16:9 (YouTube), 9:16 (TikTok/Reels), 1:1 (Štvorec), 4:5 (Sociálne siete), 4:3 (Retro), 21:9 (CinemaScope) a 3:2 (Fotografia)."
                          },
                          {
                            id: 4,
                            icon: Palette,
                            titleEn: "4. Creative & Cinematic Styles",
                            titleSk: "4. Kreatívne & kinematografické štýly",
                            textEn: "Transform design vibes with single-click pre-configured prompts including Cinematic, Photorealistic, Cyberpunk, Vintage Film, Anime Ghibli, Drone Shot, Macro, Film Noir, Disney/Pixar, 3D Digital, Minimalist, Documentary, and Surreal.",
                            textSk: "Premeňte estetiku vizuálov jedným kliknutím pomocou 13 predvolieb ako Kinematografický, Fotorealistický, Cyberpunk, Retro film, Anime Ghibli, Záber z dronu, Makro, Film Noir, Disney/Pixar, 3D render, Minimalistický, Dokumentárny a Surrealistický."
                          },
                          {
                            id: 5,
                            icon: Settings,
                            titleEn: "5. Advanced Video Parameters",
                            titleSk: "5. Pokročilé parametre videa",
                            textEn: "Control fine-grained generation variables such as custom duration, exact resolution modes (including intelligent Auto layout), and a hardware-stabilization simulation filter.",
                            textSk: "Prispôsobte si generovanie na mieru určením vlastnej dĺžky videa, presného rozlíšenia (vrátane inteligentného automatického režimu Auto) a povolením zabudovaného filtra hardvérovej stabilizácie snímok."
                          },
                          {
                            id: 6,
                            icon: Download,
                            titleEn: "6. Export and Download Controls",
                            titleSk: "6. Kontrola exportu a sťahovania",
                            textEn: "Convert renders into web-optimized, loopable GIFs via the integrated gifshot module with real-time FPS & crop presets, or download pristine .mp4 copies directly to your personal workspace.",
                            textSk: "Preveďte videosekvenciu na optimalizovanú opakujúcu sa animáciu .gif pomocou vstavaného modulu gifshot s nastavením FPS a orezov, alebo si stiahhnite originálny súbor .mp4 priamo do pamäte zariadenia."
                          },
                          {
                            id: 7,
                            icon: History,
                            titleEn: "7. Local History & Creative Vault",
                            titleSk: "7. Lokálna história a trezor",
                            textEn: "All generation details and media files are stored locally in the browser history. Instantly copy or restore accurate settings with the 'Use parameters' button.",
                            textSk: "Záznamy o každom úspešnom výtvore vrátane detailných nastavení sú bezpečne uložené v prehliadači. Pomocou tlačidla 'Použiť parametre' môžete konfigurácie bleskovo obnoviť."
                          },
                          {
                            id: 8,
                            icon: Cloud,
                            titleEn: "8. Google Drive Cloud Backup Integration",
                            titleSk: "8. Integrácia cloudového zálohovania Google Disk",
                            textEn: "Sync files in the background, set auto-uploads, explore assets in a dedicated Google Drive folder tab with options to view, download, or remove backups without leaving the application.",
                            textSk: "Zálohovajte obrázky i videá na pozadí, aktivujte automatické nahrávanie a organizujte svoje cloudové súbory v prehľadnom interaktívnom prieskumníkovi s možnosťami zobrazenia, stiahnutia či vymazania."
                          },
                          {
                            id: 9,
                            icon: Key,
                            titleEn: "9. Privacy & Token Safety",
                            titleSk: "9. Súkromie a bezpečnosť kľúčov",
                            textEn: "Highly secure local environment where your secret developer keys for Gemini and OpenAI are kept inside sandboxed localStorage and are never relayed to any external server.",
                            textSk: "Záruka absolútneho súkromia. Vaše osobné vývojárske kľúče pre Gemini a OpenAI sú uložené výhradne v lokálnom úložisku prehliadača (localStorage) a nikdy sa neodosielajú na externé servery."
                          }
                        ].map((feat) => {
                          const FeatIcon = feat.icon;
                          return (
                            <div key={feat.id} className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl flex gap-3 items-start hover:border-white/10 transition-colors">
                              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                                <FeatIcon className="w-4 h-4" />
                              </div>
                              <div className="space-y-1 flex-1">
                                <h4 className="font-bold text-white text-sm">
                                  {language === 'sk' ? feat.titleSk : feat.titleEn}
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {language === 'sk' ? feat.textSk : feat.textEn}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {false && (
                        <>
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
                        </>
                      )}
                    </div>
                  )}

                  {activeDocTab === 'models' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Film className="w-5 h-5 text-emerald-400" />
                        {language === 'sk' ? "Prehľad generatívnych modelov AI" : "Generative AI Models Overview"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {language === 'sk' 
                          ? "Vision Forge spája najpokročilejšie svetové modely pre tvorbu statických obrázkov a plynulých filmových záberov do jedného prostredia." 
                          : "Vision Forge brings together the world's most advanced image synthesis and cinematic motion models into a unified creative suite."}
                      </p>

                      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Video Models section */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                            {language === 'sk' ? "Video modely" : "Video Models"}
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <span className="font-bold text-emerald-400 text-sm">Google Veo 3.1 Lite</span>
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Google Video</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {language === 'sk' 
                                  ? "Najnovší, vysoko optimalizovaný video model vyvinutý spoločnosťou Google. Je určený na tvorbu ultra-plynulých filmových scén s presným fyzikálnym pohybom, verným nanášaním svetla a realistickým správaním kamery." 
                                  : "The latest high-performance optimized cinematic model by Google. Engineered for ultra-smooth motion synthesis, precise physical simulation, advanced scene lighting, and highly realistic camera sweeps."}
                              </p>
                            </div>

                            <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <span className="font-bold text-emerald-400 text-sm">Google Veo 2.0</span>
                                <span className="text-[9px] bg-slate-800 text-slate-400 border border-white/5 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Google Video</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {language === 'sk' 
                                  ? "Klasická preverená verzia stabilného video generátora. Vyniká vysokou spoľahlivosťou pohybových vzorcov, stálosťou kompozície medzi jednotlivými snímkami a čistými vizuálnymi prechodmi." 
                                  : "A robust, stable generation pipeline by Google. Highly reliable for maintaining consistent motion vectors, frame-to-frame integrity, and clean style coherence."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Image Models section */}
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                            {language === 'sk' ? "Obrazové modely (Generovanie podkladov)" : "Image Models (Base Generation)"}
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <span className="font-bold text-emerald-400 text-sm">Google Imagen 3</span>
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Google Image</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {language === 'sk' 
                                  ? "Vlajková loď medzi modelmi pre premenu textu na obraz. Vytvára neuveriteľne detailné, esteticky vyvážené a fotorealistické snímky s bezkonkurenčnou schopnosťou dodržať vami zadaný štýl a inštrukcie v prompte." 
                                  : "Google's flagship text-to-image engine. Generates hyper-detailed, aesthetically stunning, photorealistic imagery with masterful prompt coherence and outstanding texture fidelity."}
                              </p>
                            </div>

                            <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <span className="font-bold text-emerald-400 text-sm">Gemini 3.1 Flash Image</span>
                                <span className="text-[9px] bg-slate-800 text-slate-400 border border-white/5 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Google Image</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {language === 'sk' 
                                  ? "Bleskový a inteligentný model kombinujúci hlboké chápanie textového kontextu s okamžitým časom vykreslenia. Vynikajúci na rýchle iterácie, testovanie nápadov či promptov." 
                                  : "An incredibly fast, highly intelligent model combining deep context understanding with instant rendering speeds. Optimal for rapid prototype iterations and real-time conceptual testing."}
                              </p>
                            </div>

                            <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <span className="font-bold text-sky-400 text-sm">OpenAI GPT Image 1.5</span>
                                <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">OpenAI Image</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {language === 'sk' 
                                  ? "Prémiový grafický model od OpenAI s výnimočnou flexibilitou. Skvele interpretuje zložité umelecké zadania a je navrhnutý pre multi-subjektové kompozície, kde je potrebné držať presnú štruktúru scény." 
                                  : "A premium graphics model from OpenAI providing robust flexibility. Excels at interpreting rich artistic queries and complex scenarios with multiple distinct objects or actors."}
                              </p>
                            </div>

                            <div className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <span className="font-bold text-sky-400 text-sm">OpenAI GPT Image 2</span>
                                <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">OpenAI Image</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {language === 'sk' 
                                  ? "Najnovšia generácia obrazového motora OpenAI s pokročilým umeleckým cítením. Vyniká v abstraktných štýloch, digitálnom 3D umení a detailných kinematografických kompozíciách obohatených o komplexné vzorce." 
                                  : "OpenAI's latest generation imagery engine featuring deep artistic styling capabilities. Highly advanced in interpreting abstract concepts, digital 3D renders, and cinematic layouts with complex details."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'ratios' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-emerald-400" />
                        {language === 'sk' ? "Podporované pomery strán" : "Supported Aspect Ratios"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {language === 'sk' 
                          ? "Vision Forge ponúka plnú podporu širokej škály formátov pre akúkoľvek platformu. Nižšie nájdete prehľad ich optimálneho využitia:" 
                          : "Vision Forge offers native layouts tailored for every single display style. Below is an overview of the supported aspect ratios and their best-suited use cases:"}
                      </p>

                      <div className="grid grid-cols-1 gap-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                        {[
                          {
                            ratio: "16:9",
                            labelEn: "Widescreen / Landscape",
                            labelSk: "Na šírku / Širokouhlý",
                            descEn: "The absolute standard for global video sharing (YouTube), traditional projection layouts, computer monitor wallpapers, and cinema screens.",
                            descSk: "Hlavný štandard pre klasické videá na YouTube, firemné prezentácie, širokoúhle monitory a tradičné zobrazenie na šírku."
                          },
                          {
                            ratio: "9:16",
                            labelEn: "Portrait / Mobile",
                            labelSk: "Na výšku / Mobilný",
                            descEn: "Designed specifically for modern smartphones. Essential for high-reach social feeds including TikTok, Instagram Reels, YouTube Shorts, and Snapchat.",
                            descSk: "Určený špeciálne pre mobilné zariadenia držané na výšku. Nevyhnutný formát pre TikTok, Instagram Reels, YouTube Shorts a stories."
                          },
                          {
                            ratio: "1:1",
                            labelEn: "Square",
                            labelSk: "Štvorec / Symetrický",
                            descEn: "A perfectly balanced layout. Widely used for Instagram profile grids, artwork covers, digital badges, and central subject focus.",
                            descSk: "Dokonale vyvážený symetrický rozmer. Ideálny pre hlavný feed Instagramu, obaly albumov, profilové obrázky a stredové kompozície."
                          },
                          {
                            ratio: "4:5",
                            labelEn: "Social Feed Portrait",
                            labelSk: "Sociálny feed na výšku",
                            descEn: "A slightly elongated portrait view. Maximizes organic real-estate and view time on Instagram and Facebook scrolling feeds.",
                            descSk: "Predĺžený formát na výšku, ktorý zaberá maximum vertikálnej plochy v mobilnom feede na Facebooku a Instagrame."
                          },
                          {
                            ratio: "4:3",
                            labelEn: "Retro / Classic",
                            labelSk: "Retro / Klasický",
                            descEn: "The traditional broadcast standard. Great for analogue-style photography, nostalgic mockups, documentary themes, and legacy displays.",
                            descSk: "Tradičný rozmer starších televízorov a monitorov. Skvelý pre projekty s nostalgickým retro nádychom a analógovú fotografiu."
                          },
                          {
                            ratio: "21:9",
                            labelEn: "CinemaScope / Ultrawide",
                            labelSk: "CinemaScope / Ultra-širokouhlý",
                            descEn: "An immersive panoramic viewpoint bringing a grand film aesthetic to life. Perfect for cinematic landscapes and epic action sequences.",
                            descSk: "Rozmer kinosálu navodzujúci prémiový filmový dojem. Výborný pre majestátne panorámy krajiny a výpravné akčné scény."
                          },
                          {
                            ratio: "3:2",
                            labelEn: "Classic Photography",
                            labelSk: "Klasická fotografia",
                            descEn: "The golden standard derived from traditional 35mm film and modern DSLR sensors. Gives generations a timeless, professional fine-art look.",
                            descSk: "Osvedčený formát odvodený z 35mm kinofilmu a moderných zrkadloviek. Dodáva záberom nadčasový a profesionálny fotografický vzhľad."
                          }
                        ].map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 flex gap-4 items-center hover:border-white/10 transition-colors">
                            <div className="w-16 h-10 shrink-0 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center font-mono font-black text-sm text-emerald-400 shadow-inner select-none">
                              {item.ratio}
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-white text-xs block">
                                {language === 'sk' ? item.labelSk : item.labelEn}
                              </span>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {language === 'sk' ? item.descSk : item.descEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'styles' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Palette className="w-5 h-5 text-emerald-400" />
                        {(() => {
                          switch(language) {
                            case 'sk': return "Kinematografické štýly";
                            case 'de': return "Kinematografische Stile";
                            case 'fr': return "Styles cinématographiques";
                            case 'it': return "Stili cinematografici";
                            case 'es': return "Estilos cinematográficos";
                            case 'pt': return "Estilos cinematográficos";
                            case 'pl': return "Style filmowe";
                            default: return "Cinematic Styles";
                          }
                        })()}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {(() => {
                          switch(language) {
                            case 'sk': return "Vision Forge ponúka predkonfigurované kreatívne a filmové štýly. Jedným kliknutím premeníte vizuálnu atmosféru vašich diel pomocou pokročilých promptov.";
                            case 'de': return "Vision Forge bietet vorkonfigurierte kreative und filmische Stile. Ändern Sie die visuelle Atmosphäre Ihrer Kreation mit nur einem Klick.";
                            case 'fr': return "Vision Forge propose des styles créatifs et cinématographiques préconfigurés. Changez l'ambiance visuelle de vos créations d'un simple clic.";
                            case 'it': return "Vision Forge offre stili creativi e cinematografici preconfigurati. Cambia l'atmosfera visiva delle tue creazioni con un solo clic.";
                            case 'es': return "Vision Forge ofrece estilos cinematográficos y creativos preconfigurados. Cambie la atmósfera visual de sus creaciones con un solo clic.";
                            case 'pt': return "O Vision Forge oferece estilos criativos e cinematográficos pré-configurados. Mude a atmosfera visual das suas criações com um único clique.";
                            case 'pl': return "Vision Forge oferuje wstępnie skonfigurowane style kreatywne i filmowe. Zmień wizualną atmosferę swoich prac za pomocą jednego kliknięcia.";
                            default: return "Vision Forge offers pre-configured creative and cinematic styles. Change the visual atmosphere of your creations with single-click advanced prompts.";
                          }
                        })()}
                      </p>

                      <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                        {[
                          {
                            id: "none",
                            icon: Square,
                            label: {
                              sk: "Žiadny",
                              en: "None",
                              de: "Keiner",
                              fr: "Aucun",
                              it: "Nessuno",
                              es: "Ninguno",
                              pt: "Nenhum",
                              pl: "Brak"
                            },
                            desc: {
                              sk: "Žiadne dodatočné smerovanie umeleckého štýlu. Vykreslí sa presný surový popis, ktorý napíšete do promptu.",
                              en: "No additional artistic style direction. Renders the exact raw physical description written in your prompt.",
                              de: "Keine zusätzliche künstlerische Stilrichtung. Rendert die genaue physische Beschreibung aus Ihrem Prompt.",
                              fr: "Aucune direction artistique supplémentaire. Rend la description physique exacte écrite dans votre prompt.",
                              it: "Nessuna direzione artistica aggiuntiva. Genera l'esatta descrizione fisica grezza del prompt.",
                              es: "Sin dirección artística adicional. Renderiza exactamente la descripción escrita en el prompt.",
                              pt: "Sem direção de estilo artístico adicional. Renderiza a descrição exata gravada no seu prompt.",
                              pl: "Brak dodatkowego stylu artystycznego. Tworzy obraz na podstawie dokładnego opisu w monicie."
                            }
                          },
                          {
                            id: "cinematic",
                            icon: Film,
                            label: {
                              sk: "Kinematografický",
                              en: "Cinematic",
                              de: "Kinematografisch",
                              fr: "Cinématique",
                              it: "Cinematografico",
                              es: "Cinematográfico",
                              pt: "Cinematográfico",
                              pl: "Kinowy"
                            },
                            desc: {
                              sk: "Vysoký kontrast, dramatické osvetlenie, vzhľad natáčaný na 35mm film, anamorfné šošovky a profesionálne filmové ladenie farieb.",
                              en: "High contrast, dramatic lighting, shot on 35mm film aesthetic, anamorphic lenses, and professional cinematic color grading.",
                              de: "Hoher Kontrast, dramatische Beleuchtung, Ästhetik von 35mm-Film, anamorphe Linsen und professionelle Farbkorrektur.",
                              fr: "Contraste élevé, éclairage dramatique, esthétique film 35mm, objectifs anamorphiques et étalonnage des couleurs cinématographique.",
                              it: "Alto contrasto, illuminazione drammatica, estetica da pellicola 35mm, lenti anamorfiche e color grading professionale.",
                              es: "Alto contraste, iluminación dramática, estética de película de 35mm, lentes anamórficas y gradación de color profesional.",
                              pt: "Alto contraste, iluminação dramática, estética cinematográfica de 35mm, lentes anamórficas e gradação de cores profissional.",
                              pl: "Wysoki kontrast, oświetlenie dramatyczne, estetyka taśmy 35 mm, soczewki anamorficzne i profesjonalny grading filmowy."
                            }
                          },
                          {
                            id: "photorealistic",
                            icon: Camera,
                            label: {
                              sk: "Hyper-Realistický",
                              en: "Photorealistic",
                              de: "Fotorealistisch",
                              fr: "Photoréaliste",
                              it: "Fotorealistico",
                              es: "Fotorrealista",
                              pt: "Fotorrealista",
                              pl: "Fotorealistyczny"
                            },
                            desc: {
                              sk: "Mimoriadne detailný 8K záber so zameraním na jemné organické textúry, vyvážené sledovanie svetelných lúčov a ostré zaostrenie.",
                              en: "Ultra-detailed 8k resolution with focus on complex organic textures, sophisticated ray tracing, and surgically sharp focus.",
                              de: "Extrem detaillierte 8K-Auflösung mit Fokus auf organische Texturen, hochentwickeltes Raytracing und messerscharfen Fokus.",
                              fr: "Résolution 8K ultra-détaillée, textures organiques complexes, lancer de rayons (ray-tracing) avancé et mise au point ultra-nette.",
                              it: "Risoluzione 8K ultra-dettagliata con focus su trame complesse, ray tracing sofisticato e messa a fuoco incredibilmente nitida.",
                              es: "Resolución 8K ultradetallada enfocada en texturas orgánicas complejas, trazado de rayos sofisticado y enfoque nítido.",
                              pt: "Resolução 8k ultra-detalhada com foco em texturas complexas, ray tracing sofisticado e foco nítido.",
                              pl: "Niezwykle szczegółowa rozdzielczość 8K, z naciskiem na tekstury organiczne, zaawansowany ray tracing i ostrość obrazu."
                            }
                          },
                          {
                            id: "cyberpunk",
                            icon: Zap,
                            label: {
                              sk: "Cyberpunk",
                              en: "Cyberpunk",
                              de: "Cyberpunk",
                              fr: "Cyberpunk",
                              it: "Cyberpunk",
                              es: "Cyberpunk",
                              pt: "Cyberpunk",
                              pl: "Cyberpunk"
                            },
                            desc: {
                              sk: "Nočný futurizmus plný svietiacich neónov, sýtych ružovo-modrých tónov, syntetickej estetiky a pokročilej mestskej architektúry.",
                              en: "Nocturnal futurism packed with neon lights, saturated pink-blue color palettes, synthwave aesthetics, and high-tech urban architecture.",
                              de: "Nächtlicher Futurismus mit Neonlichtern, gesättigten Pink-Blau-Farbtönen, Synthwave-Ästhetik und Hightech-Architektur.",
                              fr: "Futurisme nocturne rempli de néons, palettes rose-bleu saturées, esthétique synthwave et architecture urbaine high-tech.",
                              it: "Futurismo notturno ricco di luci al neon, palette di colori rosa-blu saturi, estetica synthwave e architettura urbana high-tech.",
                              es: "Futurismo nocturno con luces de neón, paletas saturadas de color rosa y azul, estética synthwave y arquitectura urbana de alta tecnología.",
                              pt: "Futurismo noturno repleto de luzes de neon, paleta rosa-azulada saturada, estética synthwave e arquitetura urbana.",
                              pl: "Mroczna, futurystyczna noc z neonami, nasyconymi różowo-niebieskimi tonami, estetyką synthwave i nowoczesną architekturą."
                            }
                          },
                          {
                            id: "vintage",
                            icon: History,
                            label: {
                              sk: "Vintage Film",
                              en: "Vintage Film",
                              de: "Vintage-Film",
                              fr: "Film Vintage",
                              it: "Film Vintage",
                              es: "Cine Vintage",
                              pt: "Filme Vintage",
                              pl: "Film Vintage"
                            },
                            desc: {
                              sk: "Nostalgický retro záber imitujúci zrnitosť 16mm filmu, tlmené zemité odtiene s občasným pretekaním svetla a jemným chvením.",
                              en: "Nostalgic retro visuals simulating 16mm film grain, muted earthy color tones, organic light leaks, and analog screen flicker.",
                              de: "Nostalgische Retro-Visuals, die 16mm-Filmkorn, gedämpfte Erdtöne, organische Lichtlecks und analoges Flackern simulieren.",
                              fr: "Visuels rétro nostalgiques simulant le grain de film 16mm, tons de couleurs terreux atténués, fuites de lumière et scintillement analogique.",
                              it: "Immagini retrò nostalgiche che simulano la grana della pellicola 16mm, toni caldi attenuati, infiltrazioni di luce e sfarfallio analogico.",
                              es: "Visuales nostálgicos retro que simulan el grano de película de 16mm, tonos apagados, fugas de luz y fluctuación analógica.",
                              pt: "Visuais retrô nostálgicos simulando granulação de filme 16mm, tons de terra suaves, vazamentos de luz e cintilação analógica.",
                              pl: "Nostalgiczny obraz retro imitujący ziarno filmu 16 mm, stonowane barwy ziemi z efektami prześwietlenia i delikatnym drżeniem."
                            }
                          },
                          {
                            id: "anime",
                            icon: Palette,
                            label: {
                              sk: "Anime Ghibli",
                              en: "Anime Ghibli",
                              de: "Anime Ghibli",
                              fr: "Anime Ghibli",
                              it: "Anime Ghibli",
                              es: "Anime Ghibli",
                              pt: "Anime Ghibli",
                              pl: "Anime Ghibli"
                            },
                            desc: {
                              sk: "Pôvabný štýl ručne kreslenej tradičnej animácie inšpirovaný veľkolepým japonským štúdiom Ghibli s pastelovými a snovými scenériami.",
                              en: "Ethereal hand-drawn classic animation style inspired by Japan's iconic Studio Ghibli, featuring lush, dreamy pastel landscapes.",
                              de: "Ätherischer handgezeichneter klassischer Animationsstil, inspiriert von Studio Ghibli, mit üppigen, verträumten Pastelllandschaften.",
                              fr: "Style d'animation classique dessiné à la main inspiré par le Studio Ghibli, avec des paysages pastel luxuriants et idylliques.",
                              it: "Stile di animazione classica disegnato a mano ispirato allo Studio Ghibli, con lussureggianti e sognanti paesaggi pastello.",
                              es: "Estilo de animación clásico dibujado a mano inspirado por el icónico Studio Ghibli, con paisajes pastel exuberantes y de ensueño.",
                              pt: "Estilo de animação clássico desenhado à mão, inspirado no Studio Ghibli, com paisagens pastel exuberantes e sonhadoras.",
                              pl: "Uroczy styl ręcznie rysowanej animacji inspirowany Studio Ghibli, z pastelowymi, sennymi krajobrazami."
                            }
                          },
                          {
                            id: "drone",
                            icon: Wind,
                            label: {
                              sk: "Dronový Záber",
                              en: "Drone Shot",
                              de: "Drohnenaufnahme",
                              fr: "Prise de vue par drone",
                              it: "Ripresa con Drone",
                              es: "Toma con Dron",
                              pt: "Plano de Drone",
                              pl: "Ujęcie z drona"
                            },
                            desc: {
                              sk: "Letecká panoramatická perspektíva s plynulým kĺzavým obletom kamery, zachycujúca impozantné rozľahlé horizonty a prostredie.",
                              en: "Aerial wide-angle sweeping perspective capturing grand horizons, dynamic geographical scale, and smooth hovering motion.",
                              de: "Luftbild-Weitwinkelperspektive, die weite Horizonte, dynamische geografische Maßstäbe und sanfte Schwebefunktionen erfasst.",
                              fr: "Perspective de survol aérien à grand angle capturant d'immenses horizons, une échelle géographique dynamique et un mouvement fluide.",
                              it: "Prospettiva aerea panoramica ad ampio raggio con movimento fluido, utile per catturare orizzonti imponenti e maestosi.",
                              es: "Perspectiva panorámica aérea que captura horizontes espectaculares y una escala geográfica con un movimiento de planeo fluido.",
                              pt: "Perspectiva panorâmica aérea de grande escala, com movimentos de voo suaves capturando horizontes imponentes.",
                              pl: "Panoramiczna kamera z lotu ptaka z płynnym przelotem, pokazująca majestatyczne horyzonty i krajobrazy."
                            }
                          },
                          {
                            id: "macro",
                            icon: Search,
                            label: {
                              sk: "Makro Detail",
                              en: "Macro Detail",
                              de: "Makro-Detail",
                              fr: "Détail Macro",
                              it: "Dettaglio Macro",
                              es: "Detalle Macro",
                              pt: "Detalhe Macro",
                              pl: "Detal Makro"
                            },
                            desc: {
                              sk: "Extrémny detail zameraný na mikroskopické prvky s úzkou hĺbkou ostrosti, výrazným rozostreným pozadím a prirodzeným mäkkým svetlom.",
                              en: "Extreme close-up prioritizing microscopic details, ultra-shallow depth of field with beautiful bokeh, and soft organic lighting.",
                              de: "Extreme Nahaufnahme mit Priorisierung mikroskopischer Details, flacher Tiefenschärfe mit wunderschönem Bokeh und weichem Licht.",
                              fr: "Gros plan extrême privilégiant les détails microscopiques, profondeur de champ ultra-faible avec un superbe bokeh et lumière douce.",
                              it: "Inquadratura ravvicinata estrema che enfatizza dettagli microscopici, profondità di campo ridotta con splendido bokeh e luce morbida.",
                              es: "Primer plano extremo que prioriza detalles microscópicos, profundidad de campo reducida con bokeh y luz natural suave.",
                              pt: "Macro extrema com foco em detalhes microscópicos, profundidade de campo muito reduzida com efeito de bokeh suave.",
                              pl: "Ekstremalne zbliżenie na mikroskopijne krawędzie z małą głębią ostrości, rozmytym tłem (bokeh) i miękkim światłem naturalnym."
                            }
                          },
                          {
                            id: "noir",
                            icon: Moon,
                            label: {
                              sk: "Film Noir",
                              en: "Film Noir",
                              de: "Film Noir",
                              fr: "Film Noir",
                              it: "Film Noir",
                              es: "Cine Noir",
                              pt: "Filme Noir",
                              pl: "Film Noir"
                            },
                            desc: {
                              sk: "Čiernobiela detektívna dráma s hlbokými tieňmi, vysokým kontrastom, dymovou atmosférou a tajomnou retro štylizáciou.",
                              en: "Gritty black and white cinematic composition with steep dramatic shadows, high contrast gradients, smoky textures, and mystery.",
                              de: "Dramatische Schwarz-Weiß-Komposition mit tiefen Schatten, hohem Kontrast, rauchiger Atmosphäre und geheimnisvoller Retro-Ästhetik.",
                              fr: "Composition cinématographique brute en noir et blanc, ombres marquées, contraste élevé, fumée ambiante et tension mystérieuse.",
                              it: "Composizione cinematografica in bianco e nero con ombre nette, contrasto elevatissimo, fumo d'atmosfera ed estetica misteriosa.",
                              es: "Composición cinematográfica en blanco y negro con sombras dramáticas marcadas, alto contraste, texturas nebulosas y misterio.",
                              pt: "Composição monocromática dramática com sombras marcadas sob alto contraste, névoa e atmosfera intrigante de mistério.",
                              pl: "Czarno-biała klasyka z głębokimi cieniami, wysokim kontrastem, dymną atmosferą i aurą tajemniczości."
                            }
                          },
                          {
                            id: "disney-animation",
                            icon: Sparkles,
                            label: {
                              sk: "Disney Animácia",
                              en: "Disney/Pixar",
                              de: "Disney-Animation",
                              fr: "Animation Disney",
                              it: "Animazione Disney",
                              es: "Animación Disney",
                              pt: "Animação Disney",
                              pl: "Animacja Disney"
                            },
                            desc: {
                              sk: "Moderná hravá 3D animácia v štýle animovaných filmov od štúdií Disney a Pixar s veľkými výraznými očami a dokonalým mäkkým tieňovaním.",
                              en: "Modern, playful 3D animation style inspired by Disney & Pixar, characterized by expressive features, soft lighting, and vibrant tones.",
                              de: "Moderner, verspielter 3D-Animationsstil, inspiriert von Disney und Pixar, mit ausdrucksstarken Figuren und weichem Rendering.",
                              fr: "Style d'animation 3D moderne et joyeux inspiré par Disney et Pixar, avec des personnages expressifs et un rendu doux.",
                              it: "Stile moderno di animazione 3D ispirato a Disney e Pixar, caratterizzato da tratti espressivi e gradazioni di colore vivaci.",
                              es: "Estilo moderno de animación 3D inspirado en Disney y Pixar, caracterizado por personajes expresivos e iluminación suave.",
                              pt: "Estilo de animação 3D moderno e carismático inspirado na Disney & Pixar, com feições expressivas e superfícies polidas.",
                              pl: "Współczesna, kolorowa animacja 3D w stylu produkcji Disney i Pixar z dużymi, ekspresyjnymi oczami i gładkim cieniowaniem."
                            }
                          },
                          {
                            id: "abstract",
                            icon: Layers,
                            label: {
                              sk: "Abstraktný",
                              en: "Abstract",
                              de: "Abstrakt",
                              fr: "Abstrait",
                              it: "Astratto",
                              es: "Abstracto",
                              pt: "Abstrato",
                              pl: "Abstrakcyjny"
                            },
                            desc: {
                              sk: "Abstraktný a nekonvenčný umelecký záber spájajúci fluidné prelievajúce sa tvary, geometriu a dynamické umelecké farebné prechody.",
                              en: "Conceptual and avant-garde non-representational art merging fluid physical shapes, surreal geometry, and vibrant pigments.",
                              de: "Konzeptionelle und avantgardistische Kunst, die flüssige Formen, surreale Geometrie und lebhafte Pigmente vereint.",
                              fr: "Art abstrait conceptuel fusionnant des formes fluides, une géométrie surréelle et des pigments de couleurs saisissants.",
                              it: "Arte astratta concettuale che unisce forme fluide, geometrie insolite e combinazioni cromatiche avanguardistiche.",
                              es: "Arte conceptual y vanguardista no representativo que fusiona formas físicas fluidas, geometría surrealista y pigmentos expresivos.",
                              pt: "Arte abstrata não representativa mesclando formas fluidas, geometria surrealista e cores de vanguarda.",
                              pl: "Abstrakcyjny i niekonwencjonalny kierunek artystyczny łączący płynne formy, geometrię i nasycone barwy."
                            }
                          },
                          {
                            id: "minimalist",
                            icon: Minimize,
                            label: {
                              sk: "Minimalistický",
                              en: "Minimalist",
                              de: "Minimal",
                              fr: "Minimaliste",
                              it: "Minimale",
                              es: "Minimalista",
                              pt: "Minimalista",
                              pl: "Minimalistyczny"
                            },
                            desc: {
                              sk: "Dokonalá čistota kompozície eliminujúca rušivé vplyvy pomocou výrazného prázdnego priestoru a obmedzenej, no elegantnej palety.",
                              en: "Pristine visual composure eliminating noise through deliberate negative space, elegant minimal layouts, and highly restricted palettes.",
                              de: "Makellose visuelle Gelassenheit, die Rauschen durch bewussten Freiraum, elegantes Design und eine sehr begrenzte Palette eliminiert.",
                              fr: "Sobriété visuelle éliminant tout bruit via un espace négatif délibéré, des mises en page minimales et des palettes très limitées.",
                              it: "Estrema pulizia visiva che riduce al minimo il rumore visivo sfruttando lo spazio vuoto negativo e combinazioni cromatiche sobrie.",
                              es: "Compostura visual que elimina el ruido a través del uso de espacio negativo y paletas de colores refinadas y limitadas.",
                              pt: "Limpeza visual intencional fundamentada em espaço negativo generoso, contornos elegantes e paleta de cores limitada.",
                              pl: "Czystość kompozycji eliminująca zbędne szczegóły dzięki dużej przestrzeni ujemnej i stonowanej, eleganckiej palecie barw."
                            }
                          },
                          {
                            id: "documentary",
                            icon: Tv,
                            label: {
                              sk: "Dokumentárny",
                              en: "Documentary",
                              de: "Dokumentarfilm",
                              fr: "Documentaire",
                              it: "Documentario",
                              es: "Documental",
                              pt: "Documentário",
                              pl: "Dokumentalny"
                            },
                            desc: {
                              sk: "Autentický, realistický filmový záber, verná ručná kamera z pohľadu prvej osoby, prirodzené svetlo a živé bezprostredné scény.",
                              en: "Authentic first-person handheld aesthetic with raw, unedited camera frames, natural environments, and candid spontaneous moments.",
                              de: "Authentische Handkamera-Ästhetik aus der Ich-Perspektive mit unbearbeiteten Rahmen, natürlichem Licht und spontanen Momenten.",
                              fr: "Esthétique de caméra portable authentique en vue subjective, lumière naturelle brute et moments spontanés réalistes.",
                              it: "Estetica documentaristica realistica ripresa a mano, caratterizzata da luce naturale e cattura di attimi autentici e spontanei.",
                              es: "Estética realista de cámara en mano, con luz natural y captura espontánea de situaciones cotidianas y auténticas.",
                              pt: "Estética realista de câmera na mão com luz natural crua, transmitindo autenticidade e capturando instantes espontâneos.",
                              pl: "Autentyczny styl reportażowy z ręki z surowym kadrowaniem, naturalnym oświetleniem i szczerymi, żywymi momentami."
                            }
                          },
                          {
                            id: "surrealist",
                            icon: Cloud,
                            label: {
                              sk: "Surrealistický",
                              en: "Surrealist",
                              de: "Surrealistisch",
                              fr: "Surréaliste",
                              it: "Surrealista",
                              es: "Surrealista",
                              pt: "Surrealista",
                              pl: "Surrealistyczny"
                            },
                            desc: {
                              sk: "Bizarná atmosféra inšpirovaná snami a dielom Salvadora Dalího plná roztápajúcich sa objektov a priestorovo nemožnej geometrie.",
                              en: "Dreamlike subconscious environments directly inspired by Salvador Dalí, showcasing melting objects and impossible geometry.",
                              de: "Traumhafte Umgebungen, direkt inspiriert von Salvador Dalí, mit schmelzenden Objekten und unmöglicher Geometrie.",
                              fr: "Environnements de rêve inspirés de Salvador Dalí, présentant des objets fondants et une géométrie spatiale impossible.",
                              it: "Atmosfere oniriche ispirate a Salvador Dalì con oggetti fluttuanti o deformati e geometrie spazialmente impossibili.",
                              es: "Entornos oníricos del subconsciente directamente inspirados en Salvador Dalí, con objetos derretidos y geometría imposible.",
                              pt: "Ambientes oníricos e surreais inspirados em Salvador Dalí, exibindo objetos deformados e impossibilidades geométricas.",
                              pl: "Sennikowa, intrygująca atmosfera inspirowana Salvadorem Dalí z roztapiającymi się obiektami i niemożliwą geometrią."
                            }
                          },
                          {
                            id: "digital-art",
                            icon: Box,
                            label: {
                              sk: "3D Digitálne Umenie",
                              en: "3D Digital Art",
                              de: "3D-Digitalgrafik",
                              fr: "Art numérique 3D",
                              it: "Grafica 3D",
                              es: "Arte digital 3D",
                              pt: "Arte Digital 3D",
                              pl: "Grafika 3D"
                            },
                            desc: {
                              sk: "Moderný 3D render s využitím filmového volumetrického svetla z prostredia Unreal Engine 5 s krištáľovo ostrým zaostrením.",
                              en: "High-end 3D graphics rendered with cinematic volumetric light in Octane or Unreal Engine 5, boasting razor-sharp focal layers.",
                              de: "High-End-3D-Grafik, gerendert mit filmischem volumetrischem Licht in Unreal Engine 5, mit extrem scharfen Fokusebenen.",
                              fr: "Graphismes 3D haut de gamme rendus avec une lumière volumétrique sous Octane ou Unreal Engine 5, avec mise au point ultra-précise.",
                              it: "Grafica 3D ad altissimo livello con illuminazione volumetrica cinematografica in Unreal Engine 5 e messa a fuoco nitidissima.",
                              es: "Gráficos 3D avanzados renderizados con luz volumétrica cinematográfica en Unreal Engine 5, con nitidez de enfoque extrema.",
                              pt: "Arte digital tridimensional realista gerada no Unreal Engine 5 ou Octane, com iluminação volumétrica e nitidez soberba.",
                              pl: "Zaawansovaný render 3D z filmowym oświetleniem wolumetrycznym z silników typu Unreal Engine 5 o niesamowitej ostrości szczegółów."
                            }
                          }
                        ].map((item, idx) => {
                          const StyleIcon = item.icon;
                          const selectedLabel = item.label[language as string] || item.label['en'];
                          const selectedDesc = item.desc[language as string] || item.desc['en'];
                          return (
                            <div key={idx} className="p-3.5 bg-slate-950/45 rounded-2xl border border-white/5 flex gap-4 items-center hover:border-white/10 transition-colors">
                              <div className="w-12 h-12 shrink-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                <StyleIcon className="w-5 h-5" />
                              </div>
                              <div className="space-y-1 col-span-3">
                                <span className="font-bold text-white text-xs block">
                                  {selectedLabel}
                                </span>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                  {selectedDesc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'privacy' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Key className="w-5 h-5 text-emerald-400" />
                        {(t as any).documentation?.privacy?.title || "Privacy, Vault & Safety Rules"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
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

                      {/* Detailed Key Acquisition Guide */}
                      <div className="mt-6 border-t border-white/5 pt-6 space-y-4">
                        <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          {(t as any).documentation?.privacy?.guideTitle || "How to Obtain API Keys"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Gemini Box */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                {((t as any).documentation?.privacy?.geminiTitle) || "Google Gemini API Key"}
                              </span>
                              <a 
                                href="https://aistudio.google.com/api-keys" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                              >
                                {((t as any).documentation?.privacy?.linkText) || "Get Key"} <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                              {(((t as any).documentation?.privacy?.geminiSteps) || []).map((step: string, sIdx: number) => (
                                <li key={sIdx} className="flex gap-2">
                                  <span className="text-emerald-500 font-bold font-mono">{sIdx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                            {((t as any).documentation?.privacy?.geminiTip) && (
                              <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/90 rounded-xl p-3 text-[10.5px] leading-relaxed mt-2">
                                {((t as any).documentation?.privacy?.geminiTip)}
                              </div>
                            )}
                          </div>

                          {/* OpenAI Box */}
                          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                {((t as any).documentation?.privacy?.openaiTitle) || "OpenAI API Key (Optional)"}
                              </span>
                              <a 
                                href="https://platform.openai.com/api-keys" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                              >
                                {((t as any).documentation?.privacy?.linkText) || "Get Key"} <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                              {(((t as any).documentation?.privacy?.openaiSteps) || []).map((step: string, sIdx: number) => (
                                <li key={sIdx} className="flex gap-2">
                                  <span className="text-emerald-500 font-bold font-mono">{sIdx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                            {((t as any).documentation?.privacy?.openaiTip) && (
                              <div className="bg-amber-500/5 border border-amber-500/10 text-amber-400/90 rounded-xl p-3 text-[10.5px] leading-relaxed mt-2">
                                {((t as any).documentation?.privacy?.openaiTip)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'drive' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-emerald-400" />
                        {(t as any).documentation?.drive?.title || "Google Drive Cloud Backup"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {(t as any).documentation?.drive?.intro || ""}
                      </p>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-emerald-400 text-sm mb-1">{(t as any).documentation?.drive?.item1Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.drive?.item1Text || ""}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-emerald-400 text-sm mb-1">{(t as any).documentation?.drive?.item2Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.drive?.item2Text || ""}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-emerald-400 text-sm mb-1">{(t as any).documentation?.drive?.item3Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.drive?.item3Text || ""}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                          <h4 className="font-bold text-emerald-400 text-sm mb-1">{(t as any).documentation?.drive?.item4Title || ""}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {(t as any).documentation?.drive?.item4Text || ""}
                          </p>
                        </div>

                        {((t as any).documentation?.drive?.item5Title) && (
                          <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
                            <h4 className="font-bold text-emerald-400 text-sm mb-1">{(t as any).documentation?.drive?.item5Title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {(t as any).documentation?.drive?.item5Text}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeDocTab === 'changelog' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-emerald-400" />
                            {language === 'sk' ? "História verzií" : "Application Changelog"}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                            {language === 'sk' 
                              ? "Sledujte najnovšie vylepšenia, aktualizácie a vydania aplikácie Vision Forge." 
                              : "Track the latest improvements, fixes, and release logs of the Vision Forge creative studio."}
                          </p>
                        </div>
                        
                        <button
                          id="btn-trigger-changelog"
                          disabled={isChangelogLoading}
                          onClick={() => fetchChangelog(false)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 cursor-pointer transition-all hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isChangelogLoading ? "animate-spin" : ""}`} />
                          {isChangelogLoading 
                            ? (language === 'sk' ? "Načítavam súbor..." : "Loading changelog...") 
                            : (language === 'sk' ? "Skontrolovať zmeny" : "Check for Changes")}
                        </button>
                      </div>

                      {changelogMessage && (
                        <div id="changelog-alert-message" className="p-3 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between gap-2 animate-fadeIn">
                          <span>
                            {typeof changelogMessage === 'object' && changelogMessage !== null
                              ? (changelogMessage[language] || changelogMessage.en || "")
                              : changelogMessage}
                          </span>
                          <button 
                            id="btn-close-changelog-msg"
                            className="text-slate-500 hover:text-white font-bold" 
                            onClick={() => setChangelogMessage(null)}
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {isChangelogLoading ? (
                        <div className="space-y-4 py-8 text-center text-slate-400">
                          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
                          <p className="text-xs">
                            {language === 'sk' ? "Načítavam históriu verzií..." : "Loading version history..."}
                          </p>
                        </div>
                      ) : changelogs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs">
                          {language === 'sk' ? "Nenašli sa žiadne verzie." : "No release entries found."}
                        </div>
                      ) : (
                        <div className="space-y-6 pt-2">
                          {changelogs.map((entry, idx) => {
                            const isCurrent = idx === 0;
                            const langField = "changes" + language.charAt(0).toUpperCase() + language.slice(1);
                            const bullets = (entry as any)[langField] || entry.changesEn;
                            return (
                              <div key={entry.version} className="relative pl-6 border-l-2 border-slate-800/80 space-y-2">
                                <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-[5px] ring-4 ring-slate-950 ${isCurrent ? "bg-emerald-400 ring-emerald-950" : "bg-slate-700 ring-slate-950"}`} />
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-sm font-bold ${isCurrent ? "text-white" : "text-slate-400"}`}>v{entry.version}</span>
                                  {isCurrent && (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                                      {language === 'sk' ? "Aktuálna verzia" : "Current Release"}
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-500 font-mono">{entry.date}</span>
                                </div>
                                
                                {bullets && bullets.length > 0 ? (
                                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                                    {bullets.map((bullet: string, bIdx: number) => {
                                      const boldMatch = bullet.match(/^\*\*(.*?)\*\*(.*)/);
                                      return (
                                        <li key={bIdx} className="leading-relaxed">
                                          {boldMatch ? (
                                            <>
                                              <strong className="text-slate-200">{boldMatch[1]}</strong>
                                              <span className="text-slate-300">{boldMatch[2]}</span>
                                            </>
                                          ) : (
                                            <span className="text-slate-300">{bullet}</span>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-slate-500 leading-relaxed italic">
                                    {language === 'sk' ? "Údržbové vydanie a menšie vylepšenia stability." : "General maintenance release and minor stability improvements."}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
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
        <header className="flex flex-col gap-6 relative border-b border-white/5 pb-10 pt-2">
          {/* Top Row with Badge and Ko-fi Button */}
          <div className="flex justify-between items-start w-full gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Video className="w-4 h-4" />
              {t.heroBadge}
            </div>
            {/* Support button shrunk by 1/3 (w-28 sm:w-32) */}
            <a
              href="https://ko-fi.com/C1W320AXYA"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 transition-all duration-300 hover:border-slate-700 shadow-md active:scale-95 w-28 sm:w-32 shrink-0"
              title={(t as any).donateTooltip || "Support on Ko-fi"}
            >
              <img
                src={kofiButtonImg}
                alt="Support me on Ko-fi"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4 w-full">
              <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent font-display leading-tight py-2 flex flex-wrap items-center gap-4 sm:gap-6">
                <img
                  src={appLogoImg}
                  alt="Vision Forge Logo"
                  className="w-14 h-14 md:w-24 md:h-24 rounded-2xl border border-white/10 shadow-2xl object-cover ring-4 ring-emerald-500/10 hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <span>{t.title}</span>
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
                                {["5s", "6s", "8s"].map((dur) => (
                                  <button 
                                    key={dur}
                                    onClick={() => {
                                      setVideoDuration(dur);
                                      setIsCustomDuration(false);
                                    }}
                                    className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all duration-300 ${!isCustomDuration && videoDuration === dur ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" : "text-slate-500 hover:text-slate-300"}`}
                                  >
                                    {dur}
                                  </button>
                                ))}
                              </div>
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
                        className="w-full h-full relative"
                      >
                         <video 
                           src={videoUrl} 
                           controls 
                           autoPlay 
                           loop 
                           className="w-full h-full object-cover"
                         />

                         {/* Telemetry Overlay Panel */}
                         {showMetadataOverlay && activeVideoMetadata && (
                           <motion.div 
                             initial={{ opacity: 0, x: -20, scale: 0.95 }}
                             animate={{ opacity: 1, x: 0, scale: 1 }}
                             exit={{ opacity: 0, x: -20, scale: 0.95 }}
                             className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-[240px] sm:max-w-[280px] bg-slate-950/80 border border-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl space-y-2 text-left pointer-events-auto select-none overflow-hidden z-20"
                           >
                             <div className="flex items-center gap-2 border-b border-white/5 pb-1.5 mb-1.5">
                               <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                 {dashboardTranslations[language as keyof typeof dashboardTranslations]?.telemetryTitle || dashboardTranslations.en.telemetryTitle}
                               </span>
                             </div>

                             <div className="space-y-1.5">
                               {/* Model */}
                               <div className="flex justify-between items-center gap-4">
                                 <span className="text-[9px] text-slate-400 font-semibold uppercase">
                                   {dashboardTranslations[language as keyof typeof dashboardTranslations]?.modelName || dashboardTranslations.en.modelName}
                                 </span>
                                 <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                   {activeVideoMetadata.model}
                                 </span>
                               </div>

                               {/* Generation Duration */}
                               {activeVideoMetadata.generationDuration !== undefined && (
                                 <div className="flex justify-between items-center gap-4">
                                   <span className="text-[9px] text-slate-400 font-semibold uppercase">
                                     {dashboardTranslations[language as keyof typeof dashboardTranslations]?.genDuration || dashboardTranslations.en.genDuration}
                                   </span>
                                   <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                                     <Clock className="w-3 h-3" />
                                     {activeVideoMetadata.generationDuration} {dashboardTranslations[language as keyof typeof dashboardTranslations]?.sec || dashboardTranslations.en.sec}
                                   </span>
                                 </div>
                               )}

                               {/* Aspect Ratio */}
                               {activeVideoMetadata.aspectRatio && (
                                 <div className="flex justify-between items-center gap-4">
                                   <span className="text-[9px] text-slate-400 font-semibold uppercase">
                                     {dashboardTranslations[language as keyof typeof dashboardTranslations]?.aspectRatio || dashboardTranslations.en.aspectRatio}
                                   </span>
                                   <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-200">
                                     {activeVideoMetadata.aspectRatio}
                                   </span>
                                 </div>
                               )}

                               {/* Resolution */}
                               {activeVideoMetadata.resolution && (
                                 <div className="flex justify-between items-center gap-4">
                                   <span className="text-[9px] text-slate-400 font-semibold uppercase">
                                     {dashboardTranslations[language as keyof typeof dashboardTranslations]?.resolution || dashboardTranslations.en.resolution}
                                   </span>
                                   <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-slate-200">
                                     {activeVideoMetadata.resolution}
                                   </span>
                                 </div>
                               )}

                               {/* Video Length */}
                               {activeVideoMetadata.duration && (
                                 <div className="flex justify-between items-center gap-4">
                                   <span className="text-[9px] text-slate-400 font-semibold uppercase">
                                     {dashboardTranslations[language as keyof typeof dashboardTranslations]?.videoLength || dashboardTranslations.en.videoLength}
                                   </span>
                                   <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-slate-200">
                                     {activeVideoMetadata.duration}
                                   </span>
                                 </div>
                               )}

                               {/* Style */}
                               {activeVideoMetadata.style && (
                                 <div className="flex justify-between items-center gap-4">
                                   <span className="text-[9px] text-slate-400 font-semibold uppercase">
                                     {dashboardTranslations[language as keyof typeof dashboardTranslations]?.style || dashboardTranslations.en.style}
                                   </span>
                                   <span className="text-[10px] font-medium text-slate-200 truncate max-w-[100px] sm:max-w-[120px]" title={activeVideoMetadata.style}>
                                     {activeVideoMetadata.style}
                                   </span>
                                 </div>
                               )}

                               {/* Prompt */}
                               {activeVideoMetadata.prompt && (
                                 <div className="border-t border-white/5 pt-1.5 mt-1 text-left">
                                   <span className="text-[9px] text-slate-500 font-semibold uppercase block mb-0.5">
                                     {dashboardTranslations[language as keyof typeof dashboardTranslations]?.promptTitle || dashboardTranslations.en.promptTitle}
                                   </span>
                                   <p className="text-[9.5px] leading-relaxed text-slate-300 italic line-clamp-2" title={activeVideoMetadata.prompt}>
                                     "{activeVideoMetadata.prompt}"
                                   </p>
                                 </div>
                               )}

                               {/* Timestamp */}
                               <div className="flex justify-between items-center gap-4 border-t border-white/5 pt-1.5 mt-1.5">
                                 <span className="text-[9px] text-slate-500 font-semibold uppercase">
                                   {dashboardTranslations[language as keyof typeof dashboardTranslations]?.timestamp || dashboardTranslations.en.timestamp}
                                 </span>
                                 <span className="text-[9px] font-mono text-slate-400">
                                   {new Date(activeVideoMetadata.timestamp).toLocaleTimeString()}
                                 </span>
                               </div>
                             </div>
                           </motion.div>
                         )}

                         <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 sm:gap-3 z-20">
                            {activeVideoMetadata && (
                              <button
                                type="button"
                                onClick={() => setShowMetadataOverlay(!showMetadataOverlay)}
                                className={`p-3 sm:p-4 rounded-2xl transition-all backdrop-blur-xl border border-white/20 shadow-2xl cursor-pointer ${
                                  showMetadataOverlay 
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
                                    : 'bg-white/10 hover:bg-white text-white hover:text-black'
                                }`}
                                title={dashboardTranslations[language as keyof typeof dashboardTranslations]?.toggleTelemetry || dashboardTranslations.en.toggleTelemetry}
                              >
                                <HelpCircle className="w-5 h-5" />
                              </button>
                            )}

                            <a 
                              href={videoUrl} 
                              download="nature_sequence.mp4"
                              className="p-3 sm:p-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl transition-all backdrop-blur-xl border border-white/20 shadow-2xl group/btn cursor-pointer"
                              title="Download MP4"
                            >
                              <Video className="w-5 h-5" />
                            </a>
                            <button
                              onClick={handleExportGif}
                              disabled={isExportingGif}
                              className="p-3 sm:p-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl transition-all backdrop-blur-xl border border-white/20 shadow-2xl disabled:opacity-50 group/btn cursor-pointer"
                              title="Generate GIF"
                            >
                              {isExportingGif ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileImage className="w-5 h-5" />}
                            </button>

                            {gifUrl && (
                              <a 
                                href={gifUrl} 
                                download="nature_sequence.gif"
                                className="p-3 sm:p-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
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
          {/* Header block with title & Clear buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 text-emerald-400">
                 <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">{(t as any).historyTitle}</h2>
                <p className="text-slate-500 text-sm">Review your creations, download assets, or back them up securely.</p>
              </div>
            </div>
            {history.length > 0 && activeHistoryTab === 'local' && (
              <button 
                onClick={clearHistory}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold w-full md:w-auto"
              >
                <Trash2 className="w-4 h-4" />
                {(t as any).clearHistory}
              </button>
            )}
          </div>

          {/* Google Drive Connection & Custom Configuration Banner */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-white/5 rounded-3xl p-6 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-3xl shadow-xl shadow-slate-950/40">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex-shrink-0">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Google Drive Cloud
                </span>
                <h3 className="text-lg font-bold text-white flex flex-wrap items-center gap-2 min-w-0">
                  {driveUser ? (
                    <span className="truncate">
                      {dt.driveConnectedAs} <span className="text-blue-400 font-extrabold">{driveUser.displayName || 'User'}</span>
                    </span>
                  ) : dt.driveConnectBtn}
                </h3>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  {dt.driveDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto flex-shrink-0">
              {/* Auto backup Toggle */}
              {driveUser && (
                <div className="flex items-center justify-between gap-6 px-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl sm:w-auto">
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">{dt.driveAutoBackup}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-none">{dt.driveAutoBackupDesc}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !autoUploadToDrive;
                      setAutoUploadToDrive(newVal);
                      localStorage.setItem('drive_auto_upload', newVal ? 'true' : 'false');
                    }}
                    className={`w-10 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${autoUploadToDrive ? 'bg-blue-500' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoUploadToDrive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              )}

              {/* Login/Disconnect Actions */}
              {driveUser ? (
                <div className="flex items-center justify-between gap-3 bg-white/5 xl:bg-transparent rounded-2xl p-2.5 xl:p-0">
                  <div className="flex items-center gap-2 mr-3 flex-shrink-0">
                    {driveUser.photoURL && (
                      <img src={driveUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-blue-500/25 shadow-inner referrerPolicy='no-referrer'" />
                    )}
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 font-bold leading-none">Status</p>
                      <p className="text-[11px] text-emerald-400 font-bold mt-0.5">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {driveFolderId && (
                      <a
                        href={`https://drive.google.com/drive/folders/${driveFolderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-blue-500/20 border border-blue-500/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {dt.driveOpenFolderBtn || "Open Folder"}
                      </a>
                    )}
                    <button
                      onClick={handleDriveLogout}
                      className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold text-xs transition-all whitespace-nowrap"
                    >
                      {dt.driveDisconnect}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center sm:items-end gap-2.5 w-full sm:w-auto">
                  <label className="flex items-start gap-2 max-w-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="drive-terms-checkbox-header"
                      checked={driveTermsAccepted}
                      onChange={(e) => {
                        setDriveTermsAccepted(e.target.checked);
                        if (e.target.checked) setDriveTermsError(false);
                      }}
                      className="mt-0.5 rounded border-white/10 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 accent-emerald-500 w-3.5 h-3.5 cursor-pointer shrink-0"
                    />
                    <span className="text-[10px] text-slate-400 text-left sm:text-right leading-tight">
                      <span>
                        {dt.driveTermsAgreePrefix}{" "}
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors">
                          {dt.privacyPolicyGDPR}
                        </a>{" "}
                        {dt.driveTermsAnd}{" "}
                        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors">
                          {dt.termsOfServiceCheck}
                        </a>.
                      </span>
                    </span>
                  </label>

                  {driveTermsError && (
                    <span className="text-[10px] text-red-500 font-bold animate-pulse text-center sm:text-right max-w-xs leading-tight">
                      {dt.driveTermsErrorHeader}
                    </span>
                  )}

                  <button
                    onClick={handleDriveLogin}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 whitespace-nowrap w-full sm:w-auto mt-0.5"
                  >
                    <Cloud className="w-4 h-4" />
                    {dt.driveConnectBtn}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tab selectors for Local and Cloud backups */}
          <div className="flex items-center justify-start border-b border-white/5 pb-1 gap-2">
            <button
              onClick={() => setActiveHistoryTab('local')}
              className={`px-6 py-3 font-semibold text-xs transition-all flex items-center gap-2 border-b-2 relative -bottom-[2px] ${
                activeHistoryTab === 'local'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              {dt.driveTabLocal}
              <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">{history.length}</span>
            </button>
            <button
              onClick={() => {
                setActiveHistoryTab('drive');
                if (driveUser && driveToken) {
                  fetchDriveFiles(driveToken);
                }
              }}
              className={`px-6 py-3 font-semibold text-xs transition-all flex items-center gap-2 border-b-2 relative -bottom-[2px] ${
                activeHistoryTab === 'drive'
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4" />
              {dt.driveTabCloud}
              {driveUser && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">{driveFiles.length}</span>
              )}
            </button>
          </div>

          {/* ACTIVE TAB RENDERINGS */}
          {activeHistoryTab === 'local' ? (
            history.length === 0 ? (
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
                              setActiveVideoMetadata({
                                model: item.model,
                                generationDuration: item.parameters.generationDuration,
                                timestamp: item.timestamp,
                                resolution: item.parameters.resolution,
                                aspectRatio: item.parameters.aspectRatio,
                                duration: item.parameters.duration,
                                style: item.parameters.style,
                                prompt: item.prompt
                              });
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

                      <div className="p-6 space-y-4 text-left">
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
                          
                          {/* SAVE TO GOOGLE DRIVE CLOUD TRIGGER */}
                          {uploadedDriveIds[item.id] ? (
                            <a
                              href={uploadedDriveIds[item.id].link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-slate-950 border border-blue-500/30 transition-all flex items-center justify-center"
                              title={dt.driveOpenLink}
                            >
                              <span className="text-[10px] font-extrabold mr-1">✓</span>
                              <Cloud className="w-4 h-4" />
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                if (!driveUser) {
                                  handleDriveLogin();
                                } else {
                                  saveItemToDrive(item);
                                }
                              }}
                              disabled={isUploadingToDrive[item.id]}
                              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                                isUploadingToDrive[item.id]
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400/50'
                                  : 'bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-slate-950 border border-blue-500/20'
                              }`}
                              title={!driveUser ? dt.driveConnectBtn : isUploadingToDrive[item.id] ? dt.driveUploading : dt.driveUploadBtn}
                            >
                              {isUploadingToDrive[item.id] ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Cloud className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

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
            )
          ) : (
            /* GOOGLE DRIVE BACKUPS TAB VIEW */
            !driveUser ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-16 text-center backdrop-blur-3xl space-y-6">
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 text-blue-400">
                  <Cloud className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{dt.driveConnectBtn}</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    {dt.driveDescription}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3.5 max-w-md mx-auto p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <label className="flex items-start gap-3 cursor-pointer select-none text-left">
                    <input
                      type="checkbox"
                      id="drive-terms-checkbox-tab"
                      checked={driveTermsAccepted}
                      onChange={(e) => {
                        setDriveTermsAccepted(e.target.checked);
                        if (e.target.checked) setDriveTermsError(false);
                      }}
                      className="mt-0.5 rounded border-white/10 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 accent-emerald-500 w-4.5 h-4.5 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-slate-400 leading-normal">
                      <span>
                        {dt.driveTermsAgreePrefix}{" "}
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors">
                          {dt.privacyPolicyGDPR}
                        </a>{" "}
                        {dt.driveTermsAnd}{" "}
                        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors">
                          {dt.termsOfServiceCheck}
                        </a>.
                      </span>
                    </span>
                  </label>
                  
                  {driveTermsError && (
                    <span className="text-xs text-red-500 font-bold animate-pulse text-center leading-tight">
                      {dt.driveTermsErrorTab}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleDriveLogin}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Cloud className="w-4 h-4" />
                  {dt.driveConnectBtn}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Control bar / header inside Google Drive tab */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-3xl text-left">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-blue-400 animate-pulse" />
                      {language === 'sk' ? "Prístup k vašim cloudovým zálohám" : "Your Cloud Backups Location"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'sk'
                        ? "Vaše zálohované videá a obrázky sa ukladajú do špeciálneho priečinka vo vašom Google Disku."
                        : "Your backed-up videos and images are stored inside a dedicated folder on your Google Drive."}
                    </p>
                  </div>
                  {driveFolderId && (
                    <a
                      href={`https://drive.google.com/drive/folders/${driveFolderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-blue-500/20 w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {dt.driveOpenFolderBtn || "Open Folder"}
                    </a>
                  )}
                </div>

                {isDriveLoading ? (
                  <div className="py-20 text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">{dt.driveLoading}</p>
                  </div>
                ) : driveFiles.length === 0 ? (
                  <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-20 text-center backdrop-blur-3xl space-y-4">
                    <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-slate-800 text-slate-600">
                      <Box className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">{dt.driveEmptyCloud}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {driveFiles.map((file) => {
                      const isVideo = file.mimeType?.includes('video');
                      return (
                    <div 
                      key={file.id} 
                      className="group relative bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 ring-1 ring-white/5 flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden border-b border-white/5">
                        {file.thumbnailLink ? (
                          <img 
                            src={file.thumbnailLink.replace('=s220', '=s600')} 
                            alt={file.name} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 referrerPolicy='no-referrer'" 
                          />
                        ) : (
                          <div className="text-slate-600">
                            {isVideo ? <Film className="w-10 h-10" /> : <Camera className="w-10 h-10" />}
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${isVideo ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}>
                            {isVideo ? 'Video' : 'Image'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug break-all" title={file.name}>
                            {file.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(file.createdTime).toLocaleDateString()}
                            {file.size && ` • ${(parseInt(file.size) / (1024 * 1024)).toFixed(2)} MB`}
                          </div>
                        </div>

                        <div className="pt-4 flex items-center gap-2 w-full">
                          <button
                            onClick={() => downloadFromDrive(file.id, file.name, file.mimeType)}
                            disabled={isDownloadingFromDrive[file.id]}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 transition-all text-[10px] font-bold disabled:opacity-50"
                            title={dt.driveDownloadBtn}
                          >
                            {isDownloadingFromDrive[file.id] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            {dt.driveDownloadBtn}
                          </button>

                          <a 
                            href={file.webViewLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-slate-950 border border-blue-500/20 transition-all flex items-center justify-center"
                            title={dt.driveOpenLink}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          
                          {/* DESTRUCTION VERIFIED CONFIRM COMMAND */}
                          <button
                            onClick={() => deleteItemFromDrive(file.id, file.name)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition-all flex items-center justify-center"
                            title={dt.driveDeleteBtn}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      )}
        </motion.section>

        {/* Global Footer */}
        <footer className="pt-16 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-xs shrink-0">
          <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <img
                src={appLogoImg}
                alt="Vision Forge Icon"
                className="w-6 h-6 rounded-md border border-white/10 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold tracking-wider text-slate-300 uppercase font-display text-sm">Vision Forge AI</span>
            </div>
            <span className="text-[11px] leading-relaxed max-w-md text-slate-500">
              {language === 'sk'
                ? "© 2026. Tvorba poháňaná špičkovými generatívnymi modelmi Google Gemini, Imagen 3, Veo a OpenAI. Všetky práva vyhradené."
                : "© 2026. Powered by Google Gemini, Imagen, Veo & OpenAI. All rights reserved."}
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-xs font-semibold">
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-500 hover:text-emerald-400 underline transition-colors"
                id="footer-privacy-link"
              >
                {dt.privacyPolicyGDPR}
              </a>
              <span className="text-slate-700 select-none">•</span>
              <a 
                href="/terms-of-service" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-500 hover:text-emerald-400 underline transition-colors"
                id="footer-terms-link"
              >
                {dt.termsOfServiceCheck}
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://ko-fi.com/C1W320AXYA"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 transition-all duration-300 hover:border-slate-700 shadow-xl active:scale-95 w-[117px]"
              title={(t as any).donateTooltip || "Support on Ko-fi"}
            >
              <img
                src={kofiButtonImg}
                alt="Support me on Ko-fi"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
