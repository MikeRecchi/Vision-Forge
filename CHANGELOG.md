# 📋 Changelog

All notable changes to the **Vision Forge** project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.7.0] - 2026-07-01

### English
- **Diagnostics & Error Logging System**: Engineered a fully integrated error recording engine that collects client-side runtime errors and server-side API failures, persisting them in a structured `user_logs.json` file.
- **Interactive Logs Dashboard**: Created an in-app administrative dashboard under a smooth collapsible container, featuring real-time diagnostic stream filtration (All, Client-only, Server-only), clear-all buttons with confirmation dialogs, read indicators, and single-click JSON backup exporting.
- **Detailed Inspector & Stack Trace Viewer**: Built a system detail panel that extracts browser specifications, context URLs, custom user session states, and complete color-coded call stack traces for instantaneous debugging.
- **Slack Notification Integration**: Configured secure server-side Slack Webhook relays with inline status feedback, enabling developers to send comprehensive JSON-structured reports of caught exceptions straight to Slack channels.
- **Settings Modal Accessibility**: Redesigned the settings popup to use a responsive flexbox layout with locked footer buttons and scrollable content containers, preventing long option lists from pushing the "Save changes" button off-screen.
- **Diagnostic & Logging Translations**: Extended multi-language support to diagnostic logging systems, localized Slack/error reporting, and provided uniform confirmation prompts across all 8 supported languages.

### Slovak
- **Systém diagnostiky a chybových logov**: Vytvorené komplexné rozhranie na zachytávanie chýb na strane klienta aj servera, s bezpečným ukladaním do štruktúrovaného súboru `user_logs.json`.
- **Interaktívny panel záznamov**: Implementovaný priamy administrátorský panel s filtráciou chýb (Všetky, Klientské, Serverové), hromadným označením ako prečítané, sťahovaním JSON záloh a možnosťou prečistenia s dvojfázovým overením.
- **Hĺbkový inšpektor detailov**: Vývoj vizualizácie pre systémové parametre prehliadača, kontextové URL adresy, relácie používateľov a kompletné trasovanie volaní (Stack Trace) s farebným odlíšením pre rýchle odladenie chýb.
- **Integrácia Slack upozornení**: Zavedenie webhookov na strane servera na bezpečné a okamžité odosielanie podrobných chybových reportov v JSON formáte do zvoleného kanála na Slacku.
- **Prístupnosť nastavení**: Prepracovaný vyskakovací panel nastavení do flexibilného zobrazenia s pevným ukotvením tlačidla „Uložiť zmeny“ na spodku a scrollovateľným obsahom, čím sa zabránilo pretekaniu mimo obrazovku pri otvorených rolovacích menu.
- **Lokalizácia chybových logov**: Rozšírená podpora prekladov do diagnostického rozhrania a chybových hlásení na Slack vrátane unifikovaných dialógov pre potvrdenie vymazania pre všetkých 8 jazykov.

### German
- **Diagnose- und Fehlerprotokollsystem**: Entwicklung einer vollständig integrierten Fehleraufzeichnungskomponente, die clientseitige Laufzeitfehler und serverseitige API-Fehler sammelt und in einer strukturierten Datei `user_logs.json` speichert.
- **Interaktives Protokoll-Dashboard**: Erstellung eines Administrations-Dashboards in der App, das eine Echtzeit-Filterung der Diagnoseprotokolle (Alle, Client, Server), Massenlesemarkierung, JSON-Backup-Exporte und Löschoptionen mit Sicherheitsabfrage bietet.
- **Detaillierter Log-Inspektor**: Einbindung eines Detailbereichs zur Analyse von Browserspezifikationen, Kontext-URLs, Benutzersitzungsdaten und farblich hervorgehobenen Stack-Traces für schnelles Debugging.
- **Slack-Benachrichtigungsintegration**: Konfiguration von sicheren serverseitigen Slack-Webhooks mit direktem Status-Feedback, um JSON-Berichte von Laufzeitfehlern direkt an Slack-Kanäle zu übermitteln.
- **Barrierefreiheit des Einstellungsmodals**: Das Einstellungsfenster wurde überarbeitet und verwendet nun ein flexibles Layout mit fixiertem Footer und scrollbarem Inhaltsbereich. Dies verhindert, dass die Schaltfläche „Änderungen speichern“ durch lange Dropdown-Listen aus dem sichtbaren Bereich verschoben wird.
- **Lokalisierung der Diagnose- und Log-Systeme**: Die mehrsprachige Unterstützung wurde auf die Diagnoseprotokolle und Slack-Fehlerberichte ausgeweitet, inklusive einheitlicher Bestätigungsdialoge für alle 8 unterstützten Sprachen.

