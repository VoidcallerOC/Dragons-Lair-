# Dragon's Lair Hobbies

Official zero-build static storefront for Dragon's Lair Hobbies — Connecticut's tabletop hobby shop, with locations in Wallingford and Berlin.

## Design

An adventurer's-tavern **quest board**. Warm parchment cards on tavern-wood dark backgrounds, wax-seal buttons, brass-gold rules and hand-lettered section headers. Cinzel + IM Fell English SC + Inter for typography; wax red (`#a4271a`) and brass (`#b78a2f`) accents on a burnished black-brown ground.

## What's on the page

- Hero **quest board** with wax seal and pinned pushpin — the brand notice.
- Brand marquee ticker.
- **The Table** — three-pillar house rules: Browse, Paint, Play.
- **What We Carry** — six pinned quest cards for the top-level shelves (Warhammer 40k, Age of Sigmar, The Old World, Paint & Hobby, all TCGs, Accessories) + inline location cards with live open/closed.
- **The Codex** — accordions grouped by category, mapping to every subcategory URL on the main shop: Warhammer 40k factions, Age of Sigmar + The Old World, Paint & Hobby ranges (Vallejo, Scale 75, Two Thin Coats, Monument Hobbies, Citadel, Tamiya), and all ten trading card games.
- **Inside The Lair** — filterable photo gallery with lightbox.
- **Rally Point** — Discord CTA plus panels for Discord / Instagram / Facebook / full catalog.
- **FAQ** — six common visitor questions.
- **Visit** — dual visit cards for Wallingford and Berlin: correct addresses (220 North Colony St Ste C · 848 Farmington Ave Suite 2), per-day hours tables, live open/closed status per store, directions and events-calendar buttons, copy-address, embedded maps.
- Holiday closings note (Easter, Thanksgiving, Christmas).
- Closing CTA band + footer with policy links + mobile quick-action dock.

Logo is untouched.

## Run locally

```bash
python3 -m http.server 4173
```

Open http://localhost:4173. Product catalog and checkout still live on dragonslairhobbies.com — every category link is wired there.
