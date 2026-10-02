---
name: design-system-hoa-v-n-shz
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Hoa Văn SHZ

## Mission
Deliver implementation-ready design-system guidance for Hoa Văn SHZ that can be applied consistently across dashboard web app interfaces.

## Brand
- Product/brand: Hoa Văn SHZ
- URL: https://shz.edu.vn/?srsltid=AU7gw4Xe3902hfOxqsro9HOrWoYtFR-jzPv4Au171LN9h3JTzQ8nVdw5
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif`, `font.size.base=13.5px`, `font.weight.base=400`, `font.lineHeight.base=20.925px`
- Typography scale: `font.size.xs=11px`, `font.size.sm=12.5px`, `font.size.md=13px`, `font.size.lg=13.5px`, `font.size.xl=13.6px`, `font.size.2xl=14px`, `font.size.3xl=14.4px`, `font.size.4xl=14.5px`
- Color palette: `color.text.primary=#4a6074`, `color.surface.muted=#ffffff`, `color.text.tertiary=#d17a7b`, `color.text.inverse=#34495e`, `color.surface.base=#000000`, `color.surface.raised=#d2232a`, `color.surface.strong=#f6f8fa`, `color.border.strong=#e3e8ee`
- Spacing scale: `space.1=1.86px`, `space.2=3px`, `space.3=4px`, `space.4=5px`, `space.5=6px`, `space.6=7px`, `space.7=8px`, `space.8=8.1px`
- Radius/shadow/motion tokens: `radius.xs=8px`, `radius.sm=10px`, `radius.md=11px`, `radius.lg=12px`, `radius.xl=13px`, `radius.2xl=14px`, `radius.step7=16px`, `radius.step8=18px` | `shadow.1=rgba(52, 73, 94, 0.07) 0px 2px 12px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=180ms`, `motion.duration.normal=200ms`, `motion.duration.slow=220ms`, `motion.duration.slower=250ms`, `motion.duration.step6=300ms`

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
