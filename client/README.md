# Client — Auth Dashboard Frontend

## 1. Install & run
```bash
cd client
npm install
npm run dev
```
Runs on **http://localhost:5173** by default (Vite). Make sure your Express/Mongo backend is running on `http://localhost:5000` (see `.env` → `VITE_API_URL`).

## 2. Fully functional (real backend calls)
- Signup / Login / Logout (AuthContext + `/api/auth/*`)
- Session restore on refresh via `GET /api/auth/me`
- Protected routes (`/dashboard`, `/profile`) and admin-gated routes (`/admin/*`)
- Admin Users page: list w/ pagination (`GET /api/users`), role change (`PUT /api/users/:id`), delete (`DELETE /api/users/:id`), client-side search
- Admin Overview stats (total users, admins, new this week) computed from real `/api/users` data
- Self-protection: admin can't demote/delete their own account

## 3. Placeholder / TODO (build on top of these for the hackathon feature)
- Dashboard stat cards ("Total Items", "This Week") — static 0 values, clearly commented `TODO`
- Dashboard "Recent Activity" — empty state only, no real feed yet
- Profile → "Update Profile" and "Change Password" — full UI + validation built, but call a placeholder (toast "Feature coming soon") since there's no backend route yet
- Admin Settings page — local-only toggles, no backend wiring yet

Everything above is explicitly commented `// TODO` or `// PLACEHOLDER` in the code so it's easy to find and wire up later.
