# GSAP v3 SVG Animation: 25 Practice Problems & Solutions

Welcome to the GSAP SVG Animation Practice Lab. This guide contains 25 structured, hands-on challenges designed to build your skills in animating Scalable Vector Graphics (SVG) using GSAP v3 and its core plugins.

The problems are divided into four tiers of increasing complexity:
1. **Level 1: Core SVG Transform & Attribute Basics (Problems 1–7)**
2. **Level 2: Timeline Coordination & Custom Easing (Problems 8–14)**
3. **Level 3: Paths, Strokes, and Motion Paths (Problems 15–20)**
4. **Level 4: Advanced Interaction, Viewports, and Sync (Problems 21–25)**

---

## Level 1: Core SVG Transform & Attribute Basics

### Problem 1: Basic Translation with SVG Transforms
* **Difficulty:** Easy
* **Category:** Translation & Looping
* **Problem Statement:** Animate a green circle from left to right across a `400px` canvas. The circle should move smoothly to the right, bounce back to the start, and loop infinitely.
* **Key Concepts:** `x`, `duration`, `ease`, `repeat: -1`, `yoyo: true`.

#### Starting HTML Setup
```html
<svg width="400" height="100" style="background: #0f172a; border-radius: 8px;">
  <circle class="ball" cx="50" cy="50" r="20" fill="#10b981" />
</svg>
```

#### GSAP Solution
```javascript
gsap.to(".ball", {
  x: 300,            // Translates by 300px along the x-axis
  duration: 1.5,
  ease: "power1.inOut",
  repeat: -1,        // Loops infinitely
  yoyo: true         // Reverses direction on alternate repeats
});
```

#### Explanation
By using `x: 300`, GSAP updates the CSS transform matrix (`transform: translateX(300px)`) of the circle. This is highly performant because it leverages the browser's compositor rather than forcing layout recalculations. `repeat: -1` and `yoyo: true` combined create a seamless back-and-forth ping-pong animation.

---

### Problem 2: Center-Point Rotation on SVG Shapes
* **Difficulty:** Easy
* **Category:** Rotation & Origin
* **Problem Statement:** Rotate a gear graphic 360 degrees infinitely around its true center.
* **Key Concepts:** `rotation`, `transformOrigin`, `ease: "none"`.

#### Starting HTML Setup
```html
<svg width="200" height="200" viewBox="0 0 200 200" style="background: #0f172a; border-radius: 8px;">
  <!-- A group representing a simple cross/gear shape -->
  <g id="gear">
    <rect x="90" y="40" width="20" height="120" fill="#ea580c" rx="4" />
    <rect x="40" y="90" width="120" height="20" fill="#ea580c" rx="4" />
    <circle cx="100" cy="100" r="25" fill="#f97316" />
    <circle cx="100" cy="100" r="10" fill="#0f172a" />
  </g>
</svg>
```

#### GSAP Solution
```javascript
gsap.to("#gear", {
  rotation: 360,
  transformOrigin: "50% 50%", // Anchor to the exact center of the group
  duration: 3,
  ease: "none",               // Linear speed is essential for continuous loops
  repeat: -1
});
```

#### Explanation
By default, SVG elements rotate around the SVG canvas origin `(0, 0)` rather than their own centers. GSAP resolves this by reading the bounding box and setting `transformOrigin: "50% 50%"` (or `"center center"`). Using `ease: "none"` prevents the gear from accelerating and decelerating, resulting in a smooth, continuous spin.

---

### Problem 3: Squash and Stretch (Multi-Axis Scale)
* **Difficulty:** Easy / Medium
* **Category:** Scaling & Anchoring
* **Problem Statement:** Create a bouncing ball that falls down, squashes flat on impact with the floor, and stretches vertically when ascending.
* **Key Concepts:** `scaleX`, `scaleY`, `y`, `transformOrigin`, `yoyo`, `repeat`.

#### Starting HTML Setup
```html
<svg width="200" height="300" viewBox="0 0 200 300" style="background: #0f172a; border-radius: 8px;">
  <circle id="bouncing-ball" cx="100" cy="50" r="15" fill="#ec4899" />
  <line x1="20" y1="280" x2="180" y2="280" stroke="#334155" stroke-width="4" />
</svg>
```

#### GSAP Solution
```javascript
const tl = gsap.timeline({ repeat: -1 });

tl.to("#bouncing-ball", {
  y: 215,                   // Downward travel (280 - 50 center - 15 radius)
  scaleY: 1.2,              // Stretch vertically while falling
  scaleX: 0.8,              // Narrow horizontally
  duration: 0.6,
  ease: "power2.in",
  transformOrigin: "50% 50%"
})
.to("#bouncing-ball", {
  scaleY: 0.6,              // Squash flat on impact
  scaleX: 1.4,              // Spread wide
  duration: 0.1,
  ease: "power1.out",
  transformOrigin: "50% 100%" // Pivot from the bottom of the ball
})
.to("#bouncing-ball", {
  y: 0,                     // Return to start
  scaleY: 1,                // Recover original shape
  scaleX: 1,
  duration: 0.6,
  ease: "power2.out",
  transformOrigin: "50% 50%"
});
```

#### Explanation
To simulate physical mass, we coordinate coordinate translation (`y`) and scaling. During impact, we change the `transformOrigin` to `50% 100%` (the bottom center of the ball) so that it squashes flat against the floor instead of collapsing into its own center.

---

### Problem 4: Tweening Circle Attributes (`cx`, `cy`, `r`)
* **Difficulty:** Easy
* **Category:** AttrPlugin
* **Problem Statement:** Instead of using CSS transforms, animate the actual geometric attributes (`cx`, `cy`, and `r`) of a `<circle>` element.
* **Key Concepts:** `attr: {}` syntax.

