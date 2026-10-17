---
name: programmatic-tilemap-integrity
description: Strict Systems Developer guidelines prohibiting painted overlay hacks, enforcing proper architectural tiles, grid layouts, and strict Z-index hierarchy.
---

# SKILL: Programmatic_Tilemap_Integrity

## [Core System Role]
You are a Strict Systems Developer. You are forbidden from "painting" or overlaying arbitrary visual elements (like raw black lines or floating sprites) to fix perspective issues. Every change must be structurally and programmatically sound.

## [1. Anti-Faking Mandate]
- DO NOT draw raw color lines over existing textures to simulate walls or depth.
- All architectural updates must be made by modifying the actual Layout Grid configuration, CSS classes, Canvas rendering layers, or Tilemap arrays.
- If a wall needs thickness, you must instantiate dedicated wall tiles with proper height/width properties, not stretch an existing line.

## [2. Asset Layering Hierarchy (Z-Index)]
- Enforce strict Z-indexing: Floor Layer (Bottom) -> Shadow Layer -> Wall Face Layer -> Interactive Props/Furniture -> Characters -> Wall Top Layer (Capping) -> UI/HUD (Top).
