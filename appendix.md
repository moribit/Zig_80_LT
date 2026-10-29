---
layout: default
hideInToc: true
---

# Appendix：アプリ領域を2KBに制限した理由

<div class="memory-layout">
  <MemoryMap />
  <div>
    <p>
      <strong>D000–D7FFだけを<br />アプリ転送に許可</strong>
    </p>
    <p>ローダーとBASIC等の<br />領域を保護する。</p>
    <p class="muted">2KBは現在の設計上の制限。<br />ハードの上限ではない。</p>
    <p class="small muted"><code>CLEAR 300,&HCFFF</code>でBASIC領域を制限。詳細はAppendix 29。</p>
  </div>
</div>

<SlideFooter :number="27" chapter="Appendix" />

<!--
伝えること: 2KBがハード上限ではなく転送プロファイルの設計制限だと説明する。
前からのつながり: データの流れに加え、実機側プログラムが置けるメモリ範囲を明らかにする。
技術補足: memory profile v1の保守的な転送境界。D800–DCFFは常駐固定1280B、E400–E5FFは中継予約、E600以降はバッファ/スタック/状態でE900以上は全域転送禁止。DD00–E3FFの一部に手入力mini E300–E363が置かれるが通常deploy対象ではない。CLEAR成功とE400読書検証などが導入条件。ハードの絶対上限ではなく、拡大は所有機のRAM/BASICワークを調べ別プロファイルにする。転送制限はMMUや実行時サンドボックスではない。図はアドレス昇順、各帯の高さは縮尺外。
次への導入: 次は「Appendix：2KBに収めたZ80アプリ」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/loader_protocol.zig
-->

---
layout: default
hideInToc: true
---

# Appendix：2KBに収めたZ80アプリ

<p>アプリ領域：<strong>D000–D7FF = 2,048 B</strong></p>
<MemoryBudget />
<p>作業領域：入力64 B・送受信フレーム・キー状態など</p>
<p class="small muted">
  スタックは常駐ローダーの別領域（E700–E7FF）を使用。<br />1,743
  Bはコード・テーブル等を含む転送イメージ。<br />未割当94 Bのうち、コード直後の空きは70 B。
</p>

<SlideFooter :number="28" chapter="Appendix" />

<!--
伝えること: 1743Bと211Bと94Bの配分を示す。
前からのつながり: 2KBという設計制限の中に、コードと作業用データをどう配置したかを示す。
技術補足: D000–D6CE 1743B、D6CF–D714 70B空き、TX35B、前回RX37B、key10B、状態28B、prompt64B、RX37B=211B。D767–D76Fの9BとD7F1–D7FFの15Bも未割当で計94B。1743+211+94=2048。スタックE700–E7FFは常駐の既存256Bで、この2048へ加算する数値ではない。
次への導入: 次は「Appendix：詳細メモリマップ」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
hideInToc: true
---

# Appendix：詳細メモリマップ

<div class="memory-layout">
  <MemoryMap detailed />
  <div>

```text
CLEAR 300,&HCFFF
```

<p class="detail">
      BASICの上限をCFFFへ制限。<br />初期SP：E800付近 / DI<br />通常はRETで常駐へ復帰。
    </p>
    <p class="small muted">両端で長さ・範囲・entryを検査。<br />4KB/8KBは現プロファイルで拒否。</p>
    <p class="small muted">実行したアプリ自身の破壊を防ぐ<br />ハード隔離ではない。</p>

  </div>
</div>

<SlideFooter :number="29" chapter="Appendix" />

<!--
伝えること: CLEAR予約と転送許可範囲とABIを詳述する。
前からのつながり: 本編を終えて質疑で参照する補足資料。
技術補足: 常駐プロトコルはCRC16付き。VERIFYは受信時の累積CRCでなく配置済みRAMを再計算。EXECは独立要求。RETは規約を守るアプリのみ。任意コードの実行時隔離や暴走復帰は保証しない。miniはREADY37hを送り333B+SUM8を受信する。SUM8はCRC16より弱く複数誤りや順序交換をすべて検知しない。中継は旧stage0.asm、常駐はstage1.asmという互換ファイル名。実コード1134+ゼロ埋め146=1280。常駐のスタックE700–E7FFはアプリ2KBとは別。E900以降は転送禁止。
次への導入: 次は「Appendix：UARTフレームと反転信号」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
-->

---
layout: default
hideInToc: true
---