### French
- **Système de diagnostic et de journalisation des erreurs**: Conception d'un moteur d'enregistrement des erreurs entièrement intégré capturant les défaillances du client et de l'API serveur, avec persistance dans un fichier structuré `user_logs.json`.
- **Tableau de bord interactif des journaux**: Création d'un panneau d'administration proposant un filtrage en temps réel des flux de diagnostic (Tout, Client, Serveur), le marquage collectif comme lu, l'export de sauvegardes JSON et l'effacement complet sécurisé.
- **Inspecteur détaillé et trace de pile**: Intégration d'un visualiseur affichant les caractéristiques du navigateur, les URL contextuelles, l'état de session utilisateur et la trace complète des appels (Stack Trace) pour un débogage optimal.
- **Intégration des notifications Slack**: Configuration de relais Webhook sécurisés côté serveur, permettant d'envoyer des rapports d'erreur formatés en JSON directement vers des canaux Slack.
- **Accessibilité du modal de paramètres**: Refonte de la fenêtre des paramètres pour utiliser une disposition flexible avec un pied de page fixe et un conteneur de contenu défilant, empêchant les longues listes d'options de masquer le bouton « Enregistrer les modifications ».
- **Localisation des diagnostics et journaux**: Extension du support multilingue aux systèmes de diagnostic, aux rapports d'erreur Slack et uniformisation des invites de confirmation pour les 8 langues prises en charge.

### Italian
- **Sistema di diagnostica e tracciamento errori**: Sviluppato un motore integrato per la registrazione degli errori a livello client e server, persistiti nel file strutturato `user_logs.json`.
- **Dashboard log interattiva**: Creata una sezione amministrativa nell'app con filtri per i flussi diagnostici (Tutti, Client, Server), marcatura di lettura di massa, esportazione in JSON ed eliminazione protetta da conferma.
- **Analizzatore dettagliato e Stack Trace**: Aggiunto un pannello di ispezione contenente specifiche tecniche del browser, URL di contesto, variabili di sessione e lo stack trace completo delle chiamate evidenziato visivamente.
- **Integrazione delle notifiche Slack**: Configurazione di webhook lato server per l'inoltro sicuro e istantaneo di report diagnostici in formato JSON direttamente su canali Slack aziendali.
- **Accessibilità del modal delle impostazioni**: Riprogettato il pop-up delle impostazioni con un layout flessibile, piè di pagina fisso e contenitore scorrevole, evitando che i menu a tendina estesi nascondano il pulsante «Salva modifiche».
- **Localizzazione dei log di diagnostica**: Esteso il supporto multilingue ai registri di diagnostica e alla segnalazione degli errori Slack, con finestre di conferma uniformate per tutte le 8 lingue supportate.

