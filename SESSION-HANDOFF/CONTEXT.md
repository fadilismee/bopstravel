# Session handoff — Armada Trans Java

## User request to continue
The user explicitly wants the supplied saved Tiketux homepage HTML (`D:/Tiketux_ Pesan Tiket Travel dan Bus Mulai 50 Ribu, 60+ Operator Terpercaya 2026.html`) decomposed into clean, separate code and copied into the Armada Trans Java project as a very close visual match. Reuse the saved page's assets temporarily too. The user emphasized clean code, not one giant mixed HTML blob. They also asked to test the whole app, including login/signup and user flows, and wants the “arena” accessible from the dashboard navbar by clicking it. “Arena” needs clarification/discovery in the project because its identity/function is not established yet.

## Project
- Root: `F:/Projects/armada-trans-java`
- Laravel + Filament project; PHP is Laragon PHP 8.3.33 at `/c/laragon/bin/php/php-8.3.33-Win32-vs16-x64` (bash terminal).
- The project is currently an uncommitted scaffold on branch `master`; `git status` showed all project files untracked, no commits yet.
- Local dev server previously reported running at `http://127.0.0.1:8047`. User earlier objected to opening the local site in a browser. HTTP checks by Python/curl are okay; don't launch browser against localhost unless the user explicitly asks.

## Recent actions / current tree state
- Copied the saved Tiketux reference asset folder (164 files, approx. 4.43 MB) to `public/tiketux-reference-assets/`.
- Generated `public/tiketux-reference.html` (~395 KB) from the saved page, loading 32 local CSS files and using downloaded local images. Removed all `<script>` tags and iframe. Rewrote source-domain links to `#`. Changed some visible text occurrences from Tiketux to Armada Trans Java, but this was a broad/rough text substitution and introduced inaccurate text and residual third-party claims. Audit and clean it before treating as deliverable.
- Changed the `/` route in `routes/web.php` to return that large static HTML file as a response. This is a stopgap, not the desired clean implementation. User wants structured components/styles instead of one large mixed HTML page.
- Updated `tests/Feature/ExampleTest.php` to assert the static transplanted page; last test run: 4 tests passed, 18 assertions, Pint passed, Blade compile passed.
- Verified through HTTP that `/` returned 200, one local CSS asset returned 200, one local image returned 200.
- Browser visual inspection was not completed: Hermes Connector connected but no tab was bound; dedicated browser CDP on 9222 was unreachable. Do not claim pixel-accurate visual verification.
- `resources/views/home.blade.php` still holds the prior bespoke homepage and is no longer used by `/` after the route change.
- `AdminPanelProvider.php` defines Filament admin panel at `/admin` with login. No browser-run login/signup/user-flow tests have been done. No public signup implementation has been established. Check whether admin user/account creation exists, how access is authorized, and run feature tests without leaking credentials.

## Important safety / accuracy / brand constraints
- Keep Armada Trans Java identity; user allows Tiketux assets temporarily as visual stand-ins but that does not mean importing their scripts or misrepresenting their discounts, fare prices, payment methods, operators, routes, business address, app, or active offers as Armada features. Remove/neutralize those copied claims while retaining layout, geometry, style, and placeholder imagery.
- Do not execute copied scripts (source HTML contains browser-injected and source-provider code). Keep third-party analytics, login/payment handlers, and external Tiketux navigation out.
- Keep credentials/private `.env` data out of handoff/report. Never print or modify secrets.
- Prefer readable separated Blade partials/components and organized local CSS files, not an enormous pasted HTML blob. Preserve the reference section order, header/hero/form proportions, image treatment, desktop/mobile behavior.
- The user asked for comprehensive QA and “arena” in the dashboard navbar; discover the exact Arena feature and existing Filament sidebar/navigation before implementation; don't invent the feature. Ask the user only if repo search/docs cannot identify it.

## Immediate next steps
1. Read the repo's current instructions (`AGENTS.md`, `CLAUDE.md`), route/provider/view/test code and identify any Arena resources/symbols/usages.
2. Inspect the raw saved HTML's stylesheet links, DOM/component structure, local assets, and provided screenshots. Replace the static HTML route with clean Blade component/partial structure and separated CSS; keep local assets paths stable.
3. Keep copied assets as temporary visuals, but replace source-specific claims/content/links with clearly neutral Armada content. Do not claim pricing/promotions/partners/payment/app unless verified.
4. Implement/verify an Arena dashboard nav item only after discovery; if it is a Filament page/resource, register it through installed APIs.
5. Run `php artisan route:list`, `php artisan test`, `./vendor/bin/pint --test`, `php artisan view:cache`, `php artisan view:clear`; request key routes over HTTP. For login/signup flows, determine if public signup exists; test actual admin login only through safe available means, don't fabricate or expose passwords. Separate automated behavior verification from visual verification.
6. Never commit/push unless asked.
