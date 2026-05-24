# GSAP SVG + HTML Hybrid Practice Lab: 10 Real-World Complex Exercises

This lab contains 10 advanced exercises that integrate SVG graphics with HTML page components, layouts, forms, and viewport tracking. These challenges reflect production-level interfaces, such as interactive e-commerce product customizers, data journalism scroll-flows, spatial blueprints, HUD tracking markers, and fluid web layouts.

---

## Table of Contents
1. **Exercise 1: SVG Path Mask Reveal on HTML Hero Media**
2. **Exercise 2: SVG MotionPath with Dynamic DOM Overlay Follower**
3. **Exercise 3: Scroll-Triggered Chart sync with HTML Annotation Cards**
4. **Exercise 4: Morphing Burger Menu with Fullscreen SVG Radial Clip Nav**
5. **Exercise 5: E-Commerce Product Swatch SVG Customizer**
6. **Exercise 6: Draggable Blueprint Map with DOM Info-Panel Sync**
7. **Exercise 7: Liquid Wave SVG Footer with Floating DOM Contact Swaps**
8. **Exercise 8: ScrollTrigger Parallax Layers with Interleaved HTML Headings**
9. **Exercise 9: SVG Interactive Circular Gauge Dial with HTML Form Sync**
10. **Exercise 10: Magnetized Grid Patterns (High-Performance cursor tracking)**

---

## Exercises & Solutions

### Exercise 1: SVG Path Mask Reveal on HTML Hero Media
* **Goal:** Create a hero section containing an HTML background video or image. As the user scrolls down, an SVG mask (initially shaped like a small magnifying lens or circular hole) grows to clip the entire viewport, revealing the video behind it.
* **Real-World Case:** Premium studio landing pages or cinematic portfolio reveals.
* **Key Components:** CSS `clip-path: url()`, SVG `<clipPath>`, `ScrollTrigger`, scale.

#### Starting HTML & CSS Setup
```html
<div class="hero-container" style="position: relative; height: 150vh; background: #0b0f19; overflow: hidden;">
  <!-- Masked Video Container -->
  <div class="video-wrapper" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; clip-path: url(#reveal-clip);">
    <video src="assets/bg-video.mp4" autoplay muted loop style="width: 100%; height: 100%; object-fit: cover;"></video>
  </div>
  
  <!-- Overlay SVG Mask definitions -->
  <svg width="0" height="0" style="position: absolute;">
    <defs>
      <!-- clipPathUnits="objectBoundingBox" allows percentage scaling (0 to 1) -->
      <clipPath id="reveal-clip" clipPathUnits="objectBoundingBox">
        <circle id="mask-circle" cx="0.5" cy="0.5" r="0.05" />
      </clipPath>
    </defs>
  </svg>
  
  <div style="position: absolute; bottom: 10%; width: 100%; text-align: center; color: white; font-family: sans-serif;">
    <h2>SCROLL TO DISCOVER</h2>
  </div>
</div>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

// Tween the radius (r) of the circular clip path definition
gsap.to("#mask-circle", {
  attr: { r: 0.85 }, // Expand the circle radius to clip the full screen diagonally
  scrollTrigger: {
    trigger: ".hero-container",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
```

#### Why it Works
By using `clipPathUnits="objectBoundingBox"` inside the SVG definition, coordinates behave like percentages (ranging from `0.0` to `1.0`). We target the circle's radius (`r`) attribute using the GSAP `attr` plugin to scale it from `0.05` to `0.85` dynamically on scroll. The fixed element wrapper is clipped smoothly without resizing the physical media inside.

---

### Exercise 2: SVG MotionPath with Dynamic DOM Overlay Follower
* **Goal:** Animate an SVG ship icon along a curved vector line and align an HTML description tooltip element (`div`) to sit directly above the ship's coordinates at all frames.
* **Real-World Case:** Interactive delivery trackers or logistics maps.
* **Key Components:** `MotionPathPlugin`, `onUpdate` matrix conversions, coordinate space translations.

