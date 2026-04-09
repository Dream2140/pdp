# PDP — CI/CD: Що було зроблено і для чого

## Репозиторій та живі посилання

- **GitHub**: https://github.com/Dream2140/pdp
- **Production**: https://pdp-news-prod.fly.dev
- **Staging**: https://pdp-news-staging.fly.dev
- **Healthcheck**: https://pdp-news-prod.fly.dev/api/healthcheck
- **Prometheus метрики**: https://pdp-news-prod.fly.dev/api/metrics
- **Sentry тест**: https://pdp-news-prod.fly.dev/api/sentry-test
- **Docker образ**: ghcr.io/dream2140/pdp

---

## Частина 1: Базова

---

### 1️⃣ Створення простого додатку

**Що зроблено:** Новинний сайт на Next.js 14 + Tailwind CSS.

**Що таке Next.js?**
Це React-фреймворк, який дозволяє створювати повноцінні веб-додатки. Він вміє рендерити сторінки на сервері (SSR), генерувати статичні сторінки (SSG), і має вбудовану систему роутингу та API-ендпоінтів.

**Що таке Tailwind CSS?**
CSS-фреймворк, де стилі пишуться прямо в класах HTML-елементів (наприклад `className="text-xl font-bold"`), замість написання окремих CSS-файлів.

**Структура додатку:**

```
src/
├── app/
│   ├── layout.tsx          — Загальний layout (хедер "PDP News" на кожній сторінці)
│   ├── page.tsx            — Головна сторінка зі списком новин
│   ├── globals.css         — Глобальні стилі (Tailwind)
│   ├── news/[id]/page.tsx  — Сторінка окремої новини (динамічний роут)
│   └── api/
│       └── healthcheck/route.ts — Ендпоінт /api/healthcheck → {"status": "ok"}
├── data/
│   └── news.ts             — Масив з 6 новин (моковані дані)
└── lib/
    ├── logger.ts           — Логер (pino)
    └── metrics.ts          — Prometheus метрики
```

**Як перевірити:**

- Відкрити https://pdp-news-prod.fly.dev — побачиш список новин
- Клікнути на новину — відкриється сторінка з повним текстом
- Відкрити https://pdp-news-prod.fly.dev/api/healthcheck — побачиш `{"status":"ok"}`

---

**Юніт-тести (Jest):**

Jest — це фреймворк для написання тестів у JavaScript/TypeScript. Юніт-тести перевіряють окремі функції чи модулі ізольовано.

Файли тестів:

- `src/__tests__/news.test.ts` — перевіряє що функції `getAllNews()` і `getNewsById()` працюють правильно (4 тести)
- `src/__tests__/healthcheck.test.ts` — перевіряє що ендпоінт повертає `{status: "ok"}` і статус 200 (1 тест)
- `src/__tests__/metrics.test.ts` — перевіряє що ендпоінт метрик повертає Prometheus-формат (1 тест)

**Як запустити:** `npm test`

```
PASS src/__tests__/news.test.ts
PASS src/__tests__/healthcheck.test.ts
PASS src/__tests__/metrics.test.ts

Test Suites: 3 passed, 3 total
Tests:       6 passed, 6 total
```

---

**E2E тести (Playwright):**

Playwright — інструмент для end-to-end тестування. На відміну від юніт-тестів, E2E тести відкривають реальний браузер, переходять по сторінках і перевіряють що все працює як у реального користувача.

Файл: `e2e/app.spec.ts` (3 тести):

1. Відкриває головну сторінку → перевіряє що є заголовок "Latest News" і 6 новин
2. Клікає на першу новину → перевіряє навігацію туди і назад
3. Робить HTTP-запит на /api/healthcheck → перевіряє відповідь

**Як запустити:** `npm run test:e2e`

---

### 2️⃣ CI за допомогою GitHub Actions

**Що таке CI (Continuous Integration)?**
Це автоматична перевірка коду після кожного push/PR. Замість того щоб вручну запускати тести і лінтер, GitHub Actions робить це автоматично.

**Що таке GitHub Actions?**
Сервіс від GitHub, який запускає скрипти (workflows) на віртуальних машинах у хмарі. Workflows описуються у YAML-файлах у `.github/workflows/`.

**Файл:** `.github/workflows/ci.yml`

**Що він робить (4 джоби, перші 3 паралельно):**

```
Push в main/develop або PR
         │
    ┌────┼────┐
    ▼    ▼    ▼
  lint  test  e2e      ← запускаються паралельно
    │    │    │
    └────┼────┘
         ▼
       docker          ← запускається тільки якщо всі 3 пройшли
```

