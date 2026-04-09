# Monis Workspace Designer

Interactive workspace builder for `monis.rent` built for the Desent coding challenge.

## Live Features

- Select a desk from 3 options.
- Select a chair from 3 options.
- Add and remove accessories (monitor, lamp, plant, notebook stand, speaker).
- Live visual workspace preview that updates in real time.
- Summary/checkout panel with itemized monthly pricing.
- Preset setups for fast exploration (`Minimal Set`, `Developer Pro`, `Calm Creator`).
- Basic product constraints (for example monitor max quantity).

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Deployed on Vercel

## Local Development

```bash
npm install
npm run dev
```
## Link Vercel
https://monis-rent-delta.vercel.app/

Then open `http://localhost:3000`.

## Write-Up (Approach)

I focused on a product-like user flow first: choose furniture, see visual feedback instantly, and finish with a clear checkout summary. The UI is intentionally visual and lightweight so users can experiment quickly without feeling like they are filling a form.

Technical choices were made to keep iteration fast and maintainable:

- App Router page stays simple and renders a dedicated client component for interaction.
- Config data (desks/chairs/accessories/presets) is colocated with the builder for a compact MVP.
- State is managed with React hooks and derived totals are computed with memoization.
- Preview uses layered shapes and accessory markers for immediate visual response.

If given more time, I would improve:

- Drag-and-drop placement and snapping in preview.
- Better 2.5D/3D visuals and richer item-specific illustrations.
- URL-persisted configurations for sharing setups.
- Full accessibility audit and expanded keyboard interactions.
- API-backed catalog and checkout submission flow.

## Submission Checklist

- Live URL: deploy to Vercel and add it here.
- GitHub repository: push this code and share repo link.
- Add collaborator `desent-bot` with **Read** access.
- Include this README write-up (approach, tech choices, improvements).
