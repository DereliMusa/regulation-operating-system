# Certra — MVP · Style Guide · Kurumsal Web Sitesi Referans Dokümanı

> **Not:** `Certra` bu dokümanda geçici bir çalışma adıdır (certification + traceability). Kendi marka adınla `Find & Replace` yaparak değiştirebilirsin.
>
> **Amaç:** Bu doküman, UI tasarımını üretmeden önceki *tek referans kaynağı*dır. Üç bölümden oluşur: (1) tasarım sistemi/Style Guide, (2) ürün yazılımının (SaaS) sayfa yapısı ve özellikleri, (3) kurumsal web sitesinin sayfa yapısı ve instruction'ları. MVP göstermeliktir — çalışması gerekmez, sadece ekranların ve akışın belli olması yeterlidir.
>
> **Dil kararı:** Ürün EU/İngilizce pazara hitap ettiği için **arayüz metinleri (label, buton, başlık) İngilizce**; bu dokümanın açıklamaları Türkçe. Bu ayrımı tasarımda koru.

---

## 0. Bu doküman nasıl kullanılır

- **Style Guide (Bölüm 1)** her ekranda ve her sayfada bağlayıcıdır — renk, tipografi, boşluk, bileşen davranışları buradan gelir. Devamlılık bunu takip etmene bağlı.
- **Uygulama (Bölüm 2)** ürün yazılımının ekranlarıdır. Her sayfada: *amaç → bölümler → kullanılan bileşenler → basit wireframe* verildi.
- **Kurumsal Web (Bölüm 3)** pazarlama sitesidir; ürün ekranlarından bağımsız ama aynı marka kimliğini kullanır.
- ASCII wireframe'ler yalnızca yerleşimi gösterir; final görselleri sen üreteceksin.

---

# BÖLÜM 1 — STYLE GUIDE (Tasarım Sistemi)

## 1.1 Tasarım ilkeleri

Certra bir "cihazın güvenli olduğunu kanıtlayan dosyayı" hazırlatan bir üründür. Kimliğin özü: **hassasiyet, izlenebilirlik ve güven.** Süslemeye değil, netliğe yatırım yap.

1. **Sakin ve hassas.** Regülasyon aracı; heyecanlı değil güven veren. Renk az, boşluk çok, hiyerarşi net.
2. **Kenarlık > gölge.** Yüzeyleri ince hairline çizgilerle ayır, ağır gölgelerden kaçın. "Flat, temiz, yeni yazılım" hissi.
3. **Veri yoğun ama nefes alan.** Tablolar, matrisler, statü rozetleri çok olacak; bunları sıkışmadan hizala. İki yoğunluk modu sun (Comfortable / Compact).
4. **AI içeriği her zaman görünür şekilde işaretlidir.** Regülasyon bağlamında "bunu AI mı yazdı, insan mı onayladı" ayrımı kritiktir. AI üretimi/önerisi kendi rengini (mor) ve etiketini taşır. Bu bir stil tercihi değil, güven gereksinimidir.
5. **Statü dili tutarlıdır.** Approved / In review / Deficiency / Draft renkleri tüm üründe aynı anlama gelir.
6. **İmza öğesi: Traceability Thread.** Bağlı kayıtlar (Risk ↔ Test ↔ Clinical ↔ GSPR) ince bağlantı çizgileriyle ve mono kodlu referans çipleriyle (`GSPR 10.2`, `ISO 14971`, `RISK-014`) gösterilir. Ürünün hatırlanacak tek görsel imzası budur.

## 1.2 Renk paleti

Ana palet dar ve soğuk-temiz. Aksan tek: signal blue. Statü ve AI renkleri *fonksiyoneldir*, dekorasyon için kullanılmaz.

