# Backstage CMS — Användar- & Testmanual

Välkommen till **Backstage CMS** manualen för [theresejarvheden.se](https://theresejarvheden.se). Det här dokumentet är utformat för att ge dig som användare, redaktör eller testare en tydlig steg-för-steg-guide till hur CMS-panelen fungerar, hur du ändrar sajtens innehåll och hur du testar funktionerna systematiskt.

---

## 🎭 Allmän Översikt

Backstage CMS är byggt för att styra alla sektioner på hemsidan dynamiskt via din **Supabase**-databas. Gränssnittet är indelat i åtta flikar som speglar sajtens ordning:

1. **Akt I: Nu aktuell** (Hero-huvudlinje)
2. **Akt II: Biografi** (Citat, introduktionstext, egenskaper och FAQ)
3. **Akt III: Portfolio** (Bildgalleri med sortering, uppladdning och alt-texter)
4. **Akt IV: Showreels** (Vimeo/YouTube/Egna videor med anpassad glöd)
5. **Akt V: Meriter** (Meritförteckning med avancerad röstinspelning och manusrepliker)
6. **Akt VI: Röst** (Röstintroduktion, knappar och bokningsdetaljer)
7. **SEO & Inställningar** (Sökmotorsoptimering, titel, beskrivning och delningsbild)
8. **Mediebibliotek** (Filhanterare för alla uppladdade bilder och ljudfiler)

---

## 🛠 Inloggning till Backstage

För att komma till adminpanelen:
1. Gå till webbplatsens adress och lägg till `/backstage` i webbläsarens adressfält (t.ex. `http://localhost:5173/backstage` eller `https://theresejarvheden.se/backstage`).
2. Ange lösenordet (standardlösenordet är konfigurerat i din `.env`-fil under `VITE_BACKSTAGE_PASSWORD`).
3. Klicka på **Logga in**.

---

## 🔍 Sektionsguide: Hur du gör ändringar

### 1. Akt I: Nu aktuell (Hero)
* **Syfte:** Styr den rullande eller framhävda meningen i sajtens toppsektion.
* **Hur du ändrar:**
  * **Manuellt läge:** Stäng av *Automatisk synkronisering*. Skriv in din text på svenska och engelska. Klicka på **Spara ändringar**.
  * **Automatiskt läge:** Slå på *Automatisk synkronisering*. Spara. Systemet letar nu upp den merit i din meritförteckning som är markerad som **"Aktuell"** och genererar texten automatiskt (t.ex. `"... — Huvudroll (SVT)"`).
* **Teststeg:**
  1. Slå av auto-synk. Skriv `"Hejsan Världen"` i svenska fältet. Spara.
  2. Klicka på "Visa Webbplats" i sidofältet och verifiera att texten ändrats på förstasidan.
  3. Slå på auto-synk igen, verifiera att texten uppdateras automatiskt utifrån aktuell merit.

### 2. Akt II: Biografi
* **Syfte:** Ändrar citat, biografitexter, språk samt sökmotorernas FAQ-struktur (AEO/GEO-optimering).
* **Hur du ändrar:**
  * Redigera citaten och de tre textparagraferna i respektive språkruta.
  * Lägg till eller ändra **FAQ-frågor**. Dessa frågor bakas automatiskt in som osynliga sökmotors-metadata på hemsidan för att hjälpa Google AI & ChatGPT att hitta svar om Therese.
* **Teststeg:**
  1. Ändra en mening i *Paragraf 1 (Svenska)*. Spara.
  2. Gå till förstasidan och byt till svenska. Kontrollera att biografins första stycke stämmer överens.
  3. Lägg till en FAQ-fråga, spara, och inspektera källkoden på startsidan för att se att `application/ld+json` (FAQPage) uppdaterats med den nya frågan.

### 3. Akt III: Portfolio
* **Syfte:** Styr bilderna i det horisontella rullningsgalleriet.
* **Hur du ändrar:**
  * **Uppladdning:** Klicka på **Välj fil** för att ladda upp en ny bild från datorn till Supabase Storage. Den läggs till direkt.
  * **Sortering:** Ändra siffran i fältet *Sorteringsordning* (lägre siffror visas först).
  * **SEO Alt-text:** Skriv en beskrivande bildtext (t.ex. `"Therese Järvheden porträtt i studiomiljö"`). Detta hjälper Google Image Search att indexera bilden.
* **Teststeg:**
  1. Ladda upp en testbild.
  2. Skriv en alt-text och sätt ordningen till `0` så att den hamnar först. Spara.
  3. Kontrollera startsidan för att se att den nya bilden visas först.

### 4. Akt IV: Showreels
* **Syfte:** Hanterar showreels med anpassade bakgrundsglöd-effekter och teaterläge.
* **Hur du ändrar:**
  * Fyll i titel och undertitel på svenska och engelska.
  * Ange ett **Vimeo-ID** (t.ex. `1206764752`) eller **YouTube-ID**. Om du använder en rå `.mp4`-fil, klistra in den i *Backup Video URL*.
  * Välj en **Glow-färg** (t.ex. `rgba(235, 94, 40, 0.15)` för en varm orange glöd bakom videospelaren).
* **Teststeg:**
  1. Klicka på en befintlig showreel och ändra dess rubrik. Spara.
  2. Gå till showreel-sektionen på hemsidan och starta videon för att säkerställa att "Teaterläget" expanderar videon mjukt och dämpar bakgrunden.

### 5. Akt V: Meriter (Meritförteckning)
* **Syfte:** Hanterar den sökbara listan över filmer, TV-serier, teaterpjäser och röstjobb.
* **Hur du ändrar:**
  * Klicka på **+ Lägg till merit** för att skapa en ny rad.
  * Välj typ (Film, TV, Teater, Röst).
  * Klicka på **Visa Röstkommentar & Manus (Avancerat)** för att expandera specialfunktioner:
    * **Ljuduppladdning:** Ladda upp en röstinspelning (`.mp3` eller `.wav`). CMS-systemet beräknar automatiskt ljudets längd och fyller i fältet **Längd** (t.ex. `1:24`).
    * **Manusdialog:** Skriv in scennamn, karaktär och repliker för att visa interaktivt manus bredvid ljudspelaren på startsidan.
* **Teststeg:**
  1. Lägg till en ny merit med typen "Voice".
  2. Öppna de avancerade inställningarna och ladda upp en liten ljudfil. Spara.
  3. Verifiera på startsidan att meriten visas i listan, och att det går att klicka på **"Kommentar"**-knappen bredvid för att lyssna på ljudinspelningen i sajten inbyggda ljudspelare.

### 6. Akt VI: Röst
* **Syfte:** Hanterar texterna och knapparna för röstprovs-sektionen på förstasidan.
* **Hur du ändrar:**
  * Skriv in rubrik, brödtext och de knappar som besökaren kan klicka på för att boka eller beställa röstprover.
* **Teststeg:**
  1. Ändra texten på knappen till `"Boka röst omgående"`. Spara.
  2. Kontrollera att knappen i röst-sektionen har uppdaterats på startsidan.

### 7. SEO & Inställningar
* **Syfte:** Globala sökmotorsinställningar.
* **Hur du ändrar:**
  * **Sajttitel (Title Tag):** Det som visas i webbläsarens flik.
  * **Beskrivning (Meta Description):** Den sammanfattande texten som visas i Googles sökresultat.
  * **Social Media Image (OG Image):** Bilden som visas när någon delar länken på Facebook, LinkedIn eller i iMessage.
* **Teststeg:**
  1. Ändra sajttiteln på svenska till `"Therese Järvheden | Officiell Hemsida"`. Spara.
  2. Ladda upp en ny delningsbild.
  3. Ladda om startsidan och håll muspekaren över webbläsarfliken för att verifiera den nya titeln.

### 8. Mediebibliotek
* **Syfte:** En översikt över alla dina råfiler i Supabase Storage.
* **Hur du ändrar:**
  * Ladda upp filer direkt härifrån.
  * Klicka på **Kopiera URL** för att snabbt kunna klistra in bild- eller ljudlänkar i övriga fält i CMS-panelen.
  * Klicka på **+ Lägg till i Portfolio** för att skicka en bild direkt till bildgalleriet utan extra krångel.

---

## 🔄 Tvinga synkning till databasen
Om din databas är tom eller om du vill återställa innehållet till sajtens standardvärden:
1. Klicka på **Tvinga Synk till DB** längst ner i sidofältet.
2. Systemet läser då in webbplatsens lokala JSON-filer och skriver över motsvarande poster i Supabase.
> [!WARNING]
> Detta rensar eventuella manuella ändringar du har sparat direkt i databasen och ersätter dem med sajtens grundmallar. Används främst vid nyinstallation.

---

## 🍊 Klick-guiden (Interaktiv Chat- & Steg-för-steg-guide)

Klick-guiden är en intelligent CMS-assistent integrerad direkt i Backstage-panelen. Du aktiverar den genom att klicka på den orangea bubblan med gnistrar (**Sparkles**-ikonen) längst ner till höger på skärmen.

```mermaid
graph TD
    A[Klicka på orangea Sparkles-bubblan] --> B[Ställ din fråga i chatten]
    B --> C[Gemini AI analyserar och skapar en klick-tur]
    C --> D[Fliken växlar automatiskt till rätt sektion]
    D --> E[Mål-elementet blinkar med en orange glöd och scrollas i fokus]
    E --> F[Följ instruktionen och klicka på 'Nästa']
    F --> G[Spara-knappen blinkar för att slutföra guiden]
```

### Så här använder du guiden:
1. **Fråga chatten:** Skriv en naturlig fråga på svenska, till exempel:
   * *"Hur ändrar jag röstinspelningar på mina meriter?"*
   * *"Jag vill uppdatera min biografi"*
   * *"Hur lägger jag till en ny showreel?"*
   * *"Hur ändrar jag sökmotorsoptimering?"*
2. **Kör turen:** Systemet startar en guidad tur. Du leds då steg-för-steg:
   * Systemet **växlar automatiskt flik** i CMS-sidomenyn till den flik där ändringen utförs.
   * Det specifika inmatningsfältet, knappen eller uppladdningsytan **börjar blinka med en varm orange glöd** och rullas mjukt in i mitten av skärmen.
   * En instruktionsruta visar exakt vad du förväntas göra i det steget.
3. **Navigering:** Klicka på **Nästa** för att gå till nästa steg, **Bakåt** för föregående, eller **Avbryt** för att avsluta turen när som helst.

### AI-modeller & Nyckelinställningar:
* **Gemini-modeller:** Guiden anropar Gemini API. Standardmodellen är `gemini-3.1-flash-lite`. Om anropet misslyckas eller når gränser, faller systemet automatiskt tillbaka i följande ordning:
  1. `gemini-3.5-flash`
  2. `gemini-3-flash-preview`
  3. `gemini-2.5-flash`
  4. `gemini-2.5-flash-lite`
* **API-nyckel:** Klicka på kugghjuls-/inställningsikonen (**Sliders**) i guidens rubrikrad. Här kan du ange och spara din personliga Gemini API-nyckel. Nyckeln sparas säkert lokalt i din webbläsare.
* **Offline-läge:** Om ingen API-nyckel har angetts, eller om anropen till alla modeller blockeras, använder Klick-guiden en inbyggd offline-simulering som kan matcha och guida dig igenom alla vanliga CMS-sysslor utan avbrott eller krascher!
