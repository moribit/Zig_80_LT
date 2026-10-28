---
theme: default
favicon: /favicon.svg
title: 47年前のPCでローカルLLMクライアントを動かしてみた
info: Zig_80 PC-8001実機開発の物語 / 全33枚
aspectRatio: 16/9
canvasWidth: 1100
colorSchema: dark
fonts:
  provider: none
  sans: Noto Sans JP Variable
  mono: IBM Plex Mono
lineNumbers: false
transition: none
drawings:
  persist: false
mdc: true
layout: cover
---
<div class="eyebrow">ZIG_80 / PC-8001</div>

# 47年前のPCで<br>ローカルLLMクライアントを<br>動かしてみた

<div class="small muted">PC-8001 / Z80 / Raspberry Pi Pico 2 / Zig_80 / Ollama / Gemma</div>

<SlideFooter :number="1" chapter="01 / プログラムを届けたい" />

<!--
伝えること: 最終ゴールと使用スタックを示す。
前からのつながり: タイトルで目標を共有してから、ハードウェアと転送の前提を説明する。
技術補足: 47年は2026−1979の年差。LLM推論はMac側でありPC-8001側はクライアント。
次への導入: 次は「NEC PC-8001 — ハードウェア仕様」を説明する。
出典:
- https://jpn.nec.com/profile/corp/history/pdf/history-120.pdf
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# NEC PC-8001について

<div class="photo-grid spec-grid"><div><table class="fact-table spec-table"><thead><tr><th>項目</th><th>仕様</th></tr></thead><tbody><tr><td>発売</td><td>1979年</td></tr><tr><td>CPU</td><td>μPD780C-1(Z80互換)</td></tr><tr><td>クロック</td><td>4 MHz</td></tr><tr><td>RAM</td><td>標準16 KB</td></tr><tr><td>ROM</td><td>24 KB / N-BASIC</td></tr><tr><td>テキスト表示</td><td>40/80文字 × 20/25行</td></tr><tr><td>シリアル通信</td><td>S10 / μPD8251</td></tr></tbody></table></div><MediaAsset asset="pc8001" compact /></div>

<SlideFooter :number="2" chapter="01 / プログラムを届けたい" />

<!--
伝えること: PC-8001の機種仕様と実機開発の前提を一覧にする。
前からのつながり: 前ページの「47年前のPCでローカルLLMクライアントを動かしてみた」を受け、このページの対象を説明する。
技術補足: CPUはμPD780C-1、Z80互換。標準RAM16KBは機種仕様であり所有機の増設量は未確認。写真は未提供で実機を模した図を作らない。
仕様補足: NEC公式製品情報のCPUクロック欄は型番末尾と周波数が連結されている。μPD780C-1 / 4 MHzとして科学館資料でも照合。ROM24 KB、N-BASIC、代表的な40/80文字・20/25行、8251は以下の資料で確認。PC-8001B資料は補助資料とし、初代所有機との差を自動的に同一視しない。
次への導入: 次は「開発目標：Z80機械語を実機で実行する」を説明する。
出典:
- https://www.kahaku.go.jp/exhibitions/vm/past_parmanent/rikou/computer/pc8001.html
- https://support.nec-lavie.jp/support/product/data/spec/cpu/b020-1.html
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://oldcrap.org/wp-content/uploads/2024/07/nec-pc8001b-users-manual.pdf
- https://www.sci-museum.jp/wp-content/themes/scimuseum2021/uploads/publication/73_pdf.pdf
-->

---
layout: default
---

# 開発目標：Z80機械語を実機で実行する

<FlowDiagram :items="[{'title': 'アセンブル', 'text': 'Mac / Z80ソース\n機械語を生成'}, {'title': '転送', 'text': 'バイナリを\n実機RAMへ配置'}, {'title': '実行', 'text': '機械語を実行\nCRT表示を確認'}]" /><p>実行対象：初代PC-8001 / N-BASIC環境</p><p class="muted">アプリ領域：D000–D7FF（2 KB）</p>

<SlideFooter :number="3" chapter="01 / プログラムを届けたい" />

<!--
伝えること: Z80ソースから実機RAMへの配置・実行までの開発目標を示す。
前からのつながり: 前ページの「NEC PC-8001 — ハードウェア仕様」を受け、このページの対象を説明する。
技術補足: Zig_80はホスト側の開発環境。PC側ではアセンブル済みのZ80機械語を実行する。実測を伴わない個人の感情や回数は捏造しない。
次への導入: 次は「課題：MacからPC-8001へのプログラム転送」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# 課題：MacからPC-8001へのプログラム転送

