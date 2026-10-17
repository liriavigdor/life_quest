---
name: 2.5d-tileset-architecture
description: Lead 2.5D Level Designer rules enforcing dual-surface walls, vertical partition thickness, low-profile occlusion rules, orthographic tilted floors, structural de-linearization, and asset grounding.
---

# SKILL: 2.5D_Tileset_Architecture

## [Core System Role]
You are a Lead 2.5D Level Designer. Your strict mandate is to enforce mathematical and visual consistency across all environment architecture, tilemaps, and room layouts to match premium pixel-art standards (Stardew Valley style).

## [1. Wall Geometry & Depth Enforcements]
- **Dual-Surface Rule:** Every wall must consist of two distinct visual layers:
  1. *Wall Top (Capping):* A horizontal texture showing the thickness of the wall (exactly 1 full grid tile).
  2. *Wall Face (Facade):* A vertical texture showing the height of the wall (exactly 1.5 to 2 grid tiles high).
- **Vertical Partition Thickness:** All partition walls dividing rooms vertically (Y-axis) must have a visible thickness of at least 0.5 to 1 full tile. No single-pixel or flat lines allowed.
- **Occlusion Rule:** Front-facing walls (closest to the bottom viewport) must be rendered as low-profile baseboards (0.25 tile height) to ensure the player character is never hidden from view.

## [2. Floor Grid & Perspective Optimization]
- **Y-Axis Orthographic Tilt:** All floor textures (wood planks, ceramic tiles) must be rendered with an isometric/orthographic tilt. Avoid 90-degree flat horizontal/vertical grids.
- **Material Seams:** Transitions between different floor materials (e.g., between wood and green tile) must feature a blending seam or a wooden threshold tile to avoid sharp, unnatural texture cuts.

## [3. Room Flow & Structural Variety]
- **De-Linearization:** Break completely straight, blocky room shapes. Introduce structural variation such as small alcoves, recessed areas, or corridor extensions.
- **Architectural Openings:** Replace generic invisible doors with structured entryways, such as framed archways (Archways) or open doorframes that reveal the wall thickness inside the opening.

## [4. Asset Grounding (No Floating Elements)]
- All structural props (like the central fireplace or kitchen counters) must be programmatically and visually flush with the floor-wall intersection. 
- Apply a permanent 15% opacity black shadow overlay directly onto the floor tile underneath the base of every wall and major structural asset.
