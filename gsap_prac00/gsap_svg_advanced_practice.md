# Advanced GSAP SVG Practice Lab: 30 Real-World Exercises

This manual provides 30 advanced exercises based on the structure of [agent_work00.svg](file:///d:/TT_vid/gsap_prac00/agent_work00.svg). It is designed to prepare you for real-world frontend development, where you must animate raw, designer-exported SVGs (such as those from Excalidraw, Figma, or Adobe Illustrator) without clean, pre-existing classes or IDs.

---

## The Dynamic Mapping Setup
To ensure our solutions are robust and clean, we will run a setup script that programmatically identifies and targets anonymous Excalidraw groups by their initial positions, translating them into semantic IDs and classes:

```javascript
function prepareSvgForAnimation() {
  const groups = document.querySelectorAll("svg.excalidraw-svg g");
  
  groups.forEach(g => {
    const transform = g.getAttribute("transform") || "";
    if (transform.includes("translate(144.56")) {
      g.id = "card-title";
      g.classList.add("svg-card");
    } else if (transform.includes("translate(10 ")) {
      g.id = "card-text-gen";
      g.classList.add("svg-card");
    } else if (transform.includes("translate(319.97")) {
      g.id = "card-rag";
      g.classList.add("svg-card");
    } else if (transform.includes("translate(472.83")) {
      g.id = "card-harness";
      g.classList.add("svg-card");
    } else if (transform.includes("translate(484.18049458161704 377.65")) {
      g.id = "card-coding";
      g.classList.add("svg-sub-card");
    } else if (transform.includes("translate(484.18049458161704 443.33")) {
      g.id = "card-tool-calling";
      g.classList.add("svg-sub-card");
    } else if (transform.includes("translate(484.18049458161704 513.01")) {
      g.id = "card-scheduling";
      g.classList.add("svg-sub-card");
    }
  });

  // Connectors
  const connectorContainers = document.querySelectorAll("svg.excalidraw-svg g[stroke-linecap='round'] > g");
  connectorContainers.forEach(container => {
    const trans = container.getAttribute("transform") || "";
    if (trans.includes("translate(217.11")) container.classList.add("arrow", "arrow-title-to-text");
    else if (trans.includes("translate(308.99")) container.classList.add("arrow", "arrow-title-to-rag");
    else if (trans.includes("translate(430.47")) container.classList.add("arrow", "arrow-title-to-harness");
  });
}
```

---

## Tier 1: Selection, Normalization & Basic Transforms

### Exercise 1: Programmatic Mapping (Setup Verification)
* **Goal:** Run the setup script to map anonymous SVG groups to target IDs and test it by fading out all panels.
* **Real-World Case:** Dynamically preparing raw, designer-exported SVGs for animation at runtime.
* **GSAP Commands:** `gsap.to()`, `opacity`.

#### Solution
```javascript
prepareSvgForAnimation();
gsap.to(".svg-card, .svg-sub-card", {
  opacity: 0.2,
  duration: 1,
  stagger: 0.1
});
```

---

### Exercise 2: Normalizing Pre-existing Transforms
* **Goal:** Scale the `#card-title` card up by 20% on hover without resetting its existing `translate(144.56, 10)` position.
* **Real-World Case:** Resolving coordinate jumps when GSAP overrides inline SVG group translations.
* **GSAP Commands:** `scale`, `transformOrigin`.

#### Solution
```javascript
// GSAP automatically reads and preserves existing translate values inside matrix transforms
gsap.to("#card-title", {
  scale: 1.2,
  transformOrigin: "center center",
  duration: 0.3,
  paused: true,
  id: "hoverTween"
});

document.getElementById("card-title").addEventListener("mouseenter", () => {
  gsap.getById("hoverTween").play();
});
document.getElementById("card-title").addEventListener("mouseleave", () => {
  gsap.getById("hoverTween").reverse();
});
```

---

### Exercise 3: Target Background Rectangle Color Blend
* **Goal:** Extract and animate the fill color of the `#card-text-gen` background rectangle from green (`#b2f2bb`) to dark forest green on hover.
* **Real-World Case:** Animating specific child paths within complex, grouped assets.
* **GSAP Commands:** `gsap.to()`, `fill` CSS/attribute tween.

#### Solution
```javascript
// Target the first rect child within the designated group container
gsap.to("#card-text-gen rect", {
  fill: "#2f5c3a",
  duration: 0.4,
  paused: true,
  id: "colorTween"
});

document.getElementById("card-text-gen").addEventListener("mouseenter", () => {
  gsap.getById("colorTween").play();
});
document.getElementById("card-text-gen").addEventListener("mouseleave", () => {
  gsap.getById("colorTween").reverse();
});
```

---

### Exercise 4: Layer Depth Ordering (Z-Index Fix)
* **Goal:** Move `#card-harness` to the end of the parent SVG DOM structure dynamically, ensuring its borders render on top of overlapping connector lines.
* **Real-World Case:** Fixing rendering order issues in SVGs (which do not support the CSS `z-index` property).
* **GSAP Commands:** DOM Manipulation combined with `gsap.from()`.

#### Solution
```javascript
const harness = document.getElementById("card-harness");
const parent = harness.parentNode;

// Re-append the node to the end of the DOM so it renders last (on top)
parent.appendChild(harness);

// Prevent visual popping by running a zero-duration from tween
gsap.from(harness, {
  opacity: 0,
  duration: 0.2
});
```

---

## Tier 2: Timeline Orchestration & Flow Sequences

### Exercise 5: Cascading Flow Chart Reveal
* **Goal:** Reveal panels sequentially: Title Card -> Arrows (drawn on) -> Sub-cards fade in.
* **Real-World Case:** Loading state transitions on technical landing pages.
* **GSAP Commands:** `gsap.timeline()`, `stagger`, position parameters.

#### Solution
```javascript
gsap.set(".svg-card, .svg-sub-card, .arrow", { opacity: 0 });

const revealTL = gsap.timeline();

revealTL
  .to("#card-title", { opacity: 1, duration: 0.6 })
  .to(".arrow", { opacity: 1, duration: 0.4, stagger: 0.15 }, "-=0.2")
  .to(["#card-text-gen", "#card-rag", "#card-harness"], { 
    opacity: 1, 
    duration: 0.6, 
    stagger: 0.2 
  }, "-=0.3");
```

---

### Exercise 6: Harness Sub-modules Slide & Fade
* **Goal:** Cascade the entry of the Harness child nodes (`#card-coding`, `#card-tool-calling`, `#card-scheduling`) sliding up and fading in from the bottom of the harness.
* **Real-World Case:** Revealing child features inside parent container layouts.
* **GSAP Commands:** `y`, `opacity`, `stagger`.

#### Solution
```javascript
// Pre-set starting offsets relative to current positions
gsap.set([ "#card-coding", "#card-tool-calling", "#card-scheduling" ], {
  opacity: 0,
  y: 30
});

gsap.to([ "#card-coding", "#card-tool-calling", "#card-scheduling" ], {
  opacity: 1,
  y: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: "back.out(1.7)"
});
```

---

### Exercise 7: Drawing Connector Arrows (Dash-offset)
* **Goal:** Animate the connecting paths of the arrows using native dash-offset techniques.
* **Real-World Case:** Drawing diagram connections dynamically.
* **GSAP Commands:** `strokeDasharray`, `strokeDashoffset`, `getTotalLength()`.

#### Solution
```javascript
const paths = document.querySelectorAll(".arrow path");

paths.forEach(path => {
  const len = path.getTotalLength();
  
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: len
  });

  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: "power2.out"
  });
});
```

---

### Exercise 8: Pulsing Energy Beads Along Connector Paths
* **Goal:** Animate a small glowing circle along the path of the `#arrow-title-to-harness` connection.
* **Real-World Case:** Visualizing data flows between system components.
* **GSAP Commands:** `MotionPathPlugin`, `repeat: -1`, `x`, `y`.

#### Solution
```javascript
gsap.registerPlugin(MotionPathPlugin);

// 1. Create a glowing bead and append it to the SVG
const svg = document.querySelector("svg.excalidraw-svg");
const bead = document.createElementNS("http://www.w3.org/2000/svg", "circle");
bead.setAttribute("r", "5");
bead.setAttribute("fill", "#ea580c");
svg.appendChild(bead);

// 2. Animate the bead along the target path
gsap.to(bead, {
  duration: 3,
  repeat: -1,
  ease: "none",
  motionPath: {
    path: ".arrow-title-to-harness path",
    autoRotate: true
  }
});
```

---

### Exercise 9: Text Highlight Glow (Sequential Draw)
* **Goal:** Reveal card text elements character-by-character.
* **Real-World Case:** Simulating terminals or active typewriter UI cards.
* **GSAP Commands:** `TextPlugin`, `stagger`.

#### Solution
```javascript
gsap.registerPlugin(TextPlugin);

const textNodes = document.querySelectorAll(".svg-card text");

textNodes.forEach(node => {
  const originalText = node.textContent;
  gsap.set(node, { text: "" }); // Reset to empty
  
  gsap.to(node, {
    text: originalText,
    duration: 1.5,
    ease: "power1.inOut"
  });
});
```

---

### Exercise 10: Infinite Heartbeat Indicator lights
* **Goal:** Make the text labels of active cards pulse in brightness to indicate an active state.
* **Real-World Case:** Status dashboards.
* **GSAP Commands:** `opacity`, `repeat: -1`, `yoyo: true`.

#### Solution
```javascript
gsap.to(".svg-sub-card text", {
  opacity: 0.4,
  duration: 0.8,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  stagger: 0.2
});
```

---

## Tier 3: Scroll-Driven Zoom, Pinning & Focus

### Exercise 11: ScrollTrigger Viewport Pinning
* **Goal:** Lock the parent SVG in the center of the viewport while performing highlight overlays.
* **Real-World Case:** Storytelling infographic sections.
* **GSAP Commands:** `ScrollTrigger`, `pin`, `trigger`.

#### Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: "svg.excalidraw-svg",
  start: "center center",
  end: "+=1000",
  pin: true,
  scrub: true
});
```

---

### Exercise 12: Camera Zoom Focus (viewBox Panning)
* **Goal:** Focus the SVG camera on the `#card-harness` element on scroll.
* **Real-World Case:** Responsive diagrams on scroll.
* **GSAP Commands:** `attr: { viewBox }`, `ScrollTrigger`.

#### Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to("svg.excalidraw-svg", {
  attr: { viewBox: "450 220 280 340" }, // Focused coordinates around the Harness
  scrollTrigger: {
    trigger: "svg.excalidraw-svg",
    start: "top center",
    end: "bottom center",
    scrub: 1
  }
});
```

---

### Exercise 13: Staggered Content Disclosure Overlay
* **Goal:** Fade in descriptive text cards next to the SVG as specific nodes rotate/scale into focus.
* **Real-World Case:** Highlighting technical diagram nodes on scroll.
* **GSAP Commands:** `ScrollTrigger`, `opacity`, `scale`.

#### Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to("#card-rag", {
  scale: 1.1,
  transformOrigin: "center center",
  scrollTrigger: {
    trigger: "svg.excalidraw-svg",
    start: "top center",
    end: "+=200",
    scrub: true,
    onEnter: () => gsap.to("#info-card-rag", { opacity: 1, duration: 0.3 })
  }
});
```

---

### Exercise 14: Responsive Tooltip Highlight
* **Goal:** Scale down surrounding panels and dim their opacity when a user clicks on `#card-text-gen`.
* **Real-World Case:** Interactive detail overlays on architectural maps.
* **GSAP Commands:** `gsap.to()`, selector arrays.

#### Solution
```javascript
document.getElementById("card-text-gen").addEventListener("click", () => {
  gsap.to(".svg-card:not(#card-text-gen), .svg-sub-card", {
    opacity: 0.2,
    scale: 0.9,
    transformOrigin: "center center",
    duration: 0.5
  });
  
  gsap.to("#card-text-gen", {
    scale: 1.1,
    transformOrigin: "center center",
    duration: 0.5
  });
});
```