### Spanish
- **Sistema de diagnóstico y registro de errores**: Se programó un motor integrado de captura de excepciones que recopila errores de ejecución del cliente y fallas de la API del servidor, guardándolos en un archivo estructurado `user_logs.json`.
- **Panel de logs interactivo**: Creación de un panel de administración en la aplicación con filtrado de logs en tiempo real (Todos, Cliente, Servidor), marca de lectura masiva, exportación de copias de seguridad en JSON y eliminación segura con confirmación.
- **Inspector de detalles y Stack Trace**: Panel visual que desglosa las especificaciones del navegador, URLs de contexto, estados de sesión y el rastreo de llamadas (Stack Trace) coloreado sintácticamente para un diagnóstico inmediato.
- **Integración de alertas Slack**: Configuración de webhooks seguros en el servidor con retroalimentación en tiempo real para retransmitir los reportes de error formateados en JSON a canales de Slack.
- **Accesibilidad del modal de configuración**: Rediseño de la ventana de ajustes mediante un diseño flexible con pie de página fijo y contenedor de contenido con desplazamiento, evitando que las listas desplegables oculten el botón «Guardar cambios».
- **Traducción de diagnósticos y registros**: Se amplió el soporte de localización a los registros de diagnóstico y reportes de error de Slack, unificando los diálogos de confirmación en los 8 idiomas admitidos.

### Portuguese
- **Sistema de diagnóstico e registros de erros**: Construção de um motor de rastreamento de exceções que unifica erros em tempo de execução no cliente e falhas de API no servidor, armazenando-os de forma persistente no arquivo `user_logs.json`.
- **Painel de logs interativo**: Criação de um painel administrativo com filtros para fluxos de registros (Todos, Cliente, Servidor), marcação em massa como lidos, exportação de backups JSON e limpeza assistida por janelas de confirmação.
- **Visualizador detalhado de Stack Trace**: Painel com diagnósticos do navegador, URLs contextuais, estados de sessão de usuário e o fluxo completo de chamadas (Stack Trace) colorido para acelerar a resolução de problemas.
- **Integração de notificações Slack**: Configuração de webhooks no servidor com validações de status em tempo real, permitindo enviar relatórios formatados em JSON direto para canali do Slack.
- **Acessibilidade do modal de configurações**: Redesenhado o painel de configurações para utilizar um layout flexível com rodapé fixo e área de rolagem interna, evitando que listas longas ocultem o botão "Salvar alterações".
- **Localização de diagnósticos e logs**: Suporte multilíngue estendido para os logs de diagnóstico e relatórios de erros no Slack, unificando as telas de confirmação para todos os 8 idiomas suportados.

### Polish
- **System diagnostyki i rejestrowania błędów**: Zaprogramowano zintegrowany silnik przechwytywania wyjątków, który zbiera błędy wykonania klienta i awarie API serwera, zapisując je trwale w pliku `user_logs.json`.
- **Interaktywny panel dziennika błędów**: Dodano panel administracyjny w aplikacji z filtrami dziennika w czasie rzeczywistym (Wszystkie, Klient, Serwer), oznaczaniem jako przeczytane, eksportowaniem kopii zapasowych JSON oraz bezpiecznym czyszczeniem z potwierdzeniem.
- **Szczegółowy inspektor i podgląd śladu stosu**: Panel wizualny wyświetlający parametry przeglądarki, adresy URL kontekstu, stan sesji i pełny ślad wywołań (Stack Trace) z kolorowaniem składni dla natychmiastowego debugowania.
- **Integracja z powiadomieniami Slack**: Skonfigurowano bezpieczne webhooki po stronie serwera z informacją o statusie wysyłki, umożliwiające przekazywanie raportów błędów w formacie JSON bezpośrednio na kanały Slack.
- **Dostępność okna ustawień**: Przebudowano układ okna ustawień na elastyczny (Flexbox) z zablokowanym dolnym panelem przycisków i przewijaną zawartością, co zapobiega wypychaniu przycisku „Zapisz zmiany” poza ekran przez rozwinięte listy.
- **Lokalizacja diagnostyki i logów**: Rozszerzono wsparcie wielojęzyczne o dzienniki diagnostyczne, raporty błędów Slack oraz ujednolicono komunikaty potwierdzeń dla wszystkich 8 obsługiwanych języków.

