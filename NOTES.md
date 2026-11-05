# Accessible Component Fundamentals: Review & Comparison Notes
**Track:** Frontend AI Engineering · **Phase:** Foundations / Build · **Week:** 4  
**Assignment:** FE-05 · **Workload:** 5h  
**AI Platform:** Google Antigravity (Powered by Gemini 3.8 Flash High)  
**Repository:** [https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering](https://github.com/KMSiam/Flyrank-Internship-Front-end-AI-Engineering)

---

## 1. Executive Summary

In assignment **FE-05**, we implemented three core interactive components from scratch in React 19 and strict TypeScript within the `playground/` directory, adhering strictly to the **W3C ARIA Authoring Practices Guide (APG)**:
1. **Modal Dialog (`playground/Modal.tsx`)**: `role="dialog"`, `aria-modal="true"`, focus trapping (`Tab` / `Shift+Tab`), `Escape` key dismissal, and automatic focus restoration to the triggering element.
2. **Tabs Widget (`playground/Tabs.tsx`)**: `role="tablist"`, `role="tab"`, `role="tabpanel"`, roving `tabIndex` (active: `0`, inactive: `-1`), and directional keyboard navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`).
3. **Disclosure Widget (`playground/Disclosure.tsx`)**: Native button trigger with `aria-expanded` and `aria-controls` linked to an expandable `role="region"` with `aria-labelledby`, responding to `Enter` and `Space`.

Following the implementation, we audited the source code of **shadcn/ui** (built on top of `@radix-ui/react-dialog` and `@radix-ui/react-tabs`) to identify what edge cases and production concerns are handled by battle-tested libraries that are easy to miss in custom implementations.

---

## 2. Concrete Gaps Between Custom Hand-Crafted Code & shadcn/ui

### Gap 1: Portal Rendering & Stacking Context Isolation
- **Our Implementation:** Our modal dialog renders inline within the parent component's DOM tree (`<div className="fixed inset-0 ...">`).
- **What shadcn/ui (Radix) Handles:**
  Shadcn utilizes `@radix-ui/react-portal` to unmount the dialog from its immediate DOM parent and mount it directly into `document.body` (or a designated portal root).
- **Why This Matters in Production:**
  If a parent component has CSS properties like `overflow: hidden`, `clip-path`, `filter`, or a CSS transform (`transform: translate3d(...)`), the browser establishes a new stacking context and containing block. An inline `position: fixed` child is trapped inside that parent boundary, breaking full-screen overlay positioning and creating z-index bugs. Radix's Portal guarantees the dialog always floats above the entire application viewport.

### Gap 2: Document Scroll Locking & Layout Shift Compensation
- **Our Implementation:** Our custom modal renders a backdrop but leaves `document.body.style.overflow` unchanged. While focus is trapped, background content can still be scrolled via mouse wheel or touch gestures on mobile devices.
- **What shadcn/ui (Radix) Handles:**
  Radix incorporates `react-remove-scroll`. When the dialog mounts, it:
  1. Sets `overflow: hidden` on `document.body`.
  2. Dynamically calculates the scrollbar width (`window.innerWidth - document.documentElement.clientWidth`).
  3. Applies an inline `padding-right` equal to the scrollbar width to `document.body`.
- **Why This Matters in Production:**
  Without scrollbar compensation, removing the scrollbar causes an abrupt 15px layout shift (CLS) across the entire underlying webpage when the modal opens and closes. Radix prevents both background scrolling and visual jarring.

### Gap 3: Screen Reader Sibling Isolation (`aria-hidden` / `inert`)
- **Our Implementation:** Our modal uses `aria-modal="true"` and traps keyboard focus via JavaScript `keydown` interceptors on the `Tab` key.
- **What shadcn/ui (Radix) Handles:**
  Radix applies `@radix-ui/react-dialog`'s DOM tree walker to apply `aria-hidden="true"` (or the native HTML5 `inert` attribute) to all sibling DOM nodes outside the modal container while the dialog is open.
- **Why This Matters in Production:**
  While keyboard `Tab` navigation may be trapped, screen reader virtual cursors (e.g., VoiceOver, NVDA, JAWS swipe/arrow navigation) can still "escape" the modal boundaries and read background document text unless sibling containers are explicitly marked `inert` or `aria-hidden="true"`.

### Gap 4: Focus Guard Sentinels & Collision Resilience
- **Our Implementation:** Our focus trap uses an array query selector (`querySelectorAll`) and checks whether `document.activeElement` matches the first or last focusable child.
- **What shadcn/ui (Radix) Handles:**
  Radix injects hidden `<span tabIndex={0} aria-hidden="true" />` sentinel elements at the very start and end of the portal container. When a browser attempts to move focus outside the dialog boundaries, these sentinels intercept focus before it leaves the browser window and redirect it back to the modal.
- **Why This Matters in Production:**
  Edge cases—such as browser address bar focus jumps or dynamic conditional element unmounting—can cause query-selector-based traps to lose track of the active element. Radix's sentinels provide an unbreakable physical boundary.

### Gap 5: Polymorphic Composition via Radix `Slot` (`asChild`)
- **Our Implementation:** Components use rigid HTML tags (`<button>`, `<div>`).
- **What shadcn/ui Handles:**
  Shadcn components use `@radix-ui/react-slot`, allowing consumers to pass `asChild`. The component merges its ARIA attributes, event handlers, and refs directly onto whatever child element is passed (e.g., a Next.js `<Link>` or a custom button), avoiding unnecessary wrapper DOM nodes.

---

## 3. W3C ARIA APG Pattern Verification Checklist

| Pattern | Requirement | Custom Implementation Status | shadcn/ui Parity |
| :--- | :--- | :--- | :--- |
| **Modal** | `role="dialog"`, `aria-modal="true"` | ✅ Verified in `Modal.tsx` | Identical |
| **Modal** | `aria-labelledby` / `aria-describedby` | ✅ Verified with dynamic `useId()` | Identical |
| **Modal** | `Escape` key dismissal | ✅ Verified via `keydown` handler | Identical |
| **Modal** | Strict `Tab` / `Shift+Tab` focus trap | ✅ Verified with wrap-around cycle | Enhanced via sentinels |
| **Modal** | Restore focus to trigger on close | ✅ Verified via `previousActiveElementRef` | Identical |
| **Tabs** | `role="tablist"`, `role="tab"`, `role="tabpanel"` | ✅ Verified in `Tabs.tsx` | Identical |
| **Tabs** | Roving `tabindex` (`0` active, `-1` inactive) | ✅ Verified in `Tabs.tsx` | Identical |
| **Tabs** | `ArrowRight` / `ArrowLeft` navigation | ✅ Verified with circular wrap-around | Identical |
| **Tabs** | `Home` / `End` extremity navigation | ✅ Verified in `Tabs.tsx` | Identical |
| **Disclosure** | `button` with `aria-expanded` & `aria-controls` | ✅ Verified in `Disclosure.tsx` | Identical |
| **Disclosure** | `role="region"` with `aria-labelledby` | ✅ Verified in `Disclosure.tsx` | Identical |
| **Disclosure** | `Enter` and `Space` keyboard activation | ✅ Verified via native button semantics | Identical |

---

## 4. TypeScript Prop Safety & Zero `any` Escapes Audit

All three components declare strict TypeScript interfaces with zero `any` escapes:

```typescript
// playground/Modal.tsx
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

// playground/Tabs.tsx
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  ariaLabel?: string;
}

// playground/Disclosure.tsx
export interface DisclosureProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}
```

TypeScript compiler check (`npx tsc --noEmit`) passes with **0 errors**.

---

## 5. Architectural Takeaway

Building accessible components by hand is the only reliable way to understand how accessibility actually works under the hood. While raw AI generation frequently creates "div buttons" with missing keyboard listeners, knowing the W3C APG patterns equips engineers to review AI-authored code with authority and leverage battle-tested primitives like Radix/shadcn where appropriate.
