# landing-keepsake-vite

Лендінг дизайн-агенції Keepsake з ЛР7, переписаний на Pug і SCSS зі збіркою через Vite. Макет, кольори, брейкпоінти й поведінка сторінки ті самі, змінився тільки спосіб розробки.

**Демо:** https://eduard-korposh.github.io/landing-keepsake-vite/

## Запуск

Потрібні Node.js 20.19 або новіший (LTS) і npm.

```bash
npm install
npm run dev
```

| Команда           | Що робить                                                              |
| ----------------- | ---------------------------------------------------------------------- |
| `npm run dev`     | dev-сервер Vite з автоперезавантаженням                                |
| `npm run build`   | продакшн-збірка в `dist/`                                              |
| `npm run preview` | локальний перегляд зібраного `dist/`                                   |
| `npm run format`  | форматування всього проєкту через Prettier                             |
| `npm run lint`    | перевірка стилів Stylelint і форматування Prettier                     |
| `npm run images`  | генерація AVIF, WebP і JPEG/PNG з `images-src/` у `src/assets/images/` |

## Структура

```
landing-keepsake-vite/
├── .github/workflows/deploy.yml   # збірка й публікація на GitHub Pages
├── .husky/pre-commit              # запускає lint-staged перед комітом
├── images-src/                    # вихідні зображення для npm run images
├── scripts/images.js              # конвертація зображень через sharp
├── src/
│   ├── assets/images/             # готові зображення в кількох форматах і ширинах
│   ├── components/                # header, mobile-menu, footer, newsletter, back-to-top
│   │   └── sections/              # секції лендінгу
│   ├── data/                      # дані секцій (масиви об'єктів)
│   ├── includes/                  # meta-теги, шрифти, SVG-іконки (icons/)
│   ├── layouts/main.pug           # базовий макет
│   ├── mixins/                    # Pug-міксини
│   ├── pages/index.pug            # сторінка
│   └── styles/
│       ├── abstracts/             # змінні, map-и, функції, міксини
│       ├── base/                  # reset, custom properties, глобальні стилі
│       ├── layout/                # контейнер, секція, шапка, футер
│       ├── components/            # один БЕМ-блок — один файл
│       └── main.scss              # точка входу
├── .browserslistrc
├── .prettierrc / .prettierignore
├── .stylelintrc.json
├── postcss.config.js
└── vite.config.js
```

### Pug

`layouts/main.pug` задає каркас сторінки з блоками `meta`, `title`, `styles`, `content`, `scripts` і підключає дані, міксини, шапку, мобільне меню та футер. `pages/index.pug` наслідує макет через `extends`, дописує meta-теги через `append meta`, шрифти через `prepend styles` і збирає секції з окремих файлів через `include`.

Усе, що повторюється (меню, категорії фільтра, роботи, послуги, статистика, логотипи клієнтів, записи журналу, колонки футера, соцмережі), лежить у `src/data/` і виводиться через `each`. Міксини: `+btn` (посилання або кнопка з модифікаторами, приймає вкладений вміст і атрибути), `+icon` (вибір SVG через `case`), `+picture` (адаптивне зображення), `+work-card`, `+socials`, `+logo`.

### SCSS

Модулі підключаються тільки через `@use` / `@forward`, у кожній папці є `_index.scss`. Дизайн-токени зібрані в map-и в `abstracts/_variables.scss`: кольори через `@each` перетворюються на custom properties у `:root`, а токени, що змінюються на брейкпоінтах, генеруються окремо для кожного медіазапиту. Медіазапити пишуться тільки через `@include mq(md)` / `mq(lg)` (mobile first, `min-width` з map-а `$breakpoints`). Розміри шрифтів переводяться в rem функцією `rem()`.

Класи названі за БЕМ, елементи й модифікатори пишуться через `&__` і `&--`, вкладеність не глибше трьох рівнів.

## Інструменти

- **Vite** — dev-сервер і збірка; сам компілює SCSS, запускає PostCSS, мініфікує CSS і додає хеші до імен файлів.
- **vituum + @vituum/vite-plugin-pug** — перетворення Pug-шаблонів на HTML всередині Vite.
- **Sass** — препроцесор для SCSS.
- **PostCSS + Autoprefixer** — вендорні префікси під список браузерів з `.browserslistrc`.
- **sharp** — генерація AVIF, WebP і запасних JPEG/PNG у кількох ширинах.
- **Prettier + @prettier/plugin-pug** — єдине форматування Pug, SCSS, JS, JSON і Markdown.
- **Stylelint + stylelint-config-standard-scss** — перевірка SCSS, правило класів змінене під БЕМ.
- **husky + lint-staged** — перед комітом перевіряють і форматують тільки змінені файли.
- **GitHub Actions** — збирає проєкт і публікує `dist` на GitHub Pages.

## Браузери

```
last 2 Chrome versions
last 2 Firefox versions
last 2 Edge versions
last 2 Safari versions
last 2 iOS versions
```

Для цього списку Autoprefixer додає `-webkit-text-size-adjust` і `-webkit-user-select`.

## Розміри до і після

CSS:

| Що                                    | Розмір  |
| ------------------------------------- | ------- |
| ЛР7: `reset.css` + `style.css`        | 27,8 КБ |
| Скомпільований SCSS без мініфікації   | 28,7 КБ |
| Після `npm run build` (мініфікований) | 23,8 КБ |
| Те саме з gzip                        | 4,7 КБ  |

Зображення (усі 19 картинок, найбільша ширина):

| Формат             | Розмір   |
| ------------------ | -------- |
| ЛР7, WebP          | 64,9 КБ  |
| AVIF               | 48,8 КБ  |
| WebP               | 58,3 КБ  |
| JPEG/PNG (запасні) | 107,2 КБ |

На телефоні з звичайним екраном браузер бере менші ширини, тоді всі AVIF важать 26,5 КБ. Вихідні картинки з ЛР7 і так були в WebP, тому виграш помірний.
