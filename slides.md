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

<div class="subtitle">実機にコードを届けるところから、はじまった。</div>

<SlideFooter :number="1" chapter="01 / プログラムを届けたい" />

<!--
伝えること: 最終ゴールをタイトルで明示する。完成画面は伏せて開発の過程へ招く。
前からのつながり: 導入。成果映像を冒頭へ置かない。
技術補足: 47年は2026−1979の年差。LLM推論はMac側でありPC-8001側はクライアント。
次への導入: まず1979年のPCがどういう機械かを紹介する。
出典:
- https://jpn.nec.com/profile/corp/history/pdf/history-120.pdf
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# PC-8001という1979年のパソコン

<div class="photo-grid"><div><p><strong>Z80互換CPU</strong>の8ビットPC<br>N-BASICがROMに入っている。</p><p class="muted">キーボードで入力し、<br>CRTへ文字を表示する。</p><p class="small muted">標準RAM16KB（機種仕様）。<br>今回は予約したRAMへ機械語を置く。</p></div><MediaAsset asset="pc8001" compact /></div>

<SlideFooter :number="2" chapter="01 / プログラムを届けたい" />

<!--
伝えること: PC-8001を今回の入出力と結び付けて紹介する。
前からのつながり: タイトルの47年前を実物の機械へつなげる。
技術補足: CPUはμPD780C-1、Z80互換。標準RAM16KBは機種仕様であり所有機の増設量は未確認。写真は未提供で実機を模した図を作らない。
次への導入: このキーボードと画面を自分のプログラムで使いたくなった。
出典:
- https://www.kahaku.go.jp/exhibitions/vm/past_parmanent/rikou/computer/pc8001.html
- https://support.nec-lavie.jp/support/product/data/spec/cpu/b020-1.html
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
-->

---
layout: default
---

# このPCで、自分のコードを動かしたい

<div class="hero-message">Macで書いたZ80のコードを、<br><strong>目の前の実機</strong>で動かしたい。</div><FlowDiagram :items="[{'title': '書く', 'text': 'Mac / Z80アセンブリ'}, {'title': '動かす', 'text': 'PC-8001 / RAM'}, {'title': '見る', 'text': 'CRT / 実際の表示'}]" />

<SlideFooter :number="3" chapter="01 / プログラムを届けたい" />

<!--
伝えること: 挑戦の動機と最初の到達点を示す。
前からのつながり: PCの紹介から、自分がこの機械でやりたいことへ進む。
技術補足: Zig_80はホスト側の開発環境。PC側ではアセンブル済みのZ80機械語を実行する。実測を伴わない個人の感情や回数は捏造しない。
次への導入: コードを書く手段より前に、コードを入れる手段が問題になる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# でも、どうやってプログラムを入れる？

<div class="split"><div><p class="lead">Macにはバイナリがある。<br>実機のRAMには、まだない。</p><p class="muted">今回はカセット入力用の<br>音声ケーブルもなかった。</p></div><div><p class="lead">まず必要なのは、<br><strong>プログラムを受け取る<br>プログラム。</strong></p></div></div><p class="takeaway">その最初の一歩は、キーボードから入れる。</p>

<SlideFooter :number="4" chapter="01 / プログラムを届けたい" />

<!--
伝えること: 転送用プログラムにも導入手段が必要という循環を伝える。
前からのつながり: 自分のコードを実機で動かすにはRAMへ届ける必要がある。
技術補足: 音声ケーブル未用意はbootstrap文書の実機条件。後にCMT/WAV出力も追加されたが物理カセットロードは未確認。
次への導入: MONで機械語を手入力する工程へ。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# まずは機械語を手入力

<div class="photo-grid"><div><p>16進数を入力する。</p><p>全バイトを読み返し、<br><strong>元のコードと照合する。</strong></p><p class="muted">動く前に、<br>正しく入ったかを確かめる。</p></div><MediaAsset asset="typing" compact /></div>

<SlideFooter :number="5" chapter="01 / プログラムを届けたい" />

<!--
伝えること: 手入力には入力だけでなく全バイトの確認があることを示す。
前からのつながり: 転送手段がない最初の一回を、手で埋める。
技術補足: NECモニターSで変更しDで表示する。具体的なMON画面は素材未提供。所要時間やミス回数は記録がないため記載しない。
次への導入: 当初の手入力対象は333バイトだった。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# 333バイトを手入力する

