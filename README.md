# Настройка и установка проекта

- Склонировать репозиторий с помощью команды:
  `git clone https://github.com/Mowgle88/WhatsAppClone.git`
- После клонирования проекта в папке проекта в терминале запустить команду:
  `npm install`.
- Затем, чтобы найти импортированные SVG-файлы, запустить команду:
  `yarn react-native-vector-image generate`.
- Затем команду:
  `cd ios && pod install && cd ..` или `npx pod-install`
- Настройте Firebase с учетными данными Android и IOS:
  [React Native Firebase](https://rnfirebase.io/)
- Произвести необходимые настройки для подключения пуш уыедомлений:
  [Cloud Messaging](https://rnfirebase.io/messaging/usage)
- Добавить файл .env, в котором добавить переменные FIREBASE_API_KEY и CLOUD_MESSAGING_SERVER_KEY
- Запустить проект на ANDROID: `npx react-native run-android`
- Запустить проект на IOS: `npx react-native run-ios`
