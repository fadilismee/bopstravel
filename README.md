# Armada Trans Java — Laravel + Filament

Premium, responsive marketing-site starter for Armada Trans Java. Public pages use Laravel Blade; Filament manages routes and fleet listings. This is an original design and does not copy the reference site's source or assets.

## Stack
- Laravel 13 / PHP 8.3+
- Filament 5 admin panel at `/admin`
- Blade templates + plain CSS
- SQLite for local development (configurable via `.env`)

## Local setup
1. Install PHP 8.3+ with `pdo_sqlite`, `mbstring`, `openssl`, `fileinfo`, and `zip`, plus Composer.
2. `composer install`
3. Copy `.env.example` to `.env`, set `APP_ENV=local`, `APP_DEBUG=true`, then run `php artisan key:generate`.
4. Ensure `database/database.sqlite` exists (or configure another database in `.env`).
5. `php artisan migrate --seed`
6. `php artisan storage:link`
7. Create an admin account with a verified `@armadatransjava.com` email using `php artisan make:filament-user` interactively. Use a unique password stored in a password manager.
8. Run `php artisan serve`; visit the local URL and `/admin` to sign in.

## Pages
- `/` Landing page with route inquiry, featured routes, fleet previews, and WhatsApp actions.
- `/rute` Route directory.
- `/rute/{slug}` Route detail page.
- `/armada` Fleet directory.
- `/admin` Filament management for routes and vehicles.

## Before launch
- Confirm official WhatsApp contact, current services/routes, fleet facts, policies, operating hours, and legal business information with the operator.
- The initial three route and three fleet records are provisional examples; edit/deactivate them in admin after verification.
- Replace the remote hero photo with original/licensed imagery and verify commercial rights for every asset.
- Set `WHATSAPP_NUMBER` (digits only, including country code) in `.env`; the UI fallback uses a publicly listed number that must be verified.
- Configure production environment, database, HTTPS, backups, mail, and deployment secrets before deployment.
- Replace the example admin domain allow-list in `app/Models/User.php` with the actual authorized admin email policy before production.

Inquiry is not booking confirmation. Availability, fares, and pickup details are confirmed by the operator.