<div class="split"><div><div class="large-number">333 <small>B</small></div><p>当初の Stage 0</p><p class="muted">受信・検査・次のコードへの<br>引き渡しを持つ。</p></div><div><table class="fact-table"><thead><tr><th>従来方式</th><th>総入力文字数</th></tr></thead><tbody><tr><td>MON</td><td><strong>883</strong></td></tr><tr><td>BASIC</td><td><strong>1,406</strong></td></tr></tbody></table><p class="small muted">確認・起動操作まで含む集計。<br>BASICは21行のDATA文。</p></div></div>

<SlideFooter :number="6" chapter="02 / 転送する仕組み" />

<!--
伝えること: 機械語のサイズ以上に手入力の負担があることを数値で示す。
前からのつながり: 第1章で見た入力作業を具体的な規模にする。
技術補足: 当初333Bを手入力したことは今回のユーザー提供の開発経緯。文字数は最新文書の従来経路の計算値。MONコード入力のみ813文字、全工程883。BASICのファイルサイズ1420Bと総入力1406文字を混同しない。333BはE400–E54C。後に中継へ再利用する。
次への導入: 毎回この作業を繰り返すのは開発の妨げになる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# 毎回これを入力するのはつらい

<div class="hero-message">コードを1行直すたびに、<br>手入力へ戻りたくない。</div><FlowDiagram :items="[{'title': '初回だけ', 'text': '受信プログラムを手入力'}, {'title': '次から', 'text': 'Macから転送'}, {'title': '目標', 'text': '短い反復で実機を試す'}]" />

<SlideFooter :number="7" chapter="02 / 転送する仕組み" />

<!--
伝えること: 手入力の改善を、実機開発を繰り返すための課題として置く。
前からのつながり: 入力の負担が分かったところで、転送経路を作る動機を示す。
技術補足: 毎回333Bを実際に再入力した回数の主張ではない。常駐ローダーがRAMに残る間の再デプロイを目指す。mini化と通信診断は並行した開発であり、以後は理解のために通信とローダーを分けて説明する。
次への導入: 手元のPCにあるS10を調べる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# PC-8001にはS10という接続口がある

<div class="photo-grid"><div><p>使うのは、<strong>シリアル通信</strong>。</p><p class="muted">TXで送り、RXで受け取る。<br>GNDを共有する。</p><p class="small muted">S10は普通のRS-232端子と<br>同じ電気条件では扱わない。</p></div><MediaAsset asset="wiring" compact /></div>

<SlideFooter :number="8" chapter="02 / 転送する仕組み" />

<!--
伝えること: 既存の接続口を使って外部へつなぐ道筋を示す。
前からのつながり: 毎回の手入力を避けるため、機体側の通信手段へ目を向ける。
技術補足: 公開資料のTTL反転信号に基づき実機条件を確認する。物理ピン番号、電圧、向きの推測図は作らない。UARTは8251。候補接続表と所有機の実測を区別する。
次への導入: S10とMacのUSBをPico 2で橋渡しする。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
-->

---
layout: default
---

# Pico 2をUSBとシリアルの橋渡しに

<HardwareTopology />

<SlideFooter :number="9" chapter="02 / 転送する仕組み" />

<!--
伝えること: Mac、Pico 2、S10、PC-8001の接続と方向を整理する。
前からのつながり: S10側だけではMacのUSBへ直接つながらない。
技術補足: 図は論理構成。Pico GP0 TX→S10 /RXD、S10 /TXD→GP1 RX、GND共有。PIOがUARTを実装する。電圧や物理ピン番号の配線手順ではない。
次への導入: 通信条件には古いPCならではの癖があった。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# 300bpsで、信号も反転している

<UartFrame /><div class="split"><div><p><strong>8N1</strong><br>8bit / パリティなし / 停止1bit</p><p class="muted">1バイトに、開始を含めて10bit。</p></div><div><div class="number">30 <small>B/s</small></div><p class="small muted">300bit/s ÷ 10bit。理論値。<br>反転UARTのアイドルはLow。<br>極性はPicoのPIOで処理する。</p></div></div>

<SlideFooter :number="10" chapter="02 / 転送する仕組み" />

