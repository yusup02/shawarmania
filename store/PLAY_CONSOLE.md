# Как выложить «Шаурманию» в Google Play

Порядок такой: подготовка на GitHub (10 минут) → создание приложения в Play Console (около часа анкет) →
закрытый тест на 14 дней → заявка на публикацию → выход в магазин.

---

## Шаг 0. Подготовка на GitHub

### 0.1. Добавь ключ подписи в секреты

Без подписи Google не примет файл AAB. Значения лежат в файле `shawarmania-signing-SECRET.txt`, который тебе прислал Claude.

1. Открой https://github.com/yusup02/shawarmania/settings/secrets/actions
2. **New repository secret** → Name: `ANDROID_KEYSTORE_PASSWORD`, Secret: пароль из файла → **Add secret**.
3. Ещё раз **New repository secret** → Name: `ANDROID_KEYSTORE_BASE64`, Secret: длинная строка из файла целиком → **Add secret**.
4. Запусти сборку заново: https://github.com/yusup02/shawarmania/actions/workflows/android.yml → **Run workflow** → **Run workflow**.
5. Через 5–10 минут открой эту сборку. В сводке должно быть **AAB signed**. Если написано **AAB not signed**, проверь названия секретов.

> Файл `shawarmania-upload.jks` и пароль храни в двух местах (например, облако и флешка). Если ключ потеряется,
> его можно сбросить через поддержку Google Play, но это занимает время.

### 0.2. Включи страницу с политикой конфиденциальности

1. Открой https://github.com/yusup02/shawarmania/settings/pages
2. **Source**: Deploy from a branch. **Branch**: `main`, папка `/docs` → **Save**.
3. Через пару минут страница откроется по адресу https://yusup02.github.io/shawarmania/privacy/

### 0.3. Где брать файлы

- **AAB для Google Play**: https://github.com/yusup02/shawarmania/releases/latest — файл `shawarmania-1.0.N.aab` (скачивай с компьютера).
- **Картинки и тексты**: папка [`store/`](./) в репозитории.
  - `icon-512.png` — иконка 512×512;
  - `feature-graphic-1024x500.png` — баннер;
  - `screenshots/en/` и `screenshots/ru/` — по 5 скриншотов 1080×1920;
  - [`listing.md`](listing.md) — названия и описания на 7 языках.

---

## Шаг 1. Создай приложение

https://play.google.com/console → **Create app** (Создать приложение).

| Поле | Что указать |
|---|---|
| App name | `Shawarmania: Idle Food Tycoon` |
| Default language | English (United States) – en-US |
| App or game | Game |
| Free or paid | Free |
| Declarations | Отметь обе галочки (правила и экспортные законы США) |

Если Play Console попросит подтвердить доступ к Android-устройству, установи на телефон приложение **Google Play Console** и войди в тот же аккаунт.

---

## Шаг 2. Анкеты на главной странице приложения

На Dashboard есть раздел **Set up your app**. Пройди все пункты.

### App access (доступ к приложению)
**All functionality in my app is available without any access restrictions.**

### Ads (реклама)
**No, my app does not contain ads.** Когда добавим рекламу, этот ответ поменяем.

### Content rating (возрастной рейтинг)
- Email: твой рабочий email. Category: **Game**.
- На все вопросы про насилие, страх, сексуальный контент, ругательства, наркотики, алкоголь, табак, азартные игры: **No**.
- Пользователи общаются друг с другом / делятся местоположением / цифровые покупки: **No**.
- Ожидаемый результат: самый низкий рейтинг (Everyone / PEGI 3 / 0+).

### Target audience and content (целевая аудитория)
- Возраст: **13–15, 16–17, 18 and over**. Возрастные группы до 13 лет не отмечай: так позже можно будет подключить обычную рекламу без особых правил для детских приложений.
- «Может ли приложение непреднамеренно привлечь детей»: отвечай честно. Стиль игры мультяшный, но не малышовый.

### News apps
**No.**

### Data safety (безопасность данных)
- «Does your app collect or share any of the required user data types?» → **No**.
- В итоге на странице будет: «No data collected», «No data shared».