1. **lint** — перевірка якості коду:
   - `npm run lint` — ESLint шукає помилки та bad practices у коді
   - `npm run format` — Prettier перевіряє форматування (відступи, лапки, крапки з комою)

2. **test** — юніт-тести:
   - `npm test` — запускає всі Jest тести

3. **e2e** — end-to-end тести:
   - Встановлює Chromium браузер
   - Білдить додаток
   - Запускає Playwright тести в реальному браузері

4. **docker** — збірка та публікація Docker-образу:
   - Збирає Docker-образ
   - При push в `main` — публікує образ у GHCR (GitHub Container Registry)

**Кешування залежностей:**
У кожному джобі є `cache: npm` — це значить що `node_modules` кешуються між запусками. Якщо `package-lock.json` не змінився, залежності не перевстановлюються, а беруться з кешу. Це пришвидшує CI на ~30-60 секунд.

**Як перевірити:**

- Відкрити https://github.com/Dream2140/pdp/actions → вкладка "CI"
- Побачиш список запусків з зеленими ✅ або червоними ❌

---

### 3️⃣ Контейнеризація

**Що таке Docker?**
Docker дозволяє запакувати додаток разом з усіма залежностями у "контейнер" — ізольоване середовище, яке однаково працює на будь-якому комп'ютері. Замість "у мене на машині працює" — працює скрізь однаково.

**Що таке Docker-образ?**
Це "знімок" файлової системи з додатком. З одного образу можна запустити багато контейнерів.

---

**Dockerfile** — інструкція для збірки образу. Використовує multi-stage build (4 етапи):

```
Етап 1 (base):    node:20-alpine — базовий легкий образ з Node.js
         ▼
Етап 2 (deps):    npm ci — встановлює залежності
         ▼
Етап 3 (builder): Копіює код + node_modules → npm run build
         ▼
Етап 4 (runner):  Тільки готовий білд (без dev-залежностей) → node server.js
```

**Навіщо multi-stage?** Фінальний образ містить тільки те, що потрібно для запуску (~50 MB), а не весь node_modules (~500 MB).

---

**docker-compose.yml** — для локальної розробки. Описує набір сервісів які запускаються разом:

```yaml
services:
  app: — наш Next.js додаток (порт 3000)
  db: — PostgreSQL 16 база даних (порт 5432)
```

**Як запустити:** `docker compose up` — запустить і додаток, і БД одночасно.

---

**Docker у CI:**
Джоб `docker` у `ci.yml` автоматично збирає образ при кожному push. При push в `main` — образ публікується у GHCR (про це далі).

---

## Частина 2: Розширена

---

### 🔹 1. Автоматичне публікування Docker-образів

**Що таке GHCR (GitHub Container Registry)?**
Це сховище Docker-образів від GitHub. Як Docker Hub, але інтегроване з GitHub. Образи прив'язані до репозиторію.

**Що зроблено:**
У `ci.yml` джоб `docker` при push в `main`:

1. Логіниться в GHCR (використовує вбудований `GITHUB_TOKEN`)
2. Генерує теги для образу через `docker/metadata-action`
3. Збирає і пушить образ через `docker/build-push-action`

**Версіонування образів — які теги створюються:**

- `ghcr.io/dream2140/pdp:main` — останній білд з main
- `ghcr.io/dream2140/pdp:sha-abc1234` — конкретний коміт
- `ghcr.io/dream2140/pdp:1.0.0` — якщо є git tag `v1.0.0`

**Як перевірити:**

- Відкрити https://github.com/Dream2140/pdp/pkgs/container/pdp — побачиш список образів

---

### 🔹 2. Автоматичний деплой на хмарний сервіс

**Що таке Fly.io?**
Хмарний сервіс для запуску Docker-контейнерів. Безкоштовний tier: 3 VM, 256 MB RAM кожна. Додаток доступний за URL `*.fly.dev`.

**Що таке staging і production?**

- **Staging** — тестове середовище. Тут перевіряють нові фічі перед релізом. Якщо щось зламається — не страшно.
- **Production** — бойове середовище. Те, що бачать реальні користувачі. Тут все має працювати стабільно.

---

**Файл:** `.github/workflows/deploy.yml`

**Схема деплою:**

```
Push/merge в develop  ──→  deploy-staging   ──→  https://pdp-news-staging.fly.dev
Push/merge в main     ──→  deploy-production ──→  https://pdp-news-prod.fly.dev
                                │
                           Якщо впав?
                                │
                                ▼
                            rollback (відкат до попередньої версії)
```

**Як працює rollback:**
Якщо деплой на production впав, автоматично запускається джоб `rollback`. Він:

1. Дістає список попередніх релізів через `flyctl releases`
2. Повертає попередній образ через `flyctl deploy`

