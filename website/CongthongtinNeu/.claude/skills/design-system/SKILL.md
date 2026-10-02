---
name: design-system-m-ng-l-i-c-u-sinh-vi-n-i-h-c-kinh-t-qu-c-d-n
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Mạng Lưới Cựu Sinh Viên Đại Học Kinh Tế Quốc Dân

## Mission
Deliver implementation-ready design-system guidance for Mạng Lưới Cựu Sinh Viên Đại Học Kinh Tế Quốc Dân that can be applied consistently across dashboard web app interfaces.

## Brand
- Product/brand: Mạng Lưới Cựu Sinh Viên Đại Học Kinh Tế Quốc Dân
- URL: https://alumni.neu.edu.vn/
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Roboto Condensed`, `font.family.stack=Roboto Condensed, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=22.4px`
- Typography scale: `font.size.xs=14px`, `font.size.sm=15px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=20px`, `font.size.2xl=23px`
- Color palette: `color.text.primary=#212529`, `color.text.secondary=#0b1215`, `color.text.tertiary=#ffffff`, `color.text.inverse=#292525`, `color.surface.base=#000000`, `color.surface.raised=#0076c0`, `color.surface.strong=#ff0000`
- Spacing scale: `space.1=1px`, `space.2=3px`, `space.3=5px`, `space.4=8px`, `space.5=10px`, `space.6=12px`, `space.7=15px`, `space.8=16px`
- Radius/shadow/motion tokens: `radius.xs=50px` | `shadow.1=rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px` | `motion.duration.instant=150ms`

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
