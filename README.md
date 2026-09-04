# advisorCRM — Meridian Advisor Desk

A financial-advisor CRM built for desktop and mobile: calendar-first appointment scheduling, client households with risk tier and portfolio detail, a follow-up/task tracker, a pipeline board, a product catalog with suitability rules, and portfolio reports.

React + TypeScript + Vite. The layout, spacing, and the Modernist type/color system are ported pixel-for-pixel from the `Advisor Desk CRM` design produced in Claude Design.

## Screens

- **Calendar** — full month grid, week grid or day agenda, navigable by period with a Today reset; KPI strip, "due today" task rail, book-of-business bars. Book on **any** date and time: click a day in the month view (or "+ Add" in a week column), then pick date, start time, duration, format and type. Each booking auto-creates a Scheduled follow-up task.
- **Appointment confirmation emails** — confirming a booking drafts a confirmation to the client's email address (date, time, end time, format, advisor sign-off) and hands it to your mail client. Any appointment can be re-sent from the day agenda; appointments that have been confirmed carry a "Confirmation emailed" tag.
- **Clients** — household list; click through to **Client detail**: contact & household, risk tier meter + investment profile, holdings, total portfolio value & performance, appointment history, follow-up tasks, activity timeline.
- **Follow-ups** — filterable by pipeline stage; tick to close, → to advance.
- **Pipeline** — four stage columns (Scheduled → Completed → Follow-up sent → Closed), ← → to move deals.
- **Products** — 14-product catalog across Discretionary, Fixed income, Insurance, Education, Retirement, and Alternatives; per-product suitable risk bands, enable/disable for sale, a suitability matrix, and a next-best-action list.
- **Reports** — AUM, blended YTD, assets by risk tier, product coverage, households by value.

Sample data (7 households) lives in `src/data/mock.ts` and is held in memory — there is no backend, so edits made in the UI (task toggles, new appointments, deal stage moves, product enable/disable) reset on reload. Appointments and task due dates are generated around the day the app is opened, so the calendar is never empty.

Advisor name and email, firm name, default landing screen, whether Saturday shows in the week grid, and currency are configured in `src/config.ts`.

### A note on email

The app is a static site with no backend, so it cannot send mail itself. Confirming a booking composes the message and opens it as a `mailto:` draft in the advisor's own mail client — nothing is transmitted until the advisor sends it there, and the UI keeps a visible draft link because a `mailto:` hand-off never reports back. Swapping this for a real transactional send (Resend, SendGrid, SMTP) means adding a small API endpoint and replacing `openEmailDraft` in `src/utils/email.ts`.

## Development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages deployment

This repository is configured for GitHub Pages deployment from the `main` branch using the workflow at:

`.github/workflows/deploy-pages.yml`

To publish:

1. In GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push changes to `main` (or run the workflow manually from Actions).

The Vite `base` path is set to `/advisorCRM/` to match the repository name.