#### Starting HTML & CSS Setup
```html
<div class="map-wrapper" style="position: relative; width: 600px; height: 400px; background: #0f172a; border-radius: 8px;">
  <!-- Map Graphic -->
  <svg id="sea-map" width="100%" height="100%" viewBox="0 0 600 400">
    <path id="shipping-lane" d="M 50,300 C 150,100 350,100 550,300" fill="none" stroke="#334155" stroke-dasharray="6 6" />
    <g id="ship-node">
      <circle r="12" fill="#3b82f6" />
    </g>
  </svg>
  
  <!-- Dynamic HTML Tooltip Follower -->
  <div id="ship-tooltip" style="position: absolute; background: white; padding: 6px 12px; border-radius: 4px; font-family: monospace; font-size: 11px; pointer-events: none; transform: translate(-50%, -120%); font-weight: bold; border: 1px solid #cbd5e1;">
    VESSEL A01
  </div>
</div>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(MotionPathPlugin);

const tooltip = document.getElementById("ship-tooltip");
const ship = document.getElementById("ship-node");

gsap.to(ship, {
  duration: 8,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
  motionPath: {
    path: "#shipping-lane",
    align: "#shipping-lane"
  },
  onUpdate: function() {
    // 1. Capture the ship's current position within SVG space
    const shipMatrix = ship.getCTM();
    
    // 2. Extract X/Y coordinates from the matrix transformation
    const shipX = shipMatrix.e;
    const shipY = shipMatrix.f;
    
    // 3. Apply coordinates to the absolute-positioned HTML tooltip element
    gsap.set(tooltip, {
      left: shipX,
      top: shipY
    });
  }
});
```

#### Why it Works
SVG coordinates and HTML page coordinates operate in different spaces. By reading the Current Transformation Matrix (`getCTM()`) of the ship node on every single animation frame inside the `onUpdate` callback, we extract the precise coordinates (`e` and `f` parameters of the 2D transform matrix) and project them onto the overlay tooltip.

---

### Exercise 3: Scroll-Triggered Chart sync with HTML Annotation Cards
* **Goal:** As the user scrolls down, an SVG line chart draws itself. As the line crosses specific vertical coordinate thresholds, corresponding HTML informational sidebar cards highlight and scroll into view.
* **Real-World Case:** Financial dashboards, annual progress reports.
* **Key Components:** `ScrollTrigger`, `strokeDashoffset`, chronological timelines.

#### Starting HTML & CSS Setup
```html
<div class="infographic-container" style="display: flex; gap: 40px; background: #0f172a; padding: 100px 40px; color: white;">
  <!-- Left Side: SVG Chart Pin Column -->
  <div class="chart-col" style="flex: 1; height: 300px; position: sticky; top: 200px;">
    <svg width="100%" height="300" viewBox="0 0 500 300" style="background: #1e293b; border-radius: 8px;">
      <path id="graph-path" d="M 50,250 L 150,220 L 250,80 L 350,150 L 450,30" 
            fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
  
  <!-- Right Side: HTML Scrolling Explanatory Cards -->
  <div class="details-col" style="flex: 1; display: flex; flex-direction: column; gap: 300px; padding-bottom: 200px;">
    <div class="info-card" id="card-1" style="background: #1e293b; padding: 20px; border-radius: 8px; opacity: 0.3;">
      <h3>Q1 Launch</h3>
      <p>System deployment initiated with baseline metrics.</p>
    </div>
    <div class="info-card" id="card-2" style="background: #1e293b; padding: 20px; border-radius: 8px; opacity: 0.3;">
      <h3>Q2 Breakthrough</h3>
      <p>Data volume spikes exponentially during integration.</p>
    </div>
    <div class="info-card" id="card-3" style="background: #1e293b; padding: 20px; border-radius: 8px; opacity: 0.3;">
      <h3>Q4 Scale Peak</h3>
      <p>Production cluster reaches max scale capacity.</p>
    </div>
  </div>
</div>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

const path = document.getElementById("graph-path");
const pathLen = path.getTotalLength();
gsap.set(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

// 1. Draw chart path on scroll
gsap.to(path, {
  strokeDashoffset: 0,
  ease: "none",
  scrollTrigger: {
    trigger: ".infographic-container",
    start: "top 20%",
    end: "bottom 80%",
    scrub: true
  }
});

// 2. Sync card highlights with viewport intersections
const cards = document.querySelectorAll(".info-card");
cards.forEach(card => {
  gsap.to(card, {
    opacity: 1,
    scale: 1.05,
    x: 10,
    duration: 0.4,
    scrollTrigger: {
      trigger: card,
      start: "top 60%",
      end: "bottom 40%",
      toggleActions: "play reverse play reverse"
    }
  });
});
```