### Advertising ID
**No**, приложение не использует рекламный идентификатор.

### Government apps / Financial features / Health
**No** / **My app doesn't provide any financial features** / **My app does not have any health features**.

### Privacy policy
`https://yusup02.github.io/shawarmania/privacy/`

### App category и контакты (Store settings)
- Category: **Games → Simulation**.
- Tags: Idle, Tycoon, Cooking, Simulation, Casual (что предложит Play Console).
- Email: обязательный и публичный, его увидят игроки. Можно завести отдельный ящик для игры.
- Website (необязательно): `https://github.com/yusup02/shawarmania`

---

## Шаг 3. Страница в магазине (Main store listing)

**Grow → Store presence → Main store listing**

- App name, Short description, Full description: из [`listing.md`](listing.md), раздел English.
- App icon: `store/icon-512.png`
- Feature graphic: `store/feature-graphic-1024x500.png`
- Phone screenshots: 5 файлов из `store/screenshots/en/`
- Планшетные скриншоты необязательны.

Переводы: **Manage translations → Add your own translations** → выбери ru-RU, es-419, pt-BR, de-DE, fr-FR, tr-TR
и вставь тексты из `listing.md`. Для русского загрузи скриншоты из `store/screenshots/ru/`.
Для остальных языков Google покажет английские скриншоты.

---

## Шаг 4. Закрытый тест (12 тестеров, 14 дней)

**Test and release → Testing → Closed testing** → трек **Alpha** → **Manage track**.

1. **Countries / regions**: Add countries → выбери все.
2. **Testers**: Create email list → добавь Gmail-адреса тестеров (минимум 12, лучше 15–20 с запасом). Укажи **Feedback URL or email**.
3. **Create new release**:
   - App integrity: оставь **Google-generated key** (Play App Signing). Google хранит главный ключ, наш ключ только для загрузки.
   - App bundles: загрузи `shawarmania-1.0.N.aab`.
   - Release notes: «First test version» / «Первая тестовая версия».
   - **Next → Save**.
4. **Publishing overview → Send changes for review**. Проверка обычно занимает от нескольких часов до пары дней.
5. После одобрения на странице трека появится ссылка **Join on the web**. Отправь её тестерам: они нажимают «Стать тестировщиком» и ставят игру из Google Play.

Правила:
- минимум 12 тестеров должны оставаться в тесте **14 дней подряд**; кто вышел и вернулся, начинает отсчёт заново;
- тестерам лучше иногда открывать игру и писать отзывы: при заявке Google спрашивает, как прошёл тест;
- выпускай обновления во время теста (новая сборка = новый AAB): это показывает, что приложение развивается.

Где найти тестеров без знакомых: обмен тестированием в Telegram-группах и на Reddit (r/AndroidClosedTesting, r/TestersCommunity).
Ты ставишь чужие приложения, они ставят твоё. Готовый текст объявления ниже.

> **RU:** Ищу тестеров для закрытого теста Google Play. Игра «Шаурмания» — idle-тайкун про шаурмечную, без рекламы и регистрации.
> Нужно установить по ссылке и не выходить из теста 14 дней. Взамен протестирую ваше приложение — пишите ссылку.
>
> **EN:** Looking for testers for a Google Play closed test. Shawarmania is an idle food tycoon with no ads and no sign-up.
> Join via the link and stay opted in for 14 days. I’ll test your app in return, just send me your link.

---

## Шаг 5. Заявка на публикацию

Через 14 дней на Dashboard станет доступна кнопка **Apply for production**. Ответь на вопросы:
- как набирал тестеров (обмен тестированием, знакомые);
- какие отзывы получил и что исправил (опиши реальные изменения из обновлений);
- почему считаешь приложение готовым.

Проверка заявки обычно занимает до 7 дней. После одобрения:
**Test and release → Production → Create new release** → загрузи свежий AAB → **Send for review**.

---

## Обновления после выхода

1. Claude вносит изменения и загружает их в репозиторий.
2. GitHub собирает новую версию: номер версии растёт сам.
3. Ты скачиваешь новый AAB из Releases и загружаешь его в нужный трек Play Console.
