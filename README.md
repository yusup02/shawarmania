# Шаурмания / Shawarmania

Idle-тайкун про шаурмечную для Android (Capacitor + HTML5).

## Как устроено

- `game/` — исходники игры. `python3 game/build_app.py` собирает из них `www/index.html`.
- `www/` — готовая игра, которая попадает в приложение.
- `android/` — Android-проект (пакет `com.yusup02.shawarmania`).
- `store/` — материалы для страницы в Google Play.
- `.github/workflows/android.yml` — автосборка.

## Сборка

Каждая загрузка в ветку `main` запускает сборку на GitHub (вкладка **Actions**).
Через 5–10 минут в разделе **Artifacts** появятся:

- `shawarmania-apk-…` — APK для установки на телефон;
- `shawarmania-aab-…` — AAB для загрузки в Google Play.

AAB подписывается ключом загрузки, если в настройках репозитория заданы секреты
`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
Сам файл ключа в репозиторий не кладётся.

## Баланс

`node game/sim.js` прогоняет бота по всем точкам и показывает, сколько времени занимает каждая.