#### Starting HTML Setup
```html
<svg width="300" height="200" viewBox="0 0 300 200" style="background: #0f172a; border-radius: 8px;">
  <circle id="attr-circle" cx="50" cy="50" r="20" fill="#06b6d4" />
</svg>
```

#### GSAP Solution
```javascript
gsap.to("#attr-circle", {
  duration: 2,
  ease: "elastic.out(1, 0.5)",
  attr: { 
    cx: 200, 
    cy: 120, 
    r: 45 
  },
  repeat: -1,
  yoyo: true
});
```

#### Explanation
GSAP uses an internal plugin (AttrPlugin) whenever variables are nested inside an `attr: {}` block. This directly mutates the DOM attributes on the SVG element (e.g., `<circle cx="200">`) instead of applying CSS rules. This is necessary when you need to change the base geometry of a shape rather than its visual offsets.

---

### Problem 5: Animating Line Coordinates (Vector Graphing)
* **Difficulty:** Easy
* **Category:** Line Coordinates
* **Problem Statement:** Animate a scanning bar line from the left of a grid to the right by shifting its x-axis endpoints.
* **Key Concepts:** `attr: { x1, x2 }`.

#### Starting HTML Setup
```html
<svg width="400" height="150" viewBox="0 0 400 150" style="background: #090d16; border-radius: 8px;">
  <!-- Grid background lines -->
  <line x1="100" y1="0" x2="100" y2="150" stroke="#1e293b" />
  <line x1="200" y1="0" x2="200" y2="150" stroke="#1e293b" />
  <line x1="300" y1="0" x2="300" y2="150" stroke="#1e293b" />
  
  <!-- The scanning laser line -->
  <line id="scanner-line" x1="20" y1="10" x2="20" y2="140" stroke="#ef4444" stroke-width="4" />
</svg>
```

#### GSAP Solution
```javascript
gsap.to("#scanner-line", {
  duration: 2,
  ease: "sine.inOut",
  attr: { 
    x1: 380, 
    x2: 380 
  },
  repeat: -1,
  yoyo: true
});
```

#### Explanation
Standard lines inside SVGs are drawn using coordinate anchors `(x1, y1)` and `(x2, y2)`. By packaging `x1` and `x2` inside the `attr` block, we slide the line horizontally while keeping its vertical alignment intact.

---

### Problem 6: Dynamic Gradient Stop Animation
* **Difficulty:** Medium
* **Category:** SVG Gradients
* **Problem Statement:** Animate a linear gradient stop to create a shining metallic sheen sweep across a static shield/banner shape.
* **Key Concepts:** AttrPlugin, `<stop>` offset manipulation.

#### Starting HTML Setup
```html
<svg width="300" height="150" viewBox="0 0 300 150" style="background: #0f172a; border-radius: 8px;">
  <defs>
    <linearGradient id="shine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop class="color-stop" offset="0%" stop-color="#1e293b" />
      <stop id="light-stop" offset="0%" stop-color="#38bdf8" />
      <stop class="color-stop" offset="0%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect x="20" y="20" width="260" height="110" rx="10" fill="url(#shine-grad)" stroke="#334155" stroke-width="2" />
</svg>
```

#### GSAP Solution
```javascript
const tl = gsap.timeline({ repeat: -1 });

tl.to("#light-stop", {
  duration: 1.5,
  ease: "power2.inOut",
  attr: { offset: "100%" }
})
.to(".color-stop", {
  duration: 1.5,
  ease: "power2.inOut",
  attr: { offset: "100%" }
}, "<"); // Starts both stop updates simultaneously to slide the sheen bar
```

#### Explanation
By animating the `offset` attribute of the three gradient `<stop>` points together, the middle bright stop (`#38bdf8`) sweeps from the left edge (`0%`) to the right edge (`100%`), creating a metal reflection scan effect across the shape.

---

### Problem 7: Staggered Entrance of Grid Elements
* **Difficulty:** Medium
* **Category:** Stagger Grid
* **Problem Statement:** Animate a 5x5 grid of circles to scale up from zero, radiating outwards from the center node.
* **Key Concepts:** `stagger`, `grid`, `scale`, `transformOrigin`.

#### Starting HTML Setup
```html
<svg width="250" height="250" viewBox="0 0 250 250" style="background: #0b0f19; border-radius: 8px;">
  <g class="dot-grid">
    <!-- Row 1 -->
    <circle class="grid-dot" cx="30" cy="30" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="80" cy="30" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="130" cy="30" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="180" cy="30" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="230" cy="30" r="10" fill="#3b82f6" />
    <!-- Row 2 -->
    <circle class="grid-dot" cx="30" cy="80" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="80" cy="80" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="130" cy="80" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="180" cy="80" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="230" cy="80" r="10" fill="#3b82f6" />
    <!-- Row 3 -->
    <circle class="grid-dot" cx="30" cy="130" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="80" cy="130" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="130" cy="130" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="180" cy="130" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="230" cy="130" r="10" fill="#3b82f6" />
    <!-- Row 4 -->
    <circle class="grid-dot" cx="30" cy="180" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="80" cy="180" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="130" cy="180" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="180" cy="180" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="230" cy="180" r="10" fill="#3b82f6" />
    <!-- Row 5 -->
    <circle class="grid-dot" cx="30" cy="230" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="80" cy="230" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="130" cy="230" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="180" cy="230" r="10" fill="#3b82f6" />
    <circle class="grid-dot" cx="230" cy="230" r="10" fill="#3b82f6" />
  </g>
</svg>
```