<table class="fact-table "><thead><tr><th>対象</th><th>転送の前提</th></tr></thead><tbody><tr><td>Mac側</td><td>アセンブル済みバイナリをファイルとして生成</td></tr><tr><td>PC-8001側</td><td>実行前に、受信コードとバイナリをRAMへ配置</td></tr><tr><td>初回導入</td><td>受信コードを機械語モニターから直接入力</td></tr></tbody></table><p class="muted">今回の導入時点では、カセット入力用の音声ケーブルが未用意。</p>

<SlideFooter :number="4" chapter="01 / プログラムを届けたい" />

<!--
伝えること: 転送前に受信コードのRAM配置が必要であることを示す。
前からのつながり: 前ページの「開発目標：Z80機械語を実機で実行する」を受け、このページの対象を説明する。
技術補足: 音声ケーブル未用意はbootstrap文書の実機条件。後にCMT/WAV出力も追加されたが物理カセットロードは未確認。
次への導入: 次は「機械語モニターによる直接入力」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# 機械語モニターによる直接入力

<div class="photo-grid"><div><p><strong>Sコマンド</strong>で16進数を書き込む。</p><p><strong>Dコマンド</strong>で全バイトを表示し、生成コードと照合する。</p><p class="muted">照合後、DEFUSR / USRで起動。</p></div><MediaAsset asset="typing" compact /></div>

<SlideFooter :number="5" chapter="01 / プログラムを届けたい" />

<!--
伝えること: モニターでの書込・読み返し・起動手順を示す。
前からのつながり: 前ページの「課題：MacからPC-8001へのプログラム転送」を受け、このページの対象を説明する。
技術補足: NECモニターSで変更しDで表示する。具体的なMON画面は素材未提供。所要時間やミス回数は記録がないため記載しない。
次への導入: 次は「初期ローダー：333バイトの手入力」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# 初期ローダー：333バイトの手入力

<div class="split"><div><div class="large-number">333 <small>B</small></div><p>当初のStage 0<br>配置：E400–E54C</p><p class="muted">受信・検査・次段への制御移行</p></div><div><table class="fact-table "><thead><tr><th>入力方式</th><th>総入力文字数</th></tr></thead><tbody><tr><td>MON</td><td><strong>883</strong></td></tr><tr><td>BASIC</td><td><strong>1,406</strong></td></tr></tbody></table><p class="small muted">確認・起動操作を含む集計。<br>BASICはDATA文21行。</p></div></div>

<SlideFooter :number="6" chapter="02 / 転送する仕組み" />

<!--
伝えること: 初期333 Bローダーの入力負担を数値で示す。
前からのつながり: 前ページの「機械語モニターによる直接入力」を受け、このページの対象を説明する。
技術補足: 当初333Bを手入力したことは今回のユーザー提供の開発経緯。文字数は最新文書の従来経路の計算値。MONコード入力のみ813文字、全工程883。BASICのファイルサイズ1420Bと総入力1406文字を混同しない。333BはE400–E54C。後に中継へ再利用する。
次への導入: 次は「課題：手入力では開発サイクルを回せない」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# 課題：手入力では開発サイクルを回せない

<table class="fact-table "><thead><tr><th>工程</th><th>開発サイクル上の課題と対策</th></tr></thead><tbody><tr><td>手入力</td><td>入力・全バイト照合・起動操作が必要</td></tr><tr><td>初回導入</td><td>受信ローダーを手入力する</td></tr><tr><td>通常の反復</td><td>ローダーをRAMに保持し、Macから再転送する</td></tr></tbody></table><p class="muted">目標：ソース修正後の転送・検証・実行をCLIで行う。</p>

<SlideFooter :number="7" chapter="02 / 転送する仕組み" />

<!--
伝えること: 手入力の反復を常駐とCLI転送で置き換える要件を示す。
前からのつながり: 前ページの「初期ローダー：333バイトの手入力」を受け、このページの対象を説明する。
技術補足: 毎回333Bを実際に再入力した回数の主張ではない。常駐ローダーがRAMに残る間の再デプロイを目指す。mini化と通信診断は並行した開発であり、以後は理解のために通信とローダーを分けて説明する。
次への導入: 次は「PC-8001のS10シリアルインターフェース」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# PC-8001のS10シリアルインターフェース

<div class="photo-grid"><div><p><strong>S10 / μPD8251</strong></p><p>TX：送信<br>RX：受信<br>GND：信号基準の共有</p><p class="small muted">TTLレベルの反転信号。<br>一般的なRS-232の電気条件とは区別。</p></div><MediaAsset asset="wiring" compact /></div>

<SlideFooter :number="8" chapter="02 / 転送する仕組み" />

<!--
伝えること: S10の送受信と電気的条件の区別を示す。
前からのつながり: 前ページの「課題：手入力では開発サイクルを回せない」を受け、このページの対象を説明する。
技術補足: 公開資料のTTL反転信号に基づき実機条件を確認する。物理ピン番号、電圧、向きの推測図は作らない。UARTは8251。候補接続表と所有機の実測を区別する。
次への導入: 次は「Raspberry Pi Pico 2によるUSB–UARTブリッジ」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
-->