#### Why it Works
We split the animations into two synchronization mechanisms. The SVG line draws dynamically by tying its `strokeDashoffset` to the overall container scroll progress (`scrub: true`), while individual HTML info cards are triggered independently by their own entry points inside the viewport to focus attention on their respective data markers.

---

### Exercise 4: Morphing Burger Menu with Fullscreen SVG Radial Clip Nav
* **Goal:** When the user clicks an SVG menu button, the three bars morph to an "X", and an SVG radial mask expands from the button's coordinates to reveal a full-screen HTML navigation page.
* **Real-World Case:** Immersive corporate portfolio navigations.
* **Key Components:** SVG ClipPath mask, timeline controls, interactive triggers.

#### Starting HTML & CSS Setup
```html
<!-- Navigation Panel Hidden behind circular mask -->
<div id="nav-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #ea580c; z-index: 99; display: flex; align-items: center; justify-content: center; clip-path: url(#radial-nav-clip); pointer-events: none;">
  <ul style="list-style: none; padding: 0; text-align: center; font-family: sans-serif; font-size: 32px; font-weight: bold; line-height: 2;">
    <li><a href="#" style="color: white; text-decoration: none;">HOME</a></li>
    <li><a href="#" style="color: white; text-decoration: none;">SYSTEMS</a></li>
    <li><a href="#" style="color: white; text-decoration: none;">METRICS</a></li>
  </ul>
</div>

<!-- Burger Button SVG -->
<svg id="trigger-burger" width="60" height="60" viewBox="0 0 60 60" style="position: fixed; top: 20px; right: 20px; z-index: 100; cursor: pointer; background: #0f172a; border-radius: 50%;">
  <line id="b-top" x1="15" y1="22" x2="45" y2="22" stroke="white" stroke-width="4" stroke-linecap="round" />
  <line id="b-mid" x1="15" y1="30" x2="45" y2="30" stroke="white" stroke-width="4" stroke-linecap="round" />
  <line id="b-bot" x1="15" y1="38" x2="45" y2="38" stroke="white" stroke-width="4" stroke-linecap="round" />
  
  <defs>
    <clipPath id="radial-nav-clip" clipPathUnits="userSpaceOnUse">
      <!-- Fixed center anchor point matching button position -->
      <circle id="nav-mask-circle" cx="1870" cy="50" r="0" />
    </clipPath>
  </defs>
</svg>
```

#### GSAP Solution
```javascript
const burger = document.getElementById("trigger-burger");
const overlay = document.getElementById("nav-overlay");
const mask = document.getElementById("nav-mask-circle");

// Adjust center points dynamically to match window width calculations
function updateMaskCoordinates() {
  const rect = burger.getBoundingClientRect();
  const centerCenterX = rect.left + rect.width / 2;
  const centerCenterY = rect.top + rect.height / 2;
  mask.setAttribute("cx", centerCenterX);
  mask.setAttribute("cy", centerCenterY);
}
window.addEventListener("resize", updateMaskCoordinates);
updateMaskCoordinates();

gsap.set(["#b-top", "#b-mid", "#b-bot"], { transformOrigin: "50% 50%" });

const navTL = gsap.timeline({ paused: true });

navTL
  // 1. Morph burger lines
  .to("#b-mid", { scaleX: 0, opacity: 0, duration: 0.2 })
  .to("#b-top", { y: 8, rotation: 45, duration: 0.3 }, "<")
  .to("#b-bot", { y: -8, rotation: -45, duration: 0.3 }, "<")
  
  // 2. Expand circular clip path to reveal HTML menu
  .to(mask, {
    attr: { r: Math.hypot(window.innerWidth, window.innerHeight) },
    duration: 0.6,
    ease: "power3.inOut"
  }, "-=0.2")
  .to("#nav-overlay", {
    pointerEvents: "auto",
    duration: 0.1
  }, "<");

let isMenuOpen = false;
burger.addEventListener("click", () => {
  if (!isMenuOpen) {
    navTL.play();
  } else {
    navTL.reverse();
  }
  isMenuOpen = !isMenuOpen;
});
```

