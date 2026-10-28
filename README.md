# Zig_80 PC-8001 LT

**47年前のPCでローカルLLMクライアントを動かしてみた**

Webエンジニア向けに、Zig_80によるPC-8001実機開発を説明する本編24枚＋Appendix17枚（全41枚）のSlidevプレゼンテーション。
当時のN-BASIC・カセット保存から、転送・デプロイ、実機成果、LLMクライアントへ進む。通信障害の詳細はAppendix。
スライドは仕様・処理・条件・結果を提示し、開発経緯は発表者ノートで補足する。
完成したGemmaチャット画面・映像・サムネイルを見せる場所は22枚目のみ。
実機写真・動画は未提供のため明示プレースホルダーを置いている。

## 開発と検証

Node.js **22.12以上**、npm、現行Chrome/Chromiumを使用。依存はpackage-lock.jsonで固定。
実機への送信操作やOllamaの起動はスライド制作には不要。

```sh
npm ci
# Chromeがなければ事前に実行
npx playwright install chromium
npm run typecheck
npm run check:content
npm run dev
```

開発サーバーの `/presenter/1` では原稿のノートを参照できる。
CHROME_PATHでブラウザ実行パスを指定可能。macOSではインストール済みChromeを優先する。

```sh
npm run build
npm run export
npm run thumbnails
npm run build:qa
npm run verify
npm run preview
npm run package
```

verifyは専用のローカルサーバーを空きポートで一時起動して終了時に閉じる。previewの事前起動は不要。
packageはbuild/exportを再実行し、生成フォルダーportable/を作り直す。
生成物はGitに入れない。ソースと小さい検証MP4だけを管理する。

## 構成

- `slides.md`: 本編24枚とAppendix17枚、全ページの5項目ノートと固定コミット出典。
- `outline.md`: 本編5章・Appendixと各ページの目的。Slidevには読み込まない。
- `docs/deck.json`: ページ数・章・タイトル・成果初出の検証用メタデータ。
- `styles/theme.css`: 1100×618.75、16:9。本文26px、見出し42px、タイトル53pxの白背景・黒文字のテーマ。
- `layouts/code-focus.vue`, `layouts/video-focus.vue`: コードと動画の既存レイアウト。
- `components/HardwareTopology.vue`: Mac→USB→Pico 2→S10→PCの論理図。物理配線図ではない。
- `components/FlowDiagram.vue`, `UartFrame.vue`, `MemoryBudget.vue`: 編集可能な技術図。
- `components/MediaAsset.vue` + `config/media.json`: 実機素材とページの対応。src=nullなら用途表示。
- `media-check.md`: 本編と分離した合成動画・コードの検証デッキ。Gemma実機映像を含めない。
- `docs/facts.md`: GitHub正本の確認、参照コミット、数字、実機とモデルの範囲。
- `docs/assets.md`: 必要素材、予定ファイル、差し替え手順。
- `docs/validation.md`: 実施結果と未検証部分。

## 素材・コード・ノート

実機写真はpublic/photos/、MP4はpublic/videos/、図の元データはpublic/diagrams/。
写真と動画はobject-fit:containで情報を切り落とさず表示する。撮影者・日付・公開許可・UI版を素材台帳へ記録。
実物に似せたAI生成画像や疑似チャットを、実機の証拠として使わない。

CRT演出は`.crt`を付けた小領域のみ。実機素材・本文には重ねず、点滅・揺れは使わない。
コードは20px以上、必要な命令だけを引用。今回のHELLOは40/80文字モードのセル間隔部分4行。
原文と注釈を区別し、抜粋元・コミット・範囲をノートへ記載する。
ノートには伝えること・前からのつながり・技術補足・次への導入・出典の5項目。
公開HTMLは--without-notesで除去。発表用にノートが必要ならソースでdevを起動する。
フォントはnpm同梱のNoto Sans JP / IBM Plex MonoでCDN不要。ライセンスを配布物に含める。
FloatingVueはTwoSlashが参照するOptions APIの内部構造との互換性を保つため5.2.2へ固定。console.errorを抑止する処理は入れず、全ページのconsole/pageerrorを検査する。

## 動画・PDF・オフライン

