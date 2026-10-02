---
name: design-system-fujifilm-x-series-gfx
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# FUJIFILM X Series & GFX

## Mission
Deliver implementation-ready design-system guidance for FUJIFILM X Series & GFX that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: FUJIFILM X Series & GFX
- URL: https://www.fujifilm-x.com/global/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Noto Sans JP`, `font.family.stack=Noto Sans JP, Noto Sans, Helvetica, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=28px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=14.4px`, `font.size.lg=16px`, `font.size.xl=18px`, `font.size.2xl=19.2px`, `font.size.3xl=20px`, `font.size.4xl=22px`
- Color palette: `color.surface.base=#000000`, `color.border.muted=#ffffff`, `color.text.tertiary=#1b1b1b`, `color.text.inverse=#8e8e8e`
- Spacing scale: `space.1=1px`, `space.2=3px`, `space.3=4px`, `space.4=5px`, `space.5=8px`, `space.6=10px`, `space.7=12px`, `space.8=14px`
- Radius/shadow/motion tokens: `radius.xs=2px`, `radius.sm=9999px` | `shadow.1=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.32) 0px 0px 9.6px 0.4px`, `shadow.2=rgba(0, 0, 0, 0.2) 0px 0px 18px 0px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`, `motion.duration.normal=750ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
