# ✨ Briefly — AI Dialogue Summarizer

Briefly turns long conversations, meeting notes, and chat transcripts into short, clear summaries. It combines a fine-tuned **T5 Transformer** model with a polished React interface, so users can paste a dialogue and receive the essential context in seconds.

## 🌟 Features

- 🧠 **T5-powered summarization** for dialogue and conversational text
- ⚡ **FastAPI backend** with a simple JSON API
- 🎨 **Responsive dark UI** built with React, TypeScript, and Tailwind CSS
- 📋 Copy summaries directly to the clipboard
- 🧹 Cleans whitespace and HTML before generating a summary
- 🖥️ Uses CUDA, Apple MPS, or CPU automatically depending on availability

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 |
| Backend | Python, FastAPI, Uvicorn |
| AI / NLP | PyTorch, Hugging Face Transformers, T5 |
| Model format | SafeTensors |
| Large model storage | Git LFS |

## 📁 Project Structure

```text
.
├── client/                    # React + TypeScript + Tailwind frontend
│   ├── src/
│   │   ├── App.tsx            # Summarizer UI and API request logic
│   │   └── index.css          # Tailwind entry and global styles
│   └── vite.config.ts         # Local API proxy configuration
├── server/                    # FastAPI backend
│   ├── app.py                 # T5 model loading and /summarize endpoint
│   ├── requirements.txt       # Python dependencies
│   └── final_model/           # Saved model and tokenizer files
├── data/                      # SAMSum training, validation, and test data
└── notebooks/                 # Training and experimentation notebook
```

## 🚀 Run Locally

### 1. Clone the project and download the model

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
git lfs install
git lfs pull
```

> 💡 The T5 model is large, so it is stored with Git LFS rather than normal Git.

### 2. Start the FastAPI backend

Create and activate a virtual environment, then install the server dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r server\requirements.txt
```

Run the API:

```powershell
cd server
uvicorn app:app --reload
```

The API runs at `http://127.0.0.1:8000`.

### 3. Start the React frontend

Open a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal—usually `http://localhost:5173`. During development, Vite forwards `/summarize` requests to FastAPI automatically. 🔁

## 🔌 API Reference

### `POST /summarize`

Send a dialogue in JSON format:

```json
{
  "dialogue": "Alex: Can you send the report today?\nMaya: Yes, I will share it before 5 PM."
}
```

Example response:

```json
{
  "summary": "Maya will send the report to Alex before 5 PM."
}
```

### `GET /`

Returns a lightweight health check:

```json
{
  "status": "ok"
}
```

## ☁️ Deployment

### Backend: Render

Create a **Web Service** with these settings:

| Setting | Value |
| --- | --- |
| Root Directory | `server` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| Python Version | `3.11.11` |

Add this environment variable after deploying the frontend:

```text
ALLOWED_ORIGINS=https://YOUR-VERCEL-PROJECT.vercel.app
```

### Frontend: Vercel

Import the repository and use:

| Setting | Value |
| --- | --- |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add this environment variable with your Render service URL:

```text
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Redeploy Render after adding the exact Vercel URL to `ALLOWED_ORIGINS`. This enables browser access to the API through CORS. 🌐

## 🧪 Build the Frontend

```powershell
cd client
npm run build
```

## 📝 Notes

- The model is loaded when the FastAPI server starts, so the first request after a deployment may take longer.
- Free hosting tiers can sleep after inactivity; the next request may have a cold-start delay.
- For public deployments, use a server plan with enough memory for PyTorch and the T5 model.

---

Built with 💙 using React, FastAPI, and Hugging Face Transformers.