---
layout: default
---

# Raspberry Pi Pico 2によるUSB–UARTブリッジ

<HardwareTopology />

<SlideFooter :number="9" chapter="02 / 転送する仕組み" />

<!--
伝えること: USB–UARTブリッジの接続と信号方向を示す。
前からのつながり: 前ページの「PC-8001のS10シリアルインターフェース」を受け、このページの対象を説明する。
技術補足: 図は論理構成。Pico GP0 TX→S10 /RXD、S10 /TXD→GP1 RX、GND共有。PIOがUARTを実装する。電圧や物理ピン番号の配線手順ではない。
次への導入: 次は「通信仕様：300bps / 8N1 / 反転UART」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# 通信仕様：300bps / 8N1 / 反転UART

<UartFrame /><div class="split"><div><p><strong>8N1</strong><br>8bit / パリティなし / 停止1bit</p><p class="muted">1バイト = start 1 + data 8 + stop 1</p></div><div><div class="number">30 <small>B/s</small></div><p class="small muted">300bit/s ÷ 10bitの理論上限。<br>反転UARTのアイドルはLow。<br>PIOで信号の極性を処理する。</p></div></div>

<SlideFooter :number="10" chapter="02 / 転送する仕組み" />

<!--
伝えること: 300bps・8N1・反転UARTと理論転送量を示す。
前からのつながり: 前ページの「Raspberry Pi Pico 2によるUSB–UARTブリッジ」を受け、このページの対象を説明する。
技術補足: 8N1はstart1+data8+stop1=10bit。30B/sは線路上の理論上限でありpayload速度や推論速度ではない。TX/RXは反転モード。外部反転回路との二重反転に注意。
次への導入: 次は「USB通信の停止と原因の切り分け」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# USB通信の停止と原因の切り分け

<div class="split"><div><h2>現象</h2><p>USB要求がタイムアウト。</p><h2>切り分け</h2><p>PC電源OFF・信号線切り離し。<br>UART無効でも再現。</p></div><div><h2>観測値</h2><div class="log-extract">Pico 単体<br>uptime 減少<br>watchdog_reboot = 1</div><p class="caption">実機記録の要約</p></div></div><p class="takeaway">PCのローダーやUART信号を必要としない再現条件を確認。</p>

<SlideFooter :number="11" chapter="02 / 転送する仕組み" />

<!--
伝えること: USB停止をPico単体へ切り分けた条件と観測値を示す。
前からのつながり: 前ページの「通信仕様：300bps / 8N1 / 反転UART」を受け、このページの対象を説明する。
技術補足: 0.1.0単体probeで約25秒のTimeout。0.1.1でuptime減少とwatchdog_reboot/timeout_reboot=1を観測。USB再認識だけで原因を決めずHEALTHで再起動を測定した。
次への導入: 次は「Watchdog再起動への対処」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md#実機試行の記録2026-10-26
-->

---
layout: default
---

# Watchdog再起動への対処

<div class="split"><div><h2>変更</h2><p>停止直前の記録は待機区間。<br>アラーム/WFE起床経路を回避。</p><div class="log-extract">sleep_us(50)<br>↓<br>busy_wait_us_32(50)</div></div><div><h2>実測結果</h2><div class="number">120 <small>秒</small></div><p>USB単体試験が正常終了</p><p class="muted">714応答 / watchdogフラグ0<br>同一アダプター・UART無効</p></div></div><p class="caption">SDK内部の停止箇所・根本原因は未確定。長時間の無再発を保証しない。</p>

<SlideFooter :number="12" chapter="02 / 転送する仕組み" />

<!--
伝えること: 待機処理の変更とUSB単体試験の結果・限界を示す。
前からのつながり: 前ページの「USB通信の停止と原因の切り分け」を受け、このページの対象を説明する。
技術補足: 0.1.2 previous_watchdog_phase=7（sleep_us区間）。0.1.3は50usの待機をbusy_wait_us_32へ変更。アラーム/WFE起床経路を避けた。watchdog250ms、TXリース1秒は維持。同じアダプター・UART無効・線切離しで120秒、714応答、最大866us、ループ間隔最大223us。これはPC通信の成功証明ではなく再発なしの保証でもない。
次への導入: 次は「連続256バイト通信でのフレーミングエラー」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/commit/48f99d0
-->

---
layout: default
---

# 連続256バイト通信でのフレーミングエラー

<div class="split"><div><h2>現象</h2><p>返送00–B8の185 Bは一致。<br>B9を期待した位置で6Eを受信。</p><p class="muted">framing flag = 1</p></div><div class="log-extract">期待: … B7 B8 B9 BA …<br>受信: … B7 B8 6E<br><br>条件: 実機からの連続返送</div></div><p class="takeaway">単体ループバックは追加idleあり。隙間なし条件は未検証だった。</p>