# Appendix：UARTフレームと反転信号

<UartFrame />
<div class="split">
  <div>
    <p><strong>8N1</strong><br />8bit / パリティなし / 停止1bit</p>
    <p class="muted">1バイト = start 1 + data 8 + stop 1</p>
  </div>
  <div>
    <div class="number">30 <small>B/s</small></div>
    <p class="small muted">
      300bit/s ÷ 10bitの理論上限。<br />反転UARTのアイドルはLow。<br />PIOで信号の極性を処理する。
    </p>
  </div>
</div>

<SlideFooter :number="30" chapter="Appendix" />

<!--
伝えること: 8N1と反転極性と理論転送量を示す。
前からのつながり: 本編9の実物配線を踏まえ、UARTフレームの詳細を示す。
技術補足: 8N1はstart1+data8+stop1=10bit。30B/sは線路上の理論上限でありpayload速度や推論速度ではない。TX/RXは反転モード。外部反転回路との二重反転に注意。
次への導入: 次は「Appendix：PIOによるUART実装」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
hideInToc: true
---

# Appendix：PIOによるUART実装

<div class="split">
  <div>
    <h2>Pico 2のPIOで信号を処理</h2>
    <p>USB側のファームウェアと<br />UART波形生成・受信を分離。</p>
    <p>RX：16 cycle / bit<br />TX：8 cycle / bit</p>
    <p class="muted">300bps / 8N1<br />反転もPIO内で処理。</p>
  </div>
  <div>

```asm
bits:
    in pins, 1
    jmp x-- bits [14]
    in pins, 1
    mov isr, ~isr
    push noblock
```

<p class="caption">
      uart.pio / s10_rx_inverted原文。<br />データ8bitとstopを読み、極性を反転してFIFOへ。
    </p>

  </div>
</div>

<SlideFooter :number="31" chapter="Appendix" />

<!--
伝えること: PicoのPIOとホスト接続の関係を示す。
前からのつながり: 前ページ「Appendix：UARTフレームと反転信号」の説明を受ける。
技術補足: 図は論理構成。Pico GP0 TX→S10 /RXD、S10 /TXD→GP1 RX、GND共有。PIOがUARTを実装する。電圧や物理ピン番号の配線手順ではない。
次への導入: 次は「Appendix：USB停止の切り分け」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/hardware/pico2-pc8001/pio/uart.pio
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
hideInToc: true
---

# Appendix：USB停止の切り分け

<div class="split">
  <div>
    <h2>現象</h2>
    <p>USB要求がタイムアウト。</p>
    <h2>切り分け</h2>
    <p>PC電源OFF・信号線切り離し。<br />UART無効でも再現。</p>
  </div>
  <div>
    <h2>観測値</h2>
    <div class="log-extract">Pico 単体<br />uptime 減少<br />watchdog_reboot = 1</div>
    <p class="caption">実機記録の要約</p>
  </div>
</div>
<p class="takeaway">PCのローダーやUART信号を必要としない再現条件を確認。</p>

<SlideFooter :number="32" chapter="Appendix" />

<!--
伝えること: USB単体での停止条件と観測値を示す。
前からのつながり: 前ページ「Appendix：PIOによるUART実装」の説明を受ける。
技術補足: 0.1.0単体probeで約25秒のTimeout。0.1.1でuptime減少とwatchdog_reboot/timeout_reboot=1を観測。USB再認識だけで原因を決めずHEALTHで再起動を測定した。
次への導入: 次は「Appendix：Watchdog再起動への対処」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md#実機試行の記録2026-10-26
-->

---
layout: default
hideInToc: true
---

# Appendix：Watchdog再起動への対処

<div class="split">
  <div>
    <h2>変更</h2>
    <p>停止直前の記録は待機区間。<br />アラーム/WFE起床経路を回避。</p>
    <div class="log-extract">sleep_us(50)<br />↓<br />busy_wait_us_32(50)</div>
  </div>
  <div>
    <h2>実測結果</h2>
    <div class="number">120 <small>秒</small></div>
    <p>USB単体試験が正常終了</p>
    <p class="muted">714応答 / watchdogフラグ0<br />同一アダプター・UART無効</p>
  </div>
</div>
<p class="caption">SDK内部の停止箇所・根本原因は未確定。長時間の無再発を保証しない。</p>

<SlideFooter :number="33" chapter="Appendix" />

