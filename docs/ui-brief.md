# PROJECT DESIGN BRIEF: PMK MIPA UNDANA WEBSITE
-------------------------------------------------------------------------
PROJECT NAME    : PMK MIPA Undana Official Web
PLATFORM        : Responsive Web (Desktop & Mobile)
TARGET AUDIENCE : Mahasiswa Baru (Maba), Mahasiswa Lama, Alumni
DESIGN KEYWORDS : Modern, Warm, Academic, Spiritual, Clean
TECH STACK      : Next.js + Tailwind CSS (Vercel Deployment)
-------------------------------------------------------------------------

## 1. DESIGN SYSTEM & VISUAL GUIDELINES

### A. Color Palette (The "Golden Hour" Scheme)
Bertujuan menciptakan nuansa hangat (kekeluargaan) namun tetap kontras dan terbaca.

* **Primary (Brand)** : #FFC107 (Amber 400)
    * Usage: Main CTA Buttons, Highlights, Icons, Active States.
* **Secondary (Text)** : #111827 (Gray 900)
    * Usage: Headings, Body Text, Footer Background.
* **Background (Canvas)** : #FAFAFA (Neutral 50)
    * Usage: Main Page Background (avoid pure white for eye comfort).
* **Surface (Cards)** : #FFFFFF (White)
    * Usage: Cards, Modals, Dropdowns.
* **Accent (Soft)** : #FEF3C7 (Amber 100)
    * Usage: Section Backgrounds, Badges, Hover Tints.
* **Success/Safe** : #10B981 (Emerald 500)
    * Usage: WhatsApp Button, Success Messages.

### B. Typography
* **Headings (H1-H3)** : "Merriweather" or "Playfair Display" (Serif)
    * Feel: Authoritative, Biblical, Academic, Elegant.
* **Body Text (P, Span)** : "Inter" or "DM Sans" (Sans-Serif)
    * Feel: Modern, Clean, High Readability on Mobile.

### C. UI Components & Spacing
* **Corner Radius** : 12px (Rounded for friendly feel).
* **Shadows** : Soft diffuse shadows (`shadow-lg` in Tailwind) for floating cards.
* **Whitespace** : Generous padding (min `py-20` or 80px) between sections to prevent clutter.

---

## 2. SITEMAP & PAGE BREAKDOWN

### PAGE 1: HOMEPAGE (LANDING)
*Goal: First Impression, Emotional Hook, & Quick Information.*

**Structure & Wireframe:**
1.  **Sticky Navbar**
    * Left: Logo PMK MIPA.
    * Center: Home | Tentang Kami | Kegiatan | Kontak.
    * Right: Pill-shaped Button "Gabung Sekarang" (Solid Amber).
2.  **Hero Section (Full Height)**
    * **Background:** High-res photo of students gathering/worshipping + Dark Gradient Overlay (Bottom-up).
    * **Content (Center):**
        * H1 (Serif): "Iman yang Bertumbuh, Logika yang Utuh."
        * Subtext: "Keluarga rohani mahasiswa MIPA Undana. Tempat di mana studimu didukung, dan imanmu dikuatkan."
        * CTA: "Lihat Keseruan Kami" (Outline Button or Arrow).
3.  **Value Props (3 Cards Row)**
    * Card 1: Icon [Graduation Cap] - "Akademik Prioritas".
    * Card 2: Icon [Smiley/HighFive] - "Komunitas Fun".
    * Card 3: Icon [Briefcase] - "Koneksi Alumni" (USP).
4.  **Spiritual Core (Full Width)**
    * Background: Accent Color (#FEF3C7).
    * Content: Watermark Logo PMK (Opacity 5%).
    * Text: Quote Kolose 3:14 (Large Italic Serif).
5.  **Upcoming Events (Grid)**
    * Display next 2-3 events with clear Date/Time badges.
6.  **Footer**
    * Background: Secondary Color (#111827). Text: White.

### PAGE 2: TENTANG KAMI (ABOUT)
*Goal: Trust Building & Humanizing the Organization.*

**Structure & Wireframe:**
1.  **Header Hero**
    * Image: Full Team BPH (Badan Pengurus Harian) in Almamater.
    * Title: "Melayani dengan Hati, Berkarya dalam Sains."
2.  **History Timeline (Vertical)**
    * Layout: Vertical line with nodes.
    * Content: Year Established -> Key Milestones -> Current Vision.
3.  **Meet The Team (Grid)**
    * Layout: 3 or 4 columns responsive.
    * Card: Photo (Circle/Rounded) + Name (Bold) + Major (Grey).
    * *Must include:* Ketua, Sekretaris, Bendahara.
4.  **Alumni Network**
    * Visual: Map of Indonesia or Grid of Company Logos where alumni work.
    * Copy: "Mentorship dari kakak tingkat yang telah sukses di bidangnya."

### PAGE 3: KEGIATAN & PELAYANAN (ACTIVITIES)
*Goal: Information Clarity & Recruitment.*

**Structure & Wireframe:**
1.  **Weekly Schedule (Cards)**
    * Layout: Horizontal Cards.
    * **Design Logic:**
        * Friday Service Card: Amber Border. Content: "Jumat, 16.00 @ Aula".
        * Tuesday Prayer Card: Dark Border. Content: "Selasa, 17.00 @ Sekret".
    * Action: "Add to Calendar" icon button on each card.
2.  **Ministry Divisions (2x2 Grid)**
    * Card Style: Icon + Title + Short Description.
    * Items:
        * Musik & Pujian (Worship).
        * Multimedia & Design (Creative).
        * Pemerhati (Care/Counseling).
        * Penginjilan (Outreach).
    * Interaction: Hover effect -> "Join This Division".
3.  **Gallery Carousel**
    * Slider showing: Retreat, Easter, Christmas, Outdoor activities.

### PAGE 4: HUBUNGI KAMI (CONTACT)
*Goal: Conversion (Joining/Prayer Requests).*

**Structure & Wireframe:**
1.  **Split Screen Layout (Desktop) / Stacked (Mobile)**
    * **Left Side (Info):**
        * Photo: Entrance of Secretariat Building.
        * Map: Google Maps Embed (Small).
        * Social Buttons: WhatsApp (Green) & Instagram (Gradient).
    * **Right Side (Form Card):**
        * Background: White with Shadow.
        * Input Fields: Nama, Jurusan, No WA.
        * **Dropdown Subject (Critical):**
            * "Saya ingin bergabung"
            * "Permohonan Doa / Curhat"
            * "Pertanyaan Umum"
        * Button: "Kirim Pesan" (Full Width, Amber).

---

## 3. ASSETS & CONTENT REQUIREMENTS

### Imagery
* **Tone:** Candid, Bright, Natural Lighting, Genuine Smiles.
* **Avoid:** Generic stock photos of western people. Use actual documentation photos provided by client.
* **Optimization:** Convert all images to WebP format for performance on Vercel.

### Icons
* **Style:** Line/Stroke Icons (e.g., Heroicons or Phosphor Icons).
* **Weight:** Medium/Regular.

---

## 4. INTERACTION & ANIMATION NOTES

* **Hover States:** Buttons should darken slightly or lift up (`translate-y-1`) on hover.
* **Transitions:** Smooth fade-in for page loads.
* **Mobile Menu:** Hamburger menu must be easily tappable (min height 44px).
* **Sticky Header:** Background becomes semi-transparent blur (`backdrop-blur-md`) when scrolling down.