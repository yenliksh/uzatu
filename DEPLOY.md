# Публикация на Netlify и хранение данных в Supabase

Сайт работает на Netlify, ответы гостей сохраняются в базе Supabase. Админка на том же сайте загружает данные через пароль.

---

## 1. Supabase (база данных)

1. Зайдите на [supabase.com](https://supabase.com), зарегистрируйтесь или войдите.
2. Создайте новый проект (Organization → New project). Запомните пароль от БД.
3. В левом меню: **SQL Editor** → New query. Выполните запрос:

```sql
create table if not exists rsvp (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  will_attend boolean not null,
  guest_count int not null default 1,
  message text,
  created_at timestamptz default now()
);
```

4. **Settings** → **API**:
   - **Project URL** — скопируйте (это `SUPABASE_URL`).
   - **Project API keys** → **service_role** (Secret) — скопируйте (это `SUPABASE_SERVICE_KEY`). Не показывайте этот ключ публично.

---

## 2. Netlify

1. Залейте код в GitHub (или GitLab/Bitbucket). В репозитории должна быть папка **client** с фронтом и папкой **netlify/functions**.
2. Зайдите на [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project** → выберите репозиторий.
3. Настройки сборки:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist` (или просто `dist`, если base directory уже `client`)

   Если **Base directory** = `client`, то Publish directory укажите **dist**.

4. **Site configuration** → **Environment variables** → **Add variable** / **Add env vars** → **Edit**. Добавьте:

   | Имя                    | Значение                                                  |
   | ---------------------- | --------------------------------------------------------- |
   | `SUPABASE_URL`         | ваш Project URL из Supabase                               |
   | `SUPABASE_SERVICE_KEY` | ваш service_role ключ из Supabase                         |
   | `ADMIN_PASSWORD`       | пароль для входа в админку (например `Yenlikwedding2026`) |

5. **Deploy site**. После деплоя форма будет отправлять данные в Supabase, админка `/admin` будет загружать их по паролю.

---

## 3. Где смотреть ответы

- **В админке сайта:** откройте `https://ваш-сайт.netlify.app/admin`, введите пароль из `ADMIN_PASSWORD`.
- **В Supabase:** **Table Editor** → таблица **rsvp** — там все строки с ответами.

---

## 4. Локальная разработка

- **Фронт:** в папке `client`: `npm run dev`. Форма стучится на `/api/rsvp` (прокси на `localhost:3001`).
- **Бэкенд локально:** в папке `server`: `npm run dev` — данные пишутся в `server/rsvp-data.json`.

Чтобы локально тестировать с Supabase, в `client` можно временно поменять запросы на `/.netlify/functions/rsvp` и задать переменные окружения (например через `.env` и `vite`), но проще проверять уже на Netlify после деплоя.
