# Ciuffo Portfolio analytics

The portfolio sends first-party page and interaction events to the local `/api/` PHP endpoints.

Production deployment is handled by Vercel from `main`. The production environment keeps the
database connection in Vercel Environment Variables; no credentials belong in this repository.

The public tracker is loaded from `analytics/tracker.js` and uses `ciuffo_portfolio` as its site key.