<SlideFooter :number="13" chapter="02 / 転送する仕組み" />

<!--
伝えること: 実機の連続返送で発生した受信エラーの条件を示す。
前からのつながり: 前ページの「Watchdog再起動への対処」を受け、このページの対象を説明する。
技術補足: 0.1.3でminiから333B中継の起動までは確認済み。TX/RX取り違えは別途修正後の試行。PC保存status PE/OE/FE=0でもPico側framingを観測し全体成功にはしない。従来Pico TXはフレーム間に追加idleがあり単体ループバックでは連続条件を覆わなかった。
次への導入: 次は「PIO受信タイミングの修正」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# PIO受信タイミングの修正

<div class="split"><div><h2>再現条件</h2><p>隙間なし・クロック差・位相差を<br>実PIOモデルへ追加。</p><p class="muted">変更前：相手が1〜2%速い<br>16ケースで失敗。</p></div><div><h2>変更と結果</h2><p><strong>RX：8 → 16 cycle</strong><br>次フレームの開始待ちを調整。</p><p class="muted">変更後：40条件すべてで<br>256 B一致。</p></div></div><p class="caption">300bps・8N1・TX側は維持。モデルでの検証結果であり、実機確認は次ページ。</p>

<SlideFooter :number="14" chapter="02 / 転送する仕組み" />

<!--
伝えること: PIOモデルでの再現条件、RX変更、検証結果を示す。
前からのつながり: 前ページの「連続256バイト通信でのフレーミングエラー」を受け、このページの対象を説明する。
技術補足: 0.1.4はRXのみ16cycleへ。TX8cycle、300baud、8N1、極性、USB形式、安全期限は変更しない。両極性・独立クロック±2%・4位相など40条件。B9位置の物理エラーが同じ根本原因と証明されたわけではない。
次への導入: 次は「実機通信テスト：256バイト完全一致」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# 実機通信テスト：256バイト完全一致

<div class="split"><div><div class="large-number">256 <small>/ 256</small></div><p>00〜FFが完全一致。</p><p class="muted">実機PC-8001 / Pico 0.1.4</p></div><div><div class="log-extract">missing = 0<br>extra = 0<br>mismatch = 0<br>CRC16 = OK</div><p class="caption">往復 約17.84秒。再送0。<br>記録値の抜粋。実行しない通信試験。</p></div></div>

<SlideFooter :number="15" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 実機256 B往復の一致と計測区間を示す。
前からのつながり: 前ページの「PIO受信タイミングの修正」を受け、このページの対象を説明する。
技術補足: 2026-10-26 mini→333B中継→T非実行256B往復。263UARTイベントflags=0、PC PE/OE/FE=0。17,842,484usは往復区間であり38,266,301usのセッション全体と分ける。この時点で常駐・アプリはロードしていない。miniの小型化自体は並行して実装済み。説明の次節で導入構造と改善経緯を扱う。
次への導入: 次は「転送・RAM検証・実行・復帰」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-mini-preflight-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# 転送・RAM検証・実行・復帰

<FlowDiagram :items="[{'title': 'DATA', 'text': '指定したRAMへ書込'}, {'title': 'VERIFY', 'text': '実RAMを再読\nCRC照合'}, {'title': 'EXEC', 'text': '検証後に明示実行'}, {'title': 'RET', 'text': '常駐ローダーへ復帰'}]" /><p>転送・検証・実行を<strong>独立した要求</strong>として処理。</p><p class="muted">アプリ書込許可範囲：D000–D7FF<br>復帰後の再実行には、再VERIFYが必要。</p>

<SlideFooter :number="16" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 転送・RAM検証・実行・復帰の要求と状態を区別する。
前からのつながり: 前ページの「実機通信テスト：256バイト完全一致」を受け、このページの対象を説明する。
技術補足: 常駐プロトコルはCRC16付き。VERIFYは受信時の累積CRCでなく配置済みRAMを再計算。EXECは独立要求。RETは規約を守るアプリのみ。任意コードの実行時隔離や暴走復帰は保証しない。
次への導入: 次は「3段階のブートストラップ」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
-->

---
layout: default
---

# 3段階のブートストラップ

<FlowDiagram :items="[{'title': 'mini Stage 0', 'text': '100 B / 手入力\nE300–E363'}, {'title': '中継 Stage 1', 'text': '333 B / 転送\nE400–E54C'}, {'title': '常駐ローダー', 'text': '実コード 1,134 B\n転送 1,280 B'}]" /><p class="small muted">mini → 中継は加算チェックサム（SUM8）。中継 → 常駐はCRC16。</p><p class="takeaway">常駐は D800–DCFF。<br>アプリ用の <strong>D000–D7FF（2KB）</strong> を残す。</p>