#### Why it Works
Instead of using complex canvas libraries, we can animate an HTML element's clip mask. When the menu is toggled, the timeline morphs the icon lines while expanding the SVG circle's radius attribute `r` from `0` to the screen's full diagonal length (calculated using `Math.hypot()`), creating a smooth transition to the full-screen menu.

---

### Exercise 5: E-Commerce Product Swatch SVG Customizer
* **Goal:** Create an interactive product page featuring a stylized vector shoe SVG and three HTML color swatch buttons. Clicking a swatch color should animate the fill color of the shoe panels with an elastic scale pop.
* **Real-World Case:** Premium product customizer configurations.
* **Key Components:** Color attribute animation, staggered group pop, custom easings.

#### Starting HTML & CSS Setup
```html
<div class="customizer-card" style="width: 380px; background: #0f172a; padding: 25px; border-radius: 12px; font-family: sans-serif; color: white;">
  <div class="product-view" style="background: #1e293b; border-radius: 8px; padding: 20px;">
    <!-- Shoe Product SVG -->
    <svg id="product-shoe" width="100%" height="200" viewBox="0 0 200 100">
      <!-- Background shadow -->
      <ellipse cx="100" cy="85" rx="70" ry="10" fill="#090d16" opacity="0.5"/>
      <!-- Shoe body segments -->
      <path class="shoe-panel sole" d="M30,80 Q100,85 170,80 L160,70 Q100,75 40,70 Z" fill="#e2e8f0" />
      <path class="shoe-panel base" d="M40,70 Q100,75 160,70 C160,50 140,20 100,30 C90,40 50,40 40,70 Z" fill="#cbd5e1" />
      <path class="shoe-panel swoosh" d="M60,65 Q100,45 140,55 Q100,60 60,65 Z" fill="#64748b" />
    </svg>
  </div>
  
  <div class="control-row" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
    <span>SELECT HUES:</span>
    <div class="swatches" style="display: flex; gap: 8px;">
      <button class="swatch-btn" data-color-sole="#ef4444" data-color-base="#fee2e2" data-color-swoosh="#991b1b" style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; cursor: pointer;"></button>
      <button class="swatch-btn" data-color-sole="#10b981" data-color-base="#d1fae5" data-color-swoosh="#065f46" style="background: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; cursor: pointer;"></button>
      <button class="swatch-btn" data-color-sole="#3b82f6" data-color-base="#dbeafe" data-color-swoosh="#1e40af" style="background: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; cursor: pointer;"></button>
    </div>
  </div>
</div>
```

#### GSAP Solution
```javascript
const buttons = document.querySelectorAll(".swatch-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // 1. Extract target color attributes from HTML data properties
    const soleHue = btn.getAttribute("data-color-sole");
    const baseHue = btn.getAttribute("data-color-base");
    const swooshHue = btn.getAttribute("data-color-swoosh");
    
    // 2. Build color morph transitions with scale pop feedback
    const colorTL = gsap.timeline();
    
    colorTL
      .to(".shoe-panel", {
        scale: 0.96,
        transformOrigin: "center center",
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      })
      .to(".sole", { fill: soleHue, duration: 0.4 }, 0.15)
      .to(".base", { fill: baseHue, duration: 0.4 }, 0.15)
      .to(".swoosh", { fill: swooshHue, duration: 0.4 }, 0.15)
      .to(".shoe-panel", {
        scale: 1.0,
        transformOrigin: "center center",
        ease: "elastic.out(1.2, 0.4)",
        duration: 0.8
      }, 0.3);
  });
});
```

#### Why it Works
By grouping the color swap calls inside a synchronized timeline, we can coordinate a minor "scale down" compression on click, trigger the fill color updates simultaneously, and then snap the panels back out with an elastic overshoot.

---

### Exercise 6: Draggable Blueprint Map with DOM Info-Panel Sync
* **Goal:** Build an interactive floor plan or blueprint. Users can click-and-drag to pan the SVG map inside a bounded viewport. Double-clicking any room shape (SVG path) pans the viewport to that room and reveals an HTML details panel.
* **Real-World Case:** Exhibition floor plans, office booking maps.
* **Key Components:** `Draggable`, `viewBox` interpolation, click handlers.