---

## [1.6.0] - 2026-06-24

### English
- **API Status Dashboard**: Added a real-time health and latency telemetry dashboard for Gemini and OpenAI APIs, tracking uptime, average latency, response speeds, and active configurations.
- **Video Player Telemetry Overlay**: Introduced an interactive overlay option on the video player, displaying active model, generation duration, timestamp, aspect ratio, and styling.
- **Multilingual Support**: Fully localized the status dashboard and video player telemetry overlays across all 8 supported languages.

### Slovak
- **Dashboard stavu API v reálnom čase**: Pridaný prehľadný panel stavu a latencie pre API Gemini a OpenAI, ktorý sleduje dostupnosť, priemernú odozvu a stav pripojenia.
- **Prekrytie s telemetriou na prehrávači**: Zavedená možnosť zobrazenia interaktívnych metadát (model, trvanie generovania, čas vygenerovania, pomer strán a štýl) priamo ako prekrytie na video prehrávači.
- **Kompletná lokalizácia**: Plný preklad všetkých nových rozhraní, metadát a ovládacích prvkov do ôsmich podporovaných európskych jazykov.

### German
- **Echtzeit-API-Status-Dashboard**: Ein übersichtliches Dashboard zur Überwachung des Systemzustands und der Latenz von Gemini- und OpenAI-APIs mit Erfassung von Betriebszeit, durchschnittlicher Antwortzeit und Verbindungsstatus.
- **Video-Player-Telemetrie-Overlay**: Einführung einer interaktiven Overlap-Option auf dem Videoplayer zur Anzeige von aktivem Modell, Generierungsdauer, Zeitstempel, Seitenverhältnis und Stil.
- **Mehrsprachige Lokalisierung**: Vollständige Lokalisierung des Status-Dashboards und der Player-Telemetrie in alle 8 unterstützten europäischen Sprachen.

### French
- **Tableau de bord du statut de l'API**: Ajout d'un tableau de bord de télémétrie en temps réel de l'état et de la latence pour les API Gemini et OpenAI, suivant la disponibilité, le temps de réponse moyen et les configurations actives.
- **Incrustation de télémétrie sur le lecteur vidéo**: Introduction d'une option d'affichage des métadonnées (modèle actif, durée de génération, horodatage, format d'image et style) directement en incrustation sur le lecteur multimédia.
- **Support multilingue**: Localisation complète du tableau de bord de statut et des incrustations de télémétrie pour les 8 langues prises en charge.

### Italian
- **Tabella di controllo dello stato delle API**: Aggiunta una dashboard di telemetria in tempo reale dello stato di salute e della latenza per le API di Gemini e OpenAI, tracciando la disponibilità, il tempo di risposta medio e lo stato della connessione.
- **Overlay della telemetria sul lettore video**: Introdotta l'opzione di visualizzazione interattiva dei metadati (modello attivo, durata della generazione, timestamp, rapporto d'aspetto e stile) direttamente in overlay sul lettore.
- **Localizzazione in 8 lingue**: Traduzione completa del pannello di controllo e degli overlay sul lettore video in tutte le 8 lingue europee supportate.

### Spanish
- **Tablero de estado de la API en tiempo real**: Se agregó un panel de telemetría de salud y latencia en tiempo real para las API de Gemini y OpenAI, registrando el tiempo de actividad, el tiempo de respuesta promedio y el estado de la conexión.
- **Superposición de telemetría en el reproductor de video**: Opción de visualización interactiva de metadatos (modelo activo, tiempo de generación, marca de tiempo, relación de aspecto y estilo) directamente como superposición en el reproductor.
- **Localización multilingüe**: Traducción completa de los nuevos paneles y superposiciones en los 8 idiomas admitidos.

