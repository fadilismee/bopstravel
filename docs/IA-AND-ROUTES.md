# Information architecture and user flows

## Proposed navigation
- Beranda
- Layanan
  - Travel reguler (only if confirmed)
  - Antar-jemput / door-to-door (only if confirmed)
  - Carter / perjalanan grup (only if confirmed)
- Rute
  - Search/filter by origin and destination
  - Route detail pages from approved route matrix
- Armada
- Tentang
- FAQ
- Kontak / CTA: Tanya via WhatsApp

## Page templates
1. Home: hero + route inquiry; service cards; featured destinations; verified fleet; booking steps; trust proof; FAQs; final CTA.
2. Service detail: who it serves, inclusions, how it works, availability caveat, FAQ, inquiry.
3. Route detail: origin/destination, service type, pickup/drop boundaries, schedule/fare status, travel notes, related routes, inquiry prefilled with route. Publish only after owner validation.
4. Fleet detail: approved photos, capacity, features, luggage, applicable service types.
5. Contact/FAQ: channels, hours, response expectation, privacy and policies.

## Primary inquiry flow
Choose origin + destination + date + passenger count (optional) → validate required fields → present a clear WhatsApp inquiry preview or open a prefilled WhatsApp message → user reviews/sends in WhatsApp. Do not imply reservation is confirmed until operator confirms.

## UX requirements
- Mobile-first and keyboard accessible; labeled fields and visible focus.
- Preserve user-entered values when validation fails.
- Avoid false availability; indicate inquiry-only status.
- WhatsApp link includes encoded message and correct verified number, opens safely.
- Route and fleet content must have empty/error states and a maintainable data source.
- SEO: unique title/description, canonical policy, sitemap, robots, Open Graph; structured data only for verified facts.
