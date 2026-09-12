# Copilot Instructions

## Repository overview

Newbiethoning is a LifeFit Seoul prototype split into two independently run applications:

- `frontend/` is a React 19 app built with Vite. `src/App.jsx` currently owns the complete user flow: basic information (step 1), community preference (step 2), and ranked neighborhood results (step 3). The neighborhood data and scoring calculation are local constants and browser state.
- `backend/` is a FastAPI app in `app.py`. It persists users in `users.db` through SQLAlchemy and exposes user creation, login, and housing recommendation endpoints. Its housing recommendations use the `MOCK_HOUSING` list.

The frontend currently does not call the backend API. Keep that separation in mind when changing either side; connecting them is an integration change, not a refactor of the existing local flow.

## Build, lint, and run commands

Run frontend commands from `frontend/`:

```powershell
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

`npm run lint` uses Oxlint with the configuration in `frontend/.oxlintrc.json`. There is no frontend test script or test runner, so there is currently no single-test command.

Run the backend from `backend/` after installing the requirements in `requirements.txt`:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app:app --reload
```

The backend has no test suite or test runner. Its FastAPI routes are available through the generated `/docs` page when Uvicorn is running.

## Architecture and data flow

- `frontend/src/main.jsx` mounts `App` inside React `StrictMode`; `App.jsx` imports the page styling from `App.css`.
- `App.jsx` uses a single component with `step` state to switch between the three screens. Step 1 collects budget, location, commute limit, and job field; step 2 requires a community choice; step 3 ranks four hard-coded Seoul areas.
- Frontend scoring combines housing (40%), transport (35%), and jobs (25%), then sorts descending and displays the top three. `location`, `job`, and `community` are collected for the UI, but only budget and commute currently affect the ranking.
- `backend/app.py` creates the SQLite engine and tables at import time. `UserCreate`/`UserLogin` are Pydantic request models, while SQLAlchemy `User` is the persisted model. `/users/` creates users, `/login/` looks up an email, and `/api/housing/{user_id}` filters and sorts mock housing based on budget and `time_vs_cost`.
- Backend recommendations and frontend recommendations use different data models and scoring rules. Do not silently merge or substitute one for the other; update both contracts deliberately if API integration is added.

## Codebase-specific conventions

- Keep frontend source as JSX/ES modules and follow the existing Vite style: React hooks are imported directly, component-local state is used for this prototype, and UI styles live in `src/App.css` and `src/index.css`.
- Preserve the existing three-step flow and the disabled state of the step-2 results button until a community option is selected when modifying the form UX.
- Neighborhood ranking is intentionally deterministic. Changes to area data or scoring weights should be made next to the `areas` constant and `generateResults` in `App.jsx`, not duplicated in render branches.
- Backend routes use dependency-injected SQLAlchemy sessions through `get_db()`, raise `HTTPException` for missing/duplicate users, and return simple JSON-compatible dictionaries.
- The backend database URL is relative (`sqlite:///./users.db`), so commands should be run from `backend/` to use the repository’s existing database file consistently.
- Frontend linting is Oxlint rather than ESLint. Preserve the existing React hooks and component-export rules in `.oxlintrc.json`.
