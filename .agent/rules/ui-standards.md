---
trigger: always_on
---

When generating, updating, or styling UI components for the neuBite app, strictly adhere to the following CSS variable color palette. This ensures the application maintains a clean, professional, and highly readable interface that complements food photography without overwhelming it.

Backgrounds & Surfaces

--bg-primary: #FFFFFF (Crisp white to ensure food imagery pops and maintains maximum contrast for primary reading areas)

--bg-secondary: #F9F7F4 (Warm alabaster/cream for subtle separation, ideal for ingredient panels, recipe cards, or comments)

--bg-sidebar: #2A3A35 (Deep olive/sage for primary navigation. Provides enterprise-grade stability while hinting at fresh ingredients)

--bg-sidebar-hover: #3B4D47 (Slightly lighter sage for interactive sidebar hover states)

Text & Typography

--text-primary: #232323 (Soft charcoal. Softer than pure black to reduce eye strain, but maintains WCAG AAA compliance on light backgrounds)

--text-secondary: #686868 (Pepper gray for metadata, prep times, author info, or subtle UI text)

--text-sidebar: #A9B8B2 (Muted light sage for unselected sidebar categories)

--text-sidebar-active: #FFFFFF (Crisp white for active/selected sidebar items to ensure clear wayfinding)

Interactive & Accents

--accent-primary: #D14925 (Harissa/Terracotta. An appetizing, warm, and energetic accent color for primary actions like "Save Recipe", CTAs, and active states)

--accent-hover: #A8381A (Deep burnt orange for robust, clear hover state feedback)

Feedback & Status

--status-success: #288754 (Fresh basil green for success toasts, verified authors, or healthy dietary badges)

--status-warning: #D99414 (Saffron gold for warnings or pending states)

--status-error: #C92A2A (Cranberry red for destructive actions, alerts, or form errors)

Implementation Directive: Do not introduce new hex codes outside of this palette unless explicitly requested. Map existing framework colors to these exact values to keep neuBite's branding strictly consistent and appetizing.