<SlideFooter :number="17" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 3段階の導入とサイズ・配置・検査方式を示す。
前からのつながり: 前ページの「転送・RAM検証・実行・復帰」を受け、このページの対象を説明する。
技術補足: miniはREADY37hを送り333B+SUM8を受信する。SUM8はCRC16より弱く複数誤りや順序交換をすべて検知しない。中継は旧stage0.asm、常駐はstage1.asmという互換ファイル名。実コード1134+ゼロ埋め146=1280。常駐のスタックE700–E7FFはアプリ2KBとは別。E900以降は転送禁止。
次への導入: 次は「初期ローダーを333Bから100Bに削減」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
-->

---
layout: default
---

# 初期ローダーを333Bから100Bに削減

<div class="comparison"><div><p>当初の Stage 0</p><div class="large-number">333 <small>B</small></div><p class="muted">MON 総入力883文字</p></div><div class="arrow">→</div><div><p>mini Stage 0</p><div class="large-number">100 <small>B</small></div><p><strong>MON 総入力319文字</strong></p></div></div><p class="takeaway">元の333バイトは、中継役としてそのまま使う。</p>

<SlideFooter :number="18" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 333 Bから100 Bへ削減した入口と入力文字数を比較する。
前からのつながり: 前ページの「3段階のブートストラップ」を受け、このページの対象を説明する。
技術補足: 100Bの入口を追加し333Bコードは変更せず再利用。mini MONコード入力のみ249文字、全工程319文字。BASIC mini7行/757文字。CLEAR/WIDTH、D全バイト確認、DEFUSR/USR、RETURN/CTRL+Bを含む集計。入力時間の実測ではない。小型化は前の通信検証と並行し、後から着手したと断定しない。
次への導入: 次は「Zig_80によるビルド・デプロイ」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# Zig_80によるビルド・デプロイ

<p class="small muted">常駐ローダー待機中。Zig_80リポジトリのルートで実行。</p>

```sh
zig build
zig-out/bin/zig80 asm examples/pc8001/hello.asm \
  -o zig-out/pc8001/hello.bin
zig-out/bin/zig80 deploy zig-out/pc8001/hello.bin \
  --target pc8001 --port /dev/cu.usbmodemXXXX \
  --enable-tx --voltage-confirmed \
  --wait-return --log hello.jsonl
```

<p class="caption">ポートは実際のデバイスへ置換。送信フラグは実機の電気条件確認後に指定する。</p>

<SlideFooter :number="19" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: READMEとCLI実装に照合したビルド・デプロイ手順を示す。
前からのつながり: 前ページの「初期ローダーを333Bから100Bに削減」を受け、このページの対象を説明する。
技術補足: READMEのzig buildとasmの構文、docs/pc8001-serial-loader.mdのdeploy例、src/main.zigとsrc/serial/deploy.zigのusage/parseを照合。実機への送信は今回の資料作成中に再実行しない。PORTは例示。新規ログ名を使う。完全な初回導入手順ではない。
次への導入: 次は「常駐ローダーによる繰り返しデプロイ」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/main.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/deploy.zig
-->

---
layout: default
---

# 常駐ローダーによる繰り返しデプロイ

<FlowDiagram :items="[{'title': 'アプリA', 'text': '転送・検証・実行'}, {'title': 'RET', 'text': '常駐ローダー待機'}, {'title': 'アプリB', 'text': '再転送・検証・実行'}]" /><ul class="constraints"><li>常駐コードとスタックを保持している間は、手入力・USR不要。</li><li>電源断・RESET後は再導入。</li><li>アプリがローダーやスタックを破壊した場合の復帰は保証しない。</li></ul>

<SlideFooter :number="20" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 常駐を保持した再デプロイの条件と制約を示す。
前からのつながり: 前ページの「Zig_80によるビルド・デプロイ」を受け、このページの対象を説明する。
技術補足: 初回はCLEAR/MON→mini→中継→常駐。通常deployは既定stage1（常駐）を使う。再EXECは再VERIFYが必要。常駐はRAMのプログラムで電源断後に保持されるという意味ではない。helloからORBITALへの差し替えで実機の反復を確認。
次への導入: 次は「Zig_80のアーキテクチャと開発機能」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
-->

---
layout: default
---

# Zig_80のアーキテクチャと開発機能

<FlowDiagram :items="[{'title': 'アセンブラ', 'text': '2パス / シンボル解決\nZ80ソース → バイナリ'}, {'title': 'CPUモデル', 'text': '命令実行・テスト\n周辺機器は専用試験'}, {'title': 'CLI / TUI', 'text': '編集・デバッグ\ndeployによる実機転送'}]" /><p>アセンブラ・CPUモデル・実機デプロイをZig_80に統合。</p><p class="small muted">汎用runプロファイルとPC-8001専用の周辺機器試験は別。<br>電気的・サイクル精密な実機エミュレーションではない。</p>

