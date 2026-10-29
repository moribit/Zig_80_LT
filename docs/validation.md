# 写真・実動画の反映（2026-10-29）

写真7点とリング実機動画1点を反映。6枚目はmanual1（表紙）とmanual2（端子説明）を左右に等幅表示。
現行原稿にはS10説明の本編8への移動があり、実際の枚数は本編25＋Appendix18＝43。ページ番号・索引・台帳・outline/deck.jsonを同期。ユーザーの見出し変更や本文編集も保持。
Gemmaは22枚目のみ、未提供プレースホルダーを維持。

## 実施結果

| 検査 | 結果 |
|---|---|
| 内容・整形 | 43枚、全ノート、9素材キー、出典・フッター・見出し・outlineの整合、format:check成功 |
| 型検査・production build | 成功。HEIC/MOV原本をdistから除きJPEG/MP4を同梱 |
| PDF / PNG | 43ページ / 43枚。PDFは実動画からのポスターと独立MP4名を表示 |
| 全ページブラウザ | portable/dist、Chrome156.0.8078.48、1920×1080で撮影。6章のcontact sheetと変更ページを目視レビュー |
| エラー・外部通信・はみ出し | pageerror / console.error / HTTP失敗 / 外部要求 / レイアウト / 基本色不一致すべて0 |
| 写真 | 7点すべてnaturalWidth>0。HEICをJPEGへ変換、向きと写真全体を確認 |
| 実動画 | H.264 / yuv420p、1920×1080、13.933333秒、音声なし。ネイティブコントロールで手動再生・停止成功 |
| 実動画offline | 0〜5秒以上のバッファを確認し、context.setOffline(true)で3秒へシーク→再生→停止成功。OSネットワーク無効化とは区別 |
| 合成QA | 手動再生/停止、buffer済みoffline再生/シーク、離脱時停止、Range206成功 |
| 発表進行 | 本編25で通常/発表者画面とも進行停止。26–43の直接移動と索引9リンクの行き先を確認 |
| PDF比較 | Popplerで43ページを画像化。ブラウザとの差の最大平均RGB差6.044/255（閾値8未満） |
| 配布 | HTML・43ページPDF・独立orbital.mp4・起動手順・ソースのtar.gzを再生成 |

検査記録: artifacts/verification.json、artifacts/pdf-comparison.json。
視覚レビュー: artifacts/contact-sheet.html / contact-sheet.png、artifacts/chapter-1〜6.png。
原本HEIC/MOVはローカルに残し、Git・静的HTML・配布tar.gzには含めない。JPEG/MP4の撮影位置メタデータを除去。

## 残課題と検証の限界

- Gemma動画未提供。実動画の再生は未検証。HELLOは写真として反映し、動画再生の確認とは扱わない。
- 接続全景・検証ログの画像・マニュアル版/ページ・撮影したプログラムのCRCは未提供/未確認。
- 動画の元のBT.2020/HLG色情報を保持。本番PC・プロジェクターでの色と明るさ、OSネットワーク断、別PCの実機検証は未実施。
- 外部通信遮断のブラウザ検査と、読み込み済み区間のcontext offline試験を実施。OS全体の切断や全尺の完全キャッシュを成功扱いしない。
- 写真の追加を新しい実機通信・コードサイズ・新UIの動作確認と同一視しない。固定コミットの記録とユーザー提供写真を区別。

---

以下は過去版の検証履歴（ページ数・素材状態は各時点のもの）。

# Appendix分離・HTML整形の検証（2026-10-28）

直近のユーザー編集時点の44枚を維持。本編25枚をslides.md、26–44の19枚をappendix.mdへ分離。
slides.md末尾のsrcで読み込み、外部ファイル展開後の順序をSlidev公式パーサーで検査する。
既存の44見出し・引用コードフェンス・出典URLを保持。未記入だったメッセージ4枚のノートを補完。
フッター・素材台帳・索引・outline/deck.jsonを実際の順序に同期。Gemma素材は現行の22のみ、本編終了25。

## 実施結果