Тобто якщо новий код зламав production — система автоматично повертається до робочої версії.

**Конфіги Fly.io:**

- `fly.staging.toml` — налаштування staging (регіон `arn` = Стокгольм, 256 MB, автостоп при простої)
- `fly.production.toml` — налаштування production (те саме, але `min_machines_running = 1` — завжди працює хоча б 1 машина)

**Як перевірити:**

- https://pdp-news-prod.fly.dev — production
- https://pdp-news-staging.fly.dev — staging
- https://fly.io/apps/pdp-news-prod/monitoring — моніторинг на Fly.io

---

### 🔹 3. Infrastructure as Code (IaC)

**Що таке IaC?**
Замість ручного налаштування серверів через UI/CLI — описуємо інфраструктуру у конфігураційних файлах. Це дозволяє відтворити інфраструктуру з нуля однією командою, тримати її в git, робити code review.

---

**docker-compose.prod.yml** — production-версія docker-compose:

```yaml
services:
  app:
    image: ghcr.io/dream2140/pdp:main  ← бере готовий образ з GHCR (не білдить локально)
    healthcheck: wget /api/healthcheck  ← Docker перевіряє чи додаток живий
    restart: always                     ← перезапускає якщо впав

  db:
    image: postgres:16-alpine
    restart: always
    volumes: pgdata                     ← дані БД зберігаються на диску (не втрачаються при рестарті)
```

**Як використати:** На будь-якому сервері з Docker:

```bash
POSTGRES_PASSWORD=mysecret docker compose -f docker-compose.prod.yml up -d
```

---

**Terraform** — інструмент від HashiCorp для опису хмарної інфраструктури кодом.

Файли у `terraform/`:

| Файл                       | Що робить                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| `main.tf`                  | Описує ресурси: 2 Fly.io додатки (staging + production) з машинами |
| `variables.tf`             | Вхідні змінні: API-токен, регіон, імена додатків, Docker-образ     |
| `outputs.tf`               | Виходи: URL-и staging і production                                 |
| `terraform.tfvars.example` | Приклад заповнення змінних                                         |

**Як використати:**

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars  # заповнити реальні значення
terraform init    # завантажити провайдер Fly.io
terraform plan    # показати що буде створено (без змін)
terraform apply   # створити/оновити інфраструктуру
```

---

### 🔹 4. Логування та моніторинг

---

**Логування — Pino:**

**Що таке Pino?**
Швидкий структурований логер для Node.js. Замість `console.log("щось сталось")` пишемо `logger.info("щось сталось")` — і отримуємо JSON-лог з часом, рівнем, та іншими метаданими.

**Файл:** `src/lib/logger.ts`

**У development** (красивий вивід через pino-pretty):

```
[13:12:08] INFO: Healthcheck requested
```

**У production** (JSON для парсингу системами моніторингу):

```json
{
  "level": 30,
  "time": 1775732497492,
  "pid": 100,
  "msg": "Healthcheck requested"
}
```

**Де використовується:** В `src/app/api/healthcheck/route.ts` — логує кожен запит на healthcheck.

---

**Моніторинг помилок — Sentry:**

**Що таке Sentry?**
Сервіс, який автоматично збирає помилки з додатку. Якщо у користувача щось впало — ти отримаєш повідомлення з повним стектрейсом, URL, браузером, і т.д.

**Файли:**

- `instrumentation-client.ts` — ініціалізація Sentry для клієнта (браузер)
- `src/instrumentation.ts` — ініціалізація Sentry для сервера (Node.js)
- `next.config.js` — інтеграція Sentry з Next.js через `withSentryConfig`

**Як перевірити:**

1. Відкрити https://pdp-news-prod.fly.dev/api/sentry-test — відправить тестову помилку
2. Зайти в Sentry dashboard → побачити "Sentry test error from PDP News"

---

**Prometheus метрики:**

**Що таке Prometheus?**
Система моніторингу, яка збирає числові метрики з додатків. Наприклад: скільки запитів за хвилину, час відповіді, використання CPU/пам'яті.

**Файли:**

- `src/lib/metrics.ts` — оголошує метрики:
  - `http_request_duration_seconds` — гістограма тривалості запитів
  - `http_requests_total` — лічильник кількості запитів
  - Плюс дефолтні метрики Node.js (CPU, пам'ять, event loop)
- `src/app/api/metrics/route.ts` — ендпоінт `/api/metrics` у форматі Prometheus

**Як перевірити:**

- Відкрити https://pdp-news-prod.fly.dev/api/metrics — побачиш метрики у текстовому форматі:

```
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 0.066
...
```

---

### 🔹 5. Нотифікації про статус CI/CD

**Що зроблено:**
Telegram-бот автоматично надсилає повідомлення після кожного CI або Deploy.

**Файл:** `.github/workflows/notify.yml`

**Як це працює:**

```
CI або Deploy завершується (успіх або помилка)
         │
         ▼
