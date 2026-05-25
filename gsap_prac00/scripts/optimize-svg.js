import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

/**
 * Optimizes an Excalidraw SVG for GSAP/HyperFrames animation.
 * Groups boxes with their texts, structures arrows, and adds classes/IDs/data-attributes.
 */
export function optimizeSVG(svgContent, options = {}) {
  const {
    startCardStart = 0.5,
    startCardDuration = 4,
    startArrowStart = 1,
    startArrowDuration = 3,
    cardTrackIndex = 0,
    arrowTrackIndex = 1,
  } = options;

  const dom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
  const doc = dom.window.document;
  const svg = doc.querySelector("svg");

  if (!svg) {
    throw new Error("No SVG element found in the input content.");
  }

  // Remove empty masks
  doc.querySelectorAll("mask").forEach((mask) => {
    if (!mask.children.length && !mask.textContent.trim()) {
      mask.remove();
    }
  });

  // Get all direct children of SVG
  const children = Array.from(svg.children);
  const cardPairs = [];
  const arrowGroups = [];

  // Identify boxes and text groups
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (el.tagName.toLowerCase() === "g") {
      const hasPaths = el.querySelector("path") !== null;
      const hasText = el.querySelector("text") !== null;

      // Check if it's a shape group followed by a text group
      if (hasPaths && !hasText) {
        const nextEl = children[i + 1];
        if (nextEl && nextEl.tagName.toLowerCase() === "g" && nextEl.querySelector("text")) {
          cardPairs.push({ boxG: el, textG: nextEl });
          i++; // Skip next element since we paired it
          continue;
        }
      }

      // Check if it's an arrow group: <g stroke-linecap="round"> with no transform attribute, containing child <g> elements
      const hasStrokeLinecap = el.getAttribute("stroke-linecap") === "round";
      const hasTransform = el.hasAttribute("transform");
      const hasChildGs = Array.from(el.children).every(c => c.tagName.toLowerCase() === "g");

      if (hasStrokeLinecap && !hasTransform && hasChildGs && el.children.length > 0) {
        arrowGroups.push(el);
      }
    }
  }

  // Process Card Pairs
  let cardCount = 0;
  cardPairs.forEach(({ boxG, textG }) => {
    cardCount++;
    // Extract text content to slugify
    const textEls = Array.from(textG.querySelectorAll("text"));
    const textStr = textEls.map(t => t.textContent.trim()).join(" ");
    const slug = textStr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `box-${cardCount}`;

    // Create wrapping group
    const wrapper = doc.createElementNS("http://www.w3.org/2000/svg", "g");
    wrapper.setAttribute("id", `card-${slug}`);
    wrapper.setAttribute("class", "clip card-group");
    wrapper.setAttribute("data-start", String(startCardStart));
    wrapper.setAttribute("data-duration", String(startCardDuration));
    wrapper.setAttribute("data-track-index", String(cardTrackIndex));

    // Place wrapper where boxG was
    boxG.parentNode.insertBefore(wrapper, boxG);

    // Label inner elements
    boxG.setAttribute("class", "card-shape");
    
    // Label paths inside card
    const paths = Array.from(boxG.querySelectorAll("path"));
    paths.forEach(p => {
      const fill = p.getAttribute("fill");
      const stroke = p.getAttribute("stroke");
      if (fill && fill !== "none" && (!stroke || stroke === "none" || stroke === "transparent")) {
        p.setAttribute("class", "card-bg");
      } else if (stroke && stroke !== "none") {
        p.setAttribute("class", "card-border");
      }
    });

    textG.setAttribute("class", "card-text");

    // Move boxG and textG into wrapper
    wrapper.appendChild(boxG);
    wrapper.appendChild(textG);
  });

  // Process Arrow Groups
  let arrowCount = 0;
  arrowGroups.forEach((arrowG) => {
    arrowCount++;
    
    // Create wrapper
    const wrapper = doc.createElementNS("http://www.w3.org/2000/svg", "g");
    wrapper.setAttribute("id", `arrow-${arrowCount}`);
    wrapper.setAttribute("class", "clip arrow-group");
    wrapper.setAttribute("data-start", String(startArrowStart));
    wrapper.setAttribute("data-duration", String(startArrowDuration));
    wrapper.setAttribute("data-track-index", String(arrowTrackIndex));

    arrowG.parentNode.insertBefore(wrapper, arrowG);

    // Move children from original arrowG to wrapper
    const arrowChildren = Array.from(arrowG.children);
    arrowChildren.forEach((childG, index) => {
      // Label child groups and paths
      if (index === 0) {
        childG.setAttribute("class", "arrow-shaft-group");
        const path = childG.querySelector("path");
        if (path) path.setAttribute("class", "arrow-shaft-path");
      } else {
        childG.setAttribute("class", `arrow-head-group arrow-head-${index}`);
        const path = childG.querySelector("path");
        if (path) path.setAttribute("class", "arrow-head-path");
      }
      wrapper.appendChild(childG);
    });

    // Remove the empty original arrowG
    arrowG.remove();
  });

  // Serialize back to string
  const serializer = new dom.window.XMLSerializer();
  return serializer.serializeToString(doc);
}

// Running script directly from command line
const args = process.argv.slice(2);
if (args.length > 0 && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const inputPath = args[0];
  const outputPath = args[1] || inputPath.replace(".svg", "_clean.svg");

  try {
    const rawSvg = fs.readFileSync(inputPath, 'utf8');
    const cleanSvg = optimizeSVG(rawSvg);
    fs.writeFileSync(outputPath, cleanSvg, 'utf8');
    console.log(`\nSuccessfully optimized: ${inputPath}`);
    console.log(`Saved output to: ${outputPath}\n`);
  } catch (err) {
    console.error(`Error optimizing SVG: ${err.message}`);
    process.exit(1);
  }
}
