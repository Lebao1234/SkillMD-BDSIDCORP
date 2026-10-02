---
name: design-system-nh-h-ng-ti-c-c-i
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Nhà Hàng Tiệc Cưới

## Mission
Deliver implementation-ready design-system guidance for Nhà Hàng Tiệc Cưới that can be applied consistently across dashboard web app interfaces.

## Brand
- Product/brand: Nhà Hàng Tiệc Cưới
- URL: https://huongpho.com.vn/
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Montserrat`, `font.family.stack=Montserrat`, `font.size.base=13px`, `font.weight.base=400`, `font.lineHeight.base=21.45px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=12.92px`, `font.size.md=13px`, `font.size.lg=14px`, `font.size.xl=16px`, `font.size.2xl=18px`, `font.size.3xl=20px`
- Color palette: `color.text.primary=#666666`, `color.text.secondary=#ffffff`, `color.text.tertiary=#bc955c`, `color.text.inverse=#707070`, `color.surface.base=#000000`, `color.surface.muted=#f7f7f7`, `color.surface.raised=#f2ebe2`
- Spacing scale: `space.1=3px`, `space.2=4px`, `space.3=6px`, `space.4=8px`, `space.5=10px`, `space.6=12px`, `space.7=15px`, `space.8=20px`
- Radius/shadow/motion tokens: `radius.xs=3px` | `motion.duration.instant=150ms`, `motion.duration.fast=300ms`

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