#### GSAP Solution
```javascript
// Pre-set them all to scale 0 so we can animate "to" scale 1
gsap.set(".grid-dot", { scale: 0, transformOrigin: "50% 50%" });

gsap.to(".grid-dot", {
  scale: 1,
  duration: 1,
  ease: "back.out(1.5)",
  stagger: {
    each: 0.1,         // Gap between starts of adjacent circles
    grid: [5, 5],      // Tells GSAP to lay out selection as a 5x5 matrix
    from: "center"     // Animation radiates out from the center dot
  }
});
```

#### Explanation
GSAP automatically parses standard 1D DOM selections into a 2D matrix structure when the `grid` parameter is declared. It measures the physical coordinates of each node and staggers their entry sequentially, radiating outwards from the center node. Setting `transformOrigin: "50% 50%"` ensures each dot scales up from its own center.

---

## Level 2: Timeline Coordination & Custom Easing

### Problem 8: Gear Rotation & Flower Bloom Sequence
* **Difficulty:** Medium
* **Category:** Timelines & Overlapping Tweens
* **Problem Statement:** Create an opening sequence: First, a gear spins up; then, three petals scale out from the center one-by-one; finally, the center disk pulses.
* **Key Concepts:** Timeline nesting, position parameter shifts.

#### Starting HTML Setup
```html
<svg width="200" height="200" viewBox="0 0 200 200" style="background: #0f172a; border-radius: 8px;">
  <!-- Flower structure -->
  <g id="flower-assembly">
    <!-- Petals -->
    <path class="petal" d="M100,100 C70,50 130,50 100,100 Z" fill="#ec4899" />
    <path class="petal" d="M100,100 C50,70 50,130 100,100 Z" fill="#ec4899" />
    <path class="petal" d="M100,100 C150,70 150,130 100,100 Z" fill="#ec4899" />
    <path class="petal" d="M100,100 C70,150 130,150 100,100 Z" fill="#ec4899" />
    <!-- Core disk -->
    <circle id="flower-center" cx="100" cy="100" r="18" fill="#eab308" />
  </g>
</svg>
```

#### GSAP Solution
```javascript
// Ensure initial states are hidden
gsap.set(".petal", { scale: 0, transformOrigin: "50% 50%" });
gsap.set("#flower-center", { scale: 0, transformOrigin: "50% 50%" });

const introTL = gsap.timeline();

introTL.to("#flower-center", {
  scale: 1,
  duration: 0.5,
  ease: "back.out(2)"
})
.to(".petal", {
  scale: 1,
  stagger: 0.15,
  duration: 0.8,
  ease: "elastic.out(1, 0.6)"
}, "-=0.2") // Overlaps with previous tween (starts 0.2s before center disk finishes)
.to("#flower-center", {
  scale: 1.25,
  duration: 0.3,
  yoyo: true,
  repeat: 3,
  ease: "sine.inOut"
});
```

#### Explanation
Timelines chain animations automatically. The position parameter `"-=0.2"` overrides standard chronological sequencing, causing the petals to scale out slightly before the center core finishes its entrance, making the assembly feel organic and responsive.

---

### Problem 9: Neon Lamp Flicker (RoughEase Glitch)
* **Difficulty:** Medium
* **Category:** Custom Eases (EasePack)
* **Problem Statement:** Animate an SVG neon light text element to flicker erratically (like a broken neon sign turning on) and then settle at full brightness.
* **Key Concepts:** `RoughEase`, `opacity`, `filter` glow adjustment.

#### Starting HTML Setup
```html
<svg width="400" height="150" viewBox="0 0 400 150" style="background: #05050c; border-radius: 8px;">
  <defs>
    <!-- Glow filter -->
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  <text id="neon-text" x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
        fill="#a855f7" font-size="42" font-family="monospace" font-weight="bold"
        filter="url(#neon-glow)" style="opacity: 0.1;">
    SYSTEM READY
  </text>
</svg>
```

#### GSAP Solution
```javascript
// Register plugin
gsap.registerPlugin(EasePack);

gsap.to("#neon-text", {
  opacity: 1,
  duration: 2,
  // RoughEase configures randomized noise on the opacity channel
  ease: "rough({ template: power1.none, strength: 4, points: 30, taper: 'none', randomize: true })",
  onComplete: () => {
    // Pulse glow filter via opacity loops once it is turned on
    gsap.to("#neon-text", {
      opacity: 0.8,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
});
```

#### Explanation
`RoughEase` adds high-frequency noise spikes over a baseline curve. In this case, it causes the opacity to fluctuate rapidly between `0.1` and `1.0` before settling at `1.0`. Once the entry flicker completes, the `onComplete` callback starts a subtle, fast loop to mimic hot gas filament vibrations.

---

### Problem 10: Clock Needle Ticking (Stepper Action)
* **Difficulty:** Easy
* **Category:** Steps Ease
* **Problem Statement:** Animate a clock needle to tick 12 times in a full circle, pausing briefly at each number rather than rotating continuously.
* **Key Concepts:** `rotation`, `ease: "steps(12)"`.

#### Starting HTML Setup
```html
<svg width="200" height="200" viewBox="0 0 200 200" style="background: #0f172a; border-radius: 8px;">
  <!-- Clock Face -->
  <circle cx="100" cy="100" r="80" stroke="#475569" stroke-width="4" fill="none" />
  <!-- Needle -->
  <line id="clock-needle" x1="100" y1="100" x2="100" y2="40" stroke="#f43f5e" stroke-width="6" stroke-linecap="round" />
  <circle cx="100" cy="100" r="10" fill="#f43f5e" />
</svg>
```