| 検査 | 結果 |
|---|---|
| format / format:check | 成功。2ファイルの再整形が冪等。HTMLは2スペース、コードとノートは対象外 |
| 内容検査 | 25＋19＝44枚、全ノート、8素材、Appendixファイル・hideInToc・フッターが整合 |
| 型検査・production build | 成功 |
| PDF / PNG | 44ページ / 44枚。Appendixを含めて出力 |
| ブラウザ | portable/distをChrome156 / 1920×1080で全44枚撮影・章別一覧をレビュー |
| エラー・外部通信・はみ出し | pageerror/console.error/HTTP失敗/外部リクエスト/レイアウト/基本色の不一致すべて0 |
| 発表進行 | 通常・発表者画面で本編25→26は停止。索引リンク、26–44の直接移動成功 |
| 合成QA動画 | 手動再生/停止、buffer済みoffline再生/シーク、離脱時停止、Range206成功 |
| PDF比較 | Popplerで全44ページを画像化。ブラウザとの差の最大平均RGB差3.253/255 |
| ポータブル | HTML/PDF/動画索引/起動手順を生成。開発ソースにはappendix.mdと整形設定・スクリプトを同梱 |

HTMLの整形では、フェンス後のHTMLがCommonMarkのインデント付きコードへ変換されないよう、その開始タグを行頭へ戻す。
4枚目の既存の長いコード注釈は文字を変えず枠内で折り返す。再生する実機MP4は未提供、素材は引き続きプレースホルダー。
OSネットワーク断・会場環境・実機動画は未検証。合成QAの成功と区別する。
証跡: artifacts/verification.json、pdf-comparison.json、contact-sheet.png、browser/、pdf-review/。

以下は過去版の検証履歴。現行ページ対応はoutline / deck.json / media.jsonを優先する。

---

# メッセージ10枚目追加の検証（2026-10-28）

本編25枚＋Appendix17枚＝全42枚。Gemma専用素材23、本編終了25、Appendix26–42。
現行9の構成図の直後へ「でも、どうやって受信する？」を追加。既存messageレイアウトを使い、白背景・黒文字・中央配置で一文のみ。
ユーザー指定の4段落を口頭補足へ収録し、11「最初は機械語を直接入力」へ接続。
既存出典と17枚のAppendix本文・コードの同一性を比較確認。素材は全8件src/poster=nullのまま。

## 最終検証結果

| 検査 | 結果 |
|---|---|
| 内容・参照 | 42見出し/目的/5項目ノート、8素材、索引とページ番号が整合。5/7/10はフッター例外 |
| 型検査 | vue-tsc成功 |
| production build | dist / dist-qa成功 |
| PDF / PNG | 42ページ / 42枚。PDFメタデータも本編25＋Appendix17 |
| ブラウザ・視覚レビュー | portable/distを1920×1080のChrome156で全42枚撮影。章別contact sheetを全ページ確認、新10は個別画像でも確認 |
| メッセージ専用 | 指定文のみ、図/写真/フッターなし。黒文字・50px以上・中央配置を確認 |
| エラー・外部通信・はみ出し | pageerror/console.error/HTTP失敗/外部リクエスト/レイアウト/基本色の不一致すべて0 |
| 発表進行 | 通常/発表者画面で25→26の次操作は停止。索引と26–42の直接移動が成功 |
| Gemma初出 | 素材領域は23だけ |
| 合成QA動画 | 手動再生/停止、buffer済みoffline再生/シーク、離脱時停止、Range206成功 |
| PDF比較 | Popplerで全42ページをレンダリング。最大平均RGB差3.252/255 |
| 配布物 | HTML・PDF・独立動画索引・起動手順のportableと、ノート付き開発ソースを再生成 |

証跡: artifacts/verification.json、pdf-comparison.json、browser/slide-1.png〜slide-42.png、thumbnails/1.png〜42.png、contact-sheet.png、pdf-review/。
実機写真・動画は未提供。実MP4再生・OSネットワーク断・会場環境は未検証のまま。合成QAの成功を実機動画の成功と扱わない。

以下は過去版の検証履歴。現在のページ対応はoutline / deck.json / media.jsonを優先する。

---

# 導入ストーリー再構成の検証（2026-10-28）

