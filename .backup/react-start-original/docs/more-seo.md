Here is my unfiltered opinion on the SEO plan you provided, followed by insights
from my deep-dive research into Therese Järvheden’s digital footprint, and a
list of strategic additions you should implement to guarantee the new site ranks
high and fast.

### My Unfiltered Opinion on Your SEO Plan

**The good:** Your technical and AEO (Answer Engine Optimization) blueprint is
brilliant. Moving her away from Webnode to a modern, crawlable stack (like
Next.js/TanStack) is the single most important step. Your strategy to use
semantic HTML (real `<table>` for CVs) and heavy JSON-LD (`Person`,
`VideoObject`, `FAQPage`) is exactly how you feed modern AI overviews
(Gemini/Perplexity) and Google's Knowledge Graph. Furthermore, conceding the
head terms ("svensk skådespelerska") to Wikipedia and focusing on long-tail
dialect/intent keywords ("skånsk dialekt skådespelare") is highly realistic and
smart.

**The blind spots:** The plan assumes she exists in a vacuum solely as an
actress. It entirely misses **two massive external search intents** associated
with her name that currently dominate her Google SERP, and it overlooks a major
digital asset she already owns. If you don't account for these, Google's entity
mapping will get confused, and you'll leave easy traffic on the table.

---

### Deep-Dive: Who is Therese Järvheden on Google Today?

After researching her current web presence, three distinct patterns emerge that
must be addressed in your SEO build:

1. **The "Famous Husband" Association:** She is married to the highly successful
   Swedish comedian and musician **Thomas Järvheden**. A huge chunk of the
   search volume around her name actually stems from gossip/entertainment
   queries (e.g., people searching "Thomas Järvheden fru", "Thomas Järvheden
   familj", "Thomas Järvheden barn"). Articles from _Nyheter24_ and _Hänt_
   currently dominate her SERP because of this.
2. **The "Dual Entity" Problem:** Therese is not just an actress; she is also a
   specialized skin therapist who runs a clinic in Sollentuna called **Lyster
   Hudvård** (and works with other clinics like Mandy Medical/Active Care).
   Google’s AI currently struggles to separate "Therese Järvheden the Actress"
   from "Therese Järvheden the Skin Therapist".
3. **The Hidden Goldmine (Her YouTube Channel):** The SEO plan suggests hosting
   showreels on YouTube/Vimeo. But she _already has_ a YouTube channel
   (`@theresejarvheden7066`) with 31 videos. Some of her clips from
   _Karatefylla_ have gone viral (e.g., "Konferansligg - Karatefylla" has
   **211,000 views**, "Barnkalas" has **62,000 views**).

---

### What ELSE We Can Do to Rank the Website Higher (Action Plan)

To supercharge the website build, integrate these additions into your current
strategy:

#### 1. Hijack the "Wife of Thomas Järvheden" Search Traffic

Since magazines like _Nyheter24_ are currently stealing her brand SERP by
writing about her relationship, you should reclaim that traffic directly on her
site.

- **Action:** In the FAQ block (`/` or `/om`), add a specific question: _"Är
  Therese Järvheden gift med Thomas Järvheden?"_
- **Answer:** _"Ja, Therese är gift med komikern och artisten Thomas Järvheden.
  Tillsammans har de tre barn."_
- **Why:** By adding this to your `FAQPage` schema, you give Google the exact
  snippet it needs to answer relationship queries directly via her official
  site, bypassing tabloid sites.

#### 2. Solve the "Dual Entity" Confusion

If Google thinks she is a skincare clinic, it won't rank her for acting jobs.
You must explicitly draw a line between her two professions so the Knowledge
Graph understands.

- **Action:** Add a small, elegant section in the footer or the "Om" page
  saying: _"Letar du efter min hudvårdsklinik? Besök [Lyster Hudvård](#)."_
- **Action:** In your JSON-LD `Person` schema, explicitly add her skincare
  business to the `sameAs` array, but keep the primary `jobTitle` as
  `"Skådespelerska, Röstskådespelare"`. This tells Google: _"Yes, this is the
  same Therese, but this specific website is about her acting."_

#### 3. Weaponize Her Existing YouTube Channel

Do not upload new showreels from scratch if you don't have to. You have a
massive SEO asset in her existing YouTube channel that already has authority.

- **Action:** Embed her high-performing YouTube clips (like the _Karatefylla_
  sketches) directly onto the `/showreels` or `/comedy` page.
- **Action (Crucial Backlink):** Go into her YouTube Studio and edit the
  descriptions of _every single video_ on her channel. Add: _"Officiell hemsida:
  https://www.theresejarvheden.se"_ to the very top of the description. This
  instantly gives the new website 31 high-authority backlinks from Google-owned
  properties the second the site goes live.

#### 4. Optimize for Specific Series / Character Names

When people search for actors, they often search the show name + the character.
My research shows she was in _Kärlek & anarki_ (as Madeleine), _Beck – Utan
uppsåt_ (as Marias lärare), _Jävla klåpare_ (as Cissi), and _Hålla samman_. She
also dubbed the mother (Alice) in the SVT broadcast of _Familjen Valentin_.

- **Action:** In your HTML CV `<table>`, add a column for **"Karaktär"
  (Character)**.
- **Action:** Expand the `performerIn` JSON-LD schema to include the characters.
  This allows AI engines to confidently answer queries like _"Vem spelade
  Madeleine i Kärlek och Anarki?"_

#### 5. Bypass Wikipedia Notability with Wikidata

Your plan suggests creating a Wikipedia stub. The Swedish Wikipedia community is
notoriously strict about "notability" (relevanskriterier) and often deletes
stubs for smaller actors.

- **Action:** Instead of just Wikipedia, build her a **Wikidata** item. Wikidata
  has much lower barriers to entry. Create an item for her, link her IMDb ID,
  her spouse (Thomas Järvheden), her profession (actor), and her new official
  website. Google pulls heavily from Wikidata to generate the Knowledge Panel on
  the right side of the desktop search results.

#### 6. Audio SEO for the "Skånska" USP

Since her dialect (Skånska) is a Unique Selling Proposition (USP) for voice
acting, don't just write about it.

- **Action:** On the `/voice` route, host native `<audio>` HTML tags for her
  voice samples. Name the actual files semantically:
  `therese-jarvheden-rostprov-skanska-reklam.mp3`. Audio files with clear
  surrounding text and semantic filenames are increasingly indexed for AEO
  voice-search queries by casting directors.
