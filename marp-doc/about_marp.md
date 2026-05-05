---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    background: #fff;
  }
  h1 {
    color: #0288d1;
    font-size: 2.2rem;
  }
  h2 {
    color: #01579b;
    font-size: 1.6rem;
  }
  .lead h1 {
    font-size: 3.5rem;
    text-align: center;
  }
  .lead p {
    text-align: center;
    font-size: 1.5rem;
    color: #555;
  }
  section.bg-gradient {
    background: linear-gradient(to bottom right, #e1f5fe, #ffffff);
  }
  blockquote {
    background: #f9f9f9;
    border-left: 10px solid #0288d1;
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    font-style: italic;
  }
  code {
    background-color: #f4f4f4;
    padding: 2px 5px;
    border-radius: 4px;
    color: #d81b60;
  }
---

<!-- _class: lead bg-gradient -->

# What is Marp?
### Markdown Presentation Ecosystem
**Elegant slides from simple text.**

---

# Core Concept
## Content-First Authoring

*   **Simplification**: Focus on content, not formatting.
*   **Marpit Framework**: The engine that powers the transformation.
*   **Standards-Based**: Uses standard CommonMark syntax.
*   **Extensible**: Customizable via CSS and plugins.

---

# The Transformation
## From Text to Pixels

![bg left:40%](https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000)

*   **Input**: Your `.md` file.
*   **Logic**: Slide breaks identified by `---`.
*   **Styling**: Directives & CSS themes applied.
*   **Output**: Semantic HTML structure.

---

# Detailed Process
## Under the Hood

1.  **Parsing**: Identifies slide boundaries and metadata.
2.  **Directive Injection**: Applies global/local settings (theme, paginate).
3.  **CSS Scoping**: Themes are automatically scoped to each `<section>`.
4.  **SVG Container**: (Optional) Wraps slides in SVG for perfect scaling.

---

# Generating Output
## Flexible Deployment

> The generated HTML is a fully functional web page, serving as the foundation for all exports.

*   **Marp CLI**: The command-line power tool for automation.
*   **Interactive Preview**: Real-time feedback during authoring.
*   **Self-Contained**: Assets can be bundled into a single file.

---

# Versatile Export Formats
## One Source, Many Outputs

*   **PDF**: High-quality document sharing.
*   **PPTX**: Microsoft PowerPoint compatibility.
*   **HTML**: Interactive web presentations.
*   **Images**: PNG/JPEG for social sharing or documentation.

---

# Authoring Experience
## Marp for VS Code

*   **Live Preview**: Side-by-side editing and viewing.
*   **Export UI**: Export to PDF/PPTX with a single click.
*   **Snippet Support**: Quick insertion of directives and layouts.
*   **Theme Detection**: Automatically recognizes local CSS files.

---

<!-- _class: lead bg-gradient -->

# Start Building Today
## github.com/marp-team
