# GSAP Advanced Utilities, Ticker & Responsive Layouts: Practice Tutorial

This practice guide covers the remaining advanced features of the GSAP v3 engine: global configurations, responsive layout bindings, numerical utility helper methods, pseudo-element control, ticker loops, and simulated physics.

---

## Table of Contents
1. **Exercise 1: Global Configurations & Timeline Defaults (`gsap.defaults`)**
2. **Exercise 2: Responsive Media Query Animations (`gsap.matchMedia`)**
3. **Exercise 3: Coordinate Range Mapping (`gsap.utils.mapRange`)**
4. **Exercise 4: Boundary Confinement (`gsap.utils.clamp`)**
5. **Exercise 5: Grid & Array Snapping (`gsap.utils.snap`)**
6. **Exercise 6: Circular Wrapping / Infinite Loops (`gsap.utils.wrap`)**
7. **Exercise 7: Array Distribution Utilities (`gsap.utils.distribute`)**
8. **Exercise 8: Animating Pseudo-Elements via CSS Variables**
9. **Exercise 9: High-Performance Canvas Rendering on the GSAP Ticker (`gsap.ticker`)**
10. **Exercise 10: Simulating Draggable Deceleration (Inertia Throw) without Premium Plugins**

---

## Exercises & Solutions

### Exercise 1: Global Configurations & Timeline Defaults
* **Goal:** Set a global default transition speed of `0.4s` and ease curve (`power2.out`) for all tweens, then build a timeline that uses these defaults but overrides them for a specific step.
* **Real-World Case:** Keeping animation code DRY (Don't Repeat Yourself) by setting project-wide standards.
* **Key Commands:** `gsap.defaults()`, `gsap.timeline({ defaults })`.

#### Solution
```javascript
// 1. Establish project-wide defaults
gsap.defaults({
  duration: 0.4,
  ease: "power2.out"
});

// 2. Build timeline utilizing overrides
const tl = gsap.timeline({
  defaults: {
    duration: 0.8, // Overrides the global 0.4s default specifically for this timeline's children
    ease: "back.out(1.5)"
  }
});

tl.to("#card-title", { y: -20 }) // Inherits the timeline default: 0.8s, back.out
  .to("#card-text-gen", { x: 50 }) // Inherits the timeline default: 0.8s, back.out
  .to("#card-rag", { 
    y: 20, 
    duration: 0.2, // Explicitly overrides the timeline default for this step
    ease: "none"   // Explicitly overrides the timeline default for this step
  });
```

---

### Exercise 2: Responsive Media Query Animations
* **Goal:** Animate a sidebar panel `#sidebar`. On desktops (min-width: `800px`), it should slide in from the left. On mobile screens (max-width: `799px`), it should slide up from the bottom. All active animations must clean up automatically when the screen is resized.
* **Real-World Case:** Responsive web app animations.
* **Key Commands:** `gsap.matchMedia()`, cleanup context.

#### Starting HTML Setup
```html
<div id="sidebar" style="position: fixed; background: #1e293b; color: white; width: 300px; height: 100vh; top: 0; left: -300px;">
  <h3>Navigation Sidebar</h3>
</div>
```

#### Solution
```javascript
const mm = gsap.matchMedia();

// 1. Desktop Layout Animations
mm.add("(min-width: 800px)", () => {
  gsap.set("#sidebar", { x: 0, y: 0, left: "-300px", width: "300px", height: "100vh", top: 0 });
  
  const showTween = gsap.to("#sidebar", {
    left: 0,
    duration: 0.5,
    ease: "power2.out",
    paused: true
  });
  
  // Return cleanup function to run when viewport leaves desktop size
  return () => {
    showTween.kill();
    gsap.set("#sidebar", { clearProps: "all" });
  };
});

// 2. Mobile Layout Animations
mm.add("(max-width: 799px)", () => {
  gsap.set("#sidebar", { left: 0, top: "auto", bottom: "-50vh", width: "100vw", height: "50vh" });
  
  const showTween = gsap.to("#sidebar", {
    bottom: 0,
    duration: 0.5,
    ease: "power2.out",
    paused: true
  });
  
  return () => {
    showTween.kill();
    gsap.set("#sidebar", { clearProps: "all" });
  };
});
```

---

### Exercise 3: Coordinate Range Mapping
* **Goal:** Map the horizontal position of the user's mouse cursor (`0` to `window.innerWidth`) to an SVG path's stroke width range of `2px` to `20px` and opacity range of `0.2` to `1.0`.
* **Real-World Case:** Mouse tracking animations, parallax, custom indicators.
* **Key Commands:** `gsap.utils.mapRange()`, mouse coordinates.

#### Solution
```javascript
const path = document.getElementById("draw-path");

window.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  
  // 1. Map mouse coordinate to stroke width
  const strokeVal = gsap.utils.mapRange(
    0, window.innerWidth, // Source range (Min, Max)
    2, 20,                // Target range (Min, Max)
    mouseX                // Input value to map
  );
  
  // 2. Map mouse coordinate to opacity
  const opacityVal = gsap.utils.mapRange(
    0, window.innerWidth,
    0.2, 1.0,
    mouseX
  );
  
  // 3. Apply updates smoothly
  gsap.to(path, {
    strokeWidth: strokeVal,
    opacity: opacityVal,
    duration: 0.2
  });
});
```

---

### Exercise 4: Boundary Confinement
* **Goal:** Create a progress slider. When dragging the slider handle, clamp the value so it stays between `0` and `100` even if the mouse drags beyond the boundaries of the track.
* **Real-World Case:** Custom form sliders, video scrubbers.
* **Key Commands:** `gsap.utils.clamp()`.

#### Solution
```javascript
const handle = document.getElementById("slider-handle");
const track = document.getElementById("slider-track");

let isDragging = false;

window.addEventListener("mousedown", () => isDragging = true);
window.addEventListener("mouseup", () => isDragging = false);

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  
  const trackRect = track.getBoundingClientRect();
  
  // Calculate raw position percentage
  const rawPercentage = ((e.clientX - trackRect.left) / trackRect.width) * 100;
  
  // Clamp value between 0% and 100%
  const clampedPercentage = gsap.utils.clamp(0, 100, rawPercentage);
  
  // Apply position updates
  gsap.set(handle, {
    left: `${clampedPercentage}%`
  });
});
```

---

### Exercise 5: Grid & Array Snapping
* **Goal:** Drag an SVG group element and snap it to a grid of `50px` increments, OR snap it directly to the closest value in an array of specific target positions: `[50, 120, 280, 400]`.
* **Real-World Case:** Dashboard column snapping, puzzle game mechanics.
* **Key Commands:** `gsap.utils.snap()`.

#### Solution
```javascript
gsap.registerPlugin(Draggable);

// Scenario A: Snap to a grid of 50px increments
Draggable.create("#drag-node-grid", {
  type: "x,y",
  liveSnap: {
    x: gsap.utils.snap(50), // Snaps X to 0, 50, 100, etc.
    y: gsap.utils.snap(50)  // Snaps Y to 0, 50, 100, etc.
  }
});

// Scenario B: Snap to the closest value in an array of target positions
const targetPoints = [50, 120, 280, 400];

Draggable.create("#drag-node-array", {
  type: "x",
  liveSnap: {
    x: gsap.utils.snap(targetPoints) // Snaps to the closest value in the array
  }
});
```

---

### Exercise 6: Circular Wrapping / Infinite Loops
* **Goal:** Create a continuous scrolling banner. As three items translate off the left edge of the screen (`-300px`), wrap them back to the right edge (`900px`) to keep the loop going indefinitely.
* **Real-World Case:** Infinite marquees, looping image carousels.
* **Key Commands:** `gsap.utils.wrap()`, `gsap.to()`, `onUpdate`.

#### Starting HTML Setup
```html
<div class="marquee-track" style="position: relative; width: 600px; height: 100px; overflow: hidden; background: #0b0f19;">
  <div class="m-item" style="position: absolute; width: 250px; left: 0px;">Item 1</div>
  <div class="m-item" style="position: absolute; width: 250px; left: 300px;">Item 2</div>
  <div class="m-item" style="position: absolute; width: 250px; left: 600px;">Item 3</div>
</div>
```

#### Solution
```javascript
const items = document.querySelectorAll(".m-item");

// Loop items continuously to the left
gsap.to(items, {
  x: "-=1200", // Move left by 1200px
  duration: 8,
  ease: "none",
  repeat: -1,
  modifiers: {
    // Modify x coordinates on every frame
    x: gsap.utils.unitize(gsap.utils.wrap(-300, 900)) // Wrap values between -300px and 900px
  }
});
```

---

### Exercise 7: Array Distribution Utilities
* **Goal:** Distribute a range of scale sizes (`0.2` to `1.5`) across an array of 10 list elements radiating outwards from the center.
* **Real-World Case:** Generative background grids, typography layout treatments.
* **Key Commands:** `gsap.utils.distribute()`.

#### Solution
```javascript
const listItems = document.querySelectorAll("li");

// Distribute scale values from 0.2 (center) to 1.5 (edges)
gsap.to(listItems, {
  scale: gsap.utils.distribute({
    values: [1.5, 0.2, 1.5], // Center items scale down to 0.2; edge items scale up to 1.5
    ease: "power1.out",
    from: "center"
  }),
  duration: 1.2,
  ease: "elastic.out(1, 0.5)"
});
```

---

### Exercise 8: Animating Pseudo-Elements via CSS Variables
* **Goal:** Animate the opacity and width of a `:before` pseudo-element underline on an HTML menu link.
* **Real-World Case:** Underline animations on hover without injecting extra DOM nodes.
* **Key Commands:** CSS Variables, standard tweens.

#### Starting HTML & CSS Setup
```html
<style>
  .menu-link {
    position: relative;
    color: white;
    text-decoration: none;
    --under-width: 0%;
    --under-opacity: 0;
  }
  .menu-link::before {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    height: 2px;
    background: #10b981;
    width: var(--under-width);
    opacity: var(--under-opacity);
  }
</style>

<a href="#" class="menu-link">DASHBOARD</a>
```

#### Solution
```javascript
const link = document.querySelector(".menu-link");

// Animate the CSS custom properties of the element
link.addEventListener("mouseenter", () => {
  gsap.to(link, {
    "--under-width": "100%",
    "--under-opacity": 1,
    duration: 0.35,
    ease: "power2.out"
  });
});

link.addEventListener("mouseleave", () => {
  gsap.to(link, {
    "--under-width": "0%",
    "--under-opacity": 0,
    duration: 0.3,
    ease: "power2.in"
  });
});
```

---

### Exercise 9: High-Performance Canvas Rendering on the GSAP Ticker
* **Goal:** Bind a custom Canvas drawing loop to the GSAP global ticker. The loop should clear the canvas and draw a particle at a coordinate that is updated by a GSAP tween.
* **Real-World Case:** Combining GSAP's timeline controls with HTML5 Canvas rendering.
* **Key Commands:** `gsap.ticker.add()`, `gsap.ticker.remove()`.

#### Starting HTML Setup
```html
<canvas id="render-canvas" width="400" height="200" style="background: #090d16; border-radius: 8px;"></canvas>
```

#### Solution
```javascript
const canvas = document.getElementById("render-canvas");
const ctx = canvas.getContext("2d");

// Create a particle object with coordinates to tween
const particle = { x: 50, y: 100, radius: 10 };

// Loop particle position back and forth
gsap.to(particle, {
  x: 350,
  radius: 30,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

// 1. Bind the drawing function to the GSAP requestAnimationFrame ticker
gsap.ticker.add(drawScene);

function drawScene() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the particle
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#a855f7";
  ctx.fill();
}

// 2. Clean up and remove the listener when the canvas is destroyed
function destroyCanvasScene() {
  gsap.ticker.remove(drawScene);
}
```

---

### Exercise 10: Simulating Draggable Inertia (Throwing)
* **Goal:** Make an element draggable along the x-axis. When released, calculate the velocity and continue the movement with a smooth deceleration curve, simulating inertia without requiring premium plugins.
* **Real-World Case:** Momentum scrolling, swipe gestures.
* **Key Commands:** `Draggable`, `onDrag`, `onDragEnd`, velocity calculations.

#### Starting HTML Setup
```html
<div id="drag-container" style="width: 400px; height: 100px; background: #0f172a; position: relative; border-radius: 8px;">
  <div id="throw-node" style="position: absolute; width: 60px; height: 60px; background: #ea580c; top: 20px; left: 20px; border-radius: 6px; cursor: grab;"></div>
</div>
```

#### Solution
```javascript
gsap.registerPlugin(Draggable);

let lastX = 0;
let velocity = 0;

Draggable.create("#throw-node", {
  type: "x",
  bounds: "#drag-container",
  onDragStart: function() {
    gsap.killTweensOf(this.target); // Interrupt existing momentum animations
    lastX = this.x;
  },
  onDrag: function() {
    // Calculate velocity based on coordinate delta
    velocity = this.x - lastX;
    lastX = this.x;
  },
  onDragEnd: function() {
    // Calculate friction decay target distance
    const friction = 0.95;
    const distance = velocity * 15; // Scale velocity factor
    
    gsap.to(this.target, {
      x: `+=${distance}`,
      duration: 0.8,
      ease: "power2.out", // Smooth deceleration curve
      modifiers: {
        x: gsap.utils.unitize(gsap.utils.clamp(0, 320)) // Keep within container bounds (400 width - 60 node - 20 left offset)
      }
    });
  }
});
```
