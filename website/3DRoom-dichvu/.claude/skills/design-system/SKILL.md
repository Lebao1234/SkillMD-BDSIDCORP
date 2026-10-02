---
name: design-system-3dcubix-d-ch-v-thi-t-k-3d-in-3d-chuy-n-nghi-p-h-
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# 3DCUBIX – Dịch Vụ Thiết Kế 3D & In 3D Chuyên Nghiệp Hàng Đầu Việt Nam

## Mission
Deliver implementation-ready design-system guidance for 3DCUBIX – Dịch Vụ Thiết Kế 3D & In 3D Chuyên Nghiệp Hàng Đầu Việt Nam that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: 3DCUBIX – Dịch Vụ Thiết Kế 3D & In 3D Chuyên Nghiệp Hàng Đầu Việt Nam
- URL: https://3dcubix.vn/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Plus Jakarta Sans`, `font.family.stack=Plus Jakarta Sans`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=26px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=14.4px`, `font.size.lg=16px`, `font.size.xl=18px`, `font.size.2xl=22px`, `font.size.3xl=25px`, `font.size.4xl=36px`
- Color palette: `color.text.primary=#036080`, `color.text.secondary=#ffffff`, `color.text.tertiary=#54595f`, `color.text.inverse=#7a7a7a`, `color.surface.base=#000000`, `color.surface.raised=#292929`, `color.surface.strong=#1a1a1a`
- Spacing scale: `space.1=6px`, `space.2=7px`, `space.3=8px`, `space.4=9px`, `space.5=10px`, `space.6=11px`, `space.7=13px`, `space.8=16px`
- Radius/shadow/motion tokens: `radius.xs=50px`, `radius.sm=100px` | `motion.duration.instant=250ms`, `motion.duration.fast=300ms`, `motion.duration.normal=400ms`, `motion.duration.slow=1000ms`

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