---

### Exercise 15: ScrollTrigger Connector Completion
* **Goal:** Synchronize the drawing of the connector arrows with the user's scroll position.
* **Real-World Case:** Flow diagrams that reveal connections dynamically as you scroll.
* **GSAP Commands:** `ScrollTrigger`, `strokeDashoffset`.

#### Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

const paths = document.querySelectorAll(".arrow path");

paths.forEach(path => {
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  
  gsap.to(path, {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: "svg.excalidraw-svg",
      start: "top 60%",
      end: "bottom 40%",
      scrub: true
    }
  });
});
```

---

### Exercise 16: Highlight Track Sync
* **Goal:** Trigger active glow effects sequentially on panels as they cross the center of the viewport.
* **Real-World Case:** Walkthrough interfaces.
* **GSAP Commands:** `ScrollTrigger`, class toggle.

#### Solution
```javascript
gsap.registerPlugin(ScrollTrigger);

const cards = [ "#card-title", "#card-text-gen", "#card-rag", "#card-harness" ];

cards.forEach(card => {
  ScrollTrigger.create({
    trigger: card,
    start: "top center",
    end: "bottom center",
    toggleClass: { targets: card, className: "active-glow" }
  });
});
```

---

## Tier 4: Interactive Mockups & Draggable Nodes

### Exercise 17: Interactive 3D Card Hover Tilt
* **Goal:** Create a subtle 3D tilt effect on `#card-title` on mouse move.
* **Real-World Case:** Premium dashboard components.
* **GSAP Commands:** `rotationX`, `rotationY`, `transformPerspective`.