<!--
伝えること: 速度と反転UARTを、後の通信障害とチャット設計の前提にする。
前からのつながり: 橋渡しができても、双方の通信条件が一致している必要がある。
技術補足: 8N1はstart1+data8+stop1=10bit。30B/sは線路上の理論上限でありpayload速度や推論速度ではない。TX/RXは反転モード。外部反転回路との二重反転に注意。
次への導入: 接続できたように見えても、安定通信までは別の壁があった。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# PCを外しても、USBが止まった

<div class="split"><div><p class="lead">USB要求がタイムアウト。<br>PCのコードが原因？</p><p class="muted">PCを停止し、信号線も外す。<br>それでもPico単体で再現した。</p></div><div><div class="log-extract">Pico 単体 / UART 無効<br>uptime が減少<br>watchdog_reboot = 1</div><p class="caption">実機記録の要約。ログ画面の再現ではない。</p></div></div><p class="takeaway">まず、PC-8001を原因候補から切り離せた。</p>

<SlideFooter :number="11" chapter="02 / 転送する仕組み" />

<!--
伝えること: 問題1の現象と切り分けを伝える。
前からのつながり: 設定を揃えても、途中停止が起きた。
技術補足: 0.1.0単体probeで約25秒のTimeout。0.1.1でuptime減少とwatchdog_reboot/timeout_reboot=1を観測。USB再認識だけで原因を決めずHEALTHで再起動を測定した。
次への導入: どこで止まるかを起動後にも残す。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md#実機試行の記録2026-10-26
-->

---
layout: default
---

# 短い待機を変え、単体USBを再測定

<div class="split"><div><p>停止直前の区間を保存すると、<br><strong>ループ末尾の待機</strong>だった。</p><div class="log-extract">sleep_us(50)<br>↓<br>busy_wait_us_32(50)</div></div><div><div class="number">120 <small>秒</small></div><p>USB単体試験が正常終了</p><p class="muted">応答714回。<br>watchdog再起動フラグは0。</p></div></div><p class="caption">SDK内部の停止箇所や根本原因までは断定しない。</p>

<SlideFooter :number="12" chapter="02 / 転送する仕組み" />

<!--
伝えること: 問題1の変更と限定された改善実測を示す。
前からのつながり: Pico単体でも起きるので、Pico側のループを観測する。
技術補足: 0.1.2 previous_watchdog_phase=7（sleep_us区間）。0.1.3は50usの待機をbusy_wait_us_32へ変更。アラーム/WFE起床経路を避けた。watchdog250ms、TXリース1秒は維持。同じアダプター・UART無効・線切離しで120秒、714応答、最大866us、ループ間隔最大223us。これはPC通信の成功証明ではなく再発なしの保証でもない。
次への導入: USBが安定した次に、連続したUARTデータで別の問題を見つけた。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/commit/48f99d0
-->

---
layout: default
---

# 次は、連続256バイトで崩れた

<div class="split"><div><p>PCからの返送は<br><strong>00〜B8の185バイト</strong>まで一致。</p><p class="muted">次に期待したB9ではなく6E。<br>framing flag = 1。</p></div><div class="log-extract">期待: … B7 B8 B9 BA …<br>受信: … B7 B8 6E<br><br>単体ループバック成功<br>≠ 実機の連続通信成功</div></div><p class="takeaway">フレーム間に隙間のない条件を調べる。</p>

<SlideFooter :number="13" chapter="02 / 転送する仕組み" />

<!--
伝えること: 問題2をUSB問題から分け、単体成功では不足する境界条件を示す。
前からのつながり: USB単体の停止が改善してもPCとの通信はまだ完全ではなかった。
技術補足: 0.1.3でminiから333B中継の起動までは確認済み。TX/RX取り違えは別途修正後の試行。PC保存status PE/OE/FE=0でもPico側framingを観測し全体成功にはしない。従来Pico TXはフレーム間に追加idleがあり単体ループバックでは連続条件を覆わなかった。
次への導入: 実PIOを使ったモデルで受信境界を再現する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# 受信PIOの境界条件を見直した

