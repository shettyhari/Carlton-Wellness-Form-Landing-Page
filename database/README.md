# Database

Left for the developer. No database is connected yet: the backend validates each lead
and hands it to `saveLead()` in `backend/src/leadStore.js`, which currently only writes it to the server log.

To connect a database, put the schema or migrations in this folder, add the connection settings
to `backend/.env.example`, and save the lead inside `saveLead()`.

## Lead fields passed to `saveLead()`

| Field | Max length | Notes |
|---|---|---|
| `name` | 120 | Required |
| `phone` | 20 | Required, 10 to 15 digits, may start with + |
| `email` | 160 | Required, stored in lowercase |
| `city` | 120 | City / State |
| `capital_contribution` | 60 | `₹75 L – ₹1 Cr`, `₹1 Cr – ₹1.5 Cr` or `₹1.5 Cr+` |
| `timeline` | 60 | Timeline to start |
| `background` | 80 | Business background |
| `source` | 120 | Always `Carlton Wellness franchise Meta ad form` |
| `page` | 500 | URL the form was submitted from (includes ad UTM tags) |
| `ip_address` | 64 | Visitor IP |
| `user_agent` | 300 | Visitor browser |
| `created_at` | | ISO 8601 timestamp (UTC) |

Optional fields are `null` when empty.
