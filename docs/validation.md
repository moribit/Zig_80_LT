# 検証記録

2026-10-28 / macOS arm64 / Node 24.19.0 / Slidev 53.0.0 / Chrome 156.0.8078.48。
発表用の静的HTMLを1920×1080のヘッドレスChromeで検証。

## 成功

- TypeScript/Vue型検査、本編と別デッキのproduction build。
- slidev exportによる4ページPDF、全4枚PNG。PDFをPopplerで画像化し全ページを目視確認。
- 本編全ページのブラウザ画像、コード・動画の大きさ、折返し、余白、接続図を目視確認。
- 初回読み込みから外部HTTPをブロック。CDNのfavicon参照をローカル化し、外部リクエスト0件、HTTPエラー0件、pageerror 0件。
- SlidevVideoのautoplay=false、controls=true、初期停止。Chrome標準コントロールへのポインター操作で再生/一時停止。
- 素材を読み込み後、Playwright context.setOffline(true)でMP4の再生・停止・シーク。
- ページ離脱時の動画停止。MP4のRangeリクエスト206と100バイト応答。
- ポータブル配布物生成。dist、バックアップPDF、独立MP4、Node標準ライブラリのサーバー、起動説明、フォントライセンスを同梱。
- npm audit: 0件。dompurifyとimage-sizeに修正版overrideを指定しlockfileへ固定。

## 制約・未完了

- OSのWi-Fi/有線を切った試験は未実施。外部通信遮断とブラウザoffline試験をOSネットワーク断と同一視しない。
- 本番PC・会場の投影機器・音声系統は未確認。READMEのリハーサル手順で実施する。
- 写真とGemmaの実機MP4は未提供。現在の合成MP4は再生機構の確認専用。本編に配置していない。
- PDFエクスポート用devサーバーで依存TwoSlashのFloatingVueパッチ警告を出す場合がある。終了コード0でPDF/PNGは生成され、全ページを視覚確認済み。本番静的HTMLではpageerror 0件。
- 新UIの実機確認範囲はdocs/facts.md参照。後半は未制作。

再現時の機械的証跡はartifacts/verification.json、全ページ画像はartifacts/browser/、一覧はartifacts/contact-sheet.html。
