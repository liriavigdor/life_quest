---
name: game-art-craftsman
description: >-
  Advanced visual design and asset creation system for isometric village games and gamified interfaces.
  Replaces naive primitive geometry with rich, textured, architectural vector styling, lighting models,
  and elevated procedural rendering techniques.
---

# Game Art Craftsman Skill: Elevated Visual Design System

This skill defines the methodologies, architectural rules, and rendering techniques for creating rich, original, and visually complex game assets, moving far beyond naive geometric composites.

---

## 1. Why Naive Geometric Assembly Falls Short

When an agent glues simple polygons (`<rect>`, `<polygon>`, `<circle>`) together:
- Objects look like plastic blocks or rudimentary wireframe mockups.
- Surfaces lack tactile texture, grain, and micro-details.
- Lighting is flat (single solid fills per face without gradient falloff or ambient occlusion).
- Silhouettes are rigid and lack organic curves, wear, charm, or character.

---

## 2. Alternative High-Complexity Methodologies

To increase visual complexity and retain 100% design originality, use the following synergistic techniques:

### Method A: Isometric Multi-Pass Vector Art (The Architectural Layering Model)
Construct every asset using a **5-Pass Layered Pipeline**:
1. **Atmosphere & Shadow Base**: Ambient ground occlusion, soft elliptical cast shadows with directional offset and gaussian blur (`stdDeviation`).
2. **Structural Skeleton (Foundations & Silhouettes)**:
   - Use swooping Bézier curves (`C` / `Q` curves) for whimsical/medieval roofs, bowed wooden pillars, sagging eaves, rather than rigid straight lines.
   - Distinct isometric planes: Top face (Brightest), Left face (Medium key light), Right face (Deep ambient shadow).
3. **Surface Materials & Textures via SVG Gradients & Patterns**:
   - **Roofing**: Shingle patterns, staggered tile overlays, moss patches (`<pattern>` or procedural tile loops).
   - **Masonry**: Beveled cobblestone and brick relief lines with alternating light/shadow strokes (`stroke="#fff" strokeOpacity="0.2"` on the top edge, `stroke="#000" strokeOpacity="0.3"` on the bottom edge).
   - **Wood Timbering**: Planks with grain streaks, iron nails/rivets (`circle` with drop shadow), bracket crossbeams.
4. **Architectural Micro-Accents**:
   - Weathering, cracks, overgrown vines, banners with wind folds.
   - Volumetric items: Hanging glowing lanterns, glowing stained-glass mullions, chimney with layered translucent smoke puffs (`animate` or CSS pulse).
   - Prop staging: Barrels, crates, tool racks, steps, paved walkways.
5. **Dynamic Lighting & Shading**:
   - Multi-stop `<linearGradient>` with 45° sunlight angle.
   - Rim lighting / specular edge highlights on corners.
   - Internal emissive glow (`feDropShadow` or layered blur) for windows, runes, magical crystals, and fire.

---

### Method B: SVG Filter-Enhanced Stylization (Procedural Depth)
Utilize SVG filter graphs to create real relief without external 3D engines:
- **`feDropShadow` & `feGaussianBlur`**: Realistic contact shadows under eaves and overhangs.
- **`feTurbulence` & `feColorMatrix`**: Procedural stone roughness, parchment banner texture, or water ripples.
- **`feSpecularLighting`**: Metallic sheens on golden crests, crystal facets, and weapon blades.

---

### Method C: Canvas 2D Procedural Shader & Particle Layering
For assets that require organic animation or ultra-fine pixel/painterly aesthetics:
- Offscreen Canvas rendering with custom procedural noise for wood grain and grass blades.
- Dynamic particle emitters for chimney smoke, mystic floating sparks, and water fountain splashes.

---

## 3. Visual Grammar & Color Palette Rules

1. **Light Direction Standard**:
   - Universal Sun Source: Top-Left (315° / -45° azimuth, 60° elevation).
   - Light face: 85-95% brightness.
   - Mid-tone face: 65-75% brightness.
   - Shadow face: 40-50% brightness with cool ambient bounce (slight blue/purple tint in shadows).
2. **Edge Contrast (Bevel Technique)**:
   - Every joint between lit and unlit faces must have a 1px highlight line or chamfer to give physical volume.
3. **Silhouette Variation (The "Interesting Silhouette" Rule)**:
   - A building must never be a plain cube or pyramid.
   - Add overhangs, tiered roofs, dormer windows, balconies, chimneys, buttresses, and protruding signboards.

---

## 4. Implementation Checklist for Any Building / Asset

Before marking an asset complete, verify:
- [ ] Does it have soft ground contact shadows?
- [ ] Is there texture / material articulation (roof tiles, stonework, timber grain)?
- [ ] Are roofs curved or layered with eaves and trims rather than plain triangles?
- [ ] Does lighting use multi-stop gradients instead of flat hex colors?
- [ ] Are windows glowing or detailed with frames and glass sheen?
- [ ] Are there level-based progressive evolutions (e.g. Level 1 thatched hut → Level 4 gilded stone citadel)?
- [ ] Are micro-details present (chimneys, smoke, lanterns, banners, cobblestones)?
