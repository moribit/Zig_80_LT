# Zig_80 PC-8001 LT

「47年前のPCでローカルLLMクライアントを動かしてみた」の独立したSlidevプロジェクト。
本編は4枚のプロトタイプのみ。完成チャット画面・Gemma実機動画は後半まで公開しない。

## 開発と出力

Node.js 22以上、npm、Chrome/Chromiumを使用。依存はpackage-lock.jsonで固定。

```sh
npm ci
npx playwright install chromium
npm run dev
npm run typecheck
npm run build
npm run preview
npm run export
npm run thumbnails
npm run build:qa
npm run preview:qa
npm run verify
npm run package
```

- `slides.md`: 本編4枚。ノートは各ページ末尾のHTMLコメント。
- `outline.md`: 物語の構成と未制作の後半。Slidevにインポートしない。
- `styles/theme.css`: 1100×618.75の16:9。本文26px、見出し42px、タイトル53px。色・余白を集約。
- `layouts/code-focus.vue`: header/default/codeスロット。実コードは8〜14行程度を20px以上で表示。抜粋元・コミット・行範囲をノートへ記録。
- `layouts/video-focus.vue`: 390px高の動画を中心に表示。
- `components/HardwareTopology.vue`: 編集可能な論理図。物理配線図と混同しない。
- `media-check.md`: 本編と分離した動画・コードの検証デッキ。Gemma映像は含まない。
- `docs/facts.md`: 参照コミット、出典、実機確認範囲。

## 画像・図・ノート

実機写真は`public/photos/`、図の元データは`public/diagrams/`、動画は`public/videos/`。
ファイル名は英小文字とハイフン。由来・撮影日・権利・用途を`docs/assets.md`へ追記する。
写真はobject-fit:containを基本とし、実機の情報を切り落とさない。横4:3の写真領域を2枚目に確保。
CRT演出は`.crt`を付けた小領域だけ。本文・写真・動画には適用せず、点滅や揺れは使わない。
発表ノートは進行と出典を記載し、公開HTMLは`--without-notes`で除去する。
フォントはnpm同梱のNoto Sans JPとIBM Plex Mono。CDN参照なし。ライセンスは依存パッケージ内にあり、配布時はscripts/package.mjsで同梱する。

## 動画とオフライン発表

ローカルMP4 H.264 / yuv420p、音声が必要ならAAC。自動再生に依存しない。
`SlidevVideo controls :autoplay="false"`を使い、手動で再生・一時停止。離席時の停止も確認する。
PDFにはポスターを出し、動画名を明示する。PDF自体では動画を再生できないため独立MP4を配布する。
検証用playback-check.mp4は移動パターンのみの合成素材。実機映像ではない。
本番映像を提供後、終盤の動画スライドにだけ追加し、実際のファイルで全検証をやり直す。

`dist/`は静的HTML一式。単一HTMLファイルではない。インターネット接続は不要だがローカルWebサーバーを使う。
`file://`でindex.htmlを直接開かない。別PCへはポータブル配布物を丸ごとコピーする。
Nodeを事前に入れ、`node serve.mjs dist 4173`で起動。Pythonがある場合は`python3 -m http.server 4173 --directory dist`も利用可能。
本番は現行Chrome、投影先1920×1080、ブラウザ全画面を基本。発表者画面は`/presenter/1`。
PDFを別途開いておく。PPTXでは再生可能な動画が保持されない前提で、本番形式にしない。
PWAは現段階では不要。静的ローカルサーバーでオフライン動作させる（サービスワーカーのキャッシュに依存しない）。

## 視覚レビューと再現手順

1. build/export/thumbnailsを実行。本編が4枚、PDFが4ページ、PNGが4枚であることを確認。
2. previewとpreview:qaを起動しverifyを実行。外部通信を遮断し、初回読み込み・全ページ遷移・動画の再生/停止とHTTP範囲取得を検証。
3. `artifacts/browser/`の本編全4枚を原寸表示し、折返し、欠け、余白、色、図のラベルを確認。`artifacts/contact-sheet.html`は一覧用。
4. PDFをレンダリングして全ページを目視比較。変更後は生成し直す。
5. 本番PCでWi-Fiと有線を切り、localhostサーバーを起動。キャッシュなしで全ページ移動、動画の手動再生・停止・シーク、フルスクリーン、PDF代替を実施。
6. 実機素材に差し替えたら再検証し、`docs/validation.md`へ環境・日付・結果を記録する。

Playwrightの検証は外部リクエストを遮断した状態とブラウザoffline状態（読み込み済み素材）の両方を確認する。
OSネットワーク断や会場プロジェクターの検証を代替したとは扱わない。

## 配布

`npm run package`でbuild・PDF出力後、`artifacts/zig80-lt-portable.tar.gz`へ`dist/`、PDF、独立MP4、起動スクリプト・手順を同梱。
開発用ソースはこのリポジトリを配布。`node_modules/`やZig_80本体は同梱しない。