<!--
伝えること: 待機処理変更と120秒の測定条件を示す。
前からのつながり: 前ページ「Appendix：USB停止の切り分け」の説明を受ける。
技術補足: 0.1.2 previous_watchdog_phase=7（sleep_us区間）。0.1.3は50usの待機をbusy_wait_us_32へ変更。アラーム/WFE起床経路を避けた。watchdog250ms、TXリース1秒は維持。同じアダプター・UART無効・線切離しで120秒、714応答、最大866us、ループ間隔最大223us。これはPC通信の成功証明ではなく再発なしの保証でもない。
次への導入: 次は「Appendix：連続通信エラーの再現」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/commit/48f99d0
-->

---
layout: default
hideInToc: true
---

# Appendix：連続通信エラーの再現

<div class="split">
  <div>
    <h2>現象</h2>
    <p>返送00–B8の185 Bは一致。<br />B9を期待した位置で6Eを受信。</p>
    <p class="muted">framing flag = 1</p>
  </div>
  <div class="log-extract">
    期待: … B7 B8 B9 BA …<br />受信: … B7 B8 6E<br /><br />条件: 実機からの連続返送
  </div>
</div>
<p class="takeaway">単体ループバックは追加idleあり。隙間なし条件は未検証だった。</p>

<SlideFooter :number="34" chapter="Appendix" />

<!--
伝えること: 185B一致後のフレーミングエラーを示す。
前からのつながり: 前ページ「Appendix：Watchdog再起動への対処」の説明を受ける。
技術補足: 0.1.3でminiから333B中継の起動までは確認済み。TX/RX取り違えは別途修正後の試行。PC保存status PE/OE/FE=0でもPico側framingを観測し全体成功にはしない。従来Pico TXはフレーム間に追加idleがあり単体ループバックでは連続条件を覆わなかった。
次への導入: 次は「Appendix：PIO受信タイミングの修正」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
hideInToc: true
---

# Appendix：PIO受信タイミングの修正

<div class="split">
  <div>
    <h2>再現条件</h2>
    <p>隙間なし・クロック差・位相差を<br />実PIOモデルへ追加。</p>
    <p class="muted">変更前：相手が1〜2%速い<br />16ケースで失敗。</p>
  </div>
  <div>
    <h2>変更と結果</h2>
    <p><strong>RX：8 → 16 cycle</strong><br />次フレームの開始待ちを調整。</p>
    <p class="muted">変更後：40条件すべてで<br />256 B一致。</p>
  </div>
</div>
<p class="caption">300bps・8N1・TX側は維持。モデルでの検証結果であり、実機確認は次ページ。</p>

<SlideFooter :number="35" chapter="Appendix" />

<!--
伝えること: モデルでの再現と40条件での改善を示す。
前からのつながり: 前ページ「Appendix：連続通信エラーの再現」の説明を受ける。
技術補足: 0.1.4はRXのみ16cycleへ。TX8cycle、300baud、8N1、極性、USB形式、安全期限は変更しない。両極性・独立クロック±2%・4位相など40条件。B9位置の物理エラーが同じ根本原因と証明されたわけではない。
次への導入: 次は「Appendix：256B往復試験」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
hideInToc: true
---

# Appendix：256B往復試験

<div class="split">
  <div>
    <div class="large-number">256 <small>/ 256</small></div>
    <p>00〜FFが完全一致。</p>
    <p class="muted">実機PC-8001 / Pico 0.1.4</p>
  </div>
  <div>
    <div class="log-extract">missing = 0<br />extra = 0<br />mismatch = 0<br />CRC16 = OK</div>
    <p class="caption">往復 約17.84秒。再送0。<br />記録値の抜粋。実行しない通信試験。</p>
  </div>
</div>

<SlideFooter :number="36" chapter="Appendix" />

<!--
伝えること: 256B往復一致と測定区間を示す。
前からのつながり: 前ページ「Appendix：PIO受信タイミングの修正」の説明を受ける。
技術補足: 2026-10-26 mini→333B中継→T非実行256B往復。263UARTイベントflags=0、PC PE/OE/FE=0。17,842,484usは往復区間であり38,266,301usのセッション全体と分ける。この時点で常駐・アプリはロードしていない。miniの小型化自体は並行して実装済み。説明の次節で導入構造と改善経緯を扱う。
次への導入: 次は「Appendix：ブートストラップの詳細」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-mini-preflight-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
hideInToc: true
---

