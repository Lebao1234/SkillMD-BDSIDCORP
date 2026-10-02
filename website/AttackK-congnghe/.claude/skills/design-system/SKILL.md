---
name: design-system-attack-shark
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Attack Shark

## Mission
Deliver implementation-ready design-system guidance for Attack Shark that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: Attack Shark
- URL: https://attackshark.com/?srsltid=AfmBOoq8B9sfW3zt6m9F0WGkgFSniR4Wr6Ctb010WxlMpXq_8v-vhEOy
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Attackshark4`, `font.family.stack=Attackshark4, sans-serif`, `font.size.base=16px`, `font.weight.base=500`, `font.lineHeight.base=19.2px`
- Typography scale: `font.size.xs=9px`, `font.size.sm=12.8px`, `font.size.md=14px`, `font.size.lg=16px`, `font.size.xl=17px`, `font.size.2xl=20px`, `font.size.3xl=24px`, `font.size.4xl=32px`
- Color palette: `color.border.default=#1a1a1a`, `color.border.muted=#ffffff`, `color.text.tertiary=#41441c`, `color.text.inverse=#666666`, `color.surface.base=#000000`, `color.surface.muted=#e6f4ff`, `color.surface.raised=#f0f0f0`, `color.surface.strong=#6073f2`
- Spacing scale: `space.1=1.6px`, `space.2=5px`, `space.3=10px`, `space.4=12px`, `space.5=15px`, `space.6=16px`, `space.7=24px`, `space.8=32px`
- Radius/shadow/motion tokens: `radius.xs=8px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`, `motion.duration.normal=400ms`

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