#### Solution
```javascript
const card = document.getElementById("card-title");
gsap.set(card, { transformPerspective: 1000, transformOrigin: "center center" });

card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  gsap.to(card, {
    rotationY: x * 0.15, // Rotate on Y based on horizontal mouse pos
    rotationX: -y * 0.15, // Rotate on X based on vertical mouse pos
    duration: 0.2
  });
});

card.addEventListener("mouseleave", () => {
  gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5 });
});
```

---

### Exercise 18: Draggable Module Re-ordering
* **Goal:** Enable users to drag the three sub-cards (`#card-coding`, `#card-tool-calling`, `#card-scheduling`) vertically to rearrange them within the Harness box.
* **Real-World Case:** Interactive workflow editors.
* **GSAP Commands:** `Draggable.create()`, vertical constraint.

#### Solution
```javascript
gsap.registerPlugin(Draggable);

Draggable.create(".svg-sub-card", {
  type: "y",
  bounds: "#card-harness",
  edgeResistance: 0.65,
  onDragStart: function() {
    gsap.to(this.target, { scale: 1.05, duration: 0.2 });
  },
  onDragEnd: function() {
    gsap.to(this.target, { scale: 1.0, duration: 0.2 });
  }
});
```

---

### Exercise 19: Dynamic Arrow Elastic Re-Routing
* **Goal:** Recalculate and update the arrow paths dynamically when a card is dragged.
* **Real-World Case:** Interactive node-graph editors.
* **GSAP Commands:** `onDrag` callbacks, SVG attribute updates.

#### Solution
```javascript
gsap.registerPlugin(Draggable);

const arrowPath = document.querySelector(".arrow-title-to-text path");

Draggable.create("#card-text-gen", {
  type: "x,y",
  onDrag: function() {
    // 1. Get current positions
    const textGenPos = this.target.getBoundingClientRect();
    const titlePos = document.getElementById("card-title").getBoundingClientRect();
    
    // 2. Calculate coordinates relative to parent viewport
    const startX = titlePos.left + titlePos.width / 2;
    const startY = titlePos.bottom;
    const endX = textGenPos.left + textGenPos.width / 2;
    const endY = textGenPos.top;
    
    // 3. Update the path's "d" attribute with a smooth curve
    const newPath = `M ${startX},${startY} C ${startX},${(startY+endY)/2} ${endX},${(startY+endY)/2} ${endX},${endY}`;
    arrowPath.setAttribute("d", newPath);
  }
});
```

---

### Exercise 20: Color Ripple Effect
* **Goal:** Animate a ripple effect: clicking any card sends a wave of scaling/glowing updates across adjacent cards.
* **Real-World Case:** Multi-node control interfaces.
* **GSAP Commands:** Stagger dynamically calculated using distances.

#### Solution
```javascript
const cardsList = Array.from(document.querySelectorAll(".svg-card"));

cardsList.forEach(card => {
  card.addEventListener("click", () => {
    const clickedRect = card.getBoundingClientRect();
    const clickedX = clickedRect.left + clickedRect.width / 2;
    const clickedY = clickedRect.top + clickedRect.height / 2;
    
    cardsList.forEach(otherCard => {
      const otherRect = otherCard.getBoundingClientRect();
      const otherX = otherRect.left + otherRect.width / 2;
      const otherY = otherRect.top + otherRect.height / 2;
      
      // Calculate distance between elements
      const dist = Math.hypot(otherX - clickedX, otherY - clickedY);
      
      // Stagger animation based on distance
      gsap.to(otherCard, {
        scale: 1.1,
        yoyo: true,
        repeat: 1,
        delay: dist * 0.001,
        duration: 0.3,
        transformOrigin: "50% 50%"
      });
    });
  });
});
```