# Appendix：ブートストラップの詳細

<FlowDiagram
  :items="[{'title': 'mini Stage 0', 'text': '100 B / 手入力\nE300–E363'}, {'title': '中継 Stage 1', 'text': '333 B / 転送\nE400–E54C'}, {'title': '常駐ローダー', 'text': '実コード 1,134 B\n転送 1,280 B'}]"
/>
<p class="small muted">mini → 中継は加算チェックサム（SUM8）。中継 → 常駐はCRC16。</p>
<p class="detail">
  初期333 B / MON総入力883文字 → mini100 B / 319文字。<br />常駐は1,134 B＋ゼロ埋め146 B＝固定1,280
  B。
</p>

<SlideFooter :number="37" chapter="Appendix" />

<!--
伝えること: 100Bの入口から常駐を導入するサイズと配置を示す。
前からのつながり: 前ページ「Appendix：256B往復試験」の説明を受ける。
技術補足: miniはREADY37hを送り333B+SUM8を受信する。SUM8はCRC16より弱く複数誤りや順序交換をすべて検知しない。中継は旧stage0.asm、常駐はstage1.asmという互換ファイル名。実コード1134+ゼロ埋め146=1280。常駐のスタックE700–E7FFはアプリ2KBとは別。E900以降は転送禁止。当初333Bを手入力したことは今回のユーザー提供の開発経緯。文字数は最新文書の従来経路の計算値。MONコード入力のみ813文字、全工程883。BASICのファイルサイズ1420Bと総入力1406文字を混同しない。333BはE400–E54C。後に中継へ再利用する。100Bの入口を追加し333Bコードは変更せず再利用。mini MONコード入力のみ249文字、全工程319文字。BASIC mini7行/757文字。CLEAR/WIDTH、D全バイト確認、DEFUSR/USR、RETURN/CTRL+Bを含む集計。入力時間の実測ではない。小型化は前の通信検証と並行し、後から着手したと断定しない。
次への導入: 次は「Appendix：CRC16・ACK・再送」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
hideInToc: true
---

# Appendix：CRC16・ACK・再送

<div class="split">
  <div>
    <h2>デプロイ</h2>
    <FlowDiagram
      :items='[{"title": "DATA", "text": "RAMへ書込"}, {"title": "VERIFY", "text": "RAMを再読"}, {"title": "EXEC", "text": "明示実行"}]'
    />
    <p class="detail">
      CRC16で転送・RAMを検査。<br />NAKやtimeoutで再送制御。<br />RET後は再VERIFYが必要。
    </p>
  </div>
  <div>
    <h2>チャット</h2>
    <p class="detail">A5 5A / TYPE / SEQ / LEN<br />PAYLOAD / CRC16</p>
    <p class="detail">
      1フレーム送出 → ACK待ち。<br />未ACKなら最大2回再送。<br />同一フレームの重複は再表示しない。
    </p>
  </div>
</div>
<p class="caption">チャットにNAKはなく、不正フレームは破棄。CRC-16/CCITT-FALSE。</p>

<SlideFooter :number="38" chapter="Appendix" />

<!--
伝えること: ローダーとチャットの信頼性制御を区別する。
前からのつながり: 前ページ「Appendix：ブートストラップの詳細」の説明を受ける。
技術補足: 常駐プロトコルはCRC16付き。VERIFYは受信時の累積CRCでなく配置済みRAMを再計算。EXECは独立要求。RETは規約を守るアプリのみ。任意コードの実行時隔離や暴走復帰は保証しない。
次への導入: 次は「Appendix：キーマトリクスと押下判定」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat-protocol.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/loader_protocol.zig
-->

---
layout: default
hideInToc: true
---

# Appendix：キーマトリクスと押下判定

<div class="split">
  <div>
    <KeyboardMatrix />
    <p class="detail">ポート1〜9を走査。0＝押下。<br />反転して「現在ONかつ前回OFF」を抽出。</p>
  </div>
  <div>

```asm
key_row:
    in a,(c)
    cpl
    ld e,a
    xor (hl)
    and e
    ld (hl),e
```

<p class="caption">chat.asm 原文。C＝走査ポート、HL＝前回状態。</p>

  </div>
</div>

<SlideFooter :number="39" chapter="Appendix" />