### Portuguese
- **Painel de status da API em tempo real**: Adicionado um painel de telemetria de integridade e latência em tempo real para as APIs Gemini e OpenAI, rastreando disponibilidade, tempo de resposta médio e status da conexão.
- **Sobreposição de telemetria no player de vídeo**: Opção de exibição interativa de metadatos (modelo ativo, tempo de geração, carimbo de data/hora, proporção de tela e estilo) diretamente sobreposta no player.
- **Suporte multilíngue**: Localização completa do painel de status e das sobreposições do player nos 8 idiomas suportados.

### Polish
- **Panel stanu API w czasie rzeczywistym**: Dodano interaktywny panel telemetryczny stanu i opóźnień dla interfejsów API Gemini i OpenAI, śledzący niezawodność, średni czas odpowiedzi i konfiguracje.
- **Nakładka telemetryczna na odtwarzaczu wideo**: Wprowadzono opcję interaktywnego nakładania metadanych (aktywny model, czas generowania, sygnatura czasowa, proporcje i styl) bezpośrednio na odtwarzacz multimedialny.
- Polish: **Wielojęzyczne wsparcie**: Pełna lokalizacja nowego panelu stanu oraz nakładek telemetrycznych we wszystkich 8 obsługiwanych językach europejskich.

---

## [1.5.0] - 2026-06-20

### English
- **Terms of Service Implementation**: Created a beautifully styled and legal-compliant Terms of Service subpage connected cleanly across layout footers.
- **GDPR & TOS Verification Checkbox**: Added a mandatory consent checkbox for Google Drive storage linking, utilizing interactive warning pulses to guarantee data safety compliance.
- **Standardized Multi-language Localization**: Translated all consent agreements, error notifications, and warning systems across all 8 supported European languages.

### Slovak
- **Právny rámec a VOP**: Pridanie novej vyhradenej podstránky zmluvných podmienok (Terms of Service) a jej hlboké integrovanie do pätičky a prihlasovacích formulárov.
- **Mechanizmus overenia súhlasu**: Zavedenie povinného zaškrtávacieho poľa (Checkboxu) pre vyjadrenie súhlasu so spracovaním údajov pred prihlásením do Google Drive s animovaným varovaním v reálnom čase pri vynechaní.
- **Univerzálny lokalizačný systém**: Kompletný preklad všetkých právnych textov, chybových hlášok a podmienok do ôsmich podporovaných európskych jazykov.

### German
- **Nutzungsbedingungen & VOP**: Einführung einer ansprechend gestalteten, rechtskonformen Nutzungsbedingungen-Unterseite (Terms of Service), die nahtlos in die Fußzeile und die Anmeldeformulare integriert ist.
- **Einwilligungs-Checkbox (DSGVO)**: Hinzufügen einer obligatorischen Einwilligungserklärung (Checkbox) vor dem Google Drive-Login, inklusive visueller Warnsignale bei fehlender Zustimmung.
- **Mehrsprachige Lokalisierung**: Vollständige Übersetzung aller Rechtstexte, Warnmeldungen und Formularkomponenten in alle 8 unterstützten europäischen Sprachen.

### French
- **Conditions d'utilisation (CGU)**: Ajout d'une sous-page dédiée aux conditions d'utilisation, élégamment intégrée dans le pied de page et les formulaires d'authentification.
- **Case à cocher RGPD & CGU**: Intégration d'une case à cocher obligatoire garantissant le consentement de l'utilisateur avant la connexion à Google Drive, avec des avertissements animés en temps réel si elle est omise.
- **Localisation multilingue**: Traduction complète de tous les textes juridiques, avertissements et notifications d'erreur dans les 8 langues européennes prises en charge.

### Italian
- **Termini di Servizio (VOP)**: Creazione di una sottopagina dedicata ai termini di servizio, ottimizzata dal punto di vista legale ed elegantemente integrata nel piè di pagina e nei contesti di login.
- **Checkbox di Consenso Obbligatorio**: Aggiunta di una casella di controllo per l'accettazione del trattamento dei dati prima di collegare Google Drive, completa di avvisi visivi animati se deselezionata.
- **Localizzazione in 8 lingue**: Traduzione completa di accordi legali, messaggi d'errore e notifiche di sicurezza in tutte le 8 lingue europee supportate.

