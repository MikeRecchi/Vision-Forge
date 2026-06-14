# 🌋 Vision Forge — Používateľská Dokumentácia & Sprievodca Funkciami

Vitajte v **Vision Forge**, pokročilej aplikácii na kinematografickú AI tvorbu, ktorá premeňa textové predlohy alebo statické obrázky na dychberúce generované sekvencie. Aplikácia spája technologickú silu popredných modelov od spoločností **Google (Gemini/Veo/Imagen)** a **OpenAI** do jedného intuitívneho, vizuálne vyladeného a responzívneho prostredia.

---

## 🚀 Hlavné Architektonické Funkcie

Aplikácia **Vision Forge** ponúka komplexný súbor nástrojov pre režisérov, dizajnérov a kreatívcov. Nižšie nájdete podrobný prehľad a popis všetkých jej kľúčových možností:

### 1. Duálny Režim Vstupu (Input Mode)
- **Generovať (Text-to-Video)**: 
  Umožňuje vytvoriť video z čistého textového popisu. Na základe vášho popisu obrázka AI najprv vytvorí vysoko detailný podkladový obrázok a následne ho oživí do podoby pohyblivého kinematografického videa.
- **Nahrať (Image-to-Video)**:
  Umožňuje nahrať vlastný obrázok priamo z vášho zariadenia pomocou funkcie drag-and-drop alebo kliknutím na pole nahrávania. Aplikácia automaticky zistí a prispôsobí pomer strán pôvodného dizajnu, aby sa predišlo deformáciám pri tvorbe videa.

### 2. Široký Výber Popredných AI Modelov
Svoje projekty môžete prispôsobiť výberom špecializovaných modelov:
- **Video Modely**:
  - `Google Veo 3.1 Lite`: Najnovší, optimalizovaný model na generovanie plynulých kinematografických scén s vysokou vernosťou detailov a verným zachovaním fyziky pohybu.
  - `Google Veo 2.0`: Stabilný a efektívny model pre rôzne druhy animácie a prechodov.
- **Obrazové Modely**:
  - `Google Imagen 3`: Špičkový model pre generovanie realistických, detailných a esteticky prepracovaných obrázkov na základe textových pokynov.
  - `Gemini 3.1 Flash Image`: Rýchly a spoľahlivý model prepájajúci kontextuálny popis s rýchlym vyrenderovaním.
  - `OpenAI GPT Image 1.5 & GPT Image 2`: Alternatívne modely pre rôzne typy textových interpretácií a vizuálnych štýlov.

### 3. Pomer Strán na Mieru (Aspect Ratio)
Vision Forge je plne pripravené na tvorbu pre akúkoľvek platformu s podporou nasledovných formátov:
- **16:9** — Štandard pre YouTube, prezentácie a tradičnú televíziu.
- **9:16** — Formát pre vertikálne videá (TikTok, Instagram Reels, YouTube Shorts).
- **1:1** — Štvorcový formát ideálny pre platformu Instagram a feed príspevky.
- **4:5** — Predĺžený portrét optimalizovaný pre sociálne siete.
- **4:3** — Klasický formát pre tradičné prezentácie a retro vizuál.
- **21:9** — Širokouhlý kino-formát (Cinemascope) pre filmovú atmosféru.
- **3:2** — Štandardný formát klasickej fotografie.

### 4. Kreatívne a Kinematografické Štýly
Na jedno kliknutie môžete zmeniť celkovú estetiku vašich generovaných vizuálov pomocou trinástich prednastavených umeleckých štýlov, ktoré automaticky dopĺňajú a optimalizujú váš textový dopyt:
- **Cinematický (Cinematic)**: Dramatické filmové nasvietenie, hĺbka ostrosti a farebná úprava.
- **Hyper-Realistický (Photorealistic)**: Neuveriteľné detaily textúr, svetelných odrazov a autenticity.
- **Cyberpunk**: Futurizmus prežiarený neónmi, retro-technológiami a tmavou mestskou atmosférou.
- **Vintage Film**: Nostalgický nádych s filmovým zrnom a teplými analógovými tónmi.
- **Anime Ghibli**: Klasická, ručne kreslená estetika legendárneho japonského štúdia.
- **Dronový Záber (Drone Shot)**: Perspektíva z vtáčej perspektívy s tiahlym, dychberúcim panoramatickým pohybom.
- **Makro Detail (Macro)**: Extrémne priblíženie s precíznym zaostrením na mikroštruktúry.
- **Film Noir**: Temná čiernobiela estetika s vysokým kontrastom a tieňohrami.
- **Disney/Pixar**: Kúzelné rodinné 3D animácie s priateľskými charaktermi.
- **3D Digitálne Umenie**: Moderné trojrozmerné vyrenderované prvky a abstraktná geometria.
- **Minimalistický & Abstraktný**: Dôraz na jednoduchosť, čisté tvary, emóciu a hru farieb.
- **Dokumentárny & Surrealistický**: Reálny reportážny vizuál alebo naopak snová, nespútaná fantázia snov.

