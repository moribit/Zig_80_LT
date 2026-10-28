# 実機素材台帳と差し替え手順

実機写真・動画は2026-10-28時点で未提供。生成画像・疑似UI・合成チャットを証拠として使わない。
ファイルとページの対応は `config/media.json` が正本。現在はすべてsrc/posterがnullで明示プレースホルダーを表示する。

| 素材キー | スライド | 必要な内容 | 予定ファイル | 状態 |
|---|---:|---|---|---|
| pc8001 | 2 | 初代本体・キーボード・CRTの全体。mkIIを代用しない | public/photos/pc8001.jpg | 未提供 |
| typing | 6 | 機械語のMON入力と照合画面。旧333Bかmini100Bかを記録 | public/photos/typing.jpg | 未提供 |
| wiring | 23 | S10とPico 2のコネクタの向き・配線先が分かる実物 | public/photos/wiring.jpg | 未提供 |
| 検証ログ | 26–30 | USB単体HEALTH、連続通信失敗、成功時のログ画面 | public/photos/usb-check.png 等 | 画像未提供。文書・永続JSON記録から値を引用済み |
| hello | 11 | HELLO全文が読める実機画面・実行映像 | public/videos/hello.mp4 | 写真・動画とも未提供 |
| orbital | 12 | 2本のリングと終了表示 | public/videos/orbital.mp4 | 未提供 |
| gemma | **19のみ** | PC側のキー入力と逐次応答。新旧UIの版を確認 | public/videos/gemma.mp4 | 未提供 |

## 置換する前に

撮影者、日付、公開許可、対象の型番、UI版、コードサイズ/CRC、モデル名、尺、解像度、音声有無を台帳へ追記する。
Gemmaは完成した画面を含むので、ポスターも19枚目以外へ置かない。旧UI映像なら1683B等の版を明記して新UIの証拠にしない。
個人情報や私的な会話内容が写っていないか確認する。提供素材への加工は目的を記録する。

## 差し替え

1. 写真を `public/photos/`、MP4を `public/videos/` へ置く。英小文字のファイル名とする。
2. MP4はH.264 / yuv420p、必要な音声はAAC。必要に応じて以下で変換する。

   ```sh
   ffmpeg -i input.mov -c:v libx264 -pix_fmt yuv420p -crf 20 \
     -c:a aac -b:a 160k -movflags +faststart public/videos/gemma.mp4
   ffmpeg -ss 00:00:01 -i public/videos/gemma.mp4 -frames:v 1 \
     public/photos/gemma-poster.jpg
   ```

3. `config/media.json` の対象の `src` を `/videos/gemma.mp4` などへ変更。動画は `poster` も `/photos/gemma-poster.jpg` などへ設定する。
4. `MediaAsset.vue` はsrcがある場合のみSlidevVideoを表示する。controls付き・autoplay=false。空のsrcや存在しないMP4を作らない。
5. check:content / build / export / thumbnails / build:qa / verify / packageを再実行する。実機素材の再生は実ファイルで別途記録し、合成QAの成功を流用しない。
6. PDFにポスターが表示されること、独立MP4のファイル名が対応ページに表示されることを確認する。

現在の `hello.mp4` 等の表記は予定名。ファイルはまだ存在しない。再生中に素材待ちと誤認しないようsrc設定後に表示も確認する。

## 検証用の既存資産

- `public/videos/playback-check.mp4`: ffmpeg color/testsrc2、6秒、H.264、音声なし。合成テスト専用。本編には未使用。
- `public/videos/placeholder-poster.svg`: 文字のみの検証用ポスター。実機を描いた画像ではない。
- `components/HardwareTopology.vue`, `FlowDiagram.vue`, `UartFrame.vue`, `MemoryBudget.vue`: ソースに基づく編集可能な概念図。写真や実配線図の代替ではない。
- フォント: npm同梱Noto Sans JP/IBM Plex Mono。ライセンスを配布物に含める。

ログの値を紹介する26–30枚は「記録の抜粋・要約」と表示。実際のログ画面のスクリーンショットに見せかけない。

## 白背景版で追加した説明図

CassetteFlowは当時の接続の概念、MemoryMapはソフトウェアの配置契約、
KeyboardMatrix/VramMapはソースに基づくI/O説明図。実機写真・完成UIの代用品ではない。
新しい写真・動画は追加していない。wiringの実物写真枠はAppendix23へ移動。
