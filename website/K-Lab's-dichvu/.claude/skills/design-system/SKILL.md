---
name: design-system-v-sinh-gi-y-chuy-n-nghi-p-sneakerhead-morino
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Vệ sinh giày chuyên nghiệp ✅ sneakerhead Morino

## Mission
Deliver implementation-ready design-system guidance for Vệ sinh giày chuyên nghiệp ✅ sneakerhead Morino that can be applied consistently across content site interfaces.

## Brand
- Product/brand: Vệ sinh giày chuyên nghiệp ✅ sneakerhead Morino
- URL: https://morino.vn/
- Audience: readers and knowledge seekers
- Product surface: content site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Roboto`, `font.family.stack=Roboto, sans-serif`, `font.size.base=15px`, `font.weight.base=400`, `font.lineHeight.base=23px`
- Typography scale: `font.size.xs=0px`, `font.size.sm=11px`, `font.size.md=12px`, `font.size.lg=13px`, `font.size.xl=14px`, `font.size.2xl=15px`, `font.size.3xl=16px`, `font.size.4xl=18px`
- Color palette: `color.text.primary=#337ab7`, `color.text.secondary=#333333`, `color.text.tertiary=#ffffff`, `color.text.inverse=#adadad`, `color.surface.base=#000000`, `color.surface.muted=#ebebed`, `color.surface.strong=#eb3e32`
- Spacing scale: `space.1=1px`, `space.2=2px`, `space.3=5px`, `space.4=6px`, `space.5=8px`, `space.6=10px`, `space.7=13px`, `space.8=15px`
- Radius/shadow/motion tokens: `radius.xs=3px`, `radius.sm=100px` | `motion.duration.instant=200ms`, `motion.duration.fast=300ms`

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
