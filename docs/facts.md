# 技術的な事実と出典

確認日: 2026-10-28。正本: https://github.com/moribit/Zig_80 。
参照コミット: `9c38139d018f787902dc4c4785b83ea4b3f14e3d`。
`git ls-remote https://github.com/moribit/Zig_80.git HEAD` とクリーンなローカルHEADが一致。
発表リポジトリは独立しており、Zig_80の作業ツリーは取り込まない。

## 旧URLとの関係

旧 `https://api.github.com/repos/appleuser634/Zig_80` はHTTP 301で
`https://api.github.com/repositories/1319026178` へ転送された。
現 `moribit/Zig_80` のAPI応答も `id=1319026178`, `node_id=R_kgDOTp6-Ag`, `fork=false`。
旧パスは同一リポジトリへのリダイレクトで、別のミラーやforkではない。
正本・固定コミットのリンクをすべて `moribit/Zig_80` へ統一した。
アカウント名変更か所有権移管かという操作履歴までは、このAPIの観測だけでは特定できない。

## PC-8001と対象範囲

- 初代PC-8001、1979年、Z80互換μPD780C-1、N-BASICは[国立科学博物館の機体解説](https://www.kahaku.go.jp/exhibitions/vm/past_parmanent/rikou/computer/pc8001.html)で確認。
- [NEC公式仕様](https://support.nec-lavie.jp/support/product/data/spec/cpu/b020-1.html)の標準RAMは16KB。所有機の増設量を16KBと断定しない。CPU表記の連結を「14MHz」と解釈しない。
- 開発対象はN-BASIC・RAM予約を満たす所有機。mkII/8801のバンク・ROMルーチンを代用しない。
- 47年は2026−1979の年差。発売月は資料間の表記差があるためスライドでは年のみを使う。

## 一次修正：ハードウェア仕様表の再確認

2枚目は仕様表と既存写真枠を併置。表示は代表モードとし、所有機で全モードを実測したという意味にはしない。

| 項目 | 掲載値 | 確認先 |
|---|---|---|
| 発売年 | 1979年 | NEC製品情報・社史。月の表記差は既存方針どおり掲載しない |
| CPU / クロック | μPD780C-1（Z80互換） / 4 MHz | NEC製品情報の連結表記と大阪市立科学館の機体解説で照合 |
| RAM | 標準16 KB | NEC製品情報。所有機の増設RAM容量ではない |
| ROM | 24 KB / N-BASIC | NEC製品情報・国立科学博物館の解説 |
| テキスト表示 | 40/80文字 × 20/25行（代表モード） | Zig_80のchat文書のwidth/rowモード記述。NEC PC-8001Bマニュアルの表示説明を補助参照 |
| シリアル | S10 / μPD8251 | Zig_80 serial-validationのS10と8251記述。物理ピン配線図ではない |

追加参照: [大阪市立科学館 月刊うちゅう2015年11月号・誌面5頁](https://www.sci-museum.jp/wp-content/themes/scimuseum2021/uploads/publication/73_pdf.pdf#page=5)、[NEC PC-8001B User's Manual](https://oldcrap.org/wp-content/uploads/2024/07/nec-pc8001b-users-manual.pdf)。
Bモデルの英語マニュアルは補助資料。初代所有機のROM・増設構成や電気条件まで自動的に同一とはしない。
今回の文言修正では、元の実機記録・参照コミットと新旧UIの検証範囲は変更していない。

## 初回入力と配置

| 時点 / 役割 | 実コード | 配置 | 入力負担 |
|---|---:|---|---|
| 当初のStage 0（後に中継へ再利用） | 333B | E400–E54C | MON883文字 / BASIC1406文字・DATA21行 |
| 改善後のmini Stage 0 | 100B | E300–E363 | MON319文字 / BASIC757文字・DATA7行 |
| 常駐ローダー | 1134B | D800–DCFFに1280B固定イメージ | 転送は146Bゼロ埋め込み |
| アプリ領域 | 最大2048B | D000–D7FF | アプリのみを再転送 |

総入力文字数にはCLEAR/WIDTH・全バイト確認・DEFUSR/USRを含む。RETURN/CTRL+Bは各1文字。
MONのコード入力だけは旧813 / mini249文字。BASICファイルのCRLF込み1420Bと総入力1406文字を混同しない。
当初333Bを手入力した開発経緯は今回の依頼者の提供情報。資料から入力所要時間やミス回数は読み取れないので作らない。
mini化とUSB/PIO診断は並行して進んでおり、成功した256B試験は既にmini経由。
スライドは説明を通信と導入構造に分けるが、miniが診断後に初めて作られたとは語らない。

mini→中継は333B+SUM8でありCRC16ではない。SUM8の検出力はCRCより弱い。
中継→常駐および常駐プロトコルはCRC16。VERIFYは配置済みRAMを再読して計算。
EXECは明示要求、RETはローダーのABIを守るアプリの復帰。任意コードの実行時隔離ではない。
常駐がRAMに残りアプリが破壊しない間は再入力/USR不要。電源断・RESET後は再導入。
スタックE700–E7FFは別枠。E900以降のワーク/VRAMはローダーの転送先から保護する。

出典: BOOT, MEM, LOAD, LAYOUT（下の固定リンク表）。

## 接続と通信障害

論理経路はMac→USB→Pico 2→S10→PC-8001。Pico GP0 TX→S10 /RXD、S10 /TXD→GP1 RX、GND共有。
300bps・8N1・反転UART、PIOで極性を処理する。図は物理ピンの位置や電圧の指示ではない。
8N1はstart1+data8+stop1=10bitなので理論上限30B/s。プロトコルのpayload速度とは異なる。

| 問題 | 観測と切り分け | 変更 | 確認できた結果・限界 |
|---|---|---|---|
| USB停止 / watchdog | PC電源OFF・信号線なし・UART無効の単体でもTimeout。0.1.1でuptime減少・watchdog両フラグ1。0.1.2 previous_watchdog_phase=7 | 0.1.3でループ末尾のsleep_us(50)をbusy_wait_us_32(50)へ。250ms watchdogと1秒TXリースを維持 | 同一アダプターの単体120秒、714応答、最大応答866us、最大ループ間隔223us、watchdog両フラグ0。SDK内部の根本原因や無期限の無再発は断定しない |
| 連続UARTフレーミング | 0.1.3の実機返送00–B8の185Bは一致。次のB9期待で6E/flag1。Pico単体loopbackには余分なidleがあった | 実PIOモデルで隙間なし、±2%クロック、位相差、両極性を試験。旧RXで16ケース失敗。0.1.4でRXだけ8→16cycle | モデル40条件一致。その後実機00–FF往復256B一致、CRC OK、再送0、UART flags0、PC PE/OE/FE0。物理エラーの厳密な根因まで証明したとはしない |

実機256B往復17,842,484us、待ち込みセッション38,266,301us。非実行試験なので常駐/アプリ成功と分ける。
常駐導入では1280B/CRC/起動を確認、転送区間44,940,866us。記録の基準区間を混ぜて速度を算出しない。
出典: BOOT, SERIAL, ROUNDTRIP, RESIDENT。

## 小さな成果

| 成果 | サイズ / 配置 | 実機で確認 | モデル検証や未確認と区別する点 |
|---|---|---|---|
| HELLO | 旧29B→修正版44B、CRC ADC1 | 40文字モード、HELLO FROM ZIG_80全文一致、実行/RET復帰 | 40/80モードのセル間隔と属性保持の網羅はCPU試験。実機40文字は復帰A00で確認 |
| ORBITAL RINGS | コード/テーブル582B、D000–D245 | リングの動き、終了表示、RET/A52h | 状態6B D4E0–D4E5、属性保存640B D500–D77Fも使用。全属性復元/保護領域保持はCPUモデル検証 |
| Mini Invaders（入力の橋渡しに紹介） | 1361B / CRC382F | 左右移動・SPACE射撃 | 実機ESC/STOP、勝敗、再挑戦は未観測 |

HELLOのコード引用はhello.asmの1回目のinc deから2回目のinc deまで（16–19行）。
ASM例は抜粋であり単独実行用ではない。完成画面の生成画像や疑似動画は使わない。
出典: BOOT, HELLO, DEMOS, ORBITAL, INVADERS。

## Zig_80と実コマンド

2パスアセンブラ、Z80 CPU、CLI/TUI、実機deployを同じ開発環境で扱う。
CLI runの汎用プロファイルとPC専用8251/CRTC等を使う統合試験を混同しない。サイクル精密実機再現ではない。
スライド19はREADMEのzig build/asmと、LOADの実機例、MAIN/DEPLOYのusage・parseを照合。
`--target pc8001 --port ... --enable-tx --voltage-confirmed --wait-return --log ...`を省略せず示した。
今回の作業で実機を操作・再デプロイしたという意味ではなく、資料と実装に照合したコマンド。
初回導入・chatの全手順は固定リンク先を参照。短縮した架空コマンドは掲載しない。

## LLMクライアントの責務とメモリ

- PC: キーマトリクス入力、VRAM表示、シリアルフレームの送受信。
- Pico 2: 既存USB/PIOブリッジ。LLM導入によるファーム変更不要。
- Mac上のZigホスト: loopback HTTP、会話履歴（既定4ターン）、正規化、キュー、CRC/ACK。
- Ollama/Gemma: Mac上で推論。実機記録のモデルはgemma3:1b。最新文書中のgemma4起動例を実機記録のモデルに置き換えない。

NDJSONを逐次解析し、通常8B・LF・100ms・DONEでTEXTを送出。1〜32Bを設定可能。
未ACKバイトを保持、UART/ACK待ちはHTTP読出しを止める。小さなチャンクほどCRC/ACK負担が増える。
英字大文字ASCII化、非ASCIIは?へ、回答上限160文字。完成回答へ人工文字遅延を掛ける方式ではない。

| 新UIの範囲 | バイト数 | 内容 |
|---|---:|---|
| D000–D6CE | 1743 | コード・テーブル・3B ACK scratch |
| D6CF–D714 | 70 | コード直後の未割当 |
| D715–D737 | 35 | TX |
| D738–D75C | 37 | 前回RX |
| D75D–D766 | 10 | キー状態 |
| D767–D76F | 9 | 未割当 |
| D770–D78B | 28 | 画面/プロトコル等の状態 |
| D78C–D7CB | 64 | 入力 |
| D7CC–D7F0 | 37 | RX |
| D7F1–D7FF | 15 | 未割当 |

静的作業211B = 35+37+10+28+64+37。未割当94B = 70+9+15。
1743+211+94=2048。常駐の専用スタックE700–E7FFは既存の別領域。

## 実機のUI版と確認範囲

| UI | 確認されたこと | 未確認 |
|---|---|---|
| 初期1528B / A7A1 | 入力、2往復、逐次表示、ESC復帰、常駐応答 | 30分耐久 |
| 改良1635B / 4B3F | 句読点、カーソル、spinner、ESC復帰、常駐応答 | 後続UIの証拠として流用しない |
| 旧1683B / F1A3 | 10往復、画面充填後の継続、ESC復帰、常駐HELLO/ABORT、TX解放 | 実機80文字、30分耐久 |
| 新1743B / B9A6 | RAM検証、EXEC、HELLO/READY、入力、横入力スクロール、会話スクロール。記録時5往復、継続中 | この版の実機ESC復帰と次deploy、実機80文字、30分耐久 |

スライド30では旧/新を分けて表示。完成動画の初出は31のみ。素材自体は未提供。
モデルでの15往復や後続deployの成功を新UIの物理実測としない。
Macのスリープ復帰でNOT_ARMEDとなった別の記録もある。回線復帰後に自動再ARMしない契約を緩めない。
出典: CHAT, CHAT_OLD, CHAT_NEW, CHAT_IMPL, CHAT_ASM。

## 固定コミットの出典索引

- BOOT: [docs/pc8001-bootstrap.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md)
- MEM: [docs/pc8001-memory-map.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md)
- LOAD: [docs/pc8001-serial-loader.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md)
- LAYOUT: [examples/pc8001/loader/layout.inc](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc)
- SERIAL: [docs/pc8001-serial-validation.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md)
- ROUNDTRIP: [docs/pc8001-validation-records/2026-10-26-mini-preflight-014.json](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-mini-preflight-014.json)
- RESIDENT: [docs/pc8001-validation-records/2026-10-26-resident-014.json](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-resident-014.json)
- HELLO: [examples/pc8001/hello.asm](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm)
- HELLO_RECORD: [docs/pc8001-validation-records/2026-10-26-hello-014.json](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json)
- DEMOS: [docs/pc8001-demos.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-demos.md)
- ORBITAL: [docs/pc8001-validation-records/2026-10-26-orbital-rings-014.json](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-orbital-rings-014.json)
- INVADERS: [docs/pc8001-invaders.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-invaders.md)
- README: [README.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md)
- MAIN: [src/main.zig](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/main.zig)
- DEPLOY: [src/serial/deploy.zig](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/deploy.zig)
- CHAT: [docs/pc8001-chat.md](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md)
- CHAT_OLD: [docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json)
- CHAT_NEW: [docs/pc8001-validation-records/2026-10-27-chat-classic-014.json](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json)
- CHAT_IMPL: [src/serial/chat.zig](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat.zig)
- CHAT_ASM: [examples/pc8001/chat.asm](https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm)

## 本編 / Appendix再編（2026-10-28）

GitHubの最新HEADを再取得し、正本 `moribit/Zig_80` は引き続き
`9c38139d018f787902dc4c4785b83ea4b3f14e3d`。本編21枚＋Appendix17枚。
過去の数値・失敗記録は削除せずAppendixへ移動。旧ページ番号より `outline.md` / `config/media.json` を優先する。

| 対象 | 照合した内容 | 根拠 |
|---|---|---|
| N-BASIC（3） | 行番号付きプログラムをRAMに保持、LISTは表示、RUNは実行。行番号で追加・置換、番号だけで削除 | NEC N-BASIC Reference Manual（PC-8001B版）1-1/1-12/1-13、LIST 2-32、RUN 2-59。パソコンミニ公式BASIC第5回の行番号削除例も照合 |
| カセット（4） | CSAVE "HELLO" / CLOAD "HELLO"、BASICプログラムの保存/復元。独自教材例 | NEC PC-8001B User’s Manual PDF13頁（接続）、52–54頁（誌面47–49、CLOAD/CSAVE）。実機作業の記録とは区別 |
| 2KBの理由（16/22） | D000–D7FFのみアプリ転送可。D800–DCFF常駐固定1280B、E400–E5FF中継、E600–E8FFバッファ・スタック・状態、E900以降保護 | docs/pc8001-memory-map.md と loader/layout.inc |
| BASIC予約 | CLEAR 300,&HCFFF。成功とE400読書検証が開始条件。アプリ自身の破壊を防ぐ隔離ではない | 同メモリ文書。4/8KBは別プロファイルの調査が必要 |
| チャットの配分（17） | 1743Bコード・テーブル等、211B静的領域、94B未割当。E700–E7FFのスタックは別領域 | docs/pc8001-chat.md、chat.asmのORG/定数と最新CLIの再アセンブル結果 |
| キー（33/34） | ポート1〜9、active-low、(current XOR previous) AND current、SHIFT port8 bit6、ESC/STOP port9 bit0/7、BC1500 debounce | examples/pc8001/chat.asm key/key_row/key_table/key_debounce。docの非リピート仕様と照合 |
| VRAM（35/36） | F300–FEB7、行120B=文字80B+属性40B。40文字はstride2、80文字はstride1 | chat.asm cell/putc/scroll/clear_row、hello.asm、memory-map、chat文書 |
| スクロール/カーソル | 会話2–16行だけスクロール。属性1000Bを保持。CRTC command81hをport51h、X/Yをport50h、40文字Xは2倍 | chat.asm cursor_update/scroll と chat文書。完成UI画像はデモ19より前に置かない |
| ストリーミング（15/37） | HTTP逐次受信、通常8B / LF / 100ms / DONEでflush。UART・ACK待ちはHTTP読出停止、未ACKバイト保持 | src/serial/chat_queue.zig、chat_ollama.zig、chat_protocol.zig、chat文書 |

N-BASIC資料はNEC著・第三者保管の一次資料。BモデルのRAM32KB等は初代国内機の仕様へ転用しない。
BASICコード例は説明用に作成し、実機で実行した証拠として扱わない。カセットで今回の機械語を保存したという主張もしない。

- [NEC PC-8001B N-BASIC Reference Manual](https://archive.org/details/pc-8001b-n-basic-reference-manual-nec-en-1981)
- [NEC PC-8001B User’s Manual](https://oldcrap.org/wp-content/uploads/2024/07/nec-pc8001b-users-manual.pdf)
- [パソコンミニ公式：BASIC第5回](https://www.pcmini.jp/furoku/basic-05/index.html)
