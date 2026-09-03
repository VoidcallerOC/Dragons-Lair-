# Dragon's Lair Hobbies

Zero-build static storefront for Dragon's Lair Hobbies — Connecticut's tabletop headquarters, with locations in Wallingford and Berlin.

Rebuilt in the "Cabinet OS" pattern used across the shop's other sibling sites — a CRT arcade-cabinet interface (Press Start 2P + VT323, dark phosphor palette, sticky HUD with live open/closed status, boot screen, attract-mode marquee, chunky panels with hard drop-shadows) themed for tabletop instead of video games.

## What's here

- Boot / title-screen hero with attract-mode slideshow of the actual shop photos and a keyboard-navigable main menu.
- Attract ticker of every brand and game system.
- Faction Select — six category tiles (40k, Age of Sigmar, The Old World, Paint & Hobby, Trading Cards, Accessories).
- Community bonus stage with Discord CTA.
- How We Play — 3-column BROWSE / PAINT / PLAY manual plus per-store event calendar links.
- Paint & Hobby accordion — every Vallejo, Scale 75, Two Thin Coats, Monument Hobbies, Citadel, Tamiya sub-line linked to the main shop.
- TCGs accordion — all ten trading card games.
- Codex Access accordion — every 40k, AoS, and Old World faction.
- Photo Mode — filterable gallery of the shop photos.
- Online Hub — Discord, Instagram, Facebook, full catalog.
- Two Visit terminals with per-day hours tables, live open/closed status, correct addresses (220 North Colony St Ste C, Wallingford · 848 Farmington Ave Suite 2, Berlin), and holiday-closings note.
- Sticky HUD with store selector (Wallingford / Berlin) that swaps the live status.
- Mobile drawer with the same tree.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. Product catalog and checkout still link to the main dragonslairhobbies.com storefront.