### Spanish
- **Términos de Servicio (VOP)**: Creación de una página dedicada para los términos de servicio, integrada de manera fluida y elegante en el pie de página del diseño general.
- **Casilla de Verificación RGPD**: Se agregó una casilla de consentimiento obligatoria antes de iniciar sesión en Google Drive, con alertas visuales dinámicas de advertencia si no está marcada.
- **Localización multilingüe**: Tradución completa de todos los acuerdos de consentimiento, errores y notificaciones de advertencia en los 8 idiomas europeos compatibles.

### Portuguese
- **Termos de Serviço (VOP)**: Criação de uma subpágina de Termos de Serviço estilizada e compatível legalmente, integrada de forma limpa nos rodapés do layout geral.
- **Caixa de Seleção de Consentimento**: Adicionada uma caixa de seleção obrigatória para aceitação do processamento de dados antes de se conectar ao Google Drive, com avisos pulsantes interativos.
- **Localização em 8 idiomas**: Tradução completa de todos os termos, avisos de erro e interfaces de consentimento em todos os 8 idiomas europeus suportados.

### Polish
- **Regulamin i Warunki Świadczenia Usług**: Wdrożenie dedykowanej podstrony regulaminu świadczenia usług z pełną integracją w stopce aplikacji oraz formularzach połączenia.
- **Obowiązkowe Pole Zgody (RODO)**: Dodanie obowiązkowego pola wyboru (checkboxa) zgody na przetwarzanie danych przed połączeniem z Dyskiem Google z animowanymi ostrzeżeniami w czasie rzeczywistym.
- **Wielojęzyczna Lokalizacja**: Kompletne tłumaczenie tekstów prawnych, komunikatów ostrzegawczych i formularzy we wszystkich 8 obsługiwanych językach europejskich.

---

## [1.4.0] - 2026-06-17

### English
- **Supported Video Durations**: Restricted creative settings video duration options strictly to fully supported configurations (5s, 6s, and 8s) while updating state handling and history presets.
- **Visual Design & Launch Branding**: Integrated a premium application logo and launcher icon design featuring high-fidelity container borders, tactile hover scaling, and seamless transition animations.
- **Automated Logging & Synchronization**: Configured a background release log synchronization engine linking real-time UI localization with direct on-disk updates.

### Slovak
- **Podporované dĺžky videa**: Obmedzené možnosti trvania videa v kreatívnych nastaveniach striktne na podporované konfigurácie (5s, 6s a 8s) s aktualizáciou správy stavu a histórie predvolieb.
- **Vizuálny dizajn a branding**: Integrované prémiové logo aplikácie a spúšťacia ikona s vysoko presnými okrajmi kontajnerov, dotykovou odozvou priblíženia a plynulými prechodovými animáciami.
- **Automatizovaná synchronizácia a protokolovanie**: Nakonfigurovaný systém synchronizácie súhrnov vydaní prepájajúci lokalizáciu rozhrania v reálnom čase s priamym zápisom na disk.

### German
- **Unterstützte Videodauern**: Die Optionen für die Videodauer in den kreativen Einstellungen wurden strikt auf unterstützte Konfigurationen (5s, 6s und 8s) beschränkt sowie die Statusverwaltung und Vorlagen-Historie aktualisiert.
- **Visuelles Design & Launch-Branding**: Integration eines Premium-Anwendungslogos und Launcher-Icons mit hochpräzisen Container-Rändern, takiler Hover-Skalierung und fließenden Übergangsanimationen.
- **Automatisierte Protokollierung & Synchronisation**: Konfiguration einer Engine zur Synchronisierung von Release-Protokollen im Hintergrund, die Echtzeit-Lokalisierung der Benutzeroberfläche mit direkten Updates auf der Festplatte verbindet.

