# Tanya Kovaleva — Portfolio (Dragon Dreams Digital)

Статичный сайт-портфолио: один файл `index.html` + папка `assets/`.
Без сборки, без зависимостей, без бэкенда — работает на любом хостинге.

## Структура

```
index.html      — весь сайт (HTML + CSS + JS, переводы EN/RU/ES внутри)
assets/         — картинки и видео работ (~22 МБ)
favicon.svg     — иконка
robots.txt      — для поисковиков
sitemap.xml     — карта сайта
404.html        — редирект на главную
.nojekyll       — нужен для GitHub Pages
```

## Как выложить

### Вариант 1 — GitHub Pages (бесплатно)
1. Создайте репозиторий на GitHub (например `portfolio`).
2. Загрузите в него всё содержимое этой папки (можно перетащить файлы в браузере через **Add file → Upload files**, или через git — см. ниже).
3. В репозитории: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. Через 1–2 минуты сайт будет доступен по адресу `https://<ваш-логин>.github.io/portfolio/`.
5. Чтобы подключить свой домен (dragondreams.digital): в тех же настройках Pages впишите домен в **Custom domain**, а у регистратора домена добавьте записи:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` для `www` → `<ваш-логин>.github.io`

Через git:
```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/<ваш-логин>/portfolio.git
git push -u origin main
```

### Вариант 2 — Netlify / Vercel / Cloudflare Pages
Перетащите папку целиком в интерфейс (Netlify Drop: https://app.netlify.com/drop) — сайт поднимется сразу. Или подключите GitHub-репозиторий: Build command — пусто, Publish directory — `/` (корень).

### Вариант 3 — обычный хостинг (FTP, cPanel, reg.ru, hostinger и т. п.)
Скопируйте все файлы в корневую папку сайта (`public_html`, `www` или `htdocs`). Всё.

## Форма обратной связи
Форма отправляется через FormSubmit на `dragondreams.digital@gmail.com`.
**После первой отправки** на эту почту придёт письмо от FormSubmit с кнопкой подтверждения — нажмите её один раз, дальше все заявки будут приходить автоматически.
Чтобы сменить почту — замените адрес в `index.html` в строке `action="https://formsubmit.co/..."`.

## Как редактировать
- **Добавить/убрать работу** — в `index.html` найдите блок `<!-- WORK -->`, каждая работа — это `<a class="work ...">…</a>`. Классы `w4 / w6 / w8 / w12` — ширина плитки (из 12 колонок), `tall` — вертикальная, `wide` — 16:9.
- **Тексты и переводы** — английский текст в HTML, русский и испанский — в объекте `I18N` внизу файла (ключ `ru` и `es`).
- **Подписи к работам** на RU/ES — в `I18N.ru.cap` и `I18N.es.cap`: ключ — английская подпись, значение — перевод.
- **Видео**: лучше класть mp4 (H.264), вертикальные — 720×1280, горизонтальные — 1280×720, 1–3 МБ.

## Домен
Сейчас в мета-тегах (`canonical`, `og:url`, `sitemap.xml`, `robots.txt`) прописан `https://dragondreams.digital/`. Если сайт будет на другом адресе — замените его в этих местах.
