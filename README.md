# 🏛️ Government Score API

A REST API that calculates a Government Performance Score (0–100) for Latin American countries using real data from the World Bank, Transparency International, and Latinobarometro.

## 🌎 Live Demo
👉 [government-score-frontend](https://manuelgoicochea.github.io/government-score-frontend/)

## 📊 How the Score Works

The score is a weighted index based on 6 indicators:

| Indicator | Source | Weight |
|---|---|---|
| Inflation Rate | World Bank API | 40% (Economy) |
| Unemployment Rate | World Bank API | 40% (Economy) |
| GDP Growth | World Bank API | 40% (Economy) |
| Budget Execution | CEPAL / National Reports | 20% (Efficiency) |
| Corruption Risk | Transparency International CPI | 20% (Transparency) |
| Public Trust | Latinobarometro | 20% (Trust) |

### Classification
- ✅ **Good**: 70–100
- ⚠️ **Moderate**: 40–69
- ❌ **Critical**: 0–39

## 🛠️ Tech Stack

- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL 16
- **ORM**: SQLAlchemy 2.0
- **Containerization**: Docker + Docker Compose
- **Deployment**: Railway

## 🚀 Getting Started

### Prerequisites
- Docker Desktop
- Git

### Run locally

```bash
git clone https://github.com/manuelgoicochea/government-score-api.git
cd government-score-api
cp .env.example .env   # configure your environment variables
docker compose up --build
```

Open http://localhost:8000/docs for the interactive API documentation.

### Environment Variables

Create a `.env` file based on `.env.example`:

```
DATABASE_URL=postgresql://gov_user:gov_pass@db:5432/gov_score_db
ADMIN_API_KEY=your-secret-key-here
APP_ENV=development
```

### Trigger a data refresh (admin only)

```bash
curl -X POST http://localhost:8000/api/admin/refresh \
  -H "X-API-Key: your-secret-key-here"
```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/countries` | Get all country scores | Public |
| GET | `/api/countries/{code}` | Get score for one country | Public |
| GET | `/api/countries/last-sync` | Get last synchronization info | Public |
| POST | `/api/admin/refresh` | Refresh data from external APIs | API Key |
| GET | `/api/admin/refresh/logs` | Get refresh history | API Key |

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Interactive map of Latin America
- [ ] Historical score tracking per country
- [ ] Expand to more countries worldwide
- [ ] Score change alerts
- [ ] PDF report export

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.