#### GSAP Solution
```javascript
gsap.to("#clock-needle", {
  rotation: 360,
  transformOrigin: "50% 100%", // Bottom center coordinates of the line node
  duration: 12,
  ease: "steps(12)",            // Segments progress curve into 12 hard intervals
  repeat: -1
});
```

#### Explanation
The `steps(n)` ease splits the transition time into `n` discrete steps, immediately snapping to the next coordinate rather than interpolating smoothly. This is perfect for clock needle ticks, progressive UI sliders, or frame-by-frame character loops.

---

### Problem 11: Hamburger Menu to Close 'X' Morph
* **Difficulty:** Medium
* **Category:** Sequential Timelines
* **Problem Statement:** Animate a three-bar hamburger icon into a close "X" symbol on click. The middle bar should disappear, and the top and bottom bars should rotate 45 degrees to cross.
* **Key Concepts:** Timeline control, transform origins, element coordinates.

#### Starting HTML Setup
```html
<svg id="menu-icon" width="60" height="60" viewBox="0 0 60 60" style="background: #1e293b; border-radius: 6px; cursor: pointer;">
  <line class="menu-bar bar-top" x1="15" y1="20" x2="45" y2="20" stroke="white" stroke-width="4" stroke-linecap="round" />
  <line class="menu-bar bar-middle" x1="15" y1="30" x2="45" y2="30" stroke="white" stroke-width="4" stroke-linecap="round" />
  <line class="menu-bar bar-bottom" x1="15" y1="40" x2="45" y2="40" stroke="white" stroke-width="4" stroke-linecap="round" />
</svg>
```

#### GSAP Solution
```javascript
// Center transform origins on each line element
gsap.set(".menu-bar", { transformOrigin: "50% 50%" });

const menuTL = gsap.timeline({ paused: true });

menuTL
  .to(".bar-middle", { 
    opacity: 0, 
    scaleX: 0, 
    duration: 0.25 
  })
  .to(".bar-top", { 
    y: 10,       // Move down to the middle bar line (30 - 20)
    rotation: 45, 
    duration: 0.35, 
    ease: "back.out(1.5)" 
  }, "-=0.1")
  .to(".bar-bottom", { 
    y: -10,      // Move up to the middle bar line (30 - 40)
    rotation: -45, 
    duration: 0.35, 
    ease: "back.out(1.5)" 
  }, "<"); // Aligns with the bar-top animation

// Interactivity toggle
let isOpen = false;
document.getElementById("menu-icon").addEventListener("click", () => {
  if (!isOpen) {
    menuTL.play();
  } else {
    menuTL.reverse();
  }
  isOpen = !isOpen;
});
```

#### Explanation
By pinning the `transformOrigin` to the center of each line, the rotations occur symmetrically. We translate the top and bottom bars vertically to align them with the center bar before rotating them, creating a clean, centered "X".

---

### Problem 12: Orbital Paths with Nested Groups
* **Difficulty:** Medium
* **Category:** Nested Coordinate Groups
* **Problem Statement:** Animate a solar system where a planet orbits the sun, and a moon orbits the planet at a faster rate.
* **Key Concepts:** Nested `<g>` transforms, independent rotations.

#### Starting HTML Setup
```html
<svg width="400" height="400" viewBox="0 0 400 400" style="background: #020617; border-radius: 8px;">
  <!-- Sun at static center -->
  <circle cx="200" cy="200" r="30" fill="#eab308" />
  
  <!-- Planet Group: pivots around Sun (200, 200) -->
  <g id="planet-system">
    <!-- Planet body -->
    <circle cx="320" cy="200" r="14" fill="#3b82f6" />
    
    <!-- Moon Group: pivots around Planet center (320, 200) -->
    <g id="moon-system">
      <circle cx="345" cy="200" r="5" fill="#cbd5e1" />
    </g>
  </g>
</svg>
```

#### GSAP Solution
```javascript
// Planet system orbits sun
gsap.to("#planet-system", {
  rotation: 360,
  transformOrigin: "200px 200px", // Sun's center coordinates
  duration: 8,
  ease: "none",
  repeat: -1
});

// Moon orbits planet
gsap.to("#moon-system", {
  rotation: 360,
  transformOrigin: "320px 200px", // Planet's center coordinates
  duration: 1.5,
  ease: "none",
  repeat: -1
});
```

#### Explanation
Because `#moon-system` is nested inside `#planet-system`, its coordinates are evaluated in the planet's coordinate space. When the parent planet group rotates, the moon orbits the sun naturally, while carrying out its own local rotation around the planet.

---

### Problem 13: Radar Sweep with Staggered Blips
* **Difficulty:** Hard
* **Category:** Timeline Orchestration
* **Problem Statement:** Build a glowing radar sweep. A radial line sweeps 360 degrees infinitely, and target dots (blips) fade in and out exactly as the line sweeps over them.
* **Key Concepts:** Syncing rotation with staggered timeline triggers.

#### Starting HTML Setup
```html
<svg width="300" height="300" viewBox="0 0 300 300" style="background: #022c22; border-radius: 50%;">
  <circle cx="150" cy="150" r="140" stroke="#059669" stroke-width="2" fill="none" />
  <circle cx="150" cy="150" r="90" stroke="#059669" stroke-dasharray="4 4" fill="none" />
  
  <!-- Sweeper line -->
  <line id="radar-sweep" x1="150" y1="150" x2="150" y2="10" stroke="#10b981" stroke-width="3" />

  <!-- Target blips -->
  <circle class="blip" cx="210" cy="80" r="6" fill="#34d399" style="opacity: 0;" />
  <circle class="blip" cx="80" cy="180" r="6" fill="#34d399" style="opacity: 0;" />
  <circle class="blip" cx="220" cy="200" r="6" fill="#34d399" style="opacity: 0;" />
</svg>
```