#### Starting HTML & CSS Setup
```html
<div class="blueprint-layout" style="display: flex; gap: 20px; width: 750px; height: 350px; background: #0b0f19; padding: 20px; border-radius: 12px; font-family: sans-serif; color: white;">
  <!-- Bounded Viewport Window -->
  <div id="blueprint-window" style="flex: 2; height: 100%; border: 2px dashed #334155; border-radius: 8px; overflow: hidden; position: relative;">
    <!-- Large Panning Map Container -->
    <div id="panning-canvas" style="width: 800px; height: 600px; cursor: grab;">
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        <!-- Room A -->
        <rect id="room-a" x="50" y="50" width="200" height="150" fill="#1e293b" stroke="#475569" stroke-width="2" style="cursor: pointer;" />
        <text x="150" y="130" fill="white" text-anchor="middle">ROOM A</text>
        <!-- Room B -->
        <rect id="room-b" x="350" y="150" width="250" height="200" fill="#1e293b" stroke="#475569" stroke-width="2" style="cursor: pointer;" />
        <text x="475" y="260" fill="white" text-anchor="middle">ROOM B</text>
      </svg>
    </div>
  </div>
  
  <!-- HTML Info Sidebar -->
  <div id="desc-sidebar" style="flex: 1; background: #1e293b; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: center; text-align: center;">
    <h3 id="room-title">SELECT A ROOM</h3>
    <p id="room-detail" style="color: #94a3b8; font-size: 13px;">Double-click a room node on the blueprint to inspect details.</p>
  </div>
</div>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(Draggable);

// 1. Enable map panning within the viewport window
const dragInstance = Draggable.create("#panning-canvas", {
  bounds: "#blueprint-window",
  edgeResistance: 0.8,
  type: "x,y"
})[0];

const roomDetails = {
  "room-a": { name: "Conference Room A", details: "Equipped with video conferencing screens. Capacity: 12." },
  "room-b": { name: "Innovation Lab B", details: "Co-working space with prototype workstations. Capacity: 30." }
};

// 2. Zoom and center on double-clicked rooms
document.querySelectorAll("#panning-canvas rect").forEach(room => {
  room.addEventListener("dblclick", () => {
    const roomId = room.id;
    const details = roomDetails[roomId];
    
    // Calculate coordinates to center the selected room in the viewport
    const windowWidth = 470; // Width of blueprint-window minus borders
    const windowHeight = 310;
    
    const roomX = parseFloat(room.getAttribute("x"));
    const roomY = parseFloat(room.getAttribute("y"));
    const roomW = parseFloat(room.getAttribute("width"));
    const roomH = parseFloat(room.getAttribute("height"));
    
    const targetX = -(roomX + roomW / 2) + windowWidth / 2;
    const targetY = -(roomY + roomH / 2) + windowHeight / 2;
    
    // Animate map position and highlight the room
    gsap.to("#panning-canvas", {
      x: gsap.utils.clamp(-330, 0, targetX), // Clamp coordinates based on boundary constraints
      y: gsap.utils.clamp(-290, 0, targetY),
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => dragInstance.update() // Update Draggable's internal coordinates
    });
    
    gsap.fromTo(room, 
      { fill: "#3b82f6" }, 
      { fill: "#1e293b", duration: 1.2, ease: "sine.out" }
    );
    
    // 3. Update HTML sidebar info
    gsap.timeline()
      .to("#desc-sidebar", { opacity: 0, x: 20, duration: 0.2 })
      .call(() => {
        document.getElementById("room-title").textContent = details.name;
        document.getElementById("room-detail").textContent = details.details;
      })
      .to("#desc-sidebar", { opacity: 1, x: 0, duration: 0.3 });
  });
});
```

#### Why it Works
`Draggable.create()` allows free scrolling of the canvas. When a room is double-clicked, we compute the delta offsets between the room's center coordinates and the parent window's center coordinates. Panning to those coordinates centers the room in view, and calling `dragInstance.update()` keeps the Draggable instance's coordinates in sync.

---

