# 全編スライド検証記録

実施日: 2026-10-28。macOS arm64、Node.js 24.19.0、npm、Slidev 53.0.0、Chrome 156.0.8078.48。
投影想定は16:9 / 1920×1080。ブラウザ検証は同寸のヘッドレスChrome。
全33枚 / 5章。実機素材を待つ部分は完成原稿内に用途を示したプレースホルダーとして残す。

## 一次修正：Webエンジニア向けの文言・情報設計

33枚の章構成・順序、テーマ、素材設定を維持。今回も写真・動画の差し替えは行っていない。

- 全ページの見出しを課題・仕様・実装・結果の表現へ変更。タイトル本文は維持し、物語的なサブタイトルを技術スタックへ置換。
- 2枚目は7項目の仕様表＋既存写真枠。CPU/クロック/ROM/標準RAMをNEC資料と科学館資料、表示/S10をZig_80文書と照合。所有機のRAM量は断定しない。
- 11–14枚目は現象・切り分け・変更・結果・条件を区別。未確定の根本原因を断定しない。
- 26枚目はクライアント実装要件、27枚目は質問→HTTP→逐次回答→ACKのシーケンス、32枚目は実装結果と未確認事項を併置。
- 全33枚の本文とノートを確認。ノートの技術補足・出典は保持し、説明の前後関係・伝えることを新見出しと同期。
- outline.md / docs/deck.json / slides.mdの見出しと目的、フッター順の整合性検査を追加。
- 修正前後を比較し、既存の出典URLが同じページにすべて残っていること、素材タグ・章・順序に変更がないことを確認。
- 仕様表の項目列幅を調整し、文字を小さくせずフッターとの重なりを解消。本文も意味の単位で改行。

最終確認: 型検査、production build、PDF33ページ、PNG33枚、全ページの1920×1080ブラウザ画像とcontact sheetを生成・レビュー。
Playwrightでconsole/pageerror/HTTPエラー、外部通信、はみ出し、31枚目のみのGemma領域を検査。
合成QA動画で手動再生・停止・オフライン再生・シーク・離脱時停止・Range取得を再確認。
PDFは全ページをレンダリングし、ブラウザ画像と比較。配布形式を変えずポータブル一式を再生成。
未提供の実機動画、OSネットワーク断、会場機器は引き続き未検証。

以下は全編制作時から維持している検証範囲・技術履歴。

## 実施結果

| 項目 | 結果 | 証跡・範囲 |
|---|---|---|
| npm ci | 成功 | lockfileから再インストール。最終依存のaudit 0件 |
| 型検査 | 成功 | vue-tsc --noEmit。ローカルVueコンポーネントとレイアウト |
| 内容検査 | 成功 | 33ページ、全ページ5項目ノート、素材の対応ページ、Gemma初出31を検査 |
| production build | 成功 | 本編dist/、検証専用dist-qa/を分離 |
| PDF | 成功 | slidev export、33ページ、16:9。Popplerで全ページを画像化 |
| サムネイル | 成功 | slidev export --format pngで33枚 |
| 全ページブラウザ画像 | 成功 | 1920×1080、全33枚を出力し各ページを目視確認 |
| contact sheet | 成功 | 全編HTML/PNGと章ごとのPNGを生成 |
| レイアウト検査 | 成功 | キャンバス、フッター、コード横幅、2列本文のはみ出しを検査 |
| ブラウザのエラー | 成功 | 最終静的HTMLでconsole.error 0、pageerror 0、HTTPエラー0 |
| ネットワーク依存 | 成功 | 新規コンテキストの初回表示から外部通信遮断。外部リクエスト0件。ローカルフォント・favicon使用 |
| 動画機構 | 成功（合成QAのみ） | SlidevVideo controls、autoplay=false、標準操作へのポインタークリックで再生・停止 |
| オフライン再生 | 成功（合成QAのみ） | 読み込み後context.setOffline(true)で再生・一時停止・3秒へシーク |
| ページ離脱 / Range | 成功 | 検証動画が離脱時停止、Range要求は206と100B応答 |
| 発表者画面 | 成功 | 静的HTMLの/presenter/1を直接表示。公開版のノートは除去済み |
| ポータブル配布 | 成功 | HTML、PDF、提供済みMP4、対応索引、起動手順、サーバー、フォントライセンスをパッケージ化 |

