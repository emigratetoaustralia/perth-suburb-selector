# perth-suburb-selector

A Bulgarian-language quiz that recommends Perth suburbs to new arrivals based on budget, lifestyle character, and transport preference. Built as a free tool for the Емигрирай в Австралия community.

## Live

Coming soon.

## What it does

Asks 3 questions — budget, lifestyle character, and transport preference — and returns a ranked list of Perth suburbs with weekly rent ranges, public transport ratings, and honest caveats. Gated behind the free tier of the Емигрирай в Австралия Patreon.

## Stack

Static PWA. No backend, no dependencies, no build step.

- `index.html` — quiz flow and result UI
- `suburbs.js` — all suburb data, rent ranges, descriptions, tags
- `quiz.js` — filter engine, sort logic, toggle logic

## Licence

Code: MIT

Content copyright: suburb descriptions, opinions, and caveats © Emigrate to Australia — emigratetoaustralia.info. All rights reserved.