### Exercise 7: Liquid Wave SVG Footer with Floating DOM Contact Swaps
* **Goal:** Design a footer containing overlapping wave paths that animate infinitely. Hovering over a contact option should dynamically increase the wave's oscillation amplitude and spawn rising bubbles.
* **Real-World Case:** Creative agency page footers.
* **Key Components:** Repeating wave animations, SVG filter glows, programmatically spawned elements.

#### Starting HTML & CSS Setup
```html
<div class="footer-wrapper" style="position: relative; width: 600px; height: 250px; background: #0b0f19; overflow: hidden; font-family: sans-serif;">
  <!-- Contacts Panel (HTML) -->
  <div class="contact-links" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 30px; z-index: 10; font-weight: bold;">
    <a href="#" class="contact-anchor" data-wave-amp="30" style="color: white; text-decoration: none;">EMAIL</a>
    <a href="#" class="contact-anchor" data-wave-amp="50" style="color: white; text-decoration: none;">CALL</a>
  </div>
  
  <!-- Liquid Waves (SVG) -->
  <svg class="wave-canvas" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 160px;" viewBox="0 0 600 160" preserveAspectRatio="none">
    <path id="back-wave" d="M 0,80 Q 150,50 300,80 T 600,80 L 600,160 L 0,160 Z" fill="#1e3a8a" opacity="0.5" />
    <path id="front-wave" d="M 0,90 Q 150,60 300,90 T 600,90 L 600,160 L 0,160 Z" fill="#3b82f6" />
  </svg>
</div>
```

#### GSAP Solution
```javascript
// 1. Loop wave translations infinitely
gsap.to("#front-wave", {
  x: -150,
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

gsap.to("#back-wave", {
  x: 150,
  duration: 6,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

// 2. Adjust wave amplitude and spawn bubble elements on hover
const anchors = document.querySelectorAll(".contact-anchor");
const waveCanvas = document.querySelector(".wave-canvas");

anchors.forEach(anchor => {
  anchor.addEventListener("mouseenter", () => {
    const amp = parseInt(anchor.getAttribute("data-wave-amp"));
    
    // Scale the wave height up dynamically
    gsap.to("#front-wave", {
      attr: { d: `M 0,${90 - amp/2} Q 150,${60 - amp} 300,${90 - amp/2} T 600,${90 - amp/2} L 600,160 L 0,160 Z` },
      duration: 0.6,
      ease: "power2.out"
    });
    
    // Spawn floating bubbles
    for (let i = 0; i < 5; i++) {
      createBubble();
    }
  });
  
  anchor.addEventListener("mouseleave", () => {
    // Restore default wave paths
    gsap.to("#front-wave", {
      attr: { d: "M 0,90 Q 150,60 300,90 T 600,90 L 600,160 L 0,160 Z" },
      duration: 0.8,
      ease: "power1.out"
    });
  });
});

function createBubble() {
  const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bubble.setAttribute("cx", Math.random() * 600);
  bubble.setAttribute("cy", "160");
  bubble.setAttribute("r", Math.random() * 8 + 3);
  bubble.setAttribute("fill", "#60a5fa");
  bubble.setAttribute("opacity", "0.7");
  waveCanvas.appendChild(bubble);
  
  gsap.to(bubble, {
    y: -180,
    x: "+=" + (Math.random() * 60 - 30),
    opacity: 0,
    duration: Math.random() * 1.5 + 1.0,
    ease: "power1.out",
    onComplete: () => bubble.remove()
  });
}
```

#### Why it Works
The back and forth waves translation is achieved using simple horizontal looping tweens. On mouseenter, we dynamically recalculate the control points of the SVG path string (`d`) using the element's custom `data-wave-amp` attribute. This is combined with programmatically spawning circle nodes that float upwards and fade out before deleting themselves.

---

### Exercise 8: ScrollTrigger Parallax Layers with Interleaved HTML Headings
* **Goal:** Create a multi-layered parallax scroll section. Three SVG landscape silhouettes (background mountains, midground hills, foreground trees) should scroll at different speeds. An HTML heading element must be layered between the midground and foreground layers.
* **Real-World Case:** Creative landing page hero sections.
* **Key Components:** `ScrollTrigger`, parallax layering, positioning offsets.