<!--
伝えること: I/O読取とactive-lowと立ち上がり抽出を実コードで説明する。
前からのつながり: 前ページ「Appendix：CRC16・ACK・再送」の説明を受ける。
技術補足: chat.asm key_row原文。CPLでactive-lowを押下=1へ、(current XOR previous) AND currentで新規押下だけを採る。KEYS10B、ループはポート1〜9。押しっぱなしの自動リピートは行わない。図のポート2 bit1=Aはkey_plainとMAME原機マトリクスの対応。これは実チャット画面ではなくI/O説明図。
次への導入: 次は「Appendix：文字変換と終了処理」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
hideInToc: true
---

# Appendix：文字変換と終了処理

<div class="split keyboard-photo-layout">
  <div>
    <MediaAsset asset="keyboard-detail" compact />

```asm
    in a,(8)
    and 0x40
    jr nz,key_lookup
    ld hl,key_shift-27
```

<p class="caption">chat.asm key_table内。SHIFTのbit6が0で記号表を選ぶ。</p>

  </div>
  <div>
    <ul class="constraints">
      <li>英字は大文字へ統一</li>
      <li>
        新規押下後に短いdebounce待機<br /><span class="small muted">BC=1500の減算ループ</span>
      </li>
      <li>ポート9のbit0/7でESC/STOP<br />→ CANCEL送信後にRET</li>
    </ul>
  </div>
</div>
<p class="caption">旧UIの実機ESC復帰を、新UIの確認済み結果として流用しない。</p>

<SlideFooter :number="40" chapter="Appendix" />

<!--
伝えること: SHIFT変換と入力遅延とESC/STOPの扱いを示す。
前からのつながり: 前ページ「Appendix：キーマトリクスと押下判定」の説明を受ける。
技術補足: ユーザー提供の実物キー配置写真を追加。写真はキーの物理配置を示し、走査回路や実装版の証拠とは区別する。key先頭はIN A,(9) AND 81h CP 81hでESC/STOPを検出。終了CANCELはACKと送信完了を待ってRET。debounceはキー入力のみに適用し通信へ人工遅延を付けない。SHIFTは記号表、英字はuppercase。キーを押したままではedgeが発生しない。
次への導入: 次は「Appendix：VRAMと文字描画」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat-protocol.md
-->

---
layout: default
hideInToc: true
---

# Appendix：VRAMと文字描画

<VramMap />
<div class="split">
  <div>

```asm
    call cell
    pop af
    ld (hl),a
```

<p class="caption">chat.asm putc内。cellが座標からHLを計算。</p>

  </div>
  <div>
    <p class="detail">アドレス＝F300h＋行×120<br />＋列×STRIDE（1または2）</p>
    <p class="detail">文字更新は対象セルのみ。<br />スクロールは会話15行だけ。</p>
  </div>
</div>

<SlideFooter :number="41" chapter="Appendix" />

<!--
伝えること: 行120Bの文字と属性を分け座標からの書込先を示す。
前からのつながり: 前ページ「Appendix：文字変換と終了処理」の説明を受ける。
技術補足: putcから連続3命令を原文引用。Aは文字、PUSH AFは引用の直前にある。cellはF300+ROW*120+COL*STRIDE。scroll_rowは文字80Bを14行コピーし各行属性40Bを飛ばす。F3F0がrow2、F468がrow3。初期文字セルは25行clearし元画面は復元しない。属性1000Bは保持。VRAM全体はF300–FEB7、25行×120=3000B。
次への導入: 次は「Appendix：40/80文字とカーソル」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
-->

---
layout: default
hideInToc: true
---

# Appendix：40/80文字とカーソル

<div class="split">
  <div>
    <table class="fact-table">
      <thead>
        <tr>
          <th>モード</th>
          <th>STRIDE</th>
          <th>文字列の書込先</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>80文字</td>
          <td>1 B</td>
          <td>F300, F301, F302…</td>
        </tr>
        <tr>
          <td>40文字</td>
          <td>2 B</td>
          <td>F300, F302, F304…</td>
        </tr>
      </tbody>
    </table>
    <p class="detail">EA66hのport30保存値bit0を読む。<br />表示モード自体は変更しない。</p>
  </div>
  <div>

```asm
    ld a,0x81
    out (0x51),a
```

<p class="detail">
      続けてport50hへX/Yを送る。<br />40文字ではXを2倍。<br />カーソル形状・属性は保持。
    </p>

  </div>
