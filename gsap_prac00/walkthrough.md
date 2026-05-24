# Walkthrough - GSAP Advanced Concepts Laboratory

We have successfully created a dedicated interactive playground/harness for the advanced GSAP concepts matching the tutorial guide.

## Changes Made

### Practice Harness Creation
- Created [gsap_advanced_concepts_lab.html](file:///d:/TT_vid/gsap_prac00/gsap_advanced_concepts_lab.html):
  - Theme colors set to dark base (`#090d16`) with purple branding gradients (`#a855f7`) for advanced concepts.
  - Features a split dashboard: left-side dropdown selector and description, code editor console, and solution viewer; right-side live render sandbox canvas with grid guides.
  - Programmed active window/document event listener tracking overrides, automatically cleaning up mousemove, mousedown, mouseup, and custom `gsap.ticker` render loops when switching challenges or clicking `RESET TEMPLATE`. This prevents browser window listener pollution and ensures smooth rendering.

### Exercises Included
The harness contains all 10 practice challenges covering the following:
1. **Ex 01: Global Defaults (`gsap.defaults`)**
2. **Ex 02: Responsive Media Query Bindings (`gsap.matchMedia`)**
3. **Ex 03: Coordinate Range Mapping (`gsap.utils.mapRange`)**
4. **Ex 04: Slider Boundary Confinement (`gsap.utils.clamp`)**
5. **Ex 05: Grid & Array Snapping (`gsap.utils.snap`)**
6. **Ex 06: Circular Wrapping / Infinite Loops (`gsap.utils.wrap`)**
7. **Ex 07: Array Distribution Utilities (`gsap.utils.distribute`)**
8. **Ex 08: Animating Pseudo-Elements via CSS Variables**
9. **Ex 09: Canvas Ticker Render Loop (`gsap.ticker`)**
10. **Ex 10: Draggable Friction Deceleration (Inertia simulation)**

---

## Validation & Verification

We ran the automated project check script:
```bash
npm run check
```

**Results:**
- **Linting:** `0 errors, 0 warnings`
- **Headless Chrome Validation:** `No console errors`
- **Layout Inspection:** `0 layout issues across 9 sample(s)`