#### GSAP Solution
```javascript
// Constant infinite sweep rotation
gsap.to("#radar-sweep", {
  rotation: 360,
  transformOrigin: "0% 100%", // Anchored at center point (x1: 150, y1: 150)
  duration: 4,
  ease: "none",
  repeat: -1
});

// Trigger blip glow fades sequentially matching the sweeper's position
const blipsTL = gsap.timeline({ repeat: -1 });

blipsTL
  .to(".blip:nth-child(4)", { opacity: 1, duration: 0.2, yoyo: true, repeat: 1, repeatDelay: 0.5 }, 0.8)  // Top Right
  .to(".blip:nth-child(6)", { opacity: 1, duration: 0.2, yoyo: true, repeat: 1, repeatDelay: 0.5 }, 2.0)  // Bottom Right
  .to(".blip:nth-child(5)", { opacity: 1, duration: 0.2, yoyo: true, repeat: 1, repeatDelay: 0.5 }, 3.1); // Bottom Left
```

#### Explanation
By using the position parameter inside the timeline (the numbers at the end of each `.to()` tween), we trigger the blips' fade-in precisely when the sweeper line rotates over them. The center sweep line is rotated with a `transformOrigin` of `0% 100%` (its own starting coordinate `(150, 150)`).

---

### Problem 14: Responsive viewBox Camera Panning
* **Difficulty:** Hard
* **Category:** Attr viewBox Animation
* **Problem Statement:** Focus a large `1000x1000` SVG map canvas on three distinct detailed regions sequentially by animating the SVG `viewBox` coordinates.
* **Key Concepts:** `attr: { viewBox }`, zoom and pan.

#### Starting HTML Setup
```html
<svg id="map" width="300" height="300" viewBox="0 0 1000 1000" style="background: #0f172a; border-radius: 8px;">
  <!-- Group A (Top Left) -->
  <rect x="100" y="100" width="100" height="100" fill="#3b82f6" rx="6" />
  <!-- Group B (Center Right) -->
  <rect x="700" y="450" width="120" height="120" fill="#eab308" rx="6" />
  <!-- Group C (Bottom Left) -->
  <circle cx="200" cy="800" r="60" fill="#ec4899" />
</svg>
```

#### GSAP Solution
```javascript
const mapTL = gsap.timeline({ repeat: -1, repeatDelay: 1 });

mapTL
  // Pan to focus on Group A (Zoom in: viewBox 0 0 400 400)
  .to("#map", {
    duration: 2.0,
    ease: "power2.inOut",
    attr: { viewBox: "0 0 400 400" }
  })
  // Pan & zoom to focus on Group B
  .to("#map", {
    duration: 2.0,
    ease: "power2.inOut",
    attr: { viewBox: "560 350 400 400" }
  })
  // Pan & zoom to focus on Group C
  .to("#map", {
    duration: 2.0,
    ease: "power2.inOut",
    attr: { viewBox: "0 600 400 400" }
  })
  // Reset back to full map view
  .to("#map", {
    duration: 1.5,
    ease: "power1.inOut",
    attr: { viewBox: "0 0 1000 1000" }
  });
```

#### Explanation
The `viewBox` attribute (`"min-x min-y width height"`) defines the visible window of the SVG coordinate system. By animating this attribute, we create a hardware-accelerated zoom and pan effect that acts like a camera lens.

---

## Level 3: Paths, Strokes, and Motion Paths

### Problem 15: Draw SVG Stroke Without Plugins (The Native Way)
* **Difficulty:** Medium
* **Category:** Dash-Offset Drawings
* **Problem Statement:** Animate a curved path drawing itself onto the canvas, starting from an invisible state, without using external commercial plugins.
* **Key Concepts:** `strokeDasharray`, `strokeDashoffset`, `getTotalLength()`.

#### Starting HTML Setup
```html
<svg width="400" height="200" viewBox="0 0 400 200" style="background: #0b0f19; border-radius: 8px;">
  <path id="draw-path" d="M30,100 C100,20 200,180 370,100" 
        fill="none" stroke="#e11d48" stroke-width="4" stroke-linecap="round" />
</svg>
```

#### GSAP Solution
```javascript
const path = document.getElementById("draw-path");
const pathLength = path.getTotalLength();

// Setup the dash array to match the total length, offsetting it completely
gsap.set(path, {
  strokeDasharray: pathLength,
  strokeDashoffset: pathLength
});

// Animate the offset back to 0 to "draw" the line
gsap.to(path, {
  strokeDashoffset: 0,
  duration: 2.5,
  ease: "power2.out"
});
```

#### Explanation
This technique works by matching the dash length and gap length to the path's total length using `strokeDasharray`. Setting `strokeDashoffset` to the path's length shifts the dash completely out of view. Animating the offset to `0` brings the dash back into view, creating the signature draw-on effect.

---

### Problem 16: Plane Following a Curved Vector Path
* **Difficulty:** Medium / Hard
* **Category:** MotionPathPlugin
* **Problem Statement:** Make an SVG element (a paper airplane) follow a curved path, rotating automatically to align with the direction of travel.
* **Key Concepts:** `MotionPathPlugin`, `motionPath`, `autoRotate`.