## 視覚レビューで直した箇所

- 23枚目: HELLOのコードと注釈がフッターへ近づいたため、セル間隔の分岐に必要な4行へ絞った。
- 10枚目: フレーム図は信号値の1ではなく1bitの幅と明記。8N1の説明を意味の単位で折り返した。
- 16枚目: VERIFYとEXECの説明の不自然な単語分割を修正。
- 27枚目: 2列の役割見出しの間隔を調整。
- 29枚目: メモリバーに各区間の共通paddingが足されないようにし、1743:211:94の比率で表示。
- 既定テーマのh1直後の段落opacityを上書きし、前提やコマンド導入も十分に読める濃さにした。
- 素材未提供時のMP4名は「予定」と明示し、実際に同梱された映像と混同しない。

## 依存互換性の修正

最初はTwoSlash 4.5.0とFloatingVue 5.4.0の組み合わせで、console.errorに
`Failed to patch FloatingVue ... Popper` が出た。pageerrorだけの検査では検出できなかったためconsoleも検査対象へ追加。
TwoSlashが参照する `Menu.components.Popper.extends` の構造を保持するFloatingVue 5.2.2へoverrideで固定した。
node_modulesの手編集やconsole抑止は行っていない。最終npm ci、build、PDF、全ページブラウザ検査を再実施。
この固定を更新する場合もconsole検査を外さず、発表者画面と動画を含めて確認する。

## 技術資料との照合

正本はmoribit/Zig_80、参照HEADは `9c38139d018f787902dc4c4785b83ea4b3f14e3d`。
旧appleuser634パスの301と同一repository ID 1319026178を確認。別ミラーと扱わず正本URLへ統一。
333B→100Bの改善、入力文字数、ローダー配置、SUM8とCRC16、USB/PIO障害を確認。
HELLO44B、ORBITAL582B、CLI構文、新UIの1743+211+94=2048と実機確認範囲を文書・ソース・永続JSON記録で照合。
細部と固定リンクはfacts.md。今回新たにPC-8001やPicoを書き換えたり、実機検証を行ったわけではない。

## 未提供・未検証

- PC全体、手入力画面、S10/Pico配線の実機写真、USB/シリアル検証ログの画像は未提供。
- HELLO、ORBITAL、Gemmaの実機MP4は未提供。config/media.jsonはsrc=null。実機映像の再生/音声/尺は検証できない。
- 合成playback-check.mp4の検証結果を、実機動画の成功として扱わない。verification.jsonでも区別。
- OSのWi-Fi/有線切断、別PC、会場のプロジェクター・音声系統は未検証。READMEの最終リハーサルを実施する。
- 元プロジェクトの新UIでは実機ESC復帰・次deploy・80文字モード・30分耐久が未確認。旧UIの成功を流用しない。
- 動画差し替え後は実ファイルのポスター、手動操作、ページ離脱、オフライン、PDFと独立MP4の対応を再検証する。

## 生成物と再現

- artifacts/verification.json: 最終環境、外部通信・エラー・はみ出し、合成QA、未提供素材の機械記録。
- artifacts/browser/slide-1.png〜slide-33.png: 全ページ画像。
- artifacts/contact-sheet.html / contact-sheet.png / chapter-1.png〜chapter-5.png: 一覧。
- artifacts/thumbnails/1.png〜33.png: Slidevから書き出した全ページPNG。
- artifacts/pdf-review/: Popplerでレンダリングした全33ページ。文字・図・素材領域をブラウザ版と比較する。
- artifacts/pdf-comparison.json: review:pdfによる全ページの平均RGB差。見た目の最終判断を代替しない。
- artifacts/zig80-lt.pdf、zig80-lt-portable.tar.gz、zig80-lt-source.tar.gz: 納品物。

再現コマンドはREADME参照。生成物はGit管理せず、スクリプトで再生成する。