| Token | Hex | Kullanım |
|---|---|---|
| `--bg` | `#F5F7FA` | Uygulama arka planı (soğuk, temiz kağıt) |
| `--surface` | `#FFFFFF` | Kartlar, paneller, tablo satırları |
| `--surface-2` | `#FAFBFC` | İkincil yüzey / zebra satır |
| `--ink` | `#0E1B2C` | Ana metin + marka mürekkebi (koyu lacivert) |
| `--ink-soft` | `#55627A` | İkincil metin, açıklamalar |
| `--ink-muted` | `#8A94A6` | Placeholder, pasif metin |
| `--line` | `#E4E9F0` | Hairline kenarlıklar, ayraçlar |
| `--primary` | `#2456E6` | Signal blue — birincil aksiyon, linkler, seçili durum |
| `--primary-ink` | `#1B45C4` | Primary hover / basılı |
| `--primary-wash` | `#EAF0FF` | Primary'nin açık zemini (seçili satır, chip) |

**Statü renkleri (semantik — anlamları sabittir):**

| Durum | Hex | Zemin | Anlam |
|---|---|---|---|
| Approved / Conforme | `#1E8E5A` | `#E7F5EE` | Onaylı, uygun |
| In review / Pending | `#B9770A` | `#FBF1DE` | İncelemede, beklemede |
| Deficiency / Non-conforme | `#C43D3D` | `#FBE9E9` | Eksiklik, uygunsuzluk |
| Draft / Neutral | `#6B7688` | `#EEF1F5` | Taslak, nötr |

**AI içerik rengi (ayrı ve özel):**

| Token | Hex | Zemin | Kullanım |
|---|---|---|---|
| `--ai` | `#6D5AE6` | `#F0EDFD` | AI üretimi/önerisi; "AI draft", "Suggested by AI" rozetleri, AI paneli kenarı |

> **Kural:** AI'ın ürettiği hiçbir metin, insanın yazdığı/onayladığı metinle *aynı görünmez.* AI çıktısı ya mor kenarlı bir panelde ya da `AI draft` rozetiyle sunulur; insan onayından sonra normal metne dönüşür.

## 1.3 Tipografi

Amaç: modern + teknik + okunur. Varsayılan "her yerde Inter" hissinden kaçınmak için display'i ayırıyoruz; veri-yoğun UI için gövdede güçlü bir işçi font tutuyoruz; regülasyon kodları için mono kullanıyoruz (bu bir imza kararı).

| Rol | Font | Neden |
|---|---|---|
| **Display / başlık** | `Geist` (alternatif: `Space Grotesk`) | Teknik, hassas, karaktere sahip ama ciddi |
| **Body / UI** | `Inter` | Yoğun tablolarda/formlarda en iyi okunurluk |
| **Mono / kod** | `Geist Mono` (alt: `IBM Plex Mono`) | GSPR/ISO/risk referans kodları, audit trail, ID'ler |

**Tip skalası (px / line-height / weight):**