#### Starting HTML Setup
```html
<svg width="400" height="300" viewBox="0 0 400 300" style="background: #0f172a; border-radius: 8px;">
  <!-- The guide path -->
  <path id="flight-track" d="M 40,250 C 80,100 200,50 250,150 T 360,50" 
        fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
  
  <!-- Plane shape (needs to point to the right initially at 0deg) -->
  <g id="plane">
    <polygon points="0,0 24,10 0,20 6,10" fill="#38bdf8" />
  </g>
</svg>
```

#### GSAP Solution
```javascript
// Register plugin
gsap.registerPlugin(MotionPathPlugin);

gsap.to("#plane", {
  duration: 4,
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true,
  motionPath: {
    path: "#flight-track",   // Path element to follow
    autoRotate: true,        // Rotates the plane to follow the path's curves
    align: "#flight-track",  // Aligns plane coordinates directly with the path
    alignOrigin: [0.5, 0.5]  // Centers the plane on the path
  }
});
```

#### Explanation
`MotionPathPlugin` calculates the coordinate matrices along any SVG path. Setting `alignOrigin: [0.5, 0.5]` prevents visual offsets, and `autoRotate: true` calculates the slope tangent of the curve at each frame to automatically rotate the element.

---

### Problem 17: Bi-directional Circle Drawing (Meeting in the Middle)
* **Difficulty:** Medium
* **Category:** Symmetrical Strokes
* **Problem Statement:** Animate a ring's outline. The drawing should start at the top center, split into two arcs traveling down opposite sides, and meet at the bottom center simultaneously.
* **Key Concepts:** Symmetrical stroke offsets, paths, timelines.

#### Starting HTML Setup
```html
<svg width="200" height="200" viewBox="0 0 200 200" style="background: #0f172a; border-radius: 8px;">
  <!-- Left Half Arc -->
  <path class="arc-half" id="arc-left" d="M100,20 A80,80 0 0,0 100,180" 
        fill="none" stroke="#22c55e" stroke-width="6" stroke-linecap="round" />
  <!-- Right Half Arc -->
  <path class="arc-half" id="arc-right" d="M100,20 A80,80 0 0,1 100,180" 
        fill="none" stroke="#22c55e" stroke-width="6" stroke-linecap="round" />
</svg>
```

#### GSAP Solution
```javascript
const arcs = document.querySelectorAll(".arc-half");

arcs.forEach(arc => {
  const length = arc.getTotalLength();
  
  // Set starting values
  gsap.set(arc, {
    strokeDasharray: length,
    strokeDashoffset: length
  });
});

// Animate both paths at the same time
gsap.to(".arc-half", {
  strokeDashoffset: 0,
  duration: 2.0,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});
```

#### Explanation
By using two symmetrical paths that start at the top `(100, 20)` and meet at the bottom `(100, 180)`, we can animate them in unison using a single class selector. This creates a split loading circle effect.

---

### Problem 18: Hand-Written Signature Stroke
* **Difficulty:** Medium / Hard
* **Category:** Staggered Paths
* **Problem Statement:** Simulate a signature drawing effect. The stroke should animate smoothly across three separate paths, with each path starting right as the previous one finishes.
* **Key Concepts:** Dash offset, staggered durations, timeline coordination.

#### Starting HTML Setup
```html
<svg width="300" height="150" viewBox="0 0 300 150" style="background: #0b0f19; border-radius: 8px;">
  <!-- Simulated signature segments (J, o, h, n) -->
  <g class="sig-paths">
    <path class="sig-line" d="M40,30 L40,110 C40,130 10,130 10,110" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" />
    <path class="sig-line" d="M40,80 C60,60 80,60 70,80 C60,100 40,90 50,80" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" />
    <path class="sig-line" d="M70,80 L70,110 M70,80 C80,60 100,60 100,80 L100,110" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" />
  </g>
</svg>
```

#### GSAP Solution
```javascript
const lines = document.querySelectorAll(".sig-line");
const sigTL = gsap.timeline();

lines.forEach((line, index) => {
  const length = line.getTotalLength();
  
  // Set initial states
  gsap.set(line, {
    strokeDasharray: length,
    strokeDashoffset: length
  });
  
  // Chain each stroke in the timeline
  sigTL.to(line, {
    strokeDashoffset: 0,
    duration: 0.6,
    ease: "power1.inOut"
  }); // Appends sequentially to draw the paths one after another
});
```

#### Explanation
By iterating over the paths, we measure each segment's length dynamically. Instead of staggering with arbitrary start delays, appending each tween to a shared timeline (`sigTL`) ensures that each letter segment starts drawing the exact millisecond the previous one finishes.

---

### Problem 19: Infinite Conveyor Belt (Dash Offset Scroll)
* **Difficulty:** Easy
* **Category:** Dash Offset Scrolling
* **Problem Statement:** Create an infinite conveyor belt line that moves continuously in one direction.
* **Key Concepts:** `strokeDasharray`, repeating loops, linear easing.

#### Starting HTML Setup
```html
<svg width="400" height="80" viewBox="0 0 400 80" style="background: #0f172a; border-radius: 8px;">
  <!-- Conveyor track -->
  <line id="conveyor" x1="20" y1="40" x2="380" y2="40" 
        stroke="#eab308" stroke-width="6" stroke-linecap="square"
        stroke-dasharray="20 10" />
</svg>
```

#### GSAP Solution
```javascript
gsap.to("#conveyor", {
  strokeDashoffset: -30, // Moves the dash pattern by one full cycle (dash + gap = 20 + 10 = 30)
  duration: 1,
  ease: "none",          // Linear ease is required for a seamless loop
  repeat: -1
});
```

#### Explanation
To loop a dashed line seamlessly, you must animate the `strokeDashoffset` by a multiple of the sum of the dash length and gap length (`20 + 10 = 30`). By moving it `-30px` infinitely with a linear ease (`none`), the pattern repeats seamlessly.

