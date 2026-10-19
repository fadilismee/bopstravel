# Technical decisions — pre-implementation

Status: proposals, not installed or committed as dependencies.

## Recommended starting point
- Next.js + TypeScript for route-friendly marketing pages and SEO, unless the owner prefers a simpler static build or existing CMS.
- App Router, reusable accessible components, content/data separated from presentation.
- CSS custom properties for design tokens; avoid adding a UI framework before confirming need.
- Route and fleet content in typed local data initially; migrate to CMS only if non-developer updates are required.
- WhatsApp inquiry link as initial conversion path; no server-side lead collection until privacy, security, and operational owner are defined.

## Quality gates
- Typecheck, lint, production build.
- Unit tests for route data, input validation, and WhatsApp message encoding.
- Accessibility audit (keyboard, focus, labels, contrast) and responsive checks.
- Lighthouse / Core Web Vitals on representative mobile route.
- Verify all published facts, links, metadata, and image rights before launch.

## Security / privacy
- Do not store personal inquiry data in client analytics by default.
- Avoid secrets in source control; any future server integration needs environment variables and validation/rate limiting.
- Use minimum form fields; explain that WhatsApp is an external service and the user chooses to send.
- No third-party scripts, tracking pixels, or embedded maps until purpose/consent is decided.

## Deferred decisions
Confirm framework, runtime/package manager, hosting, domain, CMS, analytics, form backend, localization, and SEO migration/redirect needs before implementation.