#### Starting HTML & CSS Setup
```html
<div class="parallax-section" style="position: relative; height: 180vh; background: #0f172a; overflow: hidden;">
  <!-- SVG Parallax Canvas -->
  <div style="position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;">
    <!-- Background Mountains -->
    <svg class="layer layer-bg" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <polygon points="0,600 200,300 500,450 800,200 1000,600" fill="#1e293b" />
    </svg>
    
    <!-- Midground Hills -->
    <svg class="layer layer-mid" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <path d="M0,600 Q300,400 600,500 T1000,600 L1000,600 Z" fill="#0f172a" />
    </svg>
    
    <!-- Interleaved HTML Heading -->
    <h1 id="parallax-title" style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); color: white; font-family: Impact, sans-serif; font-size: 10vw; letter-spacing: 2px; margin: 0; text-align: center; pointer-events: none;">
      ADVENTURE
    </h1>
    
    <!-- Foreground Silhouette -->
    <svg class="layer layer-fg" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;" viewBox="0 0 1000 300" preserveAspectRatio="none">
      <rect x="0" y="200" width="1000" height="100" fill="#020617" />
      <!-- Stylized trees -->
      <polygon points="50,220 70,220 60,180" fill="#020617" />
      <polygon points="120,220 140,220 130,170" fill="#020617" />
      <polygon points="850,220 870,220 860,165" fill="#020617" />
    </svg>
  </div>
</div>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

// Animate layers at different speeds (scrub ratios) relative to scroll progress
gsap.to(".layer-bg", {
  yPercent: 30, // Moves down slower (less parallax)
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

gsap.to(".layer-mid", {
  yPercent: 15,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

gsap.to("#parallax-title", {
  yPercent: -40, // Moves upwards (against scroll direction)
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
```

#### Why it Works
By using a sticky container element inside a container with `height: 180vh`, the elements remain visible while scrolling. The background layer, midground layer, and title are assigned different scrolling offsets (`yPercent` values), creating a sense of depth as the foreground layers overlap the heading text.

---

### Exercise 9: SVG Interactive Circular Gauge Dial with HTML Form Sync
* **Goal:** Build a circular dashboard dial gauge in SVG. The user should be able to drag the indicator knob to adjust the value, updating both the SVG progress stroke and an HTML numeric input field in real time.
* **Real-World Case:** Smart thermostat controls or professional audio dials.
* **Key Components:** `Draggable`, polar coordinates calculation (`Math.atan2`), dashboard stroke synchronization.

#### Starting HTML & CSS Setup
```html
<div class="dial-container" style="width: 250px; background: #0f172a; padding: 25px; border-radius: 12px; font-family: monospace; color: white; text-align: center;">
  <div style="position: relative; width: 150px; height: 150px; margin: 0 auto 20px auto;">
    <svg width="150" height="150" viewBox="0 0 150 150">
      <!-- Background track -->
      <circle cx="75" cy="75" r="60" stroke="#1e293b" stroke-width="8" fill="none" />
      <!-- Active Gauge stroke (2 * Math.PI * r = 2 * 3.14159 * 60 = 377px) -->
      <circle id="active-stroke" cx="75" cy="75" r="60" stroke="#10b981" stroke-width="8" 
              stroke-linecap="round" fill="none" stroke-dasharray="377" stroke-dashoffset="377" 
              transform="rotate(-90 75 75)" />
      <!-- Rotating pointer knob -->
      <g id="dial-knob" style="cursor: grab;">
        <circle cx="75" cy="15" r="8" fill="#ef4444" />
      </g>
    </svg>
  </div>
  
  <div>
    VALUE: <input type="number" id="dial-output" value="0" min="0" max="100" style="background: #1e293b; color: white; border: 1px solid #475569; width: 60px; text-align: center; border-radius: 4px; padding: 4px;" /> %
  </div>
</div>
```