### 5. Rozšírené Parametre Videa (Advanced Settings)
- **Vlastná dĺžka videa**: Možnosť určiť presné trvanie v sekundách (napr. pre optimálnu dĺžku vašich záberov).
- **Rozlíšenie videa**: Výber medzi štandardnými formátmi s inteligentnou možnosťou **Auto**, ktorá prispôsobuje rozlíšenie podľa vašej obrazovky.
- **Stabilizácia videa**: Pokročilý filter, ktorý aktívne vyhladzuje otrasy virtuálnej kamery, čím zabezpečuje hladký, stabilný záber s filmovou gráciou.

### 6. Export a sťahovanie
- **Export do formátu GIF**: Integrovaný konverzný modul (využívajúci knižnicu `gifshot`), ktorý vygenerovanú sekvenciu rýchlo premení na animáciu `.gif`. Nastaviť môžete cieľové rozlíšenie, snímkovú frekvenciu (FPS) a želaný pomer strán.
- **Sťahovanie videa**: Možnosť jedným kliknutím stiahnuť finálne vygenerované video vo formáte `.mp4` priamo do úložiska vášho zariadenia.

### 7. Lokálna História a Uchovanie Parametrov
- Každé úspešné vygenerovanie sa okamžite uloží do **Histórie generovaní** na vašom zariadení.
- História uchováva vygenerované médiá, pôvodný textový dopyt, použitý model, rozlíšenie, dĺžku a ďalšie nastavenia.
- Možnosť kliknúť na **Použiť parametre** (Use parameters), čím sa celá konfigurácia predošlého videa okamžite načíta späť do ovládacieho panela pre rýchle iterácie.

### 8. Bezpečnosť a Súkromie pod Kontrolou
- **API Nastavenia**: Aplikácia funguje na základe vašich vlastných API kľúčov pre platformy **Google Gemini** a **OpenAI**.
- **Miestne úložisko**: API kľúče sa ukladajú výhradne lokálne vo vašom prehliadači prostredníctvom `localStorage`. Nikdy neodchádzajú na cudzie servery, čo zaručuje 100% ochranu pred zneužitím.

---

## 🛠️ Užitočné Riešenia pre Iframe a Cookies

Keďže aplikácia môže bežať vo vnútri zabudovaného okna (iframe) vývojárskeho alebo vzdelávacieho prostredia, niektoré moderné prehliadače môžu kvôli striktnej ochrane súkromia zablokovať cookies tretích strán potrebné pre overenie. 

Aplikácia **Vision Forge** ponúka elegantné elegantné riešenia na prekonanie týchto prekážok:
- **Tlačidlo "Nový panel"**: Nachádza sa v pravom hornom rohu hlavičky. Jedným kliknutím otvorí aplikáciu na samostatnej karte vo vašom prehliadači, čím okamžite obíde akékoľvek obmedzenia iframe a zaistí plnú funkčnosť.
- **Inteligentný prepínač jazyka**: Vstupný klikateľný dropdown umožňujúci zvoliť preferovaný preklad rozhrania (s podporou 8 svetových jazykov vrátane slovenčiny, angličtiny, nemčiny, francúzštiny či španielčiny), ktorý pri zmene automaticky udržuje kontext celého používateľského prostredia.

---

*Začnite prebúdzať svoje predstavy a vytvorte svoj prvý filmový záber s Vision Forge ešte dnes!*