本編24枚＋Appendix17枚＝全41枚。白背景・黒文字、16:9 / 1920×1080。
1–13は指定順、14からHELLO・描画・入出力・LLMへ続く。Gemma専用素材は22、本編終了24、Appendix25–41。

## 変更と照合範囲

- 5/7は指定された一文のみ。フッター・写真・図を置かず、中央の黒文字だけ。口頭補足はノートへ記載。
- 6はmanualの写真枠＋S10 / シリアル通信 / 8251。8はconnectionの全景写真枠、9はUSB–Pico 2–S10の概念図。
- 旧「今回の開発目標」は12のビルド・デプロイへ統合。技術補足と出典も保持。
- 最新Zig_80 HEADは9c38139d018f787902dc4c4785b83ea4b3f14e3d。S10・8251の関係を初代用技術文書で照合。
- マニュアルで着目した経緯はユーザー提供。資料写真の冊子/版/ページは未提供なので未確定。Bモデルの資料を所有機の冊子として転用しない。
- 通信障害・ブートストラップ・実機確認範囲は維持。Appendix17枚は順序・本文・コード・出典を保持し参照ページのみ更新。
- 素材キー・フッター例外・見出し・ノート・索引・本編終了・Gemma初出の整合性検査を更新。

## 最終検証

最終結果は artifacts/verification.json、pdf-comparison.json に記録済み。

| 検査 | 結果 |
|---|---|
| 内容・素材・ノート | 41件の見出し/目的/5項目ノート、8素材キー、39フッター＋2メッセージ例外が整合 |
| 型検査 | vue-tsc成功 |
| production build | distとdist-qaが成功。ノートを除去した配布HTMLを生成 |
| PDF / PNG | 41ページ / 41枚。PDFの本編24＋Appendix17メタデータも確認 |
| 全ページブラウザ | Chrome156 / 1920×1080、portable/distを配信して41枚を撮影・レビュー |
| メッセージ専用 | 5/7は指定文だけ、図/写真/フッターなし。黒文字、50px以上、中央配置を機械・目視確認 |
| エラー / 外部通信 / レイアウト | pageerror 0、console.error 0、HTTP失敗0、外部リクエスト0、はみ出し0、基本配色の不一致0 |
| 本編・Appendix | 本編24で通常/発表者の次操作が停止。索引リンクと25–41の直接移動が成功 |
| Gemma初出 | 素材領域は22だけ。全8素材はsrc/poster=nullのまま |
| 合成QA動画 | 手動再生/停止、buffer済みoffline再生/シーク、離脱時停止、Range206が成功 |
| PDF比較 | Popplerで全41ページを画像化。ブラウザとの差の最大平均RGB差3.252/255 |
| 配布物 | HTML・PDF・独立動画索引・起動手順のportableと、ノート付き開発ソースを生成 |

全41枚を章ごとのcontact sheetで目視確認。新規5–9と目標統合12は個別画像でも確認。
17枚のAppendix本文・コードが改訂前と同一であること、および元の出典URLが全て残っていることを比較検証した。


## 素材・残課題

manual（6）とconnection（8）を追加。wiring（26）は近接配線の用途を維持。
全写真・実機動画は未提供、src/poster=null。Gemma完成画面の写り込みをconnection素材にも禁止。
合成QA動画による機構確認と、未提供の実機MP4の再生検証は区別する。
OSネットワーク断・会場環境は未検証。元実機記録の新UI ESC復帰・次deploy・80文字・30分耐久も未確認のまま。

以下は過去版の検証履歴。過去の枚数・ページは現在版と異なる。現行の対応はoutline/deck.json/media.jsonを優先する。

---

# 本編・Appendix再編の検証記録

実施日: 2026-10-28。macOS arm64、Node.js 24.19.0、Slidev 53.0.0、Chrome 156。
本編21枚＋Appendix17枚＝全38枚。16:9、1920×1080。写真・動画はすべて未提供のまま。

## 内容・出典

