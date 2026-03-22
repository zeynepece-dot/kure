# Kure (Web MVP + Appwrite)

Fiziksel **Kure** oyununun mobil oncelikli dijital web versiyonu.

## Proje Amaci
- PDF kural setine dayali oynanabilir bir MVP sunmak
- 2 oyunculu yerel mod ve bilgisayara karsi mod sunmak
- Kolay / Orta / Zor AI seviyeleri sunmak
- Oyun motorunu UI'dan tamamen ayirmak

## Kural Kaynagi
Birincil kaynak: `/docs/kurallar.pdf`

Bu repoda ek olarak `/docs/kurallar-metin.txt` dosyasinda kullanici tarafindan paylasilan metin transkripti tutulur.

## Kural Analizi Ozeti (Dijital)
1. Oyun mor oyuncu ile baslar.
2. Taslar 7x7 tahtada karsilikli baslangic satirinda baslar.
3. Baslangic satirindaki tas: ileri veya capraz ileri 1 adim.
4. Baslangici terk eden tas: dikey/capraz 1 adim; yatay yasak.
5. Baslangici terk eden tas kendi baslangic satirina donemez.
6. Rakip tasi A-B-A biciminde sikistirinca B tasini alirsin.
7. Rakibin iki tasi arasina giren tas, rakibin bir sonraki hamlesine karsi korunur.
8. Rakip baslangic satirinda ayni anda en fazla 1 tas bulunabilir.
9. Rakibin 4 tasini oyundan cikarirsan kazanirsin.
10. Hamle gecmisinden geri alma desteklenir.

## Varsayimlar
1. Tahta boyutu PDF metninde acik verilmedigi icin kutu gorseline gore **7x7** kabul edildi.
2. Sikistirma kurali bitisik `A-B-A` modeli olarak yorumlandi.
3. Ayni hamlede birden fazla rakip tas sikisiyorsa hepsi alinabilir kabul edildi.
4. Madde 8 (dortlu yasak) baslangic dizilimini kilitlememesi icin oyuncunun **kendi baslangic satirindaki taslari muaf** yorumlandi.
5. Hakem/uyari/saat maddeleri MVP'de tam hakem simule edilmeden bilgi seviyesiyle sinirlandi.

## Teknik Mimari
- UI: Next.js App Router + React + Tailwind CSS
- State: Zustand
- Motor: `src/lib/game` altinda saf fonksiyonlar
- AI: `src/lib/ai` altinda moduler seviyeler
- Backend servis katmani: provider-agnostic arayuz + Appwrite implementasyonu
- Test: Vitest

### Motor-UI Ayrimi
UI kurallari bilmez. UI sadece su API'leri cagirir:
- `createInitialGameState`
- `getCurrentPlayer`
- `getValidMoves`
- `applyMove`
- `undoMove`
- `checkWinner`
- `evaluateBoard`

## Klasor Yapisi
- `src/app` sayfalar (`/`, `/game`, `/rules`)
- `src/components` tahta ve panel bilesenleri
- `src/store` Zustand store
- `src/lib/game` oyun motoru
- `src/lib/ai` AI katmani
- `src/lib/backend` backend tipleri, adapter arayuzleri ve serializer'lar
- `src/services` Appwrite auth ve database servisleri
- `tests` Vitest senaryolari
- `docs` kural referansi

## Kurulum
```bash
npm install
```

## Environment Variables
`.env.local` icine su degiskenleri ekleyin:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_SAVED_GAMES_COLLECTION_ID=saved_games
```

Supabase env degiskeni bu repoda aktif degil. Eski bir kurulum varsa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` gibi degiskenleri kaldirin.

## Appwrite Kurulumu
1. Appwrite panelinde bir `Project` olusturun.
2. Web platformu ekleyin ve local origin'inizi tanimlayin.
3. Bir database olusturun.
4. `saved_games` collection'unu olusturun.
5. Asagidaki attribute'lari ekleyin:
   - `userId`: string, required, indexed
   - `name`: string, required
   - `gameMode`: string, required
   - `difficulty`: string, required
   - `state`: string, required
   - `moveHistory`: string, required
6. Document permissions'i sadece document sahibi kullaniciya okuma/guncelleme/silme verecek sekilde ayarlayin.

Not: Bu surumde Appwrite JSON attribute destegi varsayilmadi. `state` ve `moveHistory` alanlari JSON string olarak saklaniyor. Panelde JSON attribute kullanacaksaniz `src/lib/backend/serializers.ts` icindeki TODO mantigina gore serializer'i uyarlayin.

## Calistirma
```bash
npm run dev
```

## Test
```bash
npm test
```

## Build
```bash
npm run build
```

## Lint
```bash
npm run lint
```

## Test Kapsami
- Baslangic durumu
- Gecerli/gecersiz hamle
- Hamle uygulama
- Oyuncu sirasi degisimi
- Kazanma kosulu
- Geri alma
- AI'nin yalnizca gecerli hamle secmesi
- Easy/Medium/Hard fonksiyonlarinin stabil calismasi

## Gelecekte Gelistirme Alanlari
1. Gercek zamanli online mod
2. Saat/uyari/hakem kurallarinin tam dijital yaptirimi
3. Daha gelismis AI arama derinligi ve transposition table
4. Animasyonlu tas hareketleri ve ses geri bildirimi
5. Appwrite Storage ile avatar veya disa aktarma dosyasi akislari
