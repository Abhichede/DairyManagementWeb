# DairyManagementWeb

Modern web experience for the Dairy Management System. This first release recreates the original application's navigation and visual workflow as a responsive React + TypeScript dashboard.

## Run locally

```bash
npm install
npm run dev
```

## API and MySQL

Copy `.env.example` to `.env`, update the database credentials, then initialize the schema:

```bash
mysql -u root -p < server/schema.sql
npm run api
```

The API runs on `http://localhost:4000` and currently exposes health, customers, milk collections, and payments endpoints. Credentials are read only from environment variables.

## Current scope

- DairyFlow dashboard with collection, revenue, customer, and payment metrics
- Responsive sidebar navigation matching the original modules
- Collection overview chart and recent customer activity
- Quick actions, alerts, and reminders
- Placeholder workspaces for milk collection, customers, payments, employees, reports, and settings

The next implementation phase can connect these screens to the existing MySQL data through a secure API.