#### GSAP Solution
```javascript
gsap.registerPlugin(Draggable);

const stroke = document.getElementById("active-stroke");
const output = document.getElementById("dial-output");
const circumference = 377;

// 1. Enable rotation on the knob around the gauge center (75, 75)
Draggable.create("#dial-knob", {
  type: "rotation",
  bounds: { minRotation: 0, maxRotation: 360 },
  onDrag: function() {
    updateGauge(this.rotation);
  }
});

function updateGauge(angle) {
  // Clamp negative angle adjustments
  if (angle < 0) angle = 360 + angle;
  
  // Calculate percentage (0 to 100%)
  const percentage = Math.round((angle / 360) * 100);
  
  // Update HTML input value
  output.value = percentage;
  
  // Update the dash offset of the active stroke path
  const offset = circumference - (angle / 360) * circumference;
  gsap.set(stroke, { strokeDashoffset: offset });
}

// 2. Allow sync updates from the HTML input field back to the dial
output.addEventListener("input", (e) => {
  let val = parseInt(e.target.value) || 0;
  val = gsap.utils.clamp(0, 100, val);
  
  const angle = (val / 100) * 360;
  
  // Rotate the knob and update the progress line
  gsap.set("#dial-knob", { rotation: angle });
  updateGauge(angle);
});
```

#### Why it Works
`Draggable` with `type: "rotation"` allows users to spin the pointer group around its center origin. During dragging, the current rotation angle is translated into a percentage value to update the HTML input field, while the circular `strokeDashoffset` is updated in sync.

---

### Exercise 10: Magnetized Grid Patterns (Cursor Attraction Field)
* **Goal:** Create a grid of small SVG crosshair elements. As the user moves the mouse across the page, the crosshairs should rotate to face the cursor position dynamically, returning to their default orientation when the mouse leaves.
* **Real-World Case:** Immersive interactive background grids.
* **Key Components:** Mouse move tracking, vector math (`Math.atan2`), `gsap.quickTo()` for performance.

#### Starting HTML & CSS Setup
```html
<div class="grid-section" style="position: relative; width: 600px; height: 350px; background: #090d16; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
  <!-- 5x3 Grid of SVG Nodes -->
  <svg id="magnet-canvas" width="500" height="300" viewBox="0 0 500 300">
    <!-- Col 1 -->
    <g class="magnet-node" transform="translate(50, 50)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(50, 150)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(50, 250)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <!-- Col 2 -->
    <g class="magnet-node" transform="translate(150, 50)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(150, 150)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(150, 250)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <!-- Col 3 -->
    <g class="magnet-node" transform="translate(250, 50)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(250, 150)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(250, 250)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <!-- Col 4 -->
    <g class="magnet-node" transform="translate(350, 50)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(350, 150)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(350, 250)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <!-- Col 5 -->
    <g class="magnet-node" transform="translate(450, 50)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(450, 150)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
    <g class="magnet-node" transform="translate(450, 250)"><line x1="-15" y1="0" x2="15" y2="0" stroke="#334155" stroke-width="3" /></g>
  </svg>
</div>
```

#### GSAP Solution
```javascript
const canvas = document.getElementById("magnet-canvas");
const nodes = document.querySelectorAll(".magnet-node");

// 1. Pre-allocate rotation update functions for better performance
const quickRotations = Array.from(nodes).map(node => {
  // Pre-set center origin points inside each parent group translation matrix
  gsap.set(node, { transformOrigin: "0% 0%" });
  return gsap.quickTo(node, "rotation", { duration: 0.3, ease: "power1.out" });
});

// 2. Track cursor movements and update rotation angles
document.querySelector(".grid-section").addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  nodes.forEach((node, index) => {
    // Extract base coordinates from the translate transformation
    const transform = node.getAttribute("transform") || "";
    const coords = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    
    if (coords) {
      const nodeX = parseFloat(coords[1]);
      const nodeY = parseFloat(coords[2]);
      
      // Calculate rotation angle to face the cursor
      const angleRad = Math.atan2(mouseY - nodeY, mouseX - nodeX);
      const angleDeg = angleRad * (180 / Math.PI);
      
      // Update rotation
      quickRotations[index](angleDeg);
    }
  });
});

// 3. Reset positions when the mouse leaves the area
document.querySelector(".grid-section").addEventListener("mouseleave", () => {
  quickRotations.forEach(rotationSetter => {
    rotationSetter(0); // Reset back to horizontal alignment
  });
});
```

#### Why it Works
Calculating math operations inside a `mousemove` loop can cause performance lag. By using `gsap.quickTo()`, we bypass the overhead of creating new tween instances on every frame. This allows us to smoothly animate the rotation of all 15 nodes simultaneously at 60fps.