### French
- **Durées de vidéo prises en charge**: Restriction des options de durée de vidéo dans les paramètres créatifs strictement aux configurations prises en charge (5s, 6s et 8s) et mise à jour de la gestion des états et des préréglages d'historique.
- **Design visuel et branding de lancement**: Intégration d'un logo d'application et d'une icône de lancement premium avec des bordures de conteneur haute fidélité, un effet de zoom tactile au survol et des animations de transition fluides.
- **Journalisation automatique et synchronisation**: Configuration d'un moteur de synchronisation des notes de version en arrière-plan reliant la localisation de l'interface utilisateur en temps réel aux mises à jour directes sur disque.

### Italian
- **Durate video supportate**: Limitate le opzioni di durata video nelle impostazioni creative rigorosamente alle configurazioni supportate (5s, 6s e 8s), aggiornando la gestione dello stato e i preset della cronologia.
- **Design visivo e branding di lancio**: Integrato un logo premium dell'applicazione e un'icona di avvio con bordi del contenitore ad alta fedeltà, ridimensionamento tattile al passaggio del mouse e animazioni di transizione fluide.
- **Registrazione automatica e synchronizzazione**: Configurato un motore di sincronizzazione in background per i registri di rilascio, che collega la localizzazione dell'interfaccia utente in tempo reale con gli aggiornamenti diretti su disco.

### Spanish
- **Duraciones de video compatibles**: Se restringieron las opciones de duración de video en los ajustes creativos estrictamente a las configuraciones admitidas (5s, 6s y 8s), actualizando la gestión de estado y los ajustes preestablecidos del historial.
- **Diseño visual y branding de lanzamiento**: Integración de un logotipo de aplicación premium y un icono de inicio que presenta bordes de contenedor de alta fidelidad, escala táctil al pasar el cursor y animaciones de transición fluidas.
- **Registro automatizado y sincronización**: Configuración de un motor de sincronización de registros de versiones en segundo plano que vincula la localización de la interfaz de usuario en tiempo real con actualizaciones directas en disco.

### Portuguese
- **Durações de vídeo suportadas**: Restringidas as opções de duração de vídeo nas configurações criativas estritamente para as configurações suportadas (5s, 6s e 8s), atualizando o gerenciamento de estado e as predefinições de histórico.
- **Design visual e branding de lançamento**: Integrado um logotipo de aplicativo premium e ícone de inicialização com bordas de contêiner de alta qualidade, dimensionamento tátil ao passar o mouse e animações de transition suaves.
- **Registro automatizado e sincronização**: Configurado um mecanismo de sincronização de logs de lançamento em segundo plano, conectando a localização da interface do usuário em tempo real com atualizações diretas no disco.

### Polish
- **Obsługiwane czasy trwania wideo**: Ograniczono opcje czasu trwania wideo w ustawieniach kreatywnych wyłącznie do w pełni obsługiwanych konfiguracji (5s, 6s i 8s) oraz zaktualizowano zarządzanie stanem i historię szablonów.
- **Projekt wizualny i branding**: Wdrożono luksusowe logo aplikacji i ikonę uruchamiania z precyzyjnymi obramowaniami kontenerów, interaktywnym skalowaniem po najechaniu kursem i płynnymi animacjami przejścia.
- **Automatyczne raportowanie i synchronizacja**: Skonfigurowano silnik synchronizacji podsumowań wydań w tle, łączący lokalizację interfejsu użytkownika w czasie rzeczywistym z bezpośrednim zapisem zmian na dysku.

---

## [1.3.0] - 2026-06-16

### English
- **Cinematic Styles Integration**: Implemented an interactive cinematic presets gallery featuring high-resolution visuals within the application showcase.
- **Automated Logging System & Synchronization**: Configured instant backend release summary updates with real-time UI localization support.
- **Micro-alignment Tuning**: Corrected layout spacing guidelines in sidebars and headers for pristine presentation alignment.

