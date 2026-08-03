import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very basic .env parser
const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'] || process.env.VITE_SUPABASE_URL;
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'] || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Seeding SEO content to Supabase...");

  const pressContent = {
    ingress: "Therese Järvheden är en svensk skådespelerska och röstskådespelare med bas i Malmö och Stockholm. På den här sidan samlas pressbilder i hög upplösning, showreels och pressmaterial — fritt att använda för redaktioner, casting directors och produktionsbolag i samband med omnämnanden av Therese. Ange fotograf där det anges vid bilden.",
    pressbilder_text: "Samtliga pressbilder finns i webbupplösning och högupplöst originalformat. Klicka på nedladdningsikonen på respektive bild. Bilderna omfattar porträtt, headshots för drama och komedi, scenbilder samt bilder från produktioner som SVT:s En våldsam kärlek, Karatefylla, Jävla klåpare och Beck-filmen Utan uppsåt.\n\nBehöver du en specifik bildtyp, ett annat format eller en bild i tryckupplösning — hör av dig via kontaktformuläret så skickas den samma dag.",
    showreels_text: "Thereses showreels är uppdelade i drama, komedi och röst så att du snabbt hittar rätt material. Reelerna kan bäddas in eller länkas i redaktionellt sammanhang.\n\n- Huvudshowreel — ett tvärsnitt av Thereses arbete inom drama och komedi.\n- Drama — scener från SVT:s En våldsam kärlek och Beck Utan uppsåt.\n- Komedi — material från Karatefylla, Jävla klåpare och Anna Blomberg show.\n- Reklam & röst — reklamfilmer och röstuppdrag, inklusive skånsk reklamröst.\n\nBehöver du en obeskuren fil eller en klippsekvens för sändning, kontakta agenturen.",
    bio_short: "Therese Järvheden är svensk skådespelerska och röstskådespelare, verksam inom drama, komedi och voice over. Aktuell i SVT:s En våldsam kärlek. Baserad i Malmö och Stockholm.",
    bio_long: "Therese Järvheden är en svensk skådespelerska och röstskådespelare med bas i Malmö och Stockholm. Hon har spelat teater och musikal sedan barndomen och är i TV mest känd från humorproduktioner som Kristallennominerade Karatefylla, Jävla klåpare och Anna Blomberg show. Inom drama har hon setts i Beck-filmen Utan uppsåt som läraren Nora, och senast i SVT:s dramadokumentär En våldsam kärlek. Hon anlitas flitigt som röstskådespelare, bland annat för sin skånska reklamröst och som dubbningsröst i barnserien Familjen Valentin. Hon representeras av Schultzberg Agency.",
    fakta_text: "",
    presskontakt: "Agentur för skådespeleri: Schultzberg Agency. Direktkontakt för röstuppdrag och pressförfrågningar via formuläret. Svar normalt inom ett dygn."
  };

  const voiceContent = {
    ingress: "Therese Järvheden är svensk röstskådespelare och gör voice over, speakerröst, berättarröst, reklamröst och dubbning på svenska och engelska. Hon är en av få professionella röster som levererar både genuin skånska och ren rikssvenska — samma röst, två helt olika känslor. Lyssna på röstproven nedan och boka direkt.",
    rostprov_text: "Två röstprov finns att lyssna på direkt i webbläsaren:\n- Skånsk reklamröst — varm, nära, med humor. Den röst som anlitats i radio- och TV-reklam.\n- Svensk voice over & dubbning — neutral rikssvenska för berättarröst, e-learning, företagsfilm och dubbning.\n\nBehöver du ett skräddarsytt röstprov på ditt eget manus? Skicka texten så spelas ett kort provläsning in, oftast inom 24 timmar.",
    vad_therese_gor: "- Reklamröst — radio, TV och digitala kampanjer, svenska och engelska.\n- Speakerröst & berättarröst — dokumentär, företagsfilm, e-learning och podcast-intro.\n- Dubbning — bland annat mamman i barnserien Familjen Valentin för SVT.\n- Karaktärsröster — komedi och humor, med bakgrund från Karatefylla och Jävla klåpare.\n- Voice over på skånska — den nisch där få professionella svenska röstskådespelare kan leverera trovärdigt.",
    varfor_skanska: "Skånskan bär värme, humor och närhet på ett sätt rikssvenskan inte gör. För varumärken som riktar sig mot Skåne och södra Sverige — eller som vill låta mänskliga snarare än polerade — är en autentisk skånsk röst det som gör att reklamen känns lokal. Therese växlar obehindrat mellan bred skånska, mjuk skånska och ren rikssvenska i samma inspelning.",
    sa_gar_det_till: "1. Förfrågan — skicka manus, önskad ton och leveransdatum.\n2. Provläsning — kort röstprov på ditt manus, normalt inom ett dygn.\n3. Inspelning — studioinspelning i Malmö eller Stockholm, alternativt fjärrinspelning med regi via länk.\n4. Leverans — torra filer eller färdigredigerat, WAV eller MP3, med en omtagningsrunda inkluderad.",
    teknik_leverans: "Studiokvalitet, WAV 48 kHz/24 bit eller MP3 enligt önskemål. Fjärrinspelning med realtidsregi för dig som vill sitta med under sessionen. Normal leveranstid 1–3 arbetsdagar, expressleverans möjlig."
  };

  const { data, error } = await supabase
    .from('biography')
    .update({ 
      press_page_content: pressContent,
      voice_page_content: voiceContent
    })
    .eq('id', 1);

  if (error) {
    console.error("Error updating database:", error);
  } else {
    console.log("Successfully seeded SEO content to Supabase!");
  }
}

run();
