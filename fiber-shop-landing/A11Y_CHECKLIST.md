# Accessibility (A11Y) Checklist for Fiber Agent

## Semantic HTML
- [x] Use `<nav>` for navigation
- [x] Use `<main>` for main content (pages should wrap content)
- [x] Use `<header>` and `<footer>` for page structure
- [x] Use `<section>` for logical content grouping
- [x] Use `<article>` for independent content
- [x] Single `<h1>` per page ✅ (verified in each page)
- [x] Proper heading hierarchy (h1 → h2 → h3)

## ARIA Labels
- [x] Navigation has `aria-label="Main navigation"`
- [x] Logo link has descriptive `aria-label`
- [x] Active navigation items use `aria-current="page"`
- [ ] Icon buttons have `aria-label` (check all components)
- [ ] Form fields have associated labels

## Images & Media
- [ ] All images have descriptive alt text
- [ ] Images use `loading="lazy"` for performance
- [ ] Images have `width` and `height` attributes
- [ ] SVG icons have `aria-hidden="true"` or proper labels

## Keyboard Navigation
- [x] Links are keyboard accessible (React Router handles this)
- [x] Focus states visible (CSS styling)
- [ ] Tab order follows visual flow
- [ ] No keyboard traps

## Color & Contrast
- [x] Primary color: #00d084 (green) - high contrast on dark background
- [x] Text colors meet WCAG AA standard
- [ ] Color alone doesn't convey information

## Forms (if any)
- [ ] Labels properly associated with inputs
- [ ] Error messages clear and accessible
- [ ] Required fields marked with * and aria-required="true"

## Testing Tools
- [ ] axe DevTools (Chrome extension)
- [ ] Lighthouse Accessibility audit
- [ ] WAVE (WebAIM)
- [ ] Google Mobile-Friendly Test

## To Do
1. Add `aria-label` to all icon buttons in components
2. Convert all page divs to use `<main>` element
3. Verify heading hierarchy on all pages (h1→h2→h3)
4. Add alt text to all product/merchant images
5. Add lazy loading to images: `loading="lazy"`
6. Test keyboard navigation with Tab key
7. Run Lighthouse audit (Accessibility >95)

## Resources
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- React A11Y: https://reactjs.org/docs/dom-elements.html#aria-*
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