---

### Problem 20: Aligning and Rotating an Arrow Along a Path
* **Difficulty:** Medium
* **Category:** MotionPath Alignment
* **Problem Statement:** Animate an arrow shape (`polygon`) along a custom curved path. The tip of the arrow should point in the direction of the travel throughout the animation.
* **Key Concepts:** `MotionPathPlugin`, coordinate alignment, orientation correction.

#### Starting HTML Setup
```html
<svg width="400" height="300" viewBox="0 0 400 300" style="background: #0b0f19; border-radius: 8px;">
  <path id="guide-curve" d="M50,150 C150,50 250,250 350,150" 
        fill="none" stroke="#475569" stroke-width="2" />
  
  <g id="arrow-ptr">
    <!-- Arrow pointing directly to the right (0 degrees) -->
    <polygon points="0,0 20,8 0,16 5,8" fill="#10b981" />
  </g>
</svg>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(MotionPathPlugin);

gsap.to("#arrow-ptr", {
  duration: 3,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
  motionPath: {
    path: "#guide-curve",
    autoRotate: true,
    align: "#guide-curve",
    alignOrigin: [0.5, 0.5] // Align anchor at the center point of the arrow geometry
  }
});
```

#### Explanation
For `autoRotate` to work correctly, the element must be drawn pointing directly to the right (`0` degrees) in its initial state. If the raw shape is drawn pointing upwards or diagonally, the rotation angle will be offset.

---

## Level 4: Advanced Interaction, Viewports, and Sync

### Problem 21: Typing Text inside an SVG `<text>` node
* **Difficulty:** Easy / Medium
* **Category:** TextPlugin
* **Problem Statement:** Animate a code output sequence inside an SVG text element, including a blinking cursor.
* **Key Concepts:** `TextPlugin`, cursor utility layout.

#### Starting HTML Setup
```html
<svg width="400" height="100" viewBox="0 0 400 100" style="background: #090d16; border-radius: 8px;">
  <text x="20" y="55" fill="#34d399" font-family="monospace" font-size="18" font-weight="bold">
    <tspan id="code-output">></tspan>
    <tspan id="cursor" fill="#10b981">_</tspan>
  </text>
</svg>
```

#### GSAP Solution
```javascript
// Register TextPlugin
gsap.registerPlugin(TextPlugin);

const terminalTL = gsap.timeline();

// 1. Blinking Cursor
gsap.to("#cursor", {
  opacity: 0,
  duration: 0.5,
  repeat: -1,
  yoyo: true,
  ease: "steps(1)" // Creates a hard blink
});

// 2. Typing Text Sequence
terminalTL.to("#code-output", {
  text: "> npm run dev --host",
  duration: 2.5,
  ease: "none"
});
```

#### Explanation
By separating the text output and the cursor into two `<tspan>` blocks within the parent `<text>` element, we can animate the typing effect on the text container without breaking the cursor's independent blinking loop.

---

### Problem 22: Draggable SVG Shape Constrained to Bounding Box
* **Difficulty:** Medium
* **Category:** Draggable Plugin
* **Problem Statement:** Make an SVG circle element interactive. The user should be able to drag it around, but it must be locked inside the SVG boundary.
* **Key Concepts:** `Draggable.create()`, `bounds`.

#### Starting HTML Setup
```html
<div id="canvas-wrapper" style="width: 400px; height: 250px; background: #0f172a; border-radius: 8px; position: relative;">
  <svg width="100%" height="100%">
    <circle id="drag-node" cx="50" cy="50" r="25" fill="#eab308" style="cursor: grab;" />
  </svg>
</div>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(Draggable);

Draggable.create("#drag-node", {
  type: "x,y",
  bounds: "#canvas-wrapper", // Constrain dragging to the parent container
  edgeResistance: 0.85,     // Add friction when dragging past boundaries
  onDragStart: function() {
    gsap.to(this.target, { scale: 1.15, fill: "#f59e0b", duration: 0.2 });
  },
  onDragEnd: function() {
    gsap.to(this.target, { scale: 1.0, fill: "#eab308", duration: 0.2 });
  }
});
```

#### Explanation
The `Draggable` plugin listens for mouse and touch inputs to update coordinates. By defining the `#canvas-wrapper` div as the `bounds`, GSAP calculates limits based on the container dimensions, preventing the node from dragging off-screen.

---

### Problem 23: Interactive SVG Button Hover Micro-animation
* **Difficulty:** Medium
* **Category:** Hover Effects & Micro-animations
* **Problem Statement:** Design an SVG button element. On hover, the border stroke should draw on, the background color should shift, and the element should bounce slightly.
* **Key Concepts:** Mouse events, stroke calculations, scale bounces.

#### Starting HTML Setup
```html
<svg width="220" height="80" viewBox="0 0 220 80" style="background: #0f172a; border-radius: 8px;">
  <!-- Button Container -->
  <g id="btn-group" style="cursor: pointer;">
    <!-- Background -->
    <rect id="btn-bg" x="10" y="10" width="200" height="60" rx="10" fill="#1e293b" />
    <!-- Animated Border Frame -->
    <rect id="btn-border" x="10" y="10" width="200" height="60" rx="10" 
          fill="none" stroke="#10b981" stroke-width="3" />
    <!-- Label -->
    <text x="110" y="45" fill="white" font-family="sans-serif" font-size="16" 
          font-weight="bold" text-anchor="middle" dominant-baseline="middle">
      LAUNCH
    </text>
  </g>
</svg>
```

