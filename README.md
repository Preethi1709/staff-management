# NUNES Staff, Assets & EB Expenses v1.2

One Windows-local Node.js application for **NUNES Instruments**.

## Launch
1. Install Node.js 20+ from https://nodejs.org/en/download
2. Extract this folder to a local drive, for example `C:\NUNES_Staff_Asset_Management_v1_2`.
3. Double-click `START_NUNES.bat`, or open Command Prompt in this folder and run `npm start`.
4. Open **http://127.0.0.1:5078** and set an admin password on first startup (min 10 characters).
5. Keep the terminal open while using the app.

No `npm install` or API keys are required; this project uses Node.js built-ins only. No `.env` is needed.

## Included modules
- Staff list: add/edit/delete, active, on leave and relieved status, dates
- Company mobiles, laptops, desktop CPUs, staff vehicles; asset assignments
- **NUNES EB Expenses**: service number, meter, office, monthly reading and unit consumption, bill amount, due date, paid / pending / overdue, method and payment reference, Add/Edit/Delete
- EB bill PDF/JPG/PNG attachment (max 1 MB each), protected download
- Dashboard EB summary, EB CSV report, complete JSON backup/restore including EB attachments
- Show/hide admin password on setup/login

## Important when upgrading an existing installation
**Preserve your original `data/database.json`**. The upgrade adds `ebBills:[]` automatically to the old database in memory, without changing staff, assets or administrator password. Before upgrading, use Reports > Download Backup AND copy the old `data` folder somewhere safe.

To upgrade: stop the old server (Ctrl+C), replace the files `server.js`, `public/`, `README.md`, and `package.json` from this folder in your existing project; **do not overwrite the existing data directory**; then restart with `START_NUNES.bat`. If you use a new folder instead, copy the old data directory into it before starting. If a server already runs on port 5078, close the old one first.

Current backups created by v1.2 include EB bills and their attachments. Restore accepts older v1 backups; restoring an old backup will reset EB bills to empty. Large JSON backups over 7MB cannot be restored through the UI.

## Security and data
Stored locally in `data/database.json`, created when first run; no real staff or EB records are bundled. Access is restricted to `127.0.0.1` by default and requires admin login. No automatic password recovery. Make regular backups; losing the data directory or password will prevent normal access. Avoid exposing this server directly on the public internet.

## Test
`npm test` runs original backend tests. `node test-eb.js` tests the EB routes and upgrade behavior.


## v1.3 UI FIX — Modal scroll and visible buttons
- All Staff / Mobile / Laptop / Desktop-CPU / Vehicle / EB Add/Edit popups now have a viewport-limited height.
- The form fields independently scroll while the title, Save and Cancel buttons stay visible.
- Background scrolling is disabled when a popup is open.
- Supports smaller screens and browser zoom. No database schema or backend API changes.
- To upgrade an existing installation, back up your original `data` folder first, then replace **only** `public/styles.css` and `public/app.js`, restart the server and press Ctrl+F5 in Chrome.
