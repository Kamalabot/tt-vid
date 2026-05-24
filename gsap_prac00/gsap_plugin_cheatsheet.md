Here is your updated, production-ready extensive cheatsheet for the GSAP plugins. It focuses strictly on the modern configurations, properties, methods, and syntax architecture corresponding to the **local NPM distribution builds (`node_modules/gsap/dist/*`)**.

To ensure it serves as an effective offline reference, the entire document is enclosed inside a clean code block below for immediate copying into your local project workspace notes.

```markdown
# GSAP v3 Advanced Plugins: Complete Production Reference

This reference manual documents the API parameters, lifecycle hooks, and method calls for the core animation extensions found within `node_modules/gsap/dist/`.

---

## 1. ScrollTrigger (`ScrollTrigger.min.js`)
Links animation timelines directly to the viewport's scroll bar position or intercepts scroll flags to lock layout structures.

### Module Registration & Initialization
```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Basic Syntax
gsap.to(".target", {
  scrollTrigger: {
    trigger: ".trigger-container",
    start: "top center", // [Element Anchor, Viewport Target Window]
    end: "bottom 20%",
    scrub: true
  },
  x: 300
});

```

### Key Configuration Attributes

* **`trigger`** `[string | HTMLElement]`: The reference element used to calculate viewport intersection boundaries.
* **`start` / `end**` `[string | number | function]`: Defines the exact execution points.
* *String shortcuts:* `"top top"`, `"center center"`, `"bottom 80%"`.
* *Relative values:* `"+=300"` (ends exactly 300px after start executes).


* **`scrub`** `[boolean | number]`: Links the playhead directly to the scrollbar movement. If passed as a number (e.g., `1.5`), it acts as a tracking catch-up latency in seconds.
* **`pin`** `[boolean | string | HTMLElement]`: Locks the target element in viewport space while the timeline runs. Residual space is compensated via automatic structural padding.
* **`anticipatePin`** `[number]`: Mitigates slight sub-pixel rendering stutters on heavy pages by pinning the element slightly before the start line crosses.
* **`toggleActions`** `[string]`: Dictates non-scrub playback behaviors. Expects a single string containing 4 distinct keywords mapping to: `onEnter onLeave onEnterBack onLeaveBack`.
* *Available options:* `play`, `pause`, `resume`, `reverse`, `restart`, `reset`, `complete`, `none`.
* *Example:* `toggleActions: "play pause resume reset"`



### Static Class Methods

* `ScrollTrigger.refresh()`: Re-calculates every single positioning metric across the document layout. Invoke this manually if you drop lazy-loaded elements or alter height nodes via background scripts.
* `ScrollTrigger.create(config)`: Builds a standalone ScrollTrigger execution sequence directly tied to scroll states without declaring a parent tween.
* `ScrollTrigger.getAll()`: Returns an array containing every active ScrollTrigger instance running on the page.

---

## 2. Draggable (`Draggable.min.js`)

Converts standard DOM nodes into touch-responsive, fluid, coordinate-tracked draggable elements.

### Module Registration & Initialization

```javascript
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

// Initialization returns an array of instances
const instances = Draggable.create("#target", {
  type: "x,y",
  bounds: "#parent-window",
  edgeResistance: 0.5
});
const myDraggable = instances[0];

```

### Key Configuration Attributes

* **`type`** `[string]`: Sets the allowed axes of movement tracking.
* Options: `"x,y"` | `"x"` | `"y"` | `"rotation"` | `"top,left"`


* **`bounds`** `[string | HTMLElement | object]`: Caps movement space boundaries. Can target a parent selector container or explicit pixel coordinate parameters: `{minX: 0, maxX: 500, minY: 0, maxY: 300}`.
* **`edgeResistance`** `[number]`: Floating-point scalar ranging from `0` to `1`. Dictates how much resistance is felt when dragging the element beyond the defined boundary boxes (1 blocks all movement completely).
* **`lockAxis`** `[boolean]`: If true, locks movement to a single axis once dragging starts, ignoring minor diagonal inputs.
* **`trigger`** `[string | HTMLElement]`: Specifying an element here handles all input pointer captures, allowing you to drag an object by grabbing a specific handle node instead of the main component.

### Instance Methods & Properties

* `instance.disable()` / `instance.enable()`: Turns off or re-activates input device tracking handlers dynamically.
* `instance.update(applyBounds)`: Forces a layout recalculation. Essential if the bounding box sizes modify during window layout shifts.
* `instance.x` / `instance.y`: Live coordinate readings reflecting current position shifts.
* `instance.isDragging`: Boolean flag tracking whether an input pointer is currently manipulating the element.

---

## 3. MotionPathPlugin (`MotionPathPlugin.min.js`)

Snaps coordinates directly to an inline SVG vector path geometric sequence, enabling complex Bezier pathing.

### Module Registration & Initialization

```javascript
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

gsap.to("#object", {
  duration: 5,
  motionPath: {
    path: "#svgPathId",
    autoRotate: true,
    align: "#svgPathId",
    alignOrigin: [0.5, 0.5]
  }
});

```

### Key Configuration Attributes

* **`path`** `[string | SVGPathElement | array]`: The vector wireframe track data source. Can be a CSS string selector targeting a path node, or an array of absolute coordinates: `[{x:100, y:200}, {x:300, y:400}]`.
* **`autoRotate`** `[boolean | number]`: Automatically calculates tangent slope values on the path curves and updates target rotation properties to match the direction of travel. Pass a number to offset the final rotation skew.
* **`align`** `[string | HTMLElement]`: Snaps the target's transform baseline positions directly onto the coordinates of the path container, preventing layout offset clipping.
* **`alignOrigin`** `[array]`: Dictates *where* the target element anchors to the path. `[0.5, 0.5]` centers the object perfectly on the line.

---

## 4. TextPlugin (`TextPlugin.min.js`)

Applies progressive, character-by-character updates to string values inside DOM textual layouts.

### Module Registration & Initialization

```javascript
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

gsap.to(".console", {
  duration: 3,
  text: {
    value: "Replaced baseline operational systems.",
    delimiter: " "
  }
});

```

### Key Configuration Attributes

* **`value`** `[string]`: The exact string destination content intended to populate the target element.
* **`delimiter`** `[string]`: Dictates word segmentation rules. Leaving this empty updates string metrics letter-by-letter. Passing a space character (`" "`) forces structural updates to animate word-by-word.
* **`newClass`** `[string]`: Automatically appends a designated style class identifier to each newly generated incoming character block. Useful for colorizing trailing letter chains during a typewriter loop.
* **`padSpace`** `[boolean]`: If true, maintains space layout bounds inside container frames so elements don't shift layout positions while text is typing.

---

## 5. EasePack (`EasePack.min.js`)

Supplies specialized mathematical acceleration functions for custom physics simulation vectors.

### Module Registration & Initialization

```javascript
import { EasePack } from "gsap/EasePack";
gsap.registerPlugin(EasePack);

```

### Available Core Eases

#### `SlowMo`

Creates a prolonged, uniform linear velocity plateau across the middle of an animation curve before snapping sharply into completion coordinates.

```javascript
gsap.to(".element", { 
  x: 400, 
  ease: "slow(0.7, 0.7, false)" // [linearRatio, powerRatio, yoyoMode]
});

```

#### `RoughEase`

Injects deliberate, randomized frequency vibrations directly over a standard ease curve. Ideal for simulating flickering neon tubes, electrical failure bugs, or localized structural tremors.

```javascript
gsap.to(".glitch-node", {
  opacity: 0,
  ease: "rough({ template: power1.none, strength: 2, points: 50, randomize: true })"
});

```