<div class="split"><div><p>隙間なし・クロック差・位相差を<br>実PIOのモデルへ追加。</p><p class="muted">変更前は、相手が1〜2%速い<br>16ケースで失敗した。</p></div><div><p class="lead"><strong>RX: 8 → 16 cycle</strong></p><p>次フレームの開始待ちに余裕を作る。</p><p class="muted">変更後は40条件すべてで<br>256バイト一致。</p></div></div><p class="caption">モデルでの改善と、次に示す実機での確認を分ける。</p>

<SlideFooter :number="14" chapter="02 / 転送する仕組み" />

<!--
伝えること: 問題2の再現条件と修正を説明する。
前からのつながり: 185Bまでは一致するのに崩れるので、連続フレームの受信タイミングを検証する。
技術補足: 0.1.4はRXのみ16cycleへ。TX8cycle、300baud、8N1、極性、USB形式、安全期限は変更しない。両極性・独立クロック±2%・4位相など40条件。B9位置の物理エラーが同じ根本原因と証明されたわけではない。
次への導入: 同じ実機の往復試験を再実施する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# 256バイトが、正しく往復した

<div class="split"><div><div class="large-number">256 <small>/ 256</small></div><p>00〜FFが完全一致。</p><p class="muted">実機PC-8001 / Pico 0.1.4</p></div><div><div class="log-extract">missing = 0<br>extra = 0<br>mismatch = 0<br>CRC16 = OK</div><p class="caption">往復 約17.84秒。再送0。<br>記録値の抜粋。実行しない通信試験。</p></div></div>

<SlideFooter :number="15" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 物理通信の成功を、値と検証範囲で示す。
前からのつながり: RX変更後に実機へ戻って確認した。
技術補足: 2026-10-26 mini→333B中継→T非実行256B往復。263UARTイベントflags=0、PC PE/OE/FE=0。17,842,484usは往復区間であり38,266,301usのセッション全体と分ける。この時点で常駐・アプリはロードしていない。miniの小型化自体は並行して実装済み。説明の次節で導入構造と改善経緯を扱う。
次への導入: バイトを運べるようになったので、次はプログラムを安全に実行する仕組みへ。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-mini-preflight-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# 通信できても、まだ実行はできない

<FlowDiagram :items="[{'title': '転送', 'text': '指定したRAMへ書く'}, {'title': 'VERIFY', 'text': '実RAMを再読\nCRC照合'}, {'title': 'EXEC', 'text': '明示要求で実行'}, {'title': 'RET', 'text': '常駐ローダーへ戻る'}]" /><p class="lead">「届いた」と「正しく置けた」と<br>「実行して戻れた」を、<strong>分けて確認する。</strong></p><p class="small muted">アプリの書込許可範囲は D000–D7FF。</p>

<SlideFooter :number="16" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 通信からローダーへ進む必然性を示す。
前からのつながり: 256B往復はデータを実行しない試験だった。
技術補足: 常駐プロトコルはCRC16付き。VERIFYは受信時の累積CRCでなく配置済みRAMを再計算。EXECは独立要求。RETは規約を守るアプリのみ。任意コードの実行時隔離や暴走復帰は保証しない。
次への導入: この役割を最初から手入力するのではなく段階的に導入した。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
-->

---
layout: default
---

# 小さなローダーから、大きなローダーへ

<FlowDiagram :items="[{'title': 'mini Stage 0', 'text': '100 B / 手入力\nE300–E363'}, {'title': '中継 Stage 1', 'text': '333 B / 転送\nE400–E54C'}, {'title': '常駐ローダー', 'text': '実コード 1,134 B\n転送 1,280 B'}]" /><p class="small muted">mini → 中継は加算チェックサム（SUM8）。中継 → 常駐はCRC16。</p><p class="takeaway">常駐は D800–DCFF。<br>アプリ用の <strong>D000–D7FF（2KB）</strong> を残す。</p>

<SlideFooter :number="17" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 初回導入の段階とサイズ・配置を整理する。
前からのつながり: 必要な機能を小さい入口から受け渡すことで手入力を抑える。
技術補足: miniはREADY37hを送り333B+SUM8を受信する。SUM8はCRC16より弱く複数誤りや順序交換をすべて検知しない。中継は旧stage0.asm、常駐はstage1.asmという互換ファイル名。実コード1134+ゼロ埋め146=1280。常駐のスタックE700–E7FFはアプリ2KBとは別。E900以降は転送禁止。
次への導入: 初回手入力の入口を小さくした改善を振り返る。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
-->

