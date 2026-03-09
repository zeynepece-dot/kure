# Kure (Web MVP)

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
- `tests` Vitest senaryolari
- `docs` kural referansi

## Kurulum
```bash
npm install
```

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
