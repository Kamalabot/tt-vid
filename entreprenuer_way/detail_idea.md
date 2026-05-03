# Detailed Idea 1: The Geometry of Business

This document expands on the abstract geometry concept, providing precise timings, shape definitions, and technical notes for building it with GSAP and the Hyperframes framework.

## 1. Visual Lexicon (CSS Shapes)
Instead of complex SVGs, we use simple DOM elements styled with CSS to ensure perfect rendering and easy manipulation.

* **The Entrepreneur (`.entrepreneur`):** A smooth Blue Circle (`border-radius: 50%`).
* **The Problem (`.problem`):** A jagged Red Polygon (created using CSS `clip-path: polygon(...)`).
* **The Product (`.product`):** A glowing Yellow Triangle or Star (`clip-path` or simple SVG).
* **The Team (`.team-member`):** Small, sharp Squares of different colors (e.g., Orange, Purple, Cyan, Pink).
* **The Customers (`.customer`):** Gray Circles that turn bright Green when happy.
* **The Profit (`.coin`):** Tiny golden-yellow circles.

---

## 2. Scene-by-Scene Timeline (45 Seconds)

### Scene 1: The Problem & The Spark (0s - 15s)
**Hyperframe Setup:** `<div class="clip scene-1" data-start="0" data-duration="15" data-track-index="1">`

* **0s - 5s: The Struggle**
  * `.problem` sits in the center of the screen, vibrating rapidly.
  * **GSAP:** A repeating timeline moving `x` and `y` by small amounts (e.g., `[-5, 5]`) with a `RoughEase` or linear ease to simulate chaos.
* **5s - 10s: Observation**
  * `.entrepreneur` smoothly slides in from the left side of the screen and stops right next to the vibrating `.problem`.
  * **GSAP:** `x` translation using `Power2.easeOut`.
* **10s - 15s: The Solution**
  * `.problem` rapidly shrinks to nothing (`scale: 0`, `opacity: 0`).
  * Simultaneously, `.product` pops out of the top of the `.entrepreneur` with a bouncy, elastic animation.
  * **GSAP:** `scale: 1` with `Elastic.easeOut` for the product pop.

### Scene 2: Building the Machine (15s - 30s)
**Hyperframe Setup:** `<div class="clip scene-2" data-start="15" data-duration="15" data-track-index="1">`

* **15s - 20s: Taking Center Stage**
  * The `.entrepreneur` (now holding the `.product`) moves to the absolute center of the screen.
* **20s - 25s: Hiring the Team**
  * Four `.team-member` squares pop into existence, surrounding the `.entrepreneur` in a circular or grid formation.
  * **GSAP:** `scale` from 0 to 1, using `stagger: 0.2` to make them pop in one by one.
* **25s - 30s: The Work Process**
  * The central `.product` duplicates itself. The duplicates fly back and forth between the `.team-member` squares, representing operations/production.
  * **GSAP:** Fast `x` and `y` position tweens on the product clones.

### Scene 3: The Flow of Profit (30s - 45s)
**Hyperframe Setup:** `<div class="clip scene-3" data-start="30" data-duration="15" data-track-index="1">`

* **30s - 40s: Processing Customers**
  * A continuous line of `.customer` (gray circles) slides in from the left edge of the screen.
  * They hit the central team structure, pause for a split second, change color from gray to green, and then slide off the right edge.
  * **GSAP:** A looped `staggerTo` moving them across the `x` axis, with a `backgroundColor` tween happening at the midpoint.
* **40s - 45s: Ultimate Success**
  * As the customers exit off-screen, a fountain of `.coin` elements shoots upward from the center team.
  * A simple SVG line graph draws itself in the background, trending sharply upwards.
  * **GSAP:** `y` translations and `opacity` fades for the coins. An SVG `stroke-dashoffset` animation to draw the graph line.

---

## 3. Hyperframe Technical Rules Checklist
When we start coding this in `index.html`, we must follow these framework constraints:

1. **Clip Classes:** Every scene container will have `class="clip"`, along with `data-start`, `data-duration`, and `data-track-index`. Hyperframes will automatically hide/show scenes based on the playhead.
2. **GSAP Registration:** We must initialize our master timeline and attach it to the window object so the Hyperframe renderer can scrub it deterministically:
   ```javascript
   window.__timelines = window.__timelines || {};
   const tl = gsap.timeline({ paused: true });
   window.__timelines["main-composition"] = tl;
   // Build animations on 'tl'
   ```
3. **Absolute Determinism:** We cannot use `Math.random()` for the coin fountain or customer stream. We must hardcode fixed offsets (e.g., `i * 10`) in a loop so that every frame renders exactly the same way during video export.
4. **Scoping:** Ensure any DOM selections (like `document.querySelectorAll('.customer')`) are scoped properly if we break this down into sub-compositions later.