---
layout: default
---

# 手入力を、333バイトから100バイトへ

<div class="comparison"><div><p>当初の Stage 0</p><div class="large-number">333 <small>B</small></div><p class="muted">MON 総入力883文字</p></div><div class="arrow">→</div><div><p>mini Stage 0</p><div class="large-number">100 <small>B</small></div><p><strong>MON 総入力319文字</strong></p></div></div><p class="takeaway">元の333バイトは、中継役としてそのまま使う。</p>

<SlideFooter :number="18" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 333Bから100Bへの改善を開発の経緯として伝える。
前からのつながり: 段階を分けたことで最初に手で入れる部分だけを減らせた。
技術補足: 100Bの入口を追加し333Bコードは変更せず再利用。mini MONコード入力のみ249文字、全工程319文字。BASIC mini7行/757文字。CLEAR/WIDTH、D全バイト確認、DEFUSR/USR、RETURN/CTRL+Bを含む集計。入力時間の実測ではない。小型化は前の通信検証と並行し、後から着手したと断定しない。
次への導入: 入口を通過して常駐が動いたら、Macからアプリを送れる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# Macから、ビルド・転送・実行

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
伝えること: 実装に照合した本物のコマンドで開発の操作を見せる。
前からのつながり: 常駐があるとアプリの入口はCLIになる。
技術補足: READMEのzig buildとasmの構文、docs/pc8001-serial-loader.mdのdeploy例、src/main.zigとsrc/serial/deploy.zigのusage/parseを照合。実機への送信は今回の資料作成中に再実行しない。PORTは例示。新規ログ名を使う。完全な初回導入手順ではない。
次への導入: この手順を次のアプリでも繰り返せる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/main.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/deploy.zig
-->

---
layout: default
---

# これで、何度でも試せるようになった

<FlowDiagram :items="[{'title': 'アプリA', 'text': '転送・検証・実行'}, {'title': 'RET', 'text': '常駐ローダー待機'}, {'title': 'アプリB', 'text': '再転送・検証・実行'}]" /><p class="lead">常駐がRAMに残っていれば、<br><strong>手入力・USR・RESETを繰り返さず</strong>に試せる。</p><p class="caption">電源断・RESET後は再導入。アプリがローダーやスタックを壊した場合も復帰は保証しない。</p>

<SlideFooter :number="20" chapter="03 / ローダーがローダーを呼ぶ" />

<!--
伝えること: 手入力から実機反復へ変わった成果と条件を示す。
前からのつながり: CLIで送ったアプリが戻れば次の実験を始められる。
技術補足: 初回はCLEAR/MON→mini→中継→常駐。通常deployは既定stage1（常駐）を使う。再EXECは再VERIFYが必要。常駐はRAMのプログラムで電源断後に保持されるという意味ではない。helloからORBITALへの差し替えで実機の反復を確認。
次への導入: ここから実際に書いて動かした小さなアプリを紹介する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
-->

---
layout: default
---

# Zig_80という開発環境

<FlowDiagram :items="[{'title': '書く', 'text': 'Z80アセンブリ / CLI・TUI'}, {'title': '確かめる', 'text': '2パスアセンブラ\nCPUエミュレーター'}, {'title': '実機へ', 'text': 'CLI deploy\nRAM検証・実行'}]" /><p class="lead"><strong>同じソース</strong>を、モデルで確かめて実機へ届ける。</p><p class="small muted">CPUモデルは電気的・サイクル精密な実機再現ではない。<br>汎用のrun用プロファイルとPC-8001の周辺機器試験は区別する。</p>

<SlideFooter :number="21" chapter="04 / 実機でコードを書く" />

<!--
伝えること: 道具の全体像とエミュレーターの検証範囲を示す。
前からのつながり: ローダーで反復可能になり、開発環境の役割がつながった。
技術補足: Zig製の2パスアセンブラ、Z80 CPU、CLI/TUIを提供。PC8001の検証は専用テストの8251/CRTC等モデル。汎用CLI runへhello.binを渡すだけでPC8001実機を再現するとは言わない。
次への導入: 最初のアプリはHELLOだった。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# 最初のHELLOは、表示が欠けた

