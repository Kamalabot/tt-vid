# GSAP v3 Command Dictionary & Practice Lab Guide

## 1. Primary Instantiation Selectors
* **Target Definitions:** GSAP utilizes `document.querySelectorAll()` internally. You can pass raw CSS strings (`".class"`, `"#id"`), direct DOM references, or object variables.
* **Object Configuration (`vars`):** All values representing animations must use modern camelCase rules instead of standard hyphenated CSS strings (e.g., `backgroundColor` instead of `background-color`).

## 2. Global Core Engine Commands
### `gsap.to(target, vars)`
* **Purpose:** Animates properties from their current structural location down to the explicit values passed inside the vars object block.
* **Syntax Reference:**
    ```javascript
    gsap.to(".selector", { x: 200, duration: 1 });
    ```

### `gsap.from(target, vars)`
* **Purpose:** Captures current values as endpoints, instantly updates parameters to values defined inside the block, and runs down to the cached endpoints.
* **Syntax Reference:**
    ```javascript
    gsap.from(".selector", { opacity: 0, scale: 0.5 });
    ```

### `gsap.fromTo(target, fromVars, toVars)`
* **Purpose:** Overrides existing environmental states entirely by setting an explicit starting coordinate group and ending coordinate group.
* **Syntax Reference:**
    ```javascript
    gsap.fromTo(".selector", { x: 0 }, { x: 500, duration: 2 });
    ```

### `gsap.set(target, vars)`
* **Purpose:** Triggers immediate mutations to properties with no transition time (zero duration), passing optimal performance pipelines compared to raw inline style edits.
* **Syntax Reference:**
    ```javascript
    gsap.set(".selector", { transformOrigin: "top left", display: "flex" });
    ```

---

## 3. High-Performance Transform Shortcuts
GSAP transforms operate directly on the element matrix, avoiding standard browser layout re-flows.
* `x` / `y` / `z`: Maps directly to 2D/3D translates (`translateX`, `translateY`, `translateZ`).
* `rotation` / `rotationX` / `rotationY`: Controls rotation degree values.
* `scale` / `scaleX` / `scaleY`: Controls size multipliers.
* `skewX` / `skewY`: Adjusts slant distortions.

---

## 4. Operational Callbacks & Lifecycle Parameters
These hooks can be included directly within the configuration object to coordinate background logic during transitions:
* `onStart`: Runs once as soon as the delay finishes and execution begins.
* `onUpdate`: Fires on every single rendering refresh frame during processing.
* `onComplete`: Evaluates immediately after the animation completes its total run loop.
* `onRepeat`: Triggers every time a looped instance cycles back to its starting coordinate position.