# Dragon's Lair Hobbies

Zero-build static storefront for Dragon's Lair Hobbies — Connecticut's tabletop headquarters, with locations in Wallingford and Berlin.

## What's here

- Modern dark editorial homepage (Fraunces serif + Inter + JetBrains Mono).
- Full category tree mirroring the live shop: Games Workshop (40k, Age of Sigmar, The Old World, Citadel, Black Library), Paint & Hobby (Vallejo, Scale 75, Two Thin Coats, Monument Hobbies, Tamiya), and ten Trading Card Games (MTG, Pokémon, Yu-Gi-Oh!, Gundam, Flesh & Blood, Riftbound, Star Wars: Unlimited, Lorcana, Altered, Elestrals).
- Accessories rail: Chessex, Dragon Shield, Element Card Sleeves.
- Store selector chip bar + live open/closed status driven by real store hours.
- Location cards with correct addresses (220 North Colony St Ste C, Wallingford · 848 Farmington Ave Suite 2, Berlin), per-day hours tables, and holiday-closings note.
- Community section with Discord, Instagram (@dragonslairtcg), Facebook.
- Photo gallery with lightbox, brand marquee, search filter, mobile-first layout.
- Vercel-ready zero-build deploy config.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. Product catalog and checkout still link to the main dragonslairhobbies.com storefront.