H.264 / yuv420pのローカルMP4、必要な音声はAAC。SlidevVideoのcontrolsを表示しautoplay=falseで手動再生・停止する。
提供後はconfig/media.jsonに実ファイルと印刷用posterを指定する。差し替えはdocs/assets.md参照。
PDFにはポスターと対応MP4名を表示する。未提供の予定MP4は実在する配布ファイルとして扱わない。
現在のplayback-check.mp4は合成テストであり、本編には配置しない。

`dist/`は静的HTML一式。単一HTMLではない。インターネットやCDNに依存しないが、**ローカルWebサーバーが必要**。
別PCではポータブル配布物を展開し、その中で次を実行する（Nodeは事前に用意）。

```sh
node serve.mjs dist 4173
```

Chromeで http://127.0.0.1:4173/1 を開く。file://で直接index.htmlを開かない。
Pythonを使う場合は `python3 -m http.server 4173 --directory dist` でも通常ページを表示可能（SPAの深いURLはNodeサーバーを推奨）。
本番は1920×1080・全画面表示。バックアップPDFも開いておく。
PWAは不要。ローカルサーバー方式でオフライン表示でき、サービスワーカーのキャッシュに依存しない。
PPTXで再生可能な動画が保持されない前提とし、本番形式には使わない。

## 視覚レビュー

1. build/export/thumbnailsを実行。PDF41ページ、PNG41枚を確認。
2. build:qa/verifyで全ページの1920×1080スクリーンショットを生成。
3. `artifacts/contact-sheet.html` または `artifacts/contact-sheet.png` で本編5章とAppendixの流れを見る。`chapter-1.png`〜`chapter-6.png`も生成。
4. `artifacts/browser/slide-N.png` を原寸で開き、全ページの折返し・余白・図・コード・素材領域を確認する。自動のはみ出し検査だけで見た目の合格としない。
5. Popplerのpdftoppmがあれば `npm run review:pdf` でPDF全ページを画像化しブラウザ画像と差分比較する。`artifacts/pdf-review/`を開き、文字・図・プレースホルダーを目視確認する。差分の小ささだけで見た目の合格とはしない。
6. 実機動画提供後は各実MP4で手動再生・停止・シーク、ページ離脱時の停止、PDFポスター、配布物内の独立MP4を再検証。
7. 本番PCでWi-Fiと有線を切り、キャッシュなしの読み込み・全ページ移動・全画面・実MP4再生・PDF代替をリハーサルする。

verifyは外部通信をブロックした初回表示と、context.setOffline(true)による読み込み済み合成動画の再生を確認する。
OSネットワーク断・会場機器・未提供の実機MP4を検証済みとは扱わない。`artifacts/verification.json`に区別して記録する。

## 配布物

- `artifacts/zig80-lt-source.tar.gz`: 開発ソース、全ノート、資料、検証スクリプト。
- `dist/`: 発表用静的HTML。ノートなし。
- `artifacts/zig80-lt.pdf`: 41ページのバックアップPDF。
- `artifacts/zig80-lt-portable.tar.gz`: dist、PDF、独立MP4（提供済みのみ）、media-index.json、起動手順・サーバー、ライセンス。

実機動画の対応はHELLO=14、ORBITAL=15、Gemma=22。未提供状態はmedia-index.jsonにavailable=falseとして残す。
GitHub正本: https://github.com/moribit/Zig_80 。この発表は独立リポジトリ https://github.com/moribit/Zig_80_LT で管理する。

## 本編終了と質疑

本編は24枚目のGitHubリンクで終了。通常の次ページ操作は24→25で停止する。
Appendixは24枚目の索引リンク、目次、またはURL `/25`〜`/41` で選ぶ。
発表者画面の次操作も同じ境界で停止する。PDF/サムネイルには全41枚を含む。
25:メモリ、26–28:接続、29–33:障害と通信試験、34–35:導入とプロトコル、
36–39:入力と描画、40:HTTP、41:実機記録。各ページの詳細はoutline.md。

BASICとカセットの説明は当時の手法を示す教材例で、今回の実機保存の記録ではない。
2KBはmemory profile v1の転送許可領域であり、PC本体のRAM容量やハード上限ではない。

導入は当時の編集・保存から、マニュアルでのシリアル発見、Mac/Pico接続へ進む。
5・7枚目は一文だけのメッセージ。manual（6）は資料写真、connection（8）は接続全景、wiring（26）は近接配線。
マニュアルの冊子/版/該当ページは素材提供時に確認する。
