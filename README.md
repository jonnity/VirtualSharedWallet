# WaWarikan

## 概要
使用金額を入力していくことで，仮想的な共同財布を実現して，楽にトータルの割り勘ができるようにするサービス

## 実行方法
1. /wa-warikan/vue_content> npm run build
2. /wa-warikan> npm start

## ファイル構成
```
wa-warikan/
    ├ doc/
    ├ server.js（Expressサーバの本体）
    ├ node_modules/
    ├ //routes
    └ vue_content/（フロントエンド）
        ├ dist/（ビルド結果：expressで静的ページとして返す）
        ├ node_modules/
        ├ public/
        └ src/
```