| Stil | Boyut | LH | Weight | Kullanım |
|---|---|---|---|---|
| Display | 32 | 40 | 600 | Sayfa başlığı (web hero'da 48–64) |
| H1 | 24 | 32 | 600 | Ekran başlığı |
| H2 | 20 | 28 | 600 | Bölüm başlığı |
| H3 | 16 | 24 | 600 | Kart/panel başlığı |
| Body | 14 | 22 | 400 | Varsayılan UI metni |
| Body-strong | 14 | 22 | 500 | Vurgulu satır |
| Small | 13 | 20 | 400 | Yardımcı metin |
| Caption | 12 | 16 | 500 | Etiket, tablo başlığı (uppercase, +0.04em) |
| Mono | 13 | 20 | 500 | Referans kodları, ID |

Kurallar: Başlıklar `sentence case` (ALL CAPS yok, sadece Caption uppercase). Sayısal veri ve para için tabular figürler kullan.

## 1.4 Boşluk, grid, köşe yarıçapı

- **Boşluk ölçeği (4px tabanı):** `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
- **Grid:** İçerik max genişlik 1280px; uygulama gövdesi 12 kolon, 24px gutter.
- **Köşe yarıçapı (sade → küçük):** kart `10px`, panel `10px`, input/buton `8px`, chip/rozet `6px`, avatar `full`. Pill/oval abartısı yok.
- **Yoğunluk:** Comfortable satır yüksekliği 44px, Compact 36px. Tablolar iki modu da desteklesin.

## 1.5 Yükseklik, gölge, kenarlık

- Varsayılan ayrım **1px `--line` kenarlık**tır.
- Gölge yalnızca yüzen katmanlarda (dropdown, modal, popover):
  - `--shadow-sm`: `0 1px 2px rgba(14,27,44,.06)`
  - `--shadow-md`: `0 8px 24px rgba(14,27,44,.10)` (modal/popover)
- Focus halkası: `0 0 0 3px rgba(36,86,230,.30)` — klavye erişilebilirliği için her etkileşimli öğede görünür.

## 1.6 İkonografi

- Tek çizgi (stroke) ikon seti, `1.5px` kalınlık (örn. Lucide/Phosphor stili). Dolu ikon yok.
- Boyutlar: 16 (satır içi), 20 (buton), 24 (nav).
- Renk: varsayılan `--ink-soft`; aktif `--primary`.

## 1.7 Bileşenler (temel kütüphane)

Her bileşen için varsayılan görünüm + durumları tanımla.

**Buttons**
- `Primary`: dolu `--primary`, beyaz metin. Ana aksiyon (Generate, Send for approval).
- `Secondary`: beyaz zemin, `--line` kenarlık, `--ink` metin.
- `Ghost`: zeminsiz, hover'da `--surface-2`.
- `Danger`: `--deficiency` dolu; yalnızca yıkıcı işlemler.
- Boyut: sm 32px, md 40px, lg 44px. İkon+metin arası 8px.

**Inputs & forms**
- Yükseklik 40px, `--line` kenarlık, focus'ta `--primary` kenarlık + focus halkası.
- Label üstte (Caption), altında opsiyonel yardım metni (Small, `--ink-muted`).
- Hata durumu: kenarlık `--deficiency`, altında kırmızı yardım metni.
- Elektronik form alanları: text, dropdown, number, date, file upload, rich-text (doküman alanları için).

**Status badge / chip**
- Küçük yuvarlak-köşe rozet: nokta + etiket. Renkler 1.2'deki statü tablosundan.
- Örn: `● Approved` (yeşil), `● In review` (amber), `● Deficiency` (kırmızı), `● Draft` (gri), `✦ AI draft` (mor).

**Reference chip (imza)**
- Mono metinli çip: `GSPR 10.2`, `ISO 14971:2019`, `RISK-014`, `TEST-207`. Zemin `--surface-2`, hover'da linkli (ilgili kayda gider).

**Tables / matrisler**
- Sticky header (Caption, uppercase). Zebra opsiyonel. Satır hover `--primary-wash`.
- Statü kolonu her zaman rozetle. Satır sonunda `⋯` aksiyon menüsü.
- Traceability matrisi: hücrelerde ✓ / ◐ / ✗ ve bağlantı çizgileri.

**Cards / panels**
- Beyaz yüzey, `--line`, 10px radius, 16–24px iç boşluk. Başlık (H3) + opsiyonel sağ aksiyon.

**Tabs**
- Alt çizgi (underline) sekme; aktif sekme `--primary` alt çizgi + `--ink` metin.

**Modal / drawer**
- Modal: ortada, max 560px, `--shadow-md`, arkada `rgba(14,27,44,.4)` overlay.
- Drawer: sağdan kayar (detay/inceleme için), 480–640px.

**Toast**
- Sağ alt, 4sn. Başarı yeşil sol şerit, hata kırmızı. Metin aksiyonla tutarlı ("Sent for approval", "Draft generated").

**Empty state**
- İkon + tek cümle yönlendirme + tek `Primary` aksiyon. Örn: "No technical files yet. Create your first file to start."

## 1.8 Yazım / microcopy kuralları

- Aktif fiil, sentence case: `Save changes`, `Send for approval`, `Generate draft`.
- Bir aksiyon baştan sona aynı isimle anılır (`Publish` butonu → `Published` toast).
- Sistemi değil kullanıcının kontrol ettiği şeyi adlandır: "Notifications", "webhook config" değil.
- Hata mesajı özür dilemez, ne olduğunu ve nasıl düzeltileceğini söyler.
- Boş ekran davet eder, aksiyon önerir.

---

# BÖLÜM 2 — UYGULAMA (SaaS) SAYFA YAPISI & ÖZELLİKLER

## 2.0 Global layout

Tüm iç sayfalar sol **sidebar** + üst **topbar** + içerik alanından oluşur.

```
┌───────────┬─────────────────────────────────────────────┐
│  SIDEBAR  │  TOPBAR: [Breadcrumb]     [Search][🔔][Avatar]│
│           ├─────────────────────────────────────────────┤
│ ▣ Dashboard                                              │
│ ▣ Technical Files      İÇERİK ALANI                       │
│ ▣ AI Documents         (sayfaya göre değişir)             │
│ ▣ Change & Approvals                                     │
│ ▣ Post-Market                                            │
│ ▣ Auditor Sim.                                           │
│ ▣ Standards Library                                      │
│ ─────────                                                │
│ ⚙ Settings                                               │
└───────────┴─────────────────────────────────────────────┘
```

- Sidebar: logo üstte, modül ikonları + etiket, aktif öğe `--primary-wash` zemin + `--primary` sol şerit.
- Topbar: solda breadcrumb, sağda global arama, bildirim, kullanıcı menüsü.

---

## 2.1 Login / Auth

**Amaç:** Basit giriş. (MVP'de kayıt tek adım, doğrulama yok.)

**Bölümler:** Sol yarı marka görseli/claim, sağ yarı form (Email, Password, `Sign in` primary, `Forgot password`, altta `Book a demo` linki).

```
┌───────────────┬───────────────────────────┐
│  Certra        │   Sign in                 │
│  MDR/IVDR      │   [ Email            ]     │
│  technical     │   [ Password         ]     │
│  files, done   │   [   Sign in   ]  primary │
│  right.        │   Forgot password?         │
└───────────────┴───────────────────────────┘
```

---

## 2.2 Dashboard (Genel Bakış)

**Amaç:** Kullanıcı girer girmez uyum durumunu, bekleyen işleri ve yaklaşan takvimleri görür.

**Bölümler (kartlar):**
1. **Compliance readiness** — büyük yüzde (ör. %72) + halka grafik, en zayıf 3 alan.
2. **Active technical files** — sayı + statü dağılımı (mini bar).
3. **Pending approvals** — bekleyen onay listesi (kısa), her biri statü rozetli.
4. **AI activity** — son AI taslakları (mor rozetli), "3 drafts awaiting review".
5. **Upcoming deadlines** — PSUR/PMS/PMCF takvim öğeleri, tarih + gün sayacı.
6. **Deficiency risk** — auditor simülasyonunun işaretlediği açık eksiklikler.

```
┌──────────────┬───────────────┬───────────────┐
│ Readiness 72%│ Active files 8│ Pending appr 5│
│   ◔ ring     │ ▮▮▮▯ status   │ • Change #14  │
├──────────────┴───────────────┼───────────────┤
│ AI activity                  │ Upcoming      │
│ ✦ 3 drafts awaiting review   │ PSUR — 12 days│
├──────────────────────────────┴───────────────┤
│ Deficiency risk: 4 open findings              │
└───────────────────────────────────────────────┘
```

---

## 2.3 Technical Files (Liste)

**Amaç:** Tüm cihaz teknik dosyalarını tek listede yönetmek.

**Bölümler:** Üstte filtre bar (class, status, notified body, arama) + `New technical file` primary. Altında tablo.

**Tablo kolonları:** Device name · Class (I/IIa/IIb/III) · Regulation (MDR/IVDR) · Notified Body · Readiness % · Status · Last updated · `⋯`.

```
[ Search…]  [Class ▾][Status ▾][NB ▾]        [ New technical file ]
┌────────────────────────────────────────────────────────────────┐
│ Device            Class  Reg   NB       Ready  Status           │
│ Glucose Meter X   IIa    IVDR  SZUTEST   78%   ● In review      │
│ Cardio Stent      III    MDR   —          41%   ● Deficiency    │
│ Wound Dressing    I      MDR   n/a        95%   ● Approved      │
└────────────────────────────────────────────────────────────────┘
```

---

## 2.4 Technical File Detail (Dosya Çalışma Alanı)

**Amaç:** Bir cihaza ait teknik dosyanın tüm modüllerini tek yerde toplamak. Ürünün kalbi burasıdır.

**Yapı:** Üstte dosya başlığı + readiness + `Run auditor sim` / `Generate document` aksiyonları. Altında **tab'lı çalışma alanı:**

- **Overview** — readiness kırılımı, eksik bölümler, sorumlular.
- **Electronic Forms** — yapılandırılmış veri toplama (cihaz tanımı, amaç, kullanıcı, sınıf). ERP tarzı süreç adımları.
- **GSPR Matrix** — GSPR maddeleri × uygunluk × dayanak dokümanı × standart. Her satır rozetli, referans çipleriyle bağlı.
- **Risk (ISO 14971)** — risk register; her risk `RISK-xx`, bağlı test ve klinik kanıt çipleri.
- **Clinical / CER** — klinik değerlendirme durumu ve kanıt kaynakları.
- **V&V / Tests** — doğrulama-validasyon test listesi, `TEST-xx`.
- **Traceability** — imza görünüm: Risk ↔ Test ↔ Clinical ↔ GSPR bağlantı matrisi + thread çizgileri.
- **Documents** — doküman kontrol (versiyon, statü, e-imza durumu).

```
Glucose Meter X · IVDR · Class IIa · SZUTEST      Ready 78%
[ Run auditor sim ]  [ Generate document ]

[ Overview | Forms | GSPR | Risk | Clinical | V&V | Traceability | Docs ]
┌──────────────────────────────────────────────────────────────┐
│ GSPR MATRIX                                                    │
│ Req         Conformity   Evidence        Standard             │
│ GSPR 1      ✓            [DOC-04]        [ISO 14971]           │
│ GSPR 10.2   ◐ partial    [RISK-014]      [IEC 62366-1]  ●rev  │
│ GSPR 17.1   ✗ missing    —               —              ●def  │
└──────────────────────────────────────────────────────────────┘
```

---

## 2.5 AI Document Generator ★ (talep edilen sayfa)

**Amaç:** Dosyadaki yapılandırılmış veriden yola çıkarak AI'ın regülasyon dokümanı taslağı üretmesi; insanın satır satır gözden geçirip düzenlemesi ve onaylaması.

**Akış:** `Doküman tipi seç → kaynak veri seç → Generate → yan yana inceleme → kabul/düzenle → dosyaya ekle → onaya gönder`.

**Bölümler:**
1. **Sol panel — Setup:** Document type (CER, GSPR rationale, Risk Management Report, PMS Plan, PMCF Plan, PSUR, Declaration of Conformity...), kaynak teknik dosya, opsiyonel şablon/standart seçimi, `Generate draft` primary.
2. **Orta — AI Draft:** Mor kenarlı panel, üstte `✦ AI draft` rozeti. Bölüm bölüm üretilmiş metin. Her paragrafın yanında `↺ regenerate` / `✎ edit` / `✓ accept`.
3. **Sağ panel — Sources:** AI'ın hangi veriye dayandığı (kaynak çipleri: `RISK-014`, `GSPR 10.2`, `TEST-207`). Şeffaflık — "bunu neye göre yazdı".

**Alt bar:** `Save as draft` (secondary) · `Send for approval` (primary).

```
┌────────────┬─────────────────────────────┬──────────────┐
│ SETUP      │ ✦ AI DRAFT — CER            │ SOURCES      │
│ Type ▾ CER │ ┌─ mor kenar ─────────────┐ │ Based on:    │
│ File ▾     │ │ 1. Scope & purpose      │ │ [RISK-014]   │
│ Standard ▾ │ │   …generated text…  ✎ ✓ │ │ [GSPR 10.2]  │
│            │ │ 2. Clinical background  │ │ [TEST-207]   │
│ [Generate] │ │   …generated text…  ↺ ✎ │ │ [DOC-04]     │
│            │ └─────────────────────────┘ │              │
├────────────┴─────────────────────────────┴──────────────┤
│                     [ Save as draft ]  [ Send for approval ]│
└──────────────────────────────────────────────────────────┘
```

---

## 2.6 Change Control & Approvals ★ (talep edilen sayfa)

**Amaç:** Bir değişikliği (doküman, GSPR dayanağı, risk, versiyon) onaya göndermek; etki analizini görmek; onay zincirini ve e-imzayı yönetmek.

**İki görünüm:**

**A) Liste** — bekleyen/geçmiş değişiklik talepleri.
Kolonlar: Change ID · Title · Type · Requested by · Impact · Status · Assignee · `⋯`.

**B) Detay (drawer/sayfa)** — tek değişikliğin künyesi:
- **Summary:** ne değişiyor, neden.
- **Impact analysis:** hangi kayıtlar etkilenir (bağlı GSPR/Risk/Test/CER çipleri). Bu, "change impact analysis" özelliğidir.
- **Approval chain:** sıralı onaylayanlar, her adım statü rozetli (Pending / Approved / Rejected).
- **E-signature:** onaylayan kişi + zaman damgası (mono).
- **Aksiyonlar:** `Approve` (primary), `Request changes` (secondary), `Reject` (danger).

```
LIST
┌──────────────────────────────────────────────────────────┐
│ ID     Title              Impact        Status            │
│ CHG-14 Update CER v2      3 records     ● In review       │
│ CHG-13 Revise RISK-014    5 records     ● Approved        │
└──────────────────────────────────────────────────────────┘

DETAIL (drawer)
┌ CHG-14 · Update CER v2 ──────────────────────────────────┐
│ Impact: [CER][GSPR 10.2][RISK-014]                        │
│ Approval chain:                                           │
│   1. QA Lead        ● Approved   ✎ 2026-06-20 09:12       │
│   2. RA Manager     ● Pending                             │
│ [ Reject ]  [ Request changes ]  [ Approve ] primary      │
└──────────────────────────────────────────────────────────┘
```

---

## 2.7 Post-Market (PMS / PMCF / PSUR)

**Amaç:** Piyasaya arz sonrası gözetim planlarını ve takvimlerini izlemek.

**Bölümler:**
- **Timeline / calendar:** PMS, PMCF, PSUR öğeleri tarih ekseninde; yaklaşan olanlar renk kodlu.
- **Plans tablosu:** Plan type · Device · Next due · Owner · Status.
- **Quick action:** `Generate PSUR draft` → AI Document Generator'a bağlanır.

```
┌ Post-market timeline ────────────────────────────────────┐
│  Jun ──●PMS review── Jul ──────●PSUR due── Aug            │
├──────────────────────────────────────────────────────────┤
│ Plan   Device          Next due     Status               │
│ PSUR   Glucose Meter X  2026-07-13   ● In review          │
│ PMCF   Cardio Stent     2026-09-01   ● Draft              │
└──────────────────────────────────────────────────────────┘
```

---

## 2.8 Auditor Simulation (Denetçi Simülasyonu)

**Amaç:** AI'ın bir denetçi gibi teknik dosyayı taraması, eksiklikleri (deficiency) işaretlemesi ve sahte bir deficiency report üretmesi. Ürünün en güçlü satış argümanı.

**Bölümler:**
1. **Run panel:** Dosya seç + `Run simulation` primary. Çalışırken adım adım ilerleme (Scanning GSPR… Checking traceability… Reviewing CER…).
2. **Findings list:** Her bulgu — severity (Critical/Major/Minor), ilgili madde çipi, açıklama, öneri. Kırmızı/amber rozetli.
3. **Mock deficiency report:** Denetçi diliyle özet; `Export` ve `Create change requests` (bulguları CHG'ye çevirir).

```
[ File ▾ Glucose Meter X ]   [ Run simulation ]

Findings (4)
┌──────────────────────────────────────────────────────────┐
│ ● Critical  [GSPR 17.1]  Missing electrical safety evid.  │
│ ● Major     [CER]        Literature search not documented │
│ ● Minor     [RISK-014]   Residual risk rationale unclear  │
└──────────────────────────────────────────────────────────┘
[ Export report ]   [ Create change requests ]
```

---

## 2.9 Standards & Library (Standartlar / Kütüphane)

**Amaç:** Harmonize standartlar ve şablonlar için başvuru kütüphanesi.

**Bölümler:** Arama + filtre; standart listesi (`ISO 13485`, `ISO 14971`, `IEC 62366-1`, `IEC 62304`...) durum bilgisiyle (harmonised / superseded); şablon galerisi (CER, PMS, Risk report...) → `Use in AI generator`.

---

## 2.10 Settings

**Amaç:** Kurum, kullanıcılar/roller, notified body bilgisi.

**Sekmeler:** Organization · Members & roles (Admin / RA / QA / Viewer) · Notified body · Notifications · Billing (statik).

---

# BÖLÜM 3 — KURUMSAL WEB SİTESİ (Instruction)

Aynı marka kimliği; ama pazarlama tonu. Hero'lar iddialı olabilir, ama abartısız — hedef kitle regülasyon profesyonelleri, güven arıyorlar.

## 3.0 Global (her sayfada)

**Üst navigasyon (sticky):**
`Certra` (logo) · **Product** ▾ · **Solutions** ▾ · **Pricing** · sağda `Sign in` (ghost) + `Book a demo` (primary).

- Product ve Solutions birer **mega-menu**; alt sayfalar 3.2 ve 3.3'teki gibi listelenir.

**Footer:** 4 kolon — Product (alt sayfalar), Solutions (alt sayfalar), Company (About, Contact), Legal (MDR/IVDR disclaimer, Privacy) + tekrar `Book a demo`.

---

## 3.1 Anasayfa (Home)

**Amaç:** İlk 5 saniyede "MDR/IVDR teknik dosyanı AI ile hazırla ve denetime hazır tut" mesajını vermek.

**Bölümler (sırayla):**
1. **Hero:** Kısa iddialı başlık + tek cümle alt başlık + `Book a demo` (primary) / `See the product` (secondary). Sağda ürün ekranı görseli (Technical File Detail veya AI Generator).
   - Başlık yönü (örnek): *"MDR & IVDR technical files, built to pass."*
2. **Problem şeridi:** Sektörün acısı, 3 çarpıcı istatistik kartı (ör. ilk başvuruların ~%75'i ciddi eksik içerir; tek eksik standart ~1 yıl gecikme; MDR incelemesi ortalama 13–18 ay). *Sayıları kendi doğruladığın kaynaklardan koy.*
3. **Nasıl çalışır (3 adım):** Collect data → Generate with AI → Send for approval & pass audit.
4. **Özellik vitrini:** 4–6 modül kartı (Technical File Builder, AI Document Generation, Traceability & GSPR, Change & Approvals, Post-Market, Auditor Simulation) — her biri ilgili Product alt sayfasına link.
5. **Farklılaşma / neden Certra:** Niş odak (yalnızca MDR/IVDR teknik dosya), AI-first, insan-onaylı iş akışı. Kısa karşılaştırma cümleleri.
6. **Sosyal kanıt (opsiyonel/placeholder):** logolar veya tek güçlü alıntı yeri.
7. **Kapanış CTA:** Geniş bant — "Book a demo" + tek cümle.

```
[ HERO: başlık + alt başlık + CTA'lar ]   [ ürün görseli ]
[ 75% ][ 1 yıl ][ 13–18 ay ]  ← problem istatistikleri
[ 1 Collect → 2 Generate → 3 Approve ]
[ modül kartları x6 ]
[ neden Certra ]
[ CTA bandı: Book a demo ]
```

---

## 3.2 Product (+ alt sayfalar)

**Product ana sayfası:** ürünün bütününü anlatan üst sayfa; altında tüm modüllere kartlarla giriş. Mega-menüde şu **alt sayfalar** listelenir (her biri MVP modülüne birebir karşılık gelir):

| Alt sayfa | Karşılık geldiği MVP modülü |
|---|---|
| **Technical File Builder** | Technical File Detail + Electronic Forms |
| **AI Document Generation** | AI Document Generator |
| **Traceability & GSPR Mapping** | Traceability + GSPR Matrix |
| **Change Control & Approvals** | Change & Approvals |
| **Post-Market (PMS/PMCF/PSUR)** | Post-Market |
| **Auditor Simulation** | Auditor Simulation |

**Her Product alt sayfası aynı şablonu kullanır:**
1. Odak hero (modülün tek cümlelik değeri + ilgili ürün ekranı görseli).
2. "Bu neyi çözer" — 2–3 acı noktası.
3. Özellik detayları (3–4 alt başlık + görsel).
4. İlgili modüllere çapraz linkler.
5. CTA bandı (`Book a demo`).

---

## 3.3 Solutions (+ alt sayfalar)

**Solutions ana sayfası:** "kime / hangi durum için" odağı. Ürün modüllerini *müşteri segmentine ve regülasyona* göre paketler. Mega-menüde şu **alt sayfalar:**

| Alt sayfa | Odak |
|---|---|
| **For Startups & SMEs** | Birincil müşteri: küçük/orta üretici. Az kaynakla denetime hazır olmak. |
| **MDR (2017/745)** | Tıbbi cihaz üreticileri; GSPR, CER, sınıflandırma. |
| **IVDR (2017/746)** | In-vitro tanı üreticileri; performans değerlendirme, IVDR sınıfları. |
| **For Regulatory Affairs teams** | RA/QA ekipleri ve danışmanlar; iş akışı, onay, izlenebilirlik. |

**Her Solutions alt sayfası şablonu:**
1. Hero — o segmentin diliyle vaadi.
2. O segmentin özel acıları (SME için maliyet/personel; IVDR için performans kanıtı vb.).
3. Certra bunu nasıl çözer — ilgili modüllere link.
4. Kısa senaryo / iş akışı.
5. CTA bandı.

---

## 3.4 Pricing

**Amaç:** Şeffaf, güven veren fiyat sunumu (SimplerQMS'in şeffaflık yaklaşımı iyi bir örnek). MVP'de statik.

**Bölümler:**
1. Başlık + tek cümle ("Transparent pricing. No hidden setup fees.").
2. **Plan kartları (3):** ör. *Starter / Growth / Enterprise* — her kartta: kime uygun, fiyat (veya "Custom"), kapsanan modüller listesi (✓), tek `Book a demo` CTA'sı.
3. **Karşılaştırma tablosu:** özellik × plan (✓ / ◐ / —); senin platformun aksan rengiyle vurgulu.
4. **SSS:** fiyat, kurulum, kullanıcı lisansları hakkında 4–6 soru.
5. CTA bandı.

```
[ Starter ]  [ Growth ]  [ Enterprise ]
  SME'ler     Büyüyen      Kurumsal
  €—/ay       €—/ay        Custom
  ✓ modüller  ✓ modüller   ✓ tümü
  [Book demo] [Book demo]  [Talk to us]

[ Karşılaştırma tablosu: feature × plan ]
[ SSS ]
```

---

## 3.5 Book a Demo

**Amaç:** Tek net dönüşüm sayfası.

**Bölümler:**
- Sol: kısa başlık + "demoda ne göreceksin" 3 madde + (opsiyonel) tek alıntı/logo.
- Sağ: form — Name, Work email, Company, Role (RA/QA/Founder…), Regulation (MDR/IVDR/both), Message; `Request demo` (primary).
- Form altında güven notu ("We'll respond within 1 business day.").

```
┌ Book a demo ────────────────┬───────────────────────┐
│ See Certra on your own file. │ [ Name          ]     │
│ • AI-drafted CER in minutes  │ [ Work email    ]     │
│ • Live traceability matrix   │ [ Company       ]     │
│ • Auditor simulation demo    │ [ Role ▾ ][ Reg ▾ ]  │
│                              │ [ Message       ]     │
│                              │ [ Request demo ] prim │
└──────────────────────────────┴───────────────────────┘
```

---

# BÖLÜM 4 — Sonraki adımlar (opsiyonel)

- **Sayfa öncelik sırası (tasarıma başlarken):** Login → Dashboard → Technical File Detail → AI Document Generator → Change & Approvals → Auditor Simulation → (kalan uygulama sayfaları) → Web: Home → Product → Solutions → Pricing → Book a demo.
- **Marka adı** kesinleşince `Certra`'yı değiştir; logo ve favicon Style Guide renkleriyle uyumlu olsun.
- **Görsel üretiminde** her ekranı önce Comfortable yoğunlukta tasarla, sonra Compact varyantını türet.
- Bu doküman büyüdükçe (yeni modül, yeni alt sayfa) aynı şablon mantığını koru; devamlılık buradan gelir.

---
*Referans: Yapı ve şeffaflık yaklaşımı için SimplerQMS'in modüler eQMS ve şeffaf fiyat kurgusu örnek alındı; tasarım kimliği (renk, tipografi, traceability imzası) Certra'ya özgü ve bağımsızdır.*