---

### Exercise 21: Draggable Flow Chart Snap Grid
* **Goal:** Snap cards back to their original coordinates if they are dropped outside of designated slots.
* **Real-World Case:** Interactive puzzle designs.
* **GSAP Commands:** `onDragEnd`, `x`, `y`.

#### Solution
```javascript
gsap.registerPlugin(Draggable);

const originalPositions = {};

document.querySelectorAll(".svg-card").forEach(card => {
  // Capture baseline coordinates
  originalPositions[card.id] = { 
    x: gsap.getProperty(card, "x"), 
    y: gsap.getProperty(card, "y") 
  };
  
  Draggable.create(card, {
    type: "x,y",
    onDragEnd: function() {
      const orig = originalPositions[this.target.id];
      // Check if dropped near the original position (snap range: 50px)
      const currentX = gsap.getProperty(this.target, "x");
      const currentY = gsap.getProperty(this.target, "y");
      
      if (Math.hypot(currentX - orig.x, currentY - orig.y) > 50) {
        // Return to start with smooth bounce
        gsap.to(this.target, {
          x: orig.x,
          y: orig.y,
          duration: 0.6,
          ease: "bounce.out"
        });
      }
    }
  });
});
```

---

## Tier 5: Advanced Eases, Physics & Layout Transitions

### Exercise 22: Electric Neon Glitch Initialization
* **Goal:** Flicker the main Title Card text on load to simulate a neon power-up sequence.
* **Real-World Case:** Premium intro screen loading sequences.
* **GSAP Commands:** `RoughEase`, `opacity`.

#### Solution
```javascript
gsap.registerPlugin(EasePack);

gsap.fromTo("#card-title text", 
  { opacity: 0.05 },
  { 
    opacity: 1, 
    duration: 1.8, 
    ease: "rough({ template: power1.none, strength: 3, points: 25, randomize: true })",
    onComplete: () => {
      // Steady pulse once initialized
      gsap.to("#card-title text", {
        opacity: 0.85,
        duration: 0.15,
        repeat: -1,
        yoyo: true
      });
    }
  }
);
```

---

### Exercise 23: Elastic Card Drop-In
* **Goal:** Animate all cards to drop in from the top of the canvas, overshooting their final positions and settling with realistic physics.
* **Real-World Case:** Creative page loads.
* **GSAP Commands:** `y`, `ease: "elastic.out"`.

#### Solution
```javascript
// Drop all cards from above the canvas boundary
gsap.from(".svg-card", {
  y: -500,
  duration: 1.6,
  ease: "elastic.out(1, 0.65)",
  stagger: 0.15
});
```

---

### Exercise 24: Collapsing/Expanding Sub-harness Drawer
* **Goal:** Toggle the visibility of the sub-cards inside `#card-harness` by sliding them up behind the parent container card when collapsed.
* **Real-World Case:** Expandable tree/directory nodes in diagrams.
* **GSAP Commands:** `y`, `clipPath` or standard height translations.

#### Solution
```javascript
let isCollapsed = false;

document.getElementById("card-harness").addEventListener("click", () => {
  if (!isCollapsed) {
    // Slide up behind the parent card
    gsap.to([ "#card-coding", "#card-tool-calling", "#card-scheduling" ], {
      y: -150,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: "power2.in"
    });
  } else {
    // Slide back down to visible slots
    gsap.to([ "#card-coding", "#card-tool-calling", "#card-scheduling" ], {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.5)"
    });
  }
  isCollapsed = !isCollapsed;
});
```

---

### Exercise 25: CustomEase Stepped Indicator
* **Goal:** Create a springy progress sweep line that advances in steps.
* **Real-World Case:** Status sweeps and system updates.
* **GSAP Commands:** `CustomEase`, `rotation`.

#### Solution
```javascript
gsap.registerPlugin(CustomEase);

// A springy custom ease curve
CustomEase.create("springJump", "M0,0 C0.1,0.5 0.3,1.2 0.5,1 C0.7,0.85 0.85,1.05 1,1");

gsap.to("#card-harness", {
  rotation: 10,
  transformOrigin: "center center",
  duration: 1.5,
  ease: "springJump",
  repeat: -1,
  yoyo: true
});
```

