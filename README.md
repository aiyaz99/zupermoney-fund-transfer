# ZuperMoney - Distributor Fund Transfer & Ledger

A full-stack application for managing distributor fund transfers and maintaining a transaction ledger.

## Tech Stack

### Backend

- Laravel 13
- PHP 8.3
- MySQL
- Laravel Sanctum
- Eloquent ORM

### Frontend

- React
- Vite
- JavaScript
- CSS

## Features

- Admin login using Laravel Sanctum authentication
- View all distributors and their current balances
- Create credit and debit fund transfers
- Prevent debit transactions that would make the balance negative
- Atomic balance updates using database transactions
- Row locking for safe back-to-back transfers
- Complete distributor fund transfer ledger
- Filter ledger by distributor and date range
- Pagination
- Frontend and backend validation
- Responsive React dashboard

## Project Structure

```text
zupermoney-fund-transfer/
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── tests/
├── frontend/
│   └── src/
├── .gitignore
└── README.md
```

## Database Design

### `distributors`

Stores distributor information and their current balance.

| Column | Description |
|---|---|
| `id` | Unique distributor ID |
| `name` | Distributor name |
| `current_balance` | Current available balance |
| `created_at` | Record creation time |
| `updated_at` | Record update time |

### `fund_transfers`

Stores every credit and debit transaction.

| Column | Description |
|---|---|
| `id` | Unique transfer ID |
| `distributor_id` | ID of the distributor |
| `amount` | Transfer amount |
| `type` | `credit` or `debit` |
| `balance_after` | Distributor balance after the transaction |
| `remarks` | Optional transaction remarks |
| `created_at` | Transaction creation time |
| `updated_at` | Record update time |

### `users`

Stores admin login credentials.

### `personal_access_tokens`

Stores Laravel Sanctum authentication tokens.

## Setup Instructions

### Prerequisites

Make sure the following are installed:

- PHP 8.3 or later
- Composer
- MySQL
- Node.js and npm

### 1. Clone the Repository

```bash
git clone https://github.com/aiyaz99/zupermoney-fund-transfer.git
cd zupermoney-fund-transfer
```

## Backend Setup

### 2. Go to the Backend

```bash
cd backend
```

### 3. Install Laravel Dependencies

```bash
composer install
```

### 4. Create the Environment File

On Windows:

```powershell
copy .env.example .env
```

### 5. Generate the Application Key

```bash
php artisan key:generate
```

### 6. Configure MySQL

Open the `backend/.env` file and configure the database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zupermoney
DB_USERNAME=root
DB_PASSWORD=
```

Use your own MySQL username and password if different.

### 7. Run Database Migrations

```bash
php artisan migrate
```

### 8. Seed Initial Data

```bash
php artisan db:seed
```

This creates:

- Admin user
- ABC Distributors
- XYZ Distributors
- PQR Distributors

### 9. Start the Laravel Backend

```bash
php artisan serve
```

The backend API will be available at:

```text
http://127.0.0.1:8000
```

## Frontend Setup

### 10. Open a New Terminal

From the project root:

```bash
cd frontend
```

### 11. Install Frontend Dependencies

```bash
npm install
```

### 12. Start the React Application

```bash
npm run dev
```

## Live Demo

- Frontend: https://zupermoney-fund-transfer-production.up.railway.app
- Backend API: https://noble-miracle-production-94df.up.railway.app

### Demo Credentials

- Email: `admin@example.com`
- Password: `password`

These credentials are created by the database seeder.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Admin login |
| POST | `/api/logout` | Logout |
| GET | `/api/user` | Get authenticated user |

### Distributors

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/distributors` | Get all distributors and current balances |

### Fund Transfers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/fund-transfers` | Create a credit/debit transfer |
| GET | `/api/fund-transfers` | Get paginated fund transfer ledger |

The ledger endpoint supports the following query parameters:

```text
distributor_id
from
to
page
per_page
```

Example:

```text
/api/fund-transfers?distributor_id=1&from=2026-09-01&to=2026-09-30&page=1
```

## Transfer Logic

All fund transfers are processed inside a database transaction.

For a debit transaction:

1. The distributor row is locked using `lockForUpdate()`.
2. The current balance is checked.
3. The debit is rejected if the available balance is insufficient.
4. The new balance is calculated.
5. The distributor balance is updated.
6. The transaction is recorded with the resulting `balance_after`.

This prevents negative balances and helps maintain correct balances during back-to-back requests.

## Validation

The backend validates:

- Distributor ID
- Distributor existence
- Amount must be greater than zero
- Transfer type must be `credit` or `debit`
- Remarks length
- Date filter values
- Pagination values

The frontend also validates transfer details and prevents a debit when the amount is greater than the current balance.

## Testing

Backend tests can be executed from the `backend` directory:

```bash
php artisan test
```

The feature tests cover:

- Credit transfers
- Debit transfers
- Negative balance prevention
- Transfer validation
- Distributor filtering
- Pagination
- Authentication protection

## Security

- API endpoints are protected using Laravel Sanctum authentication.
- Fund transfer operations require authentication.
- Backend validation prevents invalid requests.
- Database transactions maintain transfer consistency.
- Row-level locking protects balance updates during concurrent requests.

## Assumptions

- All authenticated users are treated as administrators for this take-home assignment.
- The seeded admin account is intended for local/demo use only.
- Distributor balances are stored with two decimal places.
- Date filters are inclusive.
- The current balance is maintained on the distributor record.
- Every transaction is preserved in the fund transfer ledger.

## If I Had More Time

- Add role-based authorization so only administrators can perform fund transfers.
- Add stronger API rate limiting and production security controls.
- Use more secure cookie-based authentication instead of localStorage.
- Add more comprehensive unit and integration tests.
- Add dashboard summaries for total credits and debits.
- Add audit logging for administrative actions.
- Improve production error handling and monitoring.
