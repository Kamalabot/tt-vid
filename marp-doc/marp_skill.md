# Marpit Slide Creation Skills

This document provides a comprehensive guide to creating engaging and professional slide decks using Marpit. It consolidates information from various Marpit documentation sources to offer a unified overview of its features, from basic slide creation to advanced styling and API usage.

## Table of Contents

1.  [Introduction to Marpit](#introduction-to-marpit)
2.  [Core Concepts: How to Write Slides](#core-concepts-how-to-write-slides)
3.  [Directives](#directives)
    *   [Usage](#usage)
    *   [Global Directives](#global-directives)
    *   [Local Directives](#local-directives)
    *   [Advanced: Custom Directives](#advanced-custom-directives)
4.  [Image Syntax](#image-syntax)
    *   [Resizing Image](#resizing-image)
    *   [Image Filters](#image-filters)
    *   [Slide Backgrounds](#slide-backgrounds)
    *   [Advanced Backgrounds (Inline SVG required)](#advanced-backgrounds-inline-svg-required)
5.  [Fragmented Lists](#fragmented-lists)
6.  [Theme CSS](#theme-css)
    *   [HTML Structure](#html-structure)
    *   [Create Theme CSS](#create-theme-css)
    *   [Styling](#styling)
    *   [Customized Theme](#customized-theme)
    *   [Tweak Style through Markdown](#tweak-style-through-markdown)
7.  [Inline SVG Slide (Experimental)](#inline-svg-slide-experimental)
    *   [Motivation](#motivation)
    *   [Webkit Polyfill](#webkit-polyfill)
    *   [::backdrop CSS selector](#backdrop-css-selector)
8.  [Marpit Usage (API)](#marpit-usage-api)
    *   [Marpit Class](#marpit-class)
    *   [Render Markdown](#render-markdown)
    *   [Apply Theme](#apply-theme)
    *   [Advanced Usage](#advanced-usage)
        *   [Output HTML as array](#output-html-as-array)
        *   [Presenter Notes](#presenter-notes)
        *   [Extend by Plugins](#extend-by-plugins)

---

## 1. Introduction to Marpit

Marpit is a lean framework for creating slide decks from Markdown. It transforms Markdown and CSS themes into static HTML and CSS, which can then be converted into a PDF slide deck. Marpit focuses on outputting minimal assets and is designed for integration with other tools and applications.

It serves as the base for the Marp ecosystem, including the core converter [@marp-team/marp-core](https://github.com/marp-team/marp-core).

### Features:

*   **Marpit Markdown**: Extended markdown-it syntax with features like Directives and Slide Backgrounds, maintaining compatibility with general Markdown.
*   **Theme CSS by clean markup**: A CSS theming system for designing slides using pure CSS without predefined classes or mixins.
*   **Inline SVG slide (Experimental)**: Uses `<svg>` elements as slide containers for pixel-perfect scaling via CSS, enabling advanced backgrounds while preserving Markdown DOM structure.

## 2. Core Concepts: How to Write Slides

Marpit uses horizontal rulers (e.g., `---`) to split pages of the slide deck.

```markdown
# Slide 1

Content for slide 1.

---

# Slide 2

Content for slide 2.
```

An empty line might be required before the dash ruler by CommonMark spec. You can also use `___`, `***`, or `- - -` to avoid adding empty lines.

## 3. Directives

Marpit Markdown extends syntax with "Directives" to control aspects like theme, page number, header, footer, and styling.

### Usage

Directives are parsed as [YAML](http://yaml.org/). Wrap values with quotes if they contain YAML special characters.

*   **HTML comment**:
    ```markdown
    <!--
    theme: default
    paginate: true
    -->
    ```
    _Also used for presenter notes; directives are not collected in `comments` result._

*   **Front-matter**: Must be the first thing in Markdown, between dash rulers.
    ```markdown
    ---
    theme: default
    paginate: true
    ---
    ```
    Slide content begins after the ending ruler of the front-matter.

### Global Directives

These are settings for the entire slide deck (e.g., theme). Marpit uses only the last value if a global directive is defined multiple times.

| Name             | Description                                                                                                                              |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `headingDivider` | Specifies heading divider option (level 1-6 or array of levels) for automatic slide splitting.                                           |
| `lang`           | Sets the `lang` attribute for each slide's HTML.                                                                                         |
| `style`          | Specifies CSS for tweaking the theme, an alternative to `<style>` tags to prevent documentation style breaks in other Markdown editors.    |
| `theme`          | Specifies the theme of the slide deck, recognizing theme names added to `Marpit.themeSet`.                                               |

#### Examples:
```markdown
<!-- theme: registered-theme-name -->
```
```markdown
---
theme: base-theme
style: |
  section {
    background-color: #ccc;
  }
---
```
```markdown
<!-- headingDivider: 2 -->
# Page 1
## Page 2
```

### Local Directives

Settings applied per slide page, affecting the defined page and all subsequent pages.

```markdown
<!-- backgroundColor: aqua -->
This page has aqua background.

---
The second page also has same color.
```

#### Apply to a single page (Spot directives)

Prefix local directives with `_` to apply them only to the current page.

```markdown
<!-- _backgroundColor: aqua -->
This page has aqua background.

---
The second page would not apply setting of directives.
```

| Name                 | Description                                        |
| :------------------- | :------------------------------------------------- |
| `paginate`           | Shows page number if `true`. Options: `true`, `false`, `hold`, `skip`. |
| `header`             | Specifies content for the slide header.            |
| `footer`             | Specifies content for the slide footer.            |
| `class`              | Specifies HTML class of slide's `<section>` element. |
| `backgroundColor`    | Sets `background-color` style of slide.         |
| `backgroundImage`    | Sets `background-image` style of slide.         |
| `backgroundPosition` | Sets `background-position` style of slide.      |
| `backgroundRepeat`   | Sets `background-repeat` style of slide.        |
| `backgroundSize`     | Sets `background-size` style of slide.          |
| `color`              | Sets `color` style of slide.                    |

#### Pagination
```markdown
<!-- paginate: true -->
```
Control:
- `true`: Show page number, increment.
- `false`: Hide page number, increment.
- `hold`: Show page number, no increment.
- `skip`: Hide page number, no increment.

#### Header and Footer
```markdown
---
header: 'Header content'
footer: '**bold** _italic_'
---
```
Content is wrapped by corresponding elements (`<header>`, `<footer>`) and inserted into the slide. Markdown syntax and inline images are supported.

#### Styling Slide with `class` and `background` directives
```markdown
<!-- _class: lead -->
# THE LEADING HEADER
```
```markdown
<!-- backgroundImage: "linear-gradient(to bottom, #67b8e3, #0288d1)" -->
Gradient background
```

### Advanced: Custom Directives

Developers can extend recognizable directives using `marpit.customDirectives.global` and `marpit.customDirectives.local`.

#### Custom Global Directive Example
```javascript
marpit.customDirectives.global.$theme = (value, marpit) => {
  return { theme: value }
}
```

#### Custom Local Directive Example
```javascript
marpit.customDirectives.local.colorPreset = (value, marpit) => {
  switch (value) {
    case 'sunset':
      return { backgroundColor: '#e62e00', color: '#fffff2' }
    case 'dark':
      return { backgroundColor: '#303033', color: '#f8f8ff' }
    default:
      return {}
  }
}
```
Usage:
```markdown
<!-- colorPreset: sunset -->
# Sunset color preset
---
<!-- _colorPreset: dark -->
# Dark color preset
```

## 4. Image Syntax

Marpit extends Markdown image syntax `![](image.jpg)` for creating beautiful slides. Features are enabled by including keywords in the image's alternative text.

### Resizing Image

Use `width` (`w`) and `height` (`h`) keywords or CSS length units.

```markdown
![width:200px](image.jpg)
![w:32 h:32](image.jpg)
```
Inline images only allow `auto` and CSS length units (excluding viewport-related units like `vw`, `vh`).

### Image Filters

Apply [CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) to images using `<filter-name>(:<param>(,<param>...))` in the alt text.

```markdown
![blur:10px](image.jpg)
![brightness:.8 sepia:50%](https://example.com/image.jpg)
```
Filters work for inline images and advanced backgrounds.

### Slide Backgrounds

Include the `bg` keyword in the alt text to specify a slide's background.

```markdown
![bg](https://example.com/background.jpg)
```
Only the last defined background image is shown for basic slide backgrounds. For multiple images, use advanced backgrounds with inline SVG.

#### Background Size
Keywords basically follow `background-size` CSS property.

| Keyword   | Description                                     | Example                    |
| :-------- | :---------------------------------------------- | :------------------------- |
| `cover`   | Scale image to fill the slide. _(Default)_      | `![bg cover](image.jpg)`   |
| `contain` | Scale image to fit the slide.                   | `![bg contain](image.jpg)` |
| `fit`     | Alias to `contain`.                             | `![bg fit](image.jpg)`     |
| `auto`    | Use the original image size.                    | `![bg auto](image.jpg)`    |
| _`x%`_    | Specify scaling factor by percentage value.     | `![bg 150%](image.jpg)`    |

Can also use `width` (`w`) and `height` (`h`) for length-based sizing.

### Advanced Backgrounds (Inline SVG required)

Enabled with experimental [inline SVG slide](#inline-svg-slide-experimental), supporting multiple backgrounds, split backgrounds, and background image filters.

#### Multiple Backgrounds
Multiple `![bg]` images arrange horizontally by default. Add `vertical` keyword for vertical arrangement.
```markdown
![bg](image-a.jpg)
![bg](image-b.jpg)
![bg vertical](image-c.jpg)
```

#### Split Backgrounds
Use `left` or `right` keyword with `bg` to create a background space on the specified side, shrinking content space. Defaults to half slide size.
```markdown
![bg left](image.jpg)
# Split backgrounds
```
Can specify split size by percentage: `![bg left:33%](image.jpg)`.

## 5. Fragmented Lists

Marpit parses lists with specific markers as "fragmented lists," allowing contents to appear one by one.

*   **Bullet list**: Use `*` as the marker.
    ```markdown
    * One
    * Two
    * Three
    ```
*   **Ordered list**: Use `)` as the following character for digits (e.g., `1)`).
    ```markdown
    1) One
    2) Two
    3) Three
    ```
**Rendering**: Adds `data-marpit-fragment` to list items (numbered from 1) and `data-marpit-fragments` to the `<section>` element, indicating the total number of fragments. The actual animation depends on the integrated app.

## 6. Theme CSS

Marpit's theming system uses pure CSS to design slides.

### HTML Structure

`<section>` elements correspond to each slide page.
```html
<section><h1>First page</h1></section>
<section><h1>Second page</h1></section>
```
Marpit automatically scopes CSS selectors with container elements.

### Create Theme CSS

Define theme styles using standard CSS. `:root` pseudo-class can be used interchangeably with `section` selector, with higher specificity.

```css
/* @theme my-awesome-theme */
section {
  width: 1280px;
  height: 960px;
  font-size: 40px;
  padding: 40px;
}
h1 {
  font-size: 60px;
  color: #09c;
}
```
**`@theme` metadata is required.**

### Styling

*   **Slide Size**: `width` and `height` in `section` or `:root` define slide size for both display and PDF printing. Must be static lengths in absolute units (e.g., `px`, `cm`).
    ```css
    section {
      width: 960px; /* 4:3 aspect ratio */
      height: 720px;
    }
    ```
*   **Pagination**: Style page numbers via `section::after` (`:root::after`). Use `attr(data-marpit-pagination)` for current page and `attr(data-marpit-pagination-total)` for total pages in `content`.
    ```css
    section::after {
      content: 'Page ' attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    }
    ```
*   **Header and Footer**: Marpit has no default styles. Use `position: absolute` for marginal placement.
    ```css
    header, footer {
      position: absolute;
      left: 50px;
      right: 50px;
      height: 20px;
    }
    ```

### Customized Theme

Create themes based on others using `@import` or `@import-theme` rules.

*   **`@import`**: Standard CSS `@import` rule. Imported theme must be added to `Marpit.themeSet` beforehand.
*   **`@import-theme`**: Alternative for CSS preprocessors (e.g., Sass) that might resolve `@import` paths at compile time.

```css
/* @theme customized */
@import 'base';
section {
  background-color: #f80;
  color: #fff;
}
```

### Tweak Style through Markdown

Use `<style>` HTML elements in Markdown for inline styling. These styles are parsed as part of the theme and bundled into the converted CSS.
```markdown
---
theme: base
---
<style>
section {
  background: yellow;
}
</style>
# Tweak style
```
Use `<style scoped>` for styles applying only to the current slide page.

## 7. Inline SVG Slide (Experimental)

Enabling `inlineSVG: true` in Marpit constructor wraps each `<section>` element with an inline SVG.

```html
<svg data-marpit-svg viewBox="0 0 1280 960">
  <foreignObject width="1280" height="960">
    <section><h1>Page 1</h1></section>
  </foreignObject>
</svg>
```

### Motivation
*   **Pixel-perfect scaling**: SVG handles scaling, simplifying slide handling in integrated apps.
*   **JavaScript not required**: Minimal web-based presentations can be pure HTML/CSS using CSS Scroll Snap.
*   **Isolated layer**: `<foreignObject>` provides an isolated layer for advanced backgrounds without breaking Markdown DOM structure.

### Webkit Polyfill
`@marp-team/marpit-svg-polyfill` is available for WebKit browsers to mitigate scaling issues within `<foreignObject>`.

### `::backdrop` CSS selector
In inline SVG mode, `::backdrop` CSS selector targets the SVG container, useful for styling the letterbox/pillarbox background.
```css
::backdrop {
  background-color: #448;
}
```
Setting `backdropSelector: false` in `inlineSVG` options can disable this redirection.

## 8. Marpit Usage (API)

Basic usage involves creating a `Marpit` instance, adding themes, and rendering Markdown.

### Marpit Class
Instantiate `Marpit` class: `const marpit = new Marpit()`.

#### Constructor Options
Customize behavior with options object.
*   **`markdown`**: Configure [markdown-it](https://github.com/markdown-it/markdown-it) parser settings (e.g., `html: true`, `breaks: true`).
*   **`container` / `slideContainer`**: Customize container HTML elements for CSS scoping using `Element` class. Default: `<div class="marpit">` for container, no slide container.
*   **`inlineSVG`**: Enable experimental [inline SVG slide](#inline-svg-slide-experimental).

### Render Markdown
Use `marpit.render(markdown)` to get rendered HTML, CSS, and collected comments.
```javascript
const { html, css, comments } = marpit.render('# Hello, Marpit!')
```

### Apply Theme
Assign theme CSS via `marpit.themeSet` property.
*   **`themeSet.add(css)`**: Adds theme CSS (must contain `@theme` meta comment) and returns `Theme` instance.
*   **`themeSet.default`**: Assign `Theme` instance to set a default theme, allowing use without directive.

### Advanced Usage

#### Output HTML as array
Pass `htmlAsArray: true` to `marpit.render(markdown, { htmlAsArray: true })` to get an array of HTML strings, one per slide page.

#### Presenter Notes
Marpit collects HTML comments (excluding directives) in the `comments` array returned by `marpit.render()`.
```javascript
const { comments } = marpit.render(`
# First page
<!-- Presenter note for first page. -->
`)
```
`comments` is a two-dimensional array of comments per slide page.

#### Extend by Plugins
Use `marpit.use()` with Marpit, markdown-it, or PostCSS plugins.
```javascript
marpit.use(marpitPlugin).use(markdownItPlugin).use(postcssPlugin)
```
*   **Marpit Plugin**: Function receiving `{ marpit }` object, allowing manipulation of Marpit instance (e.g., adding themes, registering custom directives).
*   **markdown-it Plugin**: Extend Markdown parser (e.g., `markdown-it-container` for custom blocks).
*   **PostCSS Plugin**: Append transformers to the rendered CSS style (e.g., `postcss-minify`).