<div class="split"><div><p>転送・CRC・実行・復帰は成功。<br>でも、<strong>画面の文字が合わない。</strong></p><p class="muted">最初の29B版は<br>80文字モードを仮定していた。</p></div><div><table class="fact-table"><thead><tr><th>表示モード</th><th>書込先の間隔</th></tr></thead><tbody><tr><td>80文字</td><td>1 B</td></tr><tr><td>40文字</td><td><strong>2 B</strong></td></tr></tbody></table><p class="small muted">40文字では偶数側の文字セルを使う。<br>モードを読み、書き方を変えた。</p></div></div>

<SlideFooter :number="22" chapter="04 / 実機でコードを書く" />

<!--
伝えること: 転送成功と見える成果の違いを、小さな失敗で伝える。
前からのつながり: 実機へ送れるようになったのでCRT上の本当の表示に向き合う。
技術補足: 旧29B版はCRC6283。修正版はEA66のport30保存値bit0を読む。40/80両モードの表示セルと属性保持をCPU回帰テストで確認した。所有機のモードは復帰A=00で40文字を確認。
次への導入: 44Bの修正版で、文字が揃って表示された。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json
-->

---
layout: default
---

# 44バイトで、HELLOが出た

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
伝えること: 最初の見える成果を、実コードと実機確認範囲で紹介する。
前からのつながり: 40/80文字モードの違いを解消した結果を示す。
技術補足: hello.asmの1回目のinc deから2回目のinc deまでの原文抜粋。HLは文字列、DEはVRAM。Cのbit0が0なら40文字で2バイト間隔。44B/CRC ADC1。2026-10-26オペレーターが全文一致、ホストがEXEC/RETURNを確認。動画は未提供なので映像再生成功を主張しない。
次への導入: 文字が出たので、次は動く絵を試す。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json
-->

---
layout: default
---

# 次は、画面に絵を描いてみる

<div class="split"><div><p class="lead"><strong>ORBITAL RINGS</strong></p><p>64×64のセミグラフィック。<br>2本のリングを動かす。</p><p class="muted">コード・テーブル <strong>582 B</strong><br>128フレーム後にRET。</p><p class="small muted">実機で動き・終了表示・復帰を確認。</p></div><MediaAsset asset="orbital" compact /></div>

<SlideFooter :number="24" chapter="04 / 実機でコードを書く" />

<!--
伝えること: HELLOからグラフィックへ、小さな成果を積み上げる。
前からのつながり: 同じ転送経路に別のアプリを載せれば表示の表現が増える。
技術補足: コードD000–D245、状態D4E0–D4E5、属性保存640B D500–D77F。582Bだけが全RAM使用量という意味ではない。実機CRC A9DB、復帰A52h、ユーザーがリングと終了表示を確認。属性全バイト復元・保護領域保持はCPUモデル検証。約14.277秒はEXEC ACKから復帰通知までで純粋な描画時間ではない。
次への導入: 画面に加えて入力も扱うと対話できる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-demos.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/orbital_rings.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-orbital-rings-014.json
-->

---
layout: default
---

# 画面だけでなく、キーボードも

<FlowDiagram :items="[{'title': '押す', 'text': '実機のキーボード'}, {'title': '読む', 'text': 'キーマトリクスを直接走査'}, {'title': '反応する', 'text': '画面を更新 / 送信'}]" /><p class="lead">Mini Invadersでは、<strong>左右移動と射撃</strong>を実機確認。</p><p class="muted">チャットでは文字入力・削除・Return送信へ広げる。</p><p class="caption">ゲームの実機記録ではESC終了・勝敗・再挑戦は未確認。</p>

<SlideFooter :number="25" chapter="04 / 実機でコードを書く" />

<!--
伝えること: 画面だけのデモから対話のための入力へつなげる。
前からのつながり: ORBITALには入力がない。次に操作できるアプリへ進んだ。
技術補足: Mini Invaders1361Bの左右/SPACE動作を実機確認。ESC等はモデル検証と分ける。チャットはROMや割り込みに頼らずactive-lowキーマトリクスを直接走査し、Shift、削除、64B入力を扱う。完成UIの画像はまだ出さない。
次への導入: 通信・表示・入力が揃うとチャット端末という発想が自然につながる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-invaders.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
-->