- outline / slides / deck.jsonの38件の見出し・目的・5項目ノートとページ順を機械照合。
- 最新Zig_80 HEADは9c38139d018f787902dc4c4785b83ea4b3f14e3d。メモリ配置・入力・描画・通信を文書とソースで照合。
- 最新CLIでchat.asmを/tmpへ再アセンブルし1743Bを再確認。静的211B＋未割当94Bと合わせ2048B。
- BASICの独自教材例をNEC N-BASIC資料のLIST/RUN・行番号編集と照合。カセットはCSAVE/CLOADと論理接続を紹介し、今回の保存実績と区別。
- 本編の本文からWatchdog、PIOタイミング、CRC/ACK/NAKを除外。詳細と既存の失敗記録・出典はAppendixに保持。
- 完成チャット素材は19枚目のみ。18枚目は機能表で、完成画面・疑似画面を使わない。
- 本編は21枚目で終了。通常の次キーと発表者画面の次操作は21→22で停止。索引リンク・直接URL・PDF出力は利用可能。

## 最終検証

最終実行結果は artifacts/verification.json / pdf-comparison.json に記録済み。
型検査、内容検査、production build、PDF、全ページPNG、Playwright、PDF画像比較、ポータブル生成が成功。

| 検査 | 最終結果 |
|---|---|
| 内容・型・production build | 成功。38ページの構成・全ノートと出典、短い実コード6か所を照合 |
| 配布版HTML | portable/distを実際に配信し1920×1080で全38枚を確認 |
| 白背景・黒本文 | 全ページで期待色を機械確認、図・コード・補助文字も目視レビュー |
| レイアウト / エラー | はみ出し0、console.error 0、pageerror 0、HTTP失敗0 |
| 外部ネットワーク | 初回表示から外部を遮断し、リクエスト0件 |
| Appendix | 22–38の直接移動、21の索引リンク、通常/発表者画面での終了停止が成功 |
| Gemma公開位置 | MediaAssetは19枚目だけ。全写真・動画のsrc/posterはnullのまま |
| 動画（合成QAのみ） | 手動再生/停止、buffer済みoffline再生・シーク、離脱時停止、Range206が成功 |
| PDF / PNG | 38ページ / 38枚。Poppler全ページ画像とブラウザ比較の最大平均RGB差3.252/255 |
| 配布物 | HTML＋同一PDF＋独立動画索引＋起動手順、およびsetupを含む開発ソースを生成 |

白背景#FFFFFF、本文#171717、補助#555555、アクセント#2F7348。コードも白背景に合わせた配色。
全38枚のブラウザ画像とcontact sheetを目視レビューし、コード・図・写真枠・折り返しを確認済み。

## 今回の表示調整

- 3/4枚目: 教材コードと操作説明を分け、当時の方法と今回の作業を区別。
- 16/22枚目: アドレス昇順の縦メモリマップ。高さは縮尺外と明記。
- 21枚目: GitHubと質疑用索引を配置。通常進行の停止とリンク移動を検査。
- 25/33–36枚目: 実コードを短く引用し、PIO・キー状態・VRAM・CRTCを白背景の図で補足。
- 32枚目: 補足がフッターに近づいたため、重複説明をノートへ集約して余白を確保。

## 未提供・未検証

実機写真3点とHELLO/ORBITAL/GemmaのMP4は未提供。合成QAの再生成功を実機映像の成功と扱わない。
ブラウザで外部通信を遮断し、読み込み済み合成MP4でoffline再生・停止・シークを確認済み。
OSのWi-Fi/有線切断、別PC、会場機器、実機MP4の音声・尺は未検証。
新UIの実機ESC復帰・次deploy・80文字・30分耐久は元リポジトリの未確認範囲を維持。

## 生成物

- dist/: ノートを除去した静的HTML（ローカルWebサーバーで起動）
- artifacts/zig80-lt.pdf: 本編＋Appendixの全38ページ
- artifacts/browser/slide-1.png〜slide-38.png、thumbnails/1.png〜38.png
- artifacts/contact-sheet.html / contact-sheet.png、chapter-1.png〜chapter-6.png
- artifacts/pdf-review/ と pdf-comparison.json: 全ページPDFレンダリングと比較
- artifacts/zig80-lt-portable.tar.gz / zig80-lt-source.tar.gz

以下は旧33枚版の履歴であり、ページ番号と色は現在版とは異なる。現在のページ対応はoutline / media.jsonを優先する。

---

# 以前の33枚版の検証履歴

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
