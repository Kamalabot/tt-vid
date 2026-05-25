# Implementation Plan: Excalidraw SVG Optimizer for GSAP & HyperFrames

We will create an interactive, premium single-page web tool (and a command-line script) to optimize and prepare Excalidraw SVGs for GSAP animations. The tool will handle key Excalidraw export patterns, structure them with proper semantic tags (`id`, `class`), and add HyperFrames compatibility fields (`class="clip"`, `data-*` attributes).

---

## Proposed Changes

We will create two main components:
1. **Interactive Web Tool (`excalidraw-optimizer.html`):** A premium web-based GUI that lets users paste an SVG, configure grouping parameters, instantly see side-by-side previews (visual render and code diff), and copy the optimized SVG along with generated GSAP boilerplate code.
2. **Node-based Helper Script (`scripts/optimize-svg.js`):** A command-line script that performs the same structural parsing, allowing batch processing in terminal workflows.

### Components

#### [NEW] [excalidraw-optimizer.html](file:///d:/TT_vid/gsap_prac00/excalidraw-optimizer.html)
A standalone HTML utility page styled with a modern, high-fidelity dark-mode interface (using Nunito / Lilita One fonts, smooth animations, and glassmorphism styling). It will contain:
* **UI sections:**
  * **Input Area:** Text area to paste the raw Excalidraw SVG.
  * **Configuration Panel:** Control inputs for default timing (`data-start`, `data-duration`, `data-track-index` offset), class prefix configurations, and options like "Group Arrow Components" or "Assign IDs by Text Value".
  * **Output Area:** Tabbed view displaying the **Optimized SVG Code**, a **Live Visual Render of the Clean SVG**, and a **GSAP Boilerplate Code block**.
* **Core JS Parser Logic:**
  * XML parsing of the pasted SVG.
  * **Card Detection:** Scans the SVG tree. Consecutive `<g>` elements representing a shape container (having a nested fill/stroke path) and a text container are paired up. The script reads the text content, generates a clean slug (e.g. `card-automation-using-llms`), groups them in a parent `<g id="card-automation-using-llms" class="clip card-group">`, and assigns custom `data-start`, `data-duration`, and `data-track-index` attributes.
  * **Arrow Detection:** Groups sibling `<g>` elements under `<g stroke-linecap="round">` (with no `transform`) representing shafts and arrowheads, wrapping them in `<g id="arrow-n" class="clip arrow-group">`.
  * **Styling Preservation:** Cleans up redundant `<mask>` elements and ensures valid syntax.

#### [NEW] [optimize-svg.js](file:///d:/TT_vid/gsap_prac00/scripts/optimize-svg.js)
A node CLI helper script (using the standard `jsdom` or regex/string-replacement approach to avoid external heavy dependencies) that can be run from the terminal to clean files in-place:
```bash
node scripts/optimize-svg.js agent_work00.svg agent_work00_clean.svg
```

---

## Verification Plan

### Manual Verification
1. Open `excalidraw-optimizer.html` in a web browser.
2. Paste the contents of `agent_work00.svg`.
3. Verify that:
   * The visual preview matches the layout of the original SVG.
   * All box groups and their corresponding text are successfully wrapped in a unified parent group with readable, slugified IDs (e.g., `#card-automation-using-llms`, `#card-text-generation`).
   * Connectors/arrows are grouped into single `#arrow-1`, `#arrow-2` structures.
   * The generated GSAP code contains selectors targeting these new IDs.
4. Copy the optimized SVG and check it against the HyperFrames linter (`npm run check`) to ensure it passes all syntax rules.
