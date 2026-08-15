# Dialogue Summarizer

React and Tailwind frontend with a FastAPI T5 summarization API.

## Local development

Start the API from `server`:

```powershell
..\.venv\Scripts\python.exe -m uvicorn app:app --reload
```

Start the frontend from `client`:

```powershell
npm.cmd run dev
```

The Vite proxy sends local `/summarize` requests to the API. To call an API directly, copy `client/.env.example` to `client/.env` and set `VITE_API_URL`.

## Deployment

Deploy `server` as a Render web service:

- Root directory: `server`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Environment variables: `PYTHON_VERSION=3.11.11` and `ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app`

Deploy `client` as a Vercel project:

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com`

The model file is tracked by Git LFS through `.gitattributes`.