<SlideFooter :number="21" chapter="04 / 実機でコードを書く" />

<!--
伝えること: アセンブラ・CPUモデル・CLI/TUI・実機デプロイの関係を示す。
前からのつながり: 前ページの「常駐ローダーによる繰り返しデプロイ」を受け、このページの対象を説明する。
技術補足: Zig製の2パスアセンブラ、Z80 CPU、CLI/TUIを提供。PC8001の検証は専用テストの8251/CRTC等モデル。汎用CLI runへhello.binを渡すだけでPC8001実機を再現するとは言わない。
次への導入: 次は「最初の実行結果：画面表示の不一致」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# 最初の実行結果：画面表示の不一致

<div class="split"><div><h2>現象と原因</h2><p>転送・CRC・実行・復帰は成功。<br>29 B版の表示文字は不一致。</p><p class="muted">80文字モードを前提に、<br>連続VRAMセルへ書き込んでいた。</p></div><div><table class="fact-table "><thead><tr><th>表示モード</th><th>書込先の間隔</th></tr></thead><tbody><tr><td>80文字</td><td>1 B</td></tr><tr><td>40文字</td><td><strong>2 B</strong></td></tr></tbody></table><p class="small muted">対処：現在のモードを読み取り、<br>文字セルの間隔を切り替える。</p></div></div>

<SlideFooter :number="22" chapter="04 / 実機でコードを書く" />

<!--
伝えること: 表示不一致の原因を40/80文字モードのセル間隔で説明する。
前からのつながり: 前ページの「Zig_80のアーキテクチャと開発機能」を受け、このページの対象を説明する。
技術補足: 旧29B版はCRC6283。修正版はEA66のport30保存値bit0を読む。40/80両モードの表示セルと属性保持をCPU回帰テストで確認した。所有機のモードは復帰A=00で40文字を確認。
次への導入: 次は「HELLO — 44バイトのZ80プログラム」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json
-->

---
layout: default
---

# HELLO — 44バイトのZ80プログラム

<div class="split"><div><p><strong>HELLO FROM ZIG_80</strong><br>実機で全文一致を確認。</p><p class="muted">転送・RAM検証・実行・RET復帰。</p>

```asm
    inc de
    bit 0,c
    jr nz,next_character
    inc de
```

<p class="caption">40文字モードでは、さらに1セル進める。</p></div><MediaAsset asset="hello" compact /></div>

<SlideFooter :number="23" chapter="04 / 実機でコードを書く" />

<!--
伝えること: HELLOの実コードと実機確認結果を示す。
前からのつながり: 前ページの「最初の実行結果：画面表示の不一致」を受け、このページの対象を説明する。
技術補足: hello.asmの1回目のinc deから2回目のinc deまでの原文抜粋。HLは文字列、DEはVRAM。Cのbit0が0なら40文字で2バイト間隔。44B/CRC ADC1。2026-10-26オペレーターが全文一致、ホストがEXEC/RETURNを確認。動画は未提供なので映像再生成功を主張しない。
次への導入: 次は「ORBITAL RINGS — 582バイトの描画デモ」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json
-->

---
layout: default
---

# ORBITAL RINGS — 582バイトの描画デモ

<div class="split"><div><p>64×64セミグラフィックで<br>2本のリングを描画。</p><ul class="constraints"><li>コード・テーブル：582 B</li><li>128フレーム後にRET</li><li>実機で動き・終了表示・復帰を確認</li></ul><p class="small muted">状態領域と属性保存領域は別途使用。</p></div><MediaAsset asset="orbital" compact /></div>

<SlideFooter :number="24" chapter="04 / 実機でコードを書く" />

<!--
伝えること: 描画デモのサイズ・動作・実機確認範囲を示す。
前からのつながり: 前ページの「HELLO — 44バイトのZ80プログラム」を受け、このページの対象を説明する。
技術補足: コードD000–D245、状態D4E0–D4E5、属性保存640B D500–D77F。582Bだけが全RAM使用量という意味ではない。実機CRC A9DB、復帰A52h、ユーザーがリングと終了表示を確認。属性全バイト復元・保護領域保持はCPUモデル検証。約14.277秒はEXEC ACKから復帰通知までで純粋な描画時間ではない。
次への導入: 次は「キーボード入力と画面制御」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-demos.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/orbital_rings.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-orbital-rings-014.json
-->

---
layout: default
---

# キーボード入力と画面制御

