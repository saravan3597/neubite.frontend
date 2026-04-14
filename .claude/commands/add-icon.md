Add a new SVG icon to the centralized icon library at `src/shared/components/icons.tsx`.

Steps:
1. Read `src/shared/components/icons.tsx` to understand the existing pattern before making any changes.
2. Ask the user for the icon name and its intended use if not provided in $ARGUMENTS.
3. Find a suitable 24×24 stroke-based SVG path (Heroicons outline style preferred — same family as existing icons).
4. Add the new icon export following the exact same structure as existing icons:
   - Props: `({ className = "w-5 h-5" }: IconProps)` — add `active?: boolean` only if the icon needs a fill-toggle state (like HeartIcon or BookmarkIcon)
   - Always use `stroke="currentColor"` — never hardcode colors
   - Use `fill="none"` unless it's a fill-toggle icon
   - Place it under the correct section comment: `// ── Navigation`, `// ── Actions`, or `// ── UI / Feedback`
5. Never add a new icon in isolation outside `icons.tsx` — all icons must live in the central library.
