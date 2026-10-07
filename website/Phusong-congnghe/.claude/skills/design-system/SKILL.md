---
name: design-system-vi-n-th-ng-act
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Viễn thông ACT

## Mission
Deliver implementation-ready design-system guidance for Viễn thông ACT that can be applied consistently across documentation site interfaces.

## Brand
- Product/brand: Viễn thông ACT
- URL: https://vienthongact.vn/
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Roboto`, `font.family.stack=Roboto, Helvetica, Arial, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=13px`, `font.size.sm=13.6px`, `font.size.md=14px`, `font.size.lg=16px`, `font.size.xl=16.8px`, `font.size.2xl=17.6px`, `font.size.3xl=18px`, `font.size.4xl=24px`
- Color palette: `color.surface.base=#000000`, `color.text.secondary=#ffffff`, `color.text.tertiary=#a0aec0`, `color.text.inverse=#0000ee`, `color.surface.raised=#1976d2`, `color.surface.strong=#fbfbfb`
- Spacing scale: `space.1=8px`, `space.2=12px`, `space.3=16px`, `space.4=20px`, `space.5=24px`, `space.6=32px`, `space.7=40px`, `space.8=48px`
- Radius/shadow/motion tokens: `radius.xs=4px`, `radius.sm=50px` | `shadow.1=rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px`, `shadow.2=rgba(0, 0, 0, 0.06) 0px 4px 16px 0px` | `motion.duration.instant=250ms`, `motion.duration.fast=300ms`, `motion.duration.normal=400ms`, `motion.duration.slow=600ms`

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