---
layout: default
---

# ここまでできたら、チャット端末を作れる？

<div class="hero-message"><strong>入力できる。</strong> 文字を表示できる。<br>外のコンピューターと通信できる。</div><p class="lead">返事を考える役をMacに任せれば、<br>PC-8001を会話の窓口にできそうだ。</p>

<SlideFooter :number="26" chapter="04 / 実機でコードを書く" />

<!--
伝えること: ここまでの成果がLLMクライアントへ結びつく瞬間を作る。
前からのつながり: 画面とキーボードと通信が揃ったところで最終ゴールを再提示する。
技術補足: PC側でLLM推論を行うのではない。PC側はASCII端末。ここでは疑似チャット画面や完成スクリーンショットを見せない。
次への導入: 次章で推論の場所と各機器の担当を整理する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# 今回のLLMは、Macで動かす

<div class="split"><div><h2>PC-8001 / Pico 2</h2><p>PC：キー入力・画面・シリアル<br>Pico：PIO UARTとUSBの橋渡し</p></div><div><h2>Mac</h2><p>Zig製ホスト：HTTP・履歴・文字変換<br><strong>Ollama / Gemma：LLM推論</strong></p></div></div><FlowDiagram :items="[{'title': '質問', 'text': 'PCからMacへ'}, {'title': '生成', 'text': 'Mac内のOllamaへHTTP'}, {'title': '回答', 'text': 'MacからPCへ逐次送信'}]" /><p class="caption">実機記録のモデルは gemma3:1b。PC-8001で直接推論しているわけではない。</p>

<SlideFooter :number="27" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 推論の所在とハードウェアの役割を誤解なく伝える。
前からのつながり: 返事をMacへ任せるアイデアを具体的な構成にする。
技術補足: HTTPはホストのloopback POST /api/chat、履歴と正規化もZigホスト。Picoファームウェア変更不要。実機記録はgemma3:1b、最新docのgemma4例と実機モデルを混同しない。
次への導入: 300bpsの経路に、ストリーミングをどう流すかが設計課題になる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_ollama.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# 300bpsで、AIと会話するには

<FlowDiagram :items="[{'title': 'Ollama', 'text': '応答をstreamで受信'}, {'title': 'Zigホスト', 'text': 'ASCIIへ正規化\n通常8Bずつに分割'}, {'title': 'PC-8001', 'text': 'CRCを検査\n受理した分を表示'}]" /><div class="split"><div><p><strong>全部そろう前に、届いた分から。</strong></p><p class="muted">小さく分けるほど滑らか。<br>ただしCRC・ACKの負担は増える。</p></div><div><div class="number">30 <small>B/s</small></div><p class="small muted">8N1の理論上限。実効速度は下がる。<br>既定は8B・改行・100ms・完了で送出。</p></div></div>

<SlideFooter :number="28" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 低速通信に合わせた逐次表示とトレードオフを説明する。
前からのつながり: 機器ごとの担当が分かったので回答が通る道を追う。
技術補足: NDJSONを逐次解析、TEXTは既定8B、LF、100ms、DONEでflush。1〜32B設定可。時間は送出の目標で伝送完了期限ではない。未ACKバイトを保持し、UART/ACK待ちはHTTP読出しを止める。ASCII大文字化と非ASCIIの?変換、160文字上限。完成回答に人工文字遅延を掛ける方式ではない。
次への導入: この入出力をPC側2KBのアプリ領域に収める。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_queue.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_text.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_protocol.zig
-->

---
layout: default
---

# 2KBの中に、チャットクライアント

<p>アプリ領域 <strong>D000–D7FF = 2,048 B</strong></p><MemoryBudget /><p class="takeaway">入力64B、送受信フレーム、キー状態を詰める。<br>ローダーの専用スタックは領域外で共有する。</p><p class="caption">1,743Bにはコード・テーブル・3BのACK scratchを含む。<br>94Bの未割当にはコード直後の70Bも含む。</p>