<FlowDiagram :items="[{'title': 'キー入力', 'text': 'キーマトリクスを直接走査'}, {'title': '入力処理', 'text': '文字・Shift・削除\nReturnで送信'}, {'title': '出力', 'text': 'VRAM更新\nシリアル送信'}]" /><p>Mini Invaders：左右移動・SPACE射撃を実機確認。</p><p class="caption">ゲームの実機ESC終了・勝敗・再挑戦は未確認。<br>チャットのキー入力・表示制御へ同じ入出力の扱いを展開。</p>

<SlideFooter :number="25" chapter="04 / 実機でコードを書く" />

<!--
伝えること: キーボード走査から入力処理・画面更新・通信までを示す。
前からのつながり: 前ページの「ORBITAL RINGS — 582バイトの描画デモ」を受け、このページの対象を説明する。
技術補足: Mini Invaders1361Bの左右/SPACE動作を実機確認。ESC等はモデル検証と分ける。チャットはROMや割り込みに頼らずactive-lowキーマトリクスを直接走査し、Shift、削除、64B入力を扱う。完成UIの画像はまだ出さない。
次への導入: 次は「LLMクライアントの実装要件」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-invaders.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
-->

---
layout: default
---

# LLMクライアントの実装要件

<table class="fact-table "><thead><tr><th>要件</th><th>実装内容</th></tr></thead><tbody><tr><td>入力</td><td>最大64 B / 文字編集 / Returnで質問を送信</td></tr><tr><td>受信・表示</td><td>CRC検査済みの回答を逐次表示</td></tr><tr><td>通信状態</td><td>回答完了・エラー後に次の入力を受け付ける</td></tr><tr><td>推論への接続</td><td>Mac上のホストがOllamaへHTTP接続</td></tr></tbody></table><p class="small muted">PC側はASCIIクライアント。LLM推論はMac側で実行。</p>

<SlideFooter :number="26" chapter="04 / 実機でコードを書く" />

<!--
伝えること: LLMクライアントの入力・表示・通信・推論接続要件を示す。
前からのつながり: 前ページの「キーボード入力と画面制御」を受け、このページの対象を説明する。
技術補足: PC側でLLM推論を行うのではない。PC側はASCII端末。このページではクライアントの実装要件だけを提示し、完成UIは見せない。
次への導入: 次は「システム構成：PC-8001からOllamaまで」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# システム構成：PC-8001からOllamaまで

<ChatSequence /><p class="small muted">Mac上のZigホスト：HTTP接続・会話履歴・文字変換<br>Mac上のOllama / Gemma：推論（実機記録はgemma3:1b）</p>

<SlideFooter :number="27" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 機器ごとの役割と質問・HTTP・逐次回答の時系列を示す。
前からのつながり: 前ページの「LLMクライアントの実装要件」を受け、このページの対象を説明する。
技術補足: HTTPはホストのloopback POST /api/chat、履歴と正規化もZigホスト。Picoファームウェア変更不要。実機記録はgemma3:1b、最新docのgemma4例と実機モデルを混同しない。
次への導入: 次は「300bpsに合わせたストリーミング転送」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_ollama.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# 300bpsに合わせたストリーミング転送

<FlowDiagram :items="[{'title': 'Ollama', 'text': 'NDJSONを逐次受信'}, {'title': 'Zigホスト', 'text': 'ASCIIへ正規化\n通常8 Bずつに分割'}, {'title': 'PC-8001', 'text': 'CRC検査後に表示\nACKを返送'}]" /><div class="split"><div><p>送出条件：8 B・改行<br>100ms・回答完了</p><p class="muted">小さいチャンクは表示更新を細分化。<br>CRC・ACKのオーバーヘッドは増加。</p></div><div><div class="number">30 <small>B/s</small></div><p class="small muted">300bps / 8N1の理論上限。<br>プロトコル込みの実効速度とは異なる。</p></div></div>

<SlideFooter :number="28" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: チャンク送信と低速回線上のオーバーヘッドを示す。
前からのつながり: 前ページの「システム構成：PC-8001からOllamaまで」を受け、このページの対象を説明する。
技術補足: NDJSONを逐次解析、TEXTは既定8B、LF、100ms、DONEでflush。1〜32B設定可。時間は送出の目標で伝送完了期限ではない。未ACKバイトを保持し、UART/ACK待ちはHTTP読出しを止める。ASCII大文字化と非ASCIIの?変換、160文字上限。完成回答に人工文字遅延を掛ける方式ではない。
次への導入: 次は「2KBのアプリ領域とメモリ配置」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_queue.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_text.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_protocol.zig
-->

---
layout: default
---

# 2KBのアプリ領域とメモリ配置

<p>アプリ領域：<strong>D000–D7FF = 2,048 B</strong></p><MemoryBudget /><p>作業領域：入力64 B・送受信フレーム・キー状態など</p><p class="small muted">スタックは常駐ローダーの別領域（E700–E7FF）を使用。<br>1,743 Bにはコード・テーブル・3 BのACK scratchを含む。<br>未割当94 Bのうち、コード直後の空きは70 B。</p>

