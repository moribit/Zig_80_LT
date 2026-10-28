# 技術的な事実と出典

確認日: 2026-10-28。独立した発表リポジトリへ元リポジトリを入れ子にしない。
参照元: https://github.com/appleuser634/Zig_80
`git ls-remote origin HEAD` とクリーンなローカルHEADが一致:
`9c38139d018f787902dc4c4785b83ea4b3f14e3d`

固定URLの基点: https://github.com/appleuser634/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/

| 採用した事実 | 参照ファイル |
|---|---|
| 対象は初代PC-8001、N-BASIC | docs/pc8001-memory-map.md |
| mini Stage 0は100B、旧333Bは現在の中継。mini MON入力319文字（確認・起動を含む） | docs/pc8001-bootstrap.md |
| ホストUSB→Pico 2 USB/PIO→S10、300bps/8N1/反転 | docs/pc8001-serial-validation.md、docs/pc8001-chat.md |
| GP0 TX→S10 /RXD、S10 /TXD→GP1 RX、GND共有 | docs/pc8001-serial-validation.md の候補接続表。図は論理構成のみ |
| LLM推論・履歴・HTTPはホスト側、PC-8001はASCII端末 | docs/pc8001-chat.md |
| 1743B新UIの実機入力・スクロール確認。新UIのESC復帰・次デプロイ、30分耐久は未完了 | docs/pc8001-chat.md。旧UIの実績と混同しない |
| 検証用コードはmini_stage0.asmのxor aからmode 4Ehまでの抜粋 | examples/pc8001/loader/mini_stage0.asm |

1979年・8bit・BASICの根拠: [NEC社史](https://jpn.nec.com/profile/corp/history/pdf/history-120.pdf)。タイトルの47年は2026−1979。
月日はスライドに記載しない（NECの沿革ページと社史で月の表記に差がある）。

写真・実機映像は未提供。生成画像を実機の証拠として利用しない。入力サンプルは模式表記であり実行手順ではない。
