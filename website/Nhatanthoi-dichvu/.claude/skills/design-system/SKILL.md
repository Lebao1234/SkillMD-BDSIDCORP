---
name: design-system-ti-m-nh-ann
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Tiệm nhà Ann

## Mission
Deliver implementation-ready design-system guidance for Tiệm nhà Ann that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: Tiệm nhà Ann
- URL: https://aodainhaann.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Lato`, `font.family.stack=Lato, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=25.6px`
- Typography scale: `font.size.xs=12.24px`, `font.size.sm=12.8px`, `font.size.md=13.19px`, `font.size.lg=13.6px`, `font.size.xl=14px`, `font.size.2xl=14.4px`, `font.size.3xl=14.72px`, `font.size.4xl=15px`
- Color palette: `color.text.primary=#312a29`, `color.surface.base=#000000`, `color.text.tertiary=#334862`, `color.text.inverse=#777777`, `color.surface.muted=#fce5c6`, `color.surface.raised=#ffffff`, `color.surface.strong=#1abaff`
- Spacing scale: `space.1=1.4px`, `space.2=1.44px`, `space.3=1.5px`, `space.4=1.84px`, `space.5=1.86px`, `space.6=2.5px`, `space.7=5px`, `space.8=5.44px`
- Radius/shadow/motion tokens: `radius.xs=4px`, `radius.sm=26px`, `radius.md=50px`, `radius.lg=99px`, `radius.xl=100px`, `radius.2xl=999px` | `shadow.1=rgba(0, 0, 0, 0.3) 0px -150px 15px 0px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`

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