<SlideFooter :number="29" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: コード・作業領域・未割当を2 KB内で整合させる。
前からのつながり: 前ページの「300bpsに合わせたストリーミング転送」を受け、このページの対象を説明する。
技術補足: D000–D6CE 1743B、D6CF–D714 70B空き、TX35B、前回RX37B、key10B、状態28B、prompt64B、RX37B=211B。D767–D76Fの9BとD7F1–D7FFの15Bも未割当で計94B。1743+211+94=2048。スタックE700–E7FFは常駐の既存256Bで、この2048へ加算する数値ではない。
次への導入: 次は「実機テスト結果と検証範囲」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# 実機テスト結果と検証範囲

<table class="fact-table"><thead><tr><th>版</th><th>実機で確認</th><th>残っている確認</th></tr></thead><tbody><tr><td>旧UI / 1,683 B</td><td>10往復・ESC復帰<br>常駐の再応答</td><td>30分耐久・80文字モード</td></tr><tr><td>新UI / 1,743 B</td><td>入力・横スクロール<br>会話スクロール</td><td>この版のESC復帰<br>次のdeploy</td></tr></tbody></table><p class="takeaway">新UIでは<strong>入力欄を固定</strong>し、会話だけをスクロール。</p><p class="caption">2026-10-27の記録時点。新UIも30分耐久・実機80文字モードは未確認。</p>

<SlideFooter :number="30" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 旧UIと新UIの実機確認済み・未確認を分ける。
前からのつながり: 前ページの「2KBのアプリ領域とメモリ配置」を受け、このページの対象を説明する。
技術補足: 旧UI1683B/F1A3は10往復・ESC・HELLO/ABORT・TX解放。新UI1743B/B9A6は5往復の記録時点で継続中、ESC未操作。モデルでの15往復・復帰試験を新UIの物理実測と混同しない。UIそのものの絵やサムネイルはまだ出さない。
次への導入: 次は「デモ：PC-8001からGemmaとチャット」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: video-focus
---

# デモ：PC-8001からGemmaとチャット

<MediaAsset asset="gemma" />

<SlideFooter :number="31" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 31枚目だけに完成チャット実機映像の領域を置く。
前からのつながり: 前ページの「実機テスト結果と検証範囲」を受け、このページの対象を説明する。
技術補足: 現状は動画未提供。生成映像、疑似チャット、過去UIの画像で代用しない。素材が届いたらconfig/media.jsonのgemmaだけを更新する。新UIなら1743B/B9A6との整合を確認し、映像から見えない終了検証を成功扱いしない。手動再生。PDFでは対応MP4名を示す。
次への導入: 次は「実装結果と今後の課題」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# 実装結果と今後の課題

<div class="split"><div><h2>実装結果</h2><ul class="constraints"><li>mini Stage 0（100 B）から<br>常駐ローダーを導入</li><li>HELLO・描画デモの<br>転送・検証・実行・復帰</li><li>PCの入力・表示を<br>MacのLLM推論へ接続</li></ul></div><div><h2>未確認・今後の課題</h2><ul class="constraints"><li>新UIの実機ESC復帰・次のdeploy</li><li>実機80文字モード</li><li>30分耐久試験</li></ul></div></div>

<SlideFooter :number="32" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 実装済みの機能と未確認の実機試験を整理する。
前からのつながり: 前ページの「デモ：PC-8001からGemmaとチャット」を受け、このページの対象を説明する。
技術補足: 到達点はPC単体のLLM推論ではなく、Macとの協調による実機クライアント。耐久や次デプロイなどの残課題は前スライドとfactsの範囲を維持。
次への導入: 次は「Zig_80 — ソースコードと資料」を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: cover
---

<div class="eyebrow">ZIG_80 / PC-8001</div>

# Zig_80 — ソースコードと資料

<p class="small muted">Z80アセンブラ / CPUモデル / CLI・TUI / 実機デプロイ</p>
<a class="closing-link" href="https://github.com/moribit/Zig_80">github.com/moribit/Zig_80</a>
<p class="small muted" style="margin-top:24px">スライド・発表原稿</p>
<a class="closing-link" href="https://github.com/moribit/Zig_80_LT">github.com/moribit/Zig_80_LT</a>

<SlideFooter :number="33" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: ソースコードと発表資料の参照先を示す。
前からのつながり: 前ページの「実装結果と今後の課題」を受け、このページの対象を説明する。
技術補足: リンクはGitHub正本。発表HTMLはリンクを開く操作をしなければネット接続不要。QRコードは未提供で生成しない。
次への導入: 質疑へ。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md
-->