#### GSAP Solution
```javascript
const border = document.getElementById("btn-border");
// Calculate exact rectangle border circumference: 2 * (width + height) = 2 * (200 + 60) = 520px
const circumference = 520; 

gsap.set(border, {
  strokeDasharray: circumference,
  strokeDashoffset: circumference,
  transformOrigin: "50% 50%"
});
gsap.set("#btn-group", { transformOrigin: "50% 50%" });

// Hover Playback triggers
document.getElementById("btn-group").addEventListener("mouseenter", () => {
  gsap.to(border, { strokeDashoffset: 0, duration: 0.6, ease: "power1.out" });
  gsap.to("#btn-bg", { fill: "#064e3b", duration: 0.3 });
  gsap.to("#btn-group", { scale: 1.05, duration: 0.4, ease: "back.out(2)" });
});

document.getElementById("btn-group").addEventListener("mouseleave", () => {
  gsap.to(border, { strokeDashoffset: circumference, duration: 0.6, ease: "power1.out" });
  gsap.to("#btn-bg", { fill: "#1e293b", duration: 0.3 });
  gsap.to("#btn-group", { scale: 1.0, duration: 0.4, ease: "back.out(2)" });
});
```

#### Explanation
Hovering over the button triggers three animations in sync: drawing the border outline by restoring `strokeDashoffset` to `0`, transitioning the background color, and scaling the entire group with a springy `back.out` ease.

---

### Problem 24: Scroll-Triggered Infographic Drawing
* **Difficulty:** Hard
* **Category:** ScrollTrigger
* **Problem Statement:** Create an SVG line chart where the line draws on progressively as the user scrolls down the page.
* **Key Concepts:** `ScrollTrigger`, `strokeDashoffset`, scroll scrubbing.

#### Starting HTML Setup
```html
<!-- Spacer to allow page scrolling -->
<div style="height: 100vh; background: #0b0f19;"></div>

<div id="chart-section" style="padding: 100px 0; background: #0f172a;">
  <svg width="600" height="200" viewBox="0 0 600 200" style="margin: auto; display: block;">
    <!-- Chart Data Path -->
    <path id="chart-line" d="M 50,180 L 150,120 L 250,150 L 350,50 L 450,130 L 550,20" 
          fill="none" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</div>

<div style="height: 100vh; background: #0b0f19;"></div>
```

#### GSAP Solution
```javascript
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const chartLine = document.getElementById("chart-line");
const chartLength = chartLine.getTotalLength();

// Setup starting stroke offset
gsap.set(chartLine, {
  strokeDasharray: chartLength,
  strokeDashoffset: chartLength
});

// Link line drawing to scroll position
gsap.to(chartLine, {
  strokeDashoffset: 0,
  ease: "none",
  scrollTrigger: {
    trigger: "#chart-section",
    start: "top center", // Starts when chart reaches the middle of the viewport
    end: "bottom center", // Finishes when bottom of chart reaches the middle
    scrub: 1.0           // Links scroll position to animation progress (with 1s lag)
  }
});
```

#### Explanation
By combining the dash offset drawing technique with `ScrollTrigger` and setting `scrub: 1.0` (or `true`), the progress of the line drawing is linked directly to the scrollbar. Scrolling down draws the line forward, and scrolling back up reverses it.

---

### Problem 25: Dashboard Speedometer Needle & Text Sync
* **Difficulty:** Hard
* **Category:** Multi-parameter Sync & Callbacks
* **Problem Statement:** Animate a speedometer. The physical gauge needle should swing from `0` to `120` mph while a digital text readout counts up in sync.
* **Key Concepts:** `onUpdate` callback, numeric value interpolation, rotation matrix coordinates.

#### Starting HTML Setup
```html
<svg width="300" height="250" viewBox="0 0 300 250" style="background: #020617; border-radius: 8px;">
  <!-- Dial Arc -->
  <path d="M 50,200 A 100,100 0 0,1 250,200" fill="none" stroke="#1e293b" stroke-width="12" stroke-linecap="round" />
  
  <!-- Needle (Pivots at 150, 200) -->
  <line id="speed-needle" x1="150" y1="200" x2="60" y2="140" stroke="#ef4444" stroke-width="5" stroke-linecap="round" />
  <circle cx="150" cy="200" r="10" fill="#ef4444" />
  
  <!-- Live text display -->
  <text id="speed-text" x="150" y="235" fill="white" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle">
    0 MPH
  </text>
</svg>
```

#### GSAP Solution
```javascript
// Needle center is at (150, 200). We align transformOrigin relative to its pivot.
gsap.set("#speed-needle", { transformOrigin: "150px 200px" });

// Dummy object to hold the numeric value for counting
const speedMeter = { value: 0 };
const textNode = document.getElementById("speed-text");

const dashboardTL = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });

dashboardTL
  // Rotate the needle (from -60 degrees to +60 degrees)
  .to("#speed-needle", {
    rotation: 120,
    duration: 3,
    ease: "power2.inOut"
  }, 0)
  // Interpolate the numeric speed value in sync
  .to(speedMeter, {
    value: 120,
    duration: 3,
    ease: "power2.inOut",
    onUpdate: function() {
      // Update text node content on every frame
      textNode.textContent = Math.round(speedMeter.value) + " MPH";
    }
  }, 0); // 0 ensures both tweens run simultaneously
```

#### Explanation
Since DOM elements only store strings, we cannot directly tween the value of a text node. Instead, we tween a numeric variable inside a plain JavaScript object (`speedMeter`). On every tick of the animation, the `onUpdate` callback reads the interpolated value, rounds it to the nearest integer, and updates the text inside the SVG `<text>` node.
