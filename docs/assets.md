# 実機素材台帳と差し替え手順

2026-10-29、ユーザー提供の写真7点とリング動画を反映。生成画像・疑似UIは使用しない。
ページとファイルの正本は `config/media.json`。本編25枚＋Appendix18枚、Gemma専用枠は22枚目。

| キー | ページ | 公開ファイル | 内容・状態 |
|---|---:|---|---|
| pc8001 | 2 | /photos/PC-8001.JPG | 本体・キーボード・CRT、提供済み |
| manual1 | 6左 | /photos/manual1.jpg | PC-8001 USER’S MANUAL表紙、PC-8101 / PTS-001の表記 |
| manual2 | 6右 | /photos/manual2.jpg | シリアル入出力・GND/TXD/RXDの端子説明。提供写真にある赤枠を維持 |
| wiring | 8 | /photos/S10_Pico2.jpg | 内部のS10とPico 2接写。提供写真の矢印を維持 |
| typing | 13 | /photos/mon_mode.jpg | MONのE300番地表示。100B/333Bの特定版・CRCの証明には使わない |
| hello | 17 | /photos/hello.jpg | HELLO FROM ZIG_80 Ver 1.1の静止画。動画枠から写真枠へ変更 |
| orbital | 18 | /videos/orbital.mp4 | リング実機動画、13.94秒、1920×1080、H.264/yuv420p、音声なし |
| orbitalポスター | 18/PDF | /photos/orbital-poster.jpg | 実動画の1秒位置から抽出 |
| gemma | **22のみ** | 未提供 | src/poster=null。完成画面・ポスターは他ページへ掲載しない |
| keyboard | 39 | /photos/keyboard.jpg | SHIFT・ESC・STOP等のキー配置、提供済み |

表紙と本文にPC-8001の表記を確認。マニュアルの版と掲載ページは写真から未確認。
PC-8001B/mkII等の既存Web資料と同じ冊子とは扱わない。端子表からPicoへの直結可否・電圧を推測しない。
撮影日、バイナリの版/CRC、撮影条件は未確認。ユーザーの提供・掲載依頼に基づき反映した写真であり、資料制作中に新しい実機試験を行ったという意味ではない。

## 変換と原本

HEICはmacOS sipsでJPEGへ変換。写真は全体をcontain表示し、トリミングしない。
公開JPEGはffmpegの `-map_metadata -1` で撮影位置等のメタデータを除去。
MOVは映像をH.264、yuv420p、1080pへ変換。元のBT.2020/HLG色情報を保持。
公開MP4も `-map_metadata -1` で位置等を除去。原本に音声ストリームはない。

原本HEIC/MOVはローカルに保持するが、Git・HTML・ポータブル・ソース配布には含めない。
177MBのMOVの代わりにMP4を配布。`scripts/prune-originals.mjs` が生成distから原本のみ除外する。
元のPC-8001.JPGは公開用にメタデータ除去したものを管理する。

## 残る素材

- Gemma実機チャットMP4。新旧UI、モデル名、コードCRC、解像度、音声有無を記録する。
- Mac・USB・Pico 2・PC-8001の接続全景。提供済みS10接写とは別用途。現行8枚目は接写を採用している。
- HELLO動画は未提供。現行は静止画で完成、必須の差し替えではない。
- USB/シリアル検証ログのスクリーンショット。現行31–35は文書・JSON記録の抜粋を維持。
- マニュアルの奥付・版・該当ページ番号。写真や動画に映るコードの版/CRC。

## Gemmaの差し替え

1. `public/videos/gemma.mp4` にH.264/yuv420p（音声が必要ならAAC）を置く。
2. 実動画からポスターを抽出し `public/photos/gemma-poster.jpg` に置く。
3. manifestのgemmaだけにsrc/posterを設定。対応ページ22は維持する。
4. check:content / typecheck / build:qa / package / thumbnails / verify / review:pdfを再実行する。
5. PDFは動画を再生しない。ポスターとMP4名を表示し、独立MP4を同梱する。

`MediaAsset` はSlidevVideo、controls、autoplay=falseを維持。オフライン試験は実動画と合成QAを区別する。
`playback-check.mp4` は6秒の合成テスト専用で本編には表示しない。
概念図と実配線写真は区別。フォントはローカル同梱、配布物へライセンスを含める。