GitHub запускає workflow "Notify" (тригер: workflow_run)
         │
         ▼
Використовує appleboy/telegram-action
         │
         ▼
Надсилає повідомлення у Telegram з:
  - Назва workflow (CI / Deploy)
  - Статус (✅ Success / ❌ Failed)
  - Репозиторій, гілка, коміт, автор
  - Посилання на запуск
```

**Приклад повідомлення:**

```
CI — ✅ Success

📦 Repo: Dream2140/pdp
🌿 Branch: main
💬 Commit: feat: add Prometheus metrics
👤 Author: hlib.antonenko

View Run (посилання)
```

**Секрети в GitHub:**

- `TELEGRAM_BOT_TOKEN` — токен бота від @BotFather
- `TELEGRAM_CHAT_ID` — ID чату куди слати повідомлення

---

## Загальна схема CI/CD пайплайну

```
Розробник робить git push
         │
         ▼
┌─────────────────────────────────────────┐
│           GitHub Actions: CI            │
│                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ Lint │  │ Test │  │ E2E  │  (паралельно)
│  └──┬───┘  └──┬───┘  └──┬───┘          │
│     └─────────┼─────────┘               │
│               ▼                         │
│  ┌────────────────────────┐             │
│  │ Docker build + push    │             │
│  │ (GHCR, тільки main)   │             │
│  └────────────────────────┘             │
└─────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌────────────────┐
│  Deploy to      │  │  Telegram      │
│  Fly.io         │  │  notification  │
│                 │  │  ✅ або ❌     │
│  develop→staging│  └────────────────┘
│  main→production│
│                 │
│  Якщо впав:     │
│  → rollback     │
└─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│          Production додаток             │
│                                         │
│  Pino логи → структуровані JSON логи    │
│  Sentry   → збір помилок               │
│  /metrics → Prometheus метрики          │
└─────────────────────────────────────────┘
```

---

## Використані інструменти — підсумок

| Інструмент         | Для чого                        | Де налаштовано                                  |
| ------------------ | ------------------------------- | ----------------------------------------------- |
| **Next.js**        | React-фреймворк для веб-додатку | `src/app/`                                      |
| **Tailwind CSS**   | Стилізація UI                   | `tailwind.config.ts`                            |
| **Jest**           | Юніт-тести                      | `jest.config.js`, `src/__tests__/`              |
| **Playwright**     | E2E тести у браузері            | `playwright.config.ts`, `e2e/`                  |
| **ESLint**         | Перевірка якості коду           | `.eslintrc.json`                                |
| **Prettier**       | Форматування коду               | `.prettierrc`                                   |
| **GitHub Actions** | CI/CD пайплайн                  | `.github/workflows/`                            |
| **Docker**         | Контейнеризація                 | `Dockerfile`                                    |
| **Docker Compose** | Оркестрація контейнерів         | `docker-compose.yml`, `docker-compose.prod.yml` |
| **GHCR**           | Сховище Docker-образів          | CI workflow                                     |
| **Fly.io**         | Хмарний хостинг                 | `fly.*.toml`                                    |
| **Terraform**      | Infrastructure as Code          | `terraform/`                                    |
| **Pino**           | Структуроване логування         | `src/lib/logger.ts`                             |
| **Sentry**         | Моніторинг помилок              | `instrumentation*.ts`                           |
| **Prometheus**     | Збір метрик                     | `src/lib/metrics.ts`                            |
| **Telegram Bot**   | Нотифікації CI/CD               | `notify.yml`                                    |

---

## Корисні команди

```bash
# Розробка
npm run dev              # Запустити dev-сервер (http://localhost:3000)
npm run build            # Зібрати production-білд
npm start                # Запустити production-сервер

# Тестування
npm test                 # Юніт-тести (Jest)
npm run test:e2e         # E2E тести (Playwright)

# Перевірка коду
npm run lint             # ESLint
npm run format           # Prettier (перевірка)
npm run format:fix       # Prettier (автовиправлення)

# Docker
docker compose up        # Запустити локально (app + PostgreSQL)
docker compose -f docker-compose.prod.yml up  # Production-стек

# Fly.io
fly deploy --config fly.production.toml   # Деплой на production
fly deploy --config fly.staging.toml      # Деплой на staging
fly status --app pdp-news-prod            # Статус production
fly logs --app pdp-news-prod              # Логи production

# Terraform
cd terraform && terraform init && terraform plan  # Перевірити зміни
cd terraform && terraform apply                   # Застосувати зміни
```
