---
name: design-system-speakers-headphones-sound-systems
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Speakers, Headphones & Sound Systems

## Mission
Deliver implementation-ready design-system guidance for Speakers, Headphones & Sound Systems that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: Speakers, Headphones & Sound Systems
- URL: https://vn.jbl.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Roboto`, `font.family.stack=Roboto, Source Sans Pro, sans-serif`, `font.size.base=14px`, `font.weight.base=400`, `font.lineHeight.base=20px`
- Typography scale: `font.size.xs=0px`, `font.size.sm=12px`, `font.size.md=13px`, `font.size.lg=13.01px`, `font.size.xl=14px`, `font.size.2xl=18px`, `font.size.3xl=34px`, `font.size.4xl=40px`
- Color palette: `color.text.primary=#ffffff`, `color.surface.base=#000000`, `color.text.tertiary=#111111`, `color.text.inverse=#c72800`, `color.border.strong=#ff3300`, `color.surface.raised=#df2d00`
- Spacing scale: `space.1=2px`, `space.2=4px`, `space.3=4.2px`, `space.4=5px`, `space.5=9px`, `space.6=10px`, `space.7=12px`, `space.8=13.01px`
- Radius/shadow/motion tokens: `radius.xs=2px`, `radius.sm=10px`, `radius.md=20px`, `radius.lg=30px`, `radius.xl=40px`, `radius.2xl=50px`, `radius.step7=100px` | `shadow.1=rgba(223, 45, 0, 0.7) 0px 0px 10px 7px` | `motion.duration.instant=150ms`, `motion.duration.fast=300ms`, `motion.duration.normal=400ms`

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