<SlideFooter :number="29" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: メモリ制約と実装サイズを整合した数値で示す。
前からのつながり: 逐次表示を実現するにはPC側でも入力と受信の状態を持つ必要がある。
技術補足: D000–D6CE 1743B、D6CF–D714 70B空き、TX35B、前回RX37B、key10B、状態28B、prompt64B、RX37B=211B。D767–D76Fの9BとD7F1–D7FFの15Bも未割当で計94B。1743+211+94=2048。スタックE700–E7FFは常駐の既存256Bで、この2048へ加算する数値ではない。
次への導入: 数字だけで完成扱いにせず実機で何を確認したかを区別する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# 実機で確かめたことを、版ごとに分ける

<table class="fact-table"><thead><tr><th>版</th><th>実機で確認</th><th>残っている確認</th></tr></thead><tbody><tr><td>旧UI / 1,683 B</td><td>10往復・ESC復帰<br>常駐の再応答</td><td>30分耐久・80文字モード</td></tr><tr><td>新UI / 1,743 B</td><td>入力・横スクロール<br>会話スクロール</td><td>この版のESC復帰<br>次のdeploy</td></tr></tbody></table><p class="takeaway">新UIでは<strong>入力欄を固定</strong>し、会話だけをスクロール。</p><p class="caption">2026-10-27の記録時点。新UIも30分耐久・実機80文字モードは未確認。</p>

<SlideFooter :number="30" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 完成映像を見る前に実機確認の範囲を誠実に示す。
前からのつながり: 2KBに入っただけでは使えるとは言えないので入力と会話を試した。
技術補足: 旧UI1683B/F1A3は10往復・ESC・HELLO/ABORT・TX解放。新UI1743B/B9A6は5往復の記録時点で継続中、ESC未操作。モデルでの15往復・復帰試験を新UIの物理実測と混同しない。UIそのものの絵やサムネイルはまだ出さない。
次への導入: 通信・ローダー・表示・入力が揃った結果を、いよいよ実機映像で見せる。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: video-focus
---

# ついに、PC-8001からGemmaと会話できた

<MediaAsset asset="gemma" /><p class="small muted" style="margin-top:16px">キーボードから質問し、300bpsの向こうから返事が届く。</p>

<SlideFooter :number="31" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 最後の成果映像のための専用スライド。ここで初めて完成画面を見せる。
前からのつながり: それぞれの課題が最終的に一つの対話へつながったところで実演する。
技術補足: 現状は動画未提供。生成映像、疑似チャット、過去UIの画像で代用しない。素材が届いたらconfig/media.jsonのgemmaだけを更新する。新UIなら1743B/B9A6との整合を確認し、映像から見えない終了検証を成功扱いしない。手動再生。PDFでは対応MP4名を示す。
次への導入: 映像を見た後、1979年の機械で実現した開発体験を振り返る。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# 1979年のPCで、2026年の開発体験を

<FlowDiagram :items="[{'title': '最初', 'text': '機械語を手で入れる'}, {'title': '変化', 'text': 'ビルド・転送・検証を反復'}, {'title': '到達点', 'text': '実機のキーでLLMと会話'}]" /><div class="hero-message" style="margin-top:34px">小さく動かし、実機で確かめる。<br><strong>次の挑戦へ進むための道具</strong>を作れた。</div>

<SlideFooter :number="32" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 開発の物語を体験の変化として回収する。
前からのつながり: 最後の動画の後に、成果を可能にした積み重ねへ戻る。
技術補足: 到達点はPC単体のLLM推論ではなく、Macとの協調による実機クライアント。耐久や次デプロイなどの残課題は前スライドとfactsの範囲を維持。
次への導入: コードと資料の参照先を渡して締める。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: cover
---

<div class="eyebrow">ZIG_80 / PC-8001</div>

# Zig_80<br>Thank you

<p class="subtitle">Z80アセンブリを書いて、実機へ。</p>
<a class="closing-link" href="https://github.com/moribit/Zig_80">github.com/moribit/Zig_80</a>
<p class="small muted" style="margin-top:24px">スライド: github.com/moribit/Zig_80_LT</p>

<SlideFooter :number="33" chapter="05 / ローカルLLMと会話する" />

<!--
伝えること: 正本リポジトリとスライドの場所を渡す。
前からのつながり: 振り返りを受けて、読者が続きを見られる場所へつなぐ。
技術補足: リンクはGitHub正本。発表HTMLはリンクを開く操作をしなければネット接続不要。QRコードは未提供で生成しない。
次への導入: 質疑へ。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md
-->