### Slovak
- **Integrácia kinematografických štýlov**: Implementovaná interaktívna galéria s kinematografickými predvoľbami, ktorá obsahuje obrázky vo vysokom rozlíšení.
- **Automatizovaný ladiaci systém a synchronizácia**: Nakonfigurované okamžité aktualizácie súhrnov vydaní na pozadí s lokalizáciou v reálnom čase.
- **Prispôsobenie jemného lícovania**: Opravené rozloženie a rozostupy v bočných paneloch a hlavičkách pre dokonalé vizuálne zarovnanie.

### German
- **Integration von Kinostilen**: Implementierung einer interaktiven Galerie für visuelle Stilvorlagen mit hochauflösenden Bildern im App-Showcase.
- **Automatisiertes Protokollierungssystem & Synchronisation**: Sofortige Updates der Release-Zusammenfassungen im Backend mit Echtzeit-Lokalisierungsunterstützung der Benutzeroberfläche.
- **Feineinstellung der Ausrichtung**: Korrektur von Layout-Abständen in Seitenleisten und Kopfzeilen für eine makellose Präsentationsausrichtung.

### French
- **Intégration des Styles Cinématiques**: Implémentation d'une galerie interactive de préréglages de styles visuels avec des images haute résolution dans la vitrine de l'application.
- **Système d'Enregistrement Automatisé & Synchronisation**: Mises à jour instantanées des résumés des versions sur le backend avec prise en charge de la localisation en temps réel de l'interface utilisateur.
- **Réglage Fin de l'Alignement**: Correction des espacements de mise en page dans les barres latérales et les en-têtes pour un alignement impeccable de la présentation.

### Italian
- **Integrazione degli Stili Cinematografici**: Implementazione di uma galleria interattiva di preset di stili visivi con immagini ad alta risoluzione nella vetrina dell'applicazione.
- **Sistema di Registrazione Automatizzato & Sincronizzazione**: Aggiornamenti istantanei dei riassunti delle versioni sul backend con supporto alla localizzazione in tempo reale dell'interfaccia utente.
- **Micro-calibrazione dell'Allineamento**: Corretti gli spazi di layout nelle barre laterali e nelle intestazioni per un perfetto allineamento della presentazione.

### Spanish
- **Integración de Estilos Cinemáticos**: Implementación de una galería interactiva de ajustes preestablecidos de estilos visuales con imágenes de alta resolución en el escaparate de la aplicación.
- **Sistema de Registro Automatizado & Sincronización**: Actualizaciones instantáneas de los resúmenes de versiones en el backend con soporte de localización de interfaz de usuario en tiempo real.
- **Ajuste Fino de la Alineación**: Corrección de los espacios de diseño en las barras laborales y encabezados para una alineación de presentación impecable.

### Portuguese
- **Integração de Estilos Cinemáticos**: Implementação de uma galeria interativa de predefinições de estilos visuais com imagens de alta resolução na vitrine do aplicativo.
- **Sistema de Registro Automatizado & Sincronização**: Actualizações instantâneas de resumos de lançamentos no backend com suporte para localização de interface do usuário em tempo real.
- **Ajuste Fino de Alinhamento**: Correção de espaçamentos de layout em barras laterais e cabeçalhos para alinhamento de apresentação impecável.

### Polish
- **Integracja Stylów Kinematograficznych**: Wdrożenie interaktywnej galerii gotowych stylów wizualnych ze zdjęciami o wysokiej rozdzielczości w prezentacji aplikacji.
- **Automatyczny System Rejestracji & Synchronizacja**: Natychmiastowe aktualizacje podsumowań wydań na zapleczu z obsługą lokalizacji interfejsu użytkownika w czasie rzeczywistym.
- **Dopracowanie Wyrównania**: Poprawiono odstępy w układzie paneli bocznych i nagłówków w celu uzyskania doskonałego dopasowania prezentacji.

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
