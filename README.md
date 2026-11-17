# GrowthLens – AI-Powered Social Media Content Analytics

GrowthLens is an AI-powered social media content intelligence platform designed to help creators understand content performance, monitor engagement, and make more informed content decisions.

The platform combines analytics dashboards with generative AI to turn manually provided content metrics into actionable insights and content ideas.

## Features

- **User Authentication:** Secure registration and login using JWT authentication.
- **Analytics Dashboard:** View content performance and engagement summaries.
- **Content Management:** Upload videos and maintain a record of content performance.
- **Engagement Analysis:** Calculate engagement rates using reach and interaction metrics.
- **AI-Powered Insights:** Generate content analysis using Google Gemini.
- **AI Content Ideas:** Generate new content ideas based on provided content details and performance data.
- **Content History:** Review previously submitted content and analysis.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular 19, TypeScript |
| Backend | Python, FastAPI |
| Database | MongoDB Atlas |
| AI Integration | Google Gemini API |
| Authentication | JWT, bcrypt |
| Visualisation | Chart.js |
| File Handling | Local video storage |

## Architecture

```text
Angular 19 Frontend
        |
        | REST API
        v
FastAPI Backend
        |
        +------ MongoDB Atlas
        |
        +------ Google Gemini API
        |
        +------ Video Storage
```

## How It Works

1. Users register and log in to the platform.
2. Users submit content information and performance metrics.
3. The backend processes engagement data and stores content records.
4. Google Gemini generates insights and content suggestions based on the supplied information.
5. Users access analytics, insights, and content history through the dashboard.

**AI analysis scope:** The current implementation uses submitted content information and performance metrics. It does not independently watch or interpret the uploaded video itself.

## Getting Started

### Prerequisites

- Node.js and npm
- Angular CLI
- Python 3.12
- MongoDB Atlas account
- Google Gemini API key

### Backend Setup

```bash
cd Backend

python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file using `.env.example` as a reference and configure your environment variables.

Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

API documentation:

`http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd Frontend/frontend

npm install
ng serve
```

Open:

`http://localhost:4200`

## Environment Variables

Configure the following variables in the backend `.env` file:

```env
MONGO_URI=
DB_NAME=
JWT_SECRET=
JWT_EXPIRE_MINUTES=1440

GEMINI_API_KEY=
GEMINI_MODEL=
GEMINI_FALLBACK_MODEL=

CORS_ORIGINS=
UPLOAD_DIR=uploads
MAX_UPLOAD_MB=100
```

Never commit real API keys, database credentials, or secret values to version control.

## Project Status

GrowthLens is an actively developed project. Features and deployment configuration may evolve as development progresses.

## Author

**Muhammad Haris**

B.Tech Computer Science and Engineering

GitHub: [Your GitHub Profile](https://github.com/)

---

*Built to explore the intersection of AI, analytics, and content intelligence.*