</div>
<p class="caption">初期29B HELLOの表示不一致 → 40/80対応44Bへ修正。実機80文字モードは未確認。</p>

<SlideFooter :number="42" chapter="Appendix" />

<!--
伝えること: 表示モードの読取と文字間隔とCRTC座標を説明する。
前からのつながり: 前ページ「Appendix：VRAMと文字描画」の説明を受ける。
技術補足: 旧29B版はCRC6283。修正版はEA66のport30保存値bit0を読む。40/80両モードの表示セルと属性保持をCPU回帰テストで確認した。所有機のモードは復帰A=00で40文字を確認。
次への導入: 次は「Appendix：HTTPとバックプレッシャー」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
hideInToc: true
---

# Appendix：HTTPとバックプレッシャー

<FlowDiagram
  :items="[{'title': 'Ollama', 'text': 'NDJSONを逐次受信'}, {'title': 'Zigホスト', 'text': 'ASCIIへ正規化\n通常8 Bずつに分割'}, {'title': 'PC-8001', 'text': 'CRC検査後に表示\nACKを返送'}]"
/>
<div class="split">
  <div>
    <p>送出条件：8 B・改行<br />100ms・回答完了</p>
    <p class="muted">小さいチャンクは表示更新を細分化。<br />CRC・ACKのオーバーヘッドは増加。</p>
  </div>
  <div>
    <div class="number">30 <small>B/s</small></div>
    <p class="small muted">300bps / 8N1の理論上限。<br />プロトコル込みの実効速度とは異なる。</p>
  </div>
</div>
<p class="caption">送信・ACK待ちの間はHTTP読出しを停止。未ACK分はキューに保持。</p>

<SlideFooter :number="43" chapter="Appendix" />

<!--
伝えること: HTTP逐次受信と低速UARTの流量制御を説明する。
前からのつながり: 前ページ「Appendix：40/80文字とカーソル」の説明を受ける。
技術補足: NDJSONを逐次解析、TEXTは既定8B、LF、100ms、DONEでflush。1〜32B設定可。時間は送出の目標で伝送完了期限ではない。未ACKバイトを保持し、UART/ACK待ちはHTTP読出しを止める。ASCII大文字化と非ASCIIの?変換、160文字上限。完成回答に人工文字遅延を掛ける方式ではない。
次への導入: 次は「Appendix：実機検証の詳細記録」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_queue.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_text.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_protocol.zig
-->

---
layout: default
hideInToc: true
---

# Appendix：実機検証の詳細記録

<table class="fact-table">
  <thead>
    <tr>
      <th>版</th>
      <th>実機で確認</th>
      <th>残っている確認</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>旧UI / 1,683 B</td>
      <td>10往復・ESC復帰<br />常駐の再応答</td>
      <td>30分耐久・80文字モード</td>
    </tr>
    <tr>
      <td>新UI / 1,743 B</td>
      <td>入力・横スクロール<br />会話スクロール</td>
      <td>この版のESC復帰<br />次のdeploy</td>
    </tr>
  </tbody>
</table>
<p class="takeaway">新UIでは<strong>入力欄を固定</strong>し、会話だけをスクロール。</p>
<p class="caption">2026-10-27の記録時点。新UIも30分耐久・実機80文字モードは未確認。</p>

<SlideFooter :number="44" chapter="Appendix" />

<!--
伝えること: 新旧UIの成功範囲と未確認を区別する。
前からのつながり: 前ページ「Appendix：HTTPとバックプレッシャー」の説明を受ける。
技術補足: 旧UI1683B/F1A3は10往復・ESC・HELLO/ABORT・TX解放。新UI1743B/B9A6は5往復の記録時点で継続中、ESC未操作。モデルでの15往復・復帰試験を新UIの物理実測と混同しない。UIそのものの絵やサムネイルはまだ出さない。Zig製の2パスアセンブラ、Z80 CPU、CLI/TUIを提供。PC8001の検証は専用テストの8251/CRTC等モデル。汎用CLI runへhello.binを渡すだけでPC8001実機を再現するとは言わない。Mini Invaders1361Bの左右/SPACE動作を実機確認。ESC等はモデル検証と分ける。チャットはROMや割り込みに頼らずactive-lowキーマトリクスを直接走査し、Shift、削除、64B入力を扱う。完成UIの画像はまだ出さない。
次への導入: 質疑に応じて26の索引へ戻る。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-invaders.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
-->