---

### Exercise 26: Smooth Damped Mouse Tracking (Parallax Cam)
* **Goal:** Pan the viewBox slightly in response to the user's cursor position.
* **Real-World Case:** Immersive spatial illustrations.
* **GSAP Commands:** `gsap.to()`, dynamic viewport manipulation.

#### Solution
```javascript
const svg = document.querySelector("svg.excalidraw-svg");

window.addEventListener("mousemove", (e) => {
  const normX = (e.clientX / window.innerWidth) - 0.5;  // Range: -0.5 to +0.5
  const normY = (e.clientY / window.innerHeight) - 0.5; // Range: -0.5 to +0.5
  
  // Smoothly interpolate the viewBox to follow cursor movements
  gsap.to(svg, {
    attr: { viewBox: `${normX * 100} ${normY * 100} 726.64 605.88` },
    duration: 0.8,
    ease: "power2.out"
  });
});
```

---

### Exercise 27: FLIP Column Layout Swap
* **Goal:** Swap the positions of `#card-text-gen` and `#card-rag` using the FLIP plugin.
* **Real-World Case:** Responsive dashboard grids.
* **GSAP Commands:** `Flip.getState()`, `Flip.from()`.

#### Solution
```javascript
gsap.registerPlugin(Flip);

function swapCards() {
  // 1. Capture positions of the elements
  const state = Flip.getState("#card-text-gen, #card-rag");
  
  // 2. Perform layout swaps
  const cardA = document.getElementById("card-text-gen");
  const cardB = document.getElementById("card-rag");
  const parent = cardA.parentNode;
  
  parent.insertBefore(cardB, cardA); // Swap rendering order in DOM
  
  // 3. Smoothly animate between state changes
  Flip.from(state, {
    duration: 0.6,
    ease: "power2.inOut",
    scale: true
  });
}

// Bind to click trigger
document.getElementById("card-title").addEventListener("click", swapCards);
```

---

### Exercise 28: FLIP Harness Parent Box Resize
* **Goal:** Expand `#card-harness` to full width and scale child nodes to fit.
* **Real-World Case:** Expanding system panels.
* **GSAP Commands:** `Flip`.

#### Solution
```javascript
gsap.registerPlugin(Flip);

let isLarge = false;

function togglePanelScale() {
  const state = Flip.getState("#card-harness");
  
  // Modify the width dynamically
  const rect = document.querySelector("#card-harness rect");
  if (!isLarge) {
    rect.setAttribute("width", "350");
  } else {
    rect.setAttribute("width", "243.81");
  }
  isLarge = !isLarge;
  
  // Smoothly transition between states
  Flip.from(state, {
    duration: 0.5,
    ease: "back.out(1.2)"
  });
}
```

---

### Exercise 29: Morphing Border Paths (CSS transitions)
* **Goal:** Round the corners of panels dynamically from square corners to circle nodes.
* **Real-World Case:** Interactive button state morphs.
* **GSAP Commands:** `attr: { rx }`.

#### Solution
```javascript
// Tweening the corner radius (rx, ry) of the panel's rect elements
gsap.to(".svg-card rect", {
  attr: { rx: 50 }, // Morphs sharp rectangles into pill/circular shapes
  duration: 1.2,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true
});
```

---

### Exercise 30: System Reset Clean-up
* **Goal:** Kill all active animations, clean up inline style modifications, and restore the SVG layout to its original state.
* **Real-World Case:** Switching layouts or navigation events.
* **GSAP Commands:** `gsap.killTweensOf()`, `clearProps`.

#### Solution
```javascript
function resetAllAnimations() {
  // 1. Kill active tweens
  gsap.killTweensOf("*");
  
  // 2. Clear inline styling properties
  gsap.set(".svg-card, .svg-sub-card, rect, text, path", { clearProps: "all" });
  
  // 3. Restore original coordinates
  const svg = document.querySelector("svg.excalidraw-svg");
  svg.setAttribute("viewBox", "0 0 726.64 605.88");
  
  // 4. Remove dynamically injected elements
  const beads = svg.querySelectorAll("circle:not([cx])"); // dynamically created bead has no cx attribute
  beads.forEach(b => b.remove());
}
```
