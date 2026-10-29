---
theme: default
favicon: /favicon.svg
title: 47年前のPCでローカルLLMクライアントを動かしてみた
info: Zig_80 PC-8001実機開発の物語 / 本編25枚 / Appendix18枚
aspectRatio: 16/9
canvasWidth: 1100
colorSchema: light
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

<SlideFooter :number="1" chapter="01 / 1979年の開発環境" />

<!--
伝えること: 最終ゴールと使用スタックを示す。
前からのつながり: タイトルでクライアントという最終ゴールを示す。完成画面はまだ出さない。
技術補足: 47年は2026−1979の年差。LLM推論はMac側でありPC-8001側はクライアント。
次への導入: 次は「NEC PC-8001について」。
出典:
- https://jpn.nec.com/profile/corp/history/pdf/history-120.pdf
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# NEC PC-8001について

<div class="photo-grid spec-grid">
  <div>
    <table class="fact-table spec-table">
      <thead>
        <tr>
          <th>項目</th>
          <th>仕様</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>発売</td>
          <td>1979年</td>
        </tr>
        <tr>
          <td>CPU</td>
          <td>μPD780C-1(Z80互換)</td>
        </tr>
        <tr>
          <td>クロック</td>
          <td>4 MHz</td>
        </tr>
        <tr>
          <td>RAM</td>
          <td>標準16 KB</td>
        </tr>
        <tr>
          <td>ROM</td>
          <td>24 KB / N-BASIC</td>
        </tr>
        <tr>
          <td>テキスト表示</td>
          <td>40/80文字 × 20/25行</td>
        </tr>
        <tr>
          <td>シリアル通信</td>
          <td>S10 / μPD8251</td>
        </tr>
      </tbody>
    </table>
  </div>
  <MediaAsset asset="pc8001" compact />
</div>

<SlideFooter :number="2" chapter="01 / 1979年の開発環境" />

<!--
伝えること: 初代PC-8001の仕様とN-BASIC搭載を紹介する。
前からのつながり: まず対象のPCを共有し、現代の開発環境との前提の違いを説明する。
技術補足: CPUはμPD780C-1、Z80互換。標準RAM16KBは機種仕様であり所有機の増設量は未確認。ユーザー提供の本体・CRT写真を表示する。写真からRAM容量を推定しない。
仕様補足: NEC公式製品情報のCPUクロック欄は型番末尾と周波数が連結されている。μPD780C-1 / 4 MHzとして科学館資料でも照合。ROM24 KB、N-BASIC、代表的な40/80文字・20/25行、8251は以下の資料で確認。PC-8001B資料は補助資料とし、初代所有機との差を自動的に同一視しない。
次への導入: 次は「N-BASICでのプログラム開発」。
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

# N-BASICでのプログラム開発

<div class="split">
  <div>

```text
10 PRINT "HELLO"
20 GOTO 10
LIST
RUN
```

</div>
  <div>
    <h2>行番号で更新</h2>
    <p>
      <code>15 PRINT "PC-8001"</code>：追加<br /><code>10 PRINT "HELLO!"</code>：上書き<br /><code
        >15</code
      >：その行を削除
    </p>
    <p><strong>LIST</strong>：ソースを表示<br /><strong>RUN</strong>：RAM上のコードを実行</p>
  </div>
</div>
<p class="takeaway">ソースファイルを開く代わりに、メモリ上の行を直接更新する。</p>

<SlideFooter :number="3" chapter="01 / 1979年の開発環境" />

<!--
伝えること: 行番号でRAM上のプログラムを編集しLISTとRUNを使い分ける。
前からのつながり: ROMにN-BASICがあるため、当時はこの環境でコードを入力して実行できた。
技術補足: 歴史的なN-BASICの説明。LISTは表示コマンドであり編集命令ではない。行番号付きの入力でプログラムを保持し、同じ番号で置換、番号だけで削除する。スクリーンエディタによる既存行編集も可能。教材用の独自例で、今回の実機作業と区別。NEC N-BASIC Reference Manual（PC-8001B版）1-1、1-12/13、2-32、2-59を参照。Bモデルから所有機のRAM容量は推定しない。
次への導入: 次は「データレコーダーによる保存と読み込み」。
出典:
- https://archive.org/details/pc-8001b-n-basic-reference-manual-nec-en-1981
- https://www.pcmini.jp/furoku/basic-05/index.html
-->

---
layout: default
---

# データレコーダーによる保存と読み込み

<CassetteFlow />
<div class="split">
  <div class="cassette-code">

```text
CSAVE "HELLO" //テープへ"HELLO"で保存
CLOAD "HELLO" //テープの"HELLO"をロード
```

</div>
  <div>
    <p><strong>CSAVE</strong>：RAM → テープ<br /><strong>CLOAD</strong>：テープ → RAM</p>
    <p class="muted">電源断で消えるプログラムを保存。</p>
  </div>
</div>

<SlideFooter :number="4" chapter="01 / 1979年の開発環境" />

<!--
伝えること: 当時のBASIC保存を今回のシリアル転送と区別する。
前からのつながり: 前ページのプログラムはRAM上なので、電源断に備える保存先が必要になる。
技術補足: NEC User’s Manual PC-8001B版のPDF13頁がレコーダー接続、52–54頁（誌面47–49）がCLOAD/CSAVE。BASICのプログラム保存とMONのW/Lによる機械語保存・ロードを区別する。今回bootstrap記録は音声ケーブル未用意、CMT/WAV生成はソフト検証済みだが物理ロードは未確認。CSAVE/CLOADのファイル名は先頭6文字を使用。HELLOは独自例。接続図は論理的な音声の流れで端子配線図ではない。
次への導入: 次は「とても大変。」。
出典:
- https://oldcrap.org/wp-content/uploads/2024/07/nec-pc8001b-users-manual.pdf
- https://archive.org/details/pc-8001b-n-basic-reference-manual-nec-en-1981
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: message
class: short-message
---

# 割りと大変

<!--
伝えること: 当時の編集と保存の操作負担を口頭で補足する。
前からのつながり: 前2枚で、RAM上での編集とカセットへの保存を説明した。
技術補足: 技術的な性能比較や実測値ではなく、前2枚の操作手順に対する発表上の所感。今回のカセット保存・所要時間・失敗回数は主張しない。
口頭補足: 当時の方法ではメモリ上のプログラムを行単位で更新し、保存・読込ではレコーダーも操作する。Macでファイルを編集してビルドする流れと比べ、手順が増える点を話す。今回カセットを使用したという説明にはしない。
次への導入: 次は「マニュアルで見つけたシリアル通信」。
出典:
- https://archive.org/details/pc-8001b-n-basic-reference-manual-nec-en-1981
- https://oldcrap.org/wp-content/uploads/2024/07/nec-pc8001b-users-manual.pdf
-->

---
layout: default
---

# マニュアルで見つけたシリアル通信

<div class="manual-grid">
  <MediaAsset asset="manual1" />
  <MediaAsset asset="manual2" />
</div>

<SlideFooter :number="6" chapter="01 / 1979年の開発環境" />

<!--
伝えること: マニュアルでS10に着目した経緯とシリアル通信の存在を紹介する。
前からのつながり: 操作の手間から、別の入力・転送経路を探す話へつなぐ。
技術補足: マニュアルを見てS10に着目したという経緯は今回のユーザー提供情報。発見日・場所は未提供。提供写真の表紙はPC-8001 USER’S MANUAL / PC-8101 / PTS-001。写真2にはPC-8001、PC-8062ケーブル、GND/TXD/RXDの端子説明が写る。版・掲載ページは未確認。S10と8251を使う初代PC-8001の技術関係はZig_80 serial-validationの初代対象記述と実機記録で照合。NEC原本回路の完全照合は元文書でも未完了。既存のPC-8001B User’s Manual参照を、所有機のマニュアル写真やS10端子図の証拠に転用しない。提供写真は初代PC-8001表記を確認。写真の端子表だけでPicoへの直結可否や電圧を判断しない。
口頭補足: 当時の操作手順を紹介した後、マニュアルを読みシリアル通信に着目した経緯へ移る。
次への導入: 次は「これで通信できたら、色々できそう！」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
-->

---
layout: message
---

# これで通信できたら色々できそう！

<!--
伝えること: シリアル経由でMacとの接続とプログラム転送を考える。
前からのつながり: S10とシリアル通信の存在を知り、Macと通信する用途を考える。
技術補足: 可能性を考えたという発表上の展開。実機通信がこの時点で成功していたと解釈させない。具体的な日付や別の試作品は追加しない。
口頭補足: PC単体で編集する代わりに、普段使うMacを編集・ビルドの環境として使えるのではと考えた、という展開を話す。ここは通信成功の報告ではなく、接続を構想する段階。完成チャットへの発展は後半で説明する。
次への導入: 次は「MacとPC-8001を接続する」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
-->

---
layout: default
---

# PC-8001(S10)とRaspberryPi Pico2

<div class="photo-grid">
  <div>
    <p><strong>S10/Pico2</strong></p>
    <p>TX/GPIO 0<br />RX/GPIO 1<br />GND：基準電位</p>
  </div>
  <MediaAsset asset="wiring" compact />
</div>

<SlideFooter :number="8" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: S10の論理信号と物理配線の区別を示す。
前からのつながり: Macとの通信を考え、S10とPico 2の実物接続を示す。
技術補足: 公開資料のTTL反転信号に基づき実機条件を確認する。物理ピン番号、電圧、向きの推測図は作らない。UARTは8251。候補接続表と所有機の実測を区別する。
次への導入: 次はMac・USB・Pico 2・PC-8001の構成図で役割を整理する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
-->

---
layout: default
---

# MacとPC-8001の接続構成

<ConnectionTopology />

<SlideFooter :number="9" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: USBとS10の間をPico 2で橋渡しする構成と機器の役割を示す。
前からのつながり: 前ページはS10とPico 2の接写。ここでは機器ごとの担当を図で整理する。
技術補足: 図は論理構成。Pico GP0 TX→S10 /RXD、S10 /TXD→GP1 RX、GND共有。PIOがUARTを実装する。電圧や物理ピン番号の配線手順ではない。
次への導入: 次は「でも、どうやって受信する？」で、物理接続と受信プログラムを分けて考える。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: message
---

# でも、どうやって<br>任意のプログラムを実行するか？

<!--
伝えること: 物理接続だけでは転送できず最初の受信プログラムが必要だと説明する。
前からのつながり: MacとPC-8001の物理的な接続構成を示した後、受信側のソフトウェアが必要になる点を説明する。
技術補足: 接続の成立とプログラム転送・実行の成立は別。最初の受信プログラムだけを手入力するbootstrapの経緯を説明し、通信障害の詳細な時系列や実機確認範囲は変更しない。
口頭補足:
MacとPC-8001を物理的に接続できました。しかし、接続しただけでは機械語プログラムを転送できません。

PC-8001側に、シリアル通信で受信したデータをRAMへ配置するプログラムが必要です。

ところが、その受信プログラム自体を転送する手段がありません。

そこで、最初の受信プログラムだけは機械語モニターから手入力しました。
次への導入: 次は「最初は機械語を直接入力」で、初期333Bから100Bへ改善した入口を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: message
---

# プログラムをロード・実行する仕組みが必要

<!--
伝えること: 物理接続に加え実機側の受信・実行コードが必要だと示す。
前からのつながり: でも、どうやって任意のプログラムを実行するか？の説明を受けて次の実装へ進む。
技術補足: 発表上の導入。新たな実機成功・計測値を追加しない。
次への導入: 次の実装・確認結果を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# シリアル通信でのローダーの実装

<FlowDiagram
  :items='[{"title": "初回導入", "text": "小さな受信コードを\n手入力"}, {"title": "常駐ローダー", "text": "次段をシリアル転送\nRAMで待機"}, {"title": "アプリを実行", "text": "転送 → RAM検証\n実行 → ローダーへ復帰"}]'
/>
<p>ローダーは、実機側で動く「受信・実行」のプログラム。</p>
<p class="muted">初回導入後は、アプリのソース修正と再転送を繰り返せる。</p>

<SlideFooter :number="12" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: PC側の受信プログラムでデプロイを可能にする。
前からのつながり: 手入力した小さな受信コードから次段を導入し、アプリを転送できる状態へ進む。
技術補足: miniはREADY37hを送り333B+SUM8を受信する。SUM8はCRC16より弱く複数誤りや順序交換をすべて検知しない。中継は旧stage0.asm、常駐はstage1.asmという互換ファイル名。実コード1134+ゼロ埋め146=1280。常駐のスタックE700–E7FFはアプリ2KBとは別。E900以降は転送禁止。
次への導入: 次は「Zig_80による開発・デプロイ」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# 最初は機械語を直接入力

<div class="photo-grid">
  <div>
    <p>初期ローダー：<strong>100B</strong></p>
    <p>Sコマンドで16進数を書き込み、Dコマンドで読み返す。</p>
    <p class="small muted">詳細：Appendix 36</p>
  </div>
  <MediaAsset asset="typing" compact />
</div>

<SlideFooter :number="13" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: 最初の333B手入力と後の100B化を時系列で示す。
前からのつながり: 受信プログラム自体を転送できないため、最初の入口を機械語モニターから手入力する。
技術補足: NECモニターSで変更しDで表示する。ユーザー提供のMON画面写真を表示。写真はE300番地の表示であり、E400配置の333B版やmini100B版の同一CRCの証拠とはしない。所要時間やミス回数は記録がないため記載しない。当初333Bを手入力したことは今回のユーザー提供の開発経緯。文字数は最新文書の従来経路の計算値。MONコード入力のみ813文字、全工程883。BASICのファイルサイズ1420Bと総入力1406文字を混同しない。333BはE400–E54C。後に中継へ再利用する。100Bの入口を追加し333Bコードは変更せず再利用。mini MONコード入力のみ249文字、全工程319文字。BASIC mini7行/757文字。CLEAR/WIDTH、D全バイト確認、DEFUSR/USR、RETURN/CTRL+Bを含む集計。入力時間の実測ではない。小型化は前の通信検証と並行し、後から着手したと断定しない。
次への導入: 次は「シリアルローダーの実装」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# Zig_80による開発・デプロイ

<p class="small muted">目標：Macで編集 → アセンブル → 実機で実行。常駐ローダー待機中。</p>

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

<SlideFooter :number="14" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: Macで編集したZ80ソースをビルドし実機へデプロイする目標とCLI手順を示す。
前からのつながり: ローダーが受信・検証・起動を担当できるので、Macの編集・ビルド・デプロイへ統合する。
技術補足: コマンドはZig_80リポジトリのルートで実行。従来の独立した開発目標はこのページへ統合。Zig_80はホスト側の開発環境。PC側ではアセンブル済みのZ80機械語を実行する。実測を伴わない個人の感情や回数は捏造しない。 READMEのzig buildとasmの構文、docs/pc8001-serial-loader.mdのdeploy例、src/main.zigとsrc/serial/deploy.zigのusage/parseを照合。実機への送信は今回の資料作成中に再実行しない。PORTは例示。新規ログ名を使う。完全な初回導入手順ではない。Zig製の2パスアセンブラ、Z80 CPU、CLI/TUIを提供。PC8001の検証は専用テストの8251/CRTC等モデル。汎用CLI runへhello.binを渡すだけでPC8001実機を再現するとは言わない。
次への導入: 次は「実機で繰り返し実行する」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/main.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/deploy.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
-->

---
layout: default
---

# 実機で繰り返し実行する

<FlowDiagram
  :items="[{'title': 'アプリA', 'text': '転送・検証・実行'}, {'title': 'RET', 'text': '常駐ローダー待機'}, {'title': 'アプリB', 'text': '再転送・検証・実行'}]"
/>
<ul class="constraints">
  <li>常駐コードとスタックを保持している間は、手入力・USR不要。</li>
  <li>電源断・RESET後は再導入。</li>
  <li>アプリがローダーやスタックを破壊する可能性はある。</li>
</ul>

<SlideFooter :number="15" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: 常駐ローダーに戻ることで反復できる条件を示す。
前からのつながり: コマンドを用意した後は、アプリからローダーへ戻って次を試す流れを示す。
技術補足: 初回はCLEAR/MON→mini→中継→常駐。通常deployは既定stage1（常駐）を使う。再EXECは再VERIFYが必要。常駐はRAMのプログラムで電源断後に保持されるという意味ではない。helloからORBITALへの差し替えで実機の反復を確認。
次への導入: 次は「HELLOプログラム」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
-->

---
layout: message
---

# まずはHELLOを表示してみる

<!--
伝えること: 転送の仕組みを使った最初の文字表示へ導入する。
前からのつながり: 実機で繰り返し実行するの説明を受けて次の実装へ進む。
技術補足: 発表上の導入。新たな実機成功・計測値を追加しない。
次への導入: 次の実装・確認結果を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# HELLOプログラム

<div class="split">
  <div>
    <p><strong>44 B / HELLO FROM ZIG_80</strong><br />実機で全文一致を確認。</p>
    <p class="muted">転送・RAM検証・実行・RET復帰。</p>

```asm
    inc de
    bit 0,c
    jr nz,next_character
    inc de
```

</div>
  <MediaAsset asset="hello" compact />
</div>

<SlideFooter :number="17" chapter="03 / 実機アプリの成果" />

<!--
伝えること: 44Bの表示プログラムと実機確認結果を示す。
前からのつながり: 反復可能な経路で、まず文字表示を確認した実機成果を紹介する。
技術補足: hello.asmの1回目のinc deから2回目のinc deまでの原文抜粋。HLは文字列、DEはVRAM。Cのbit0が0なら40文字で2バイト間隔。44B/CRC ADC1。2026-10-26オペレーターが全文一致、ホストがEXEC/RETURNを確認。提供写真にはHELLO FROM ZIG_80 Ver 1.1と表示。写真のバイナリサイズ・CRCは未提供のため、44B/ADC1の過去記録とは分けて扱う。HELLO動画は未提供。
次への導入: 次は「ORBITAL RINGS」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json
-->

---
layout: default
---

# リングのアニメーション

<div class="split">
  <div>
    <p>64×64セミグラフィックで<br />2本のリングを描画。</p>
    <ul class="constraints">
      <li>コード・テーブル：582 B</li>
      <li>128フレーム後にRET</li>
      <li>実機で動き・終了表示・復帰を確認</li>
    </ul>
    <p class="small muted">状態領域と属性保存領域は別途使用。</p>
  </div>
  <MediaAsset asset="orbital" compact />
</div>

<SlideFooter :number="18" chapter="03 / 実機アプリの成果" />

<!--
伝えること: 582Bの描画デモと実機確認結果を示す。
前からのつながり: 文字表示と転送を確認できたので、次は連続した画面更新を試す。
技術補足: コードD000–D245、状態D4E0–D4E5、属性保存640B D500–D77F。582Bだけが全RAM使用量という意味ではない。実機CRC A9DB、復帰A52h、ユーザーがリングと終了表示を確認。属性全バイト復元・保護領域保持はCPUモデル検証。約14.277秒はEXEC ACKから復帰通知までで純粋な描画時間ではない。
次への導入: 次は「入力・表示・通信を組み合わせる」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-demos.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/orbital_rings.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-orbital-rings-014.json
-->

---
layout: message
---

# プログラムの転送以外に<br>アプリでもシリアル通信が使えると楽しそう

<!--
伝えること: デプロイ以外のアプリ内通信へ用途を広げる。
前からのつながり: ORBITAL RINGSの説明を受けて次の実装へ進む。
技術補足: 発表上の導入。新たな実機成功・計測値を追加しない。
次への導入: 次の実装・確認結果を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: message
---

# チャットができるようにしてみよう

<!--
伝えること: 入力・表示・通信を組み合わせたチャット端末へつなぐ。
前からのつながり: プログラムの転送以外にアプリでもシリアル通信が使えると楽しそうの説明を受けて次の実装へ進む。
技術補足: 発表上の導入。新たな実機成功・計測値を追加しない。
次への導入: 次の実装・確認結果を説明する。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: default
---

# PC-8001とローカルLLMの接続

<LlmTopology />
<p class="takeaway">Gemmaの推論はMac上。PC-8001ではクライアントが動く。</p>
<p class="caption">MacのZigホスト：HTTP接続・会話履歴・文字変換。Pico 2：通信の橋渡し。</p>

<SlideFooter :number="21" chapter="04 / LLMクライアントの設計" />

<!--
伝えること: 機器とソフトウェアの責務を分ける。
前からのつながり: 入出力をPCで扱い、計算の重い推論はMacへ分ける。
技術補足: HTTPはホストのloopback POST /api/chat、履歴と正規化もZigホスト。Picoファームウェア変更不要。実機記録はgemma3:1b、最新docのgemma4例と実機モデルを混同しない。
次への導入: 次は「LLMクライアントの処理」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_ollama.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: video-focus
---

# デモ：Gemmaとのチャット

<MediaAsset asset="gemma" />

<SlideFooter :number="22" chapter="04 / LLMクライアントの設計" />

<!--
伝えること: このページで初めて完成チャット実機映像を公開する。
前からのつながり: 構成・処理・メモリ・UIの設計を説明した後で、初めて完成映像の公開へ進む。
技術補足: 現状は動画未提供。生成映像、疑似チャット、過去UIの画像で代用しない。素材が届いたらconfig/media.jsonのgemmaだけを更新する。新UIなら1743B/B9A6との整合を確認し、映像から見えない終了検証を成功扱いしない。手動再生。PDFでは対応MP4名を示す。
次への導入: 次は「実装結果と今後の課題」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# PC-8001のチャットUI

<table class="fact-table">
  <thead>
    <tr>
      <th>機能</th>
      <th>実装</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>入力</td>
      <td>最大64 B / 編集 / Returnで送信</td>
    </tr>
    <tr>
      <td>入力欄</td>
      <td>固定位置。40文字以上は横スクロール</td>
    </tr>
    <tr>
      <td>会話表示</td>
      <td>回答を逐次表示。会話領域だけスクロール</td>
    </tr>
    <tr>
      <td>状態表示</td>
      <td>接続・送信・推論待ち・受信・入力可能</td>
    </tr>
  </tbody>
</table>

<SlideFooter :number="23" chapter="04 / LLMクライアントの設計" />

<!--
伝えること: 完成画面を見せず入力と表示の設計を説明する。
前からのつながり: メモリ配分の結果として実装した、入力・表示・状態管理の機能を説明する。
技術補足: PC側でLLM推論を行うのではない。PC側はASCII端末。このページではクライアントの実装要件だけを提示し、完成UIは見せない。旧UI1683B/F1A3は10往復・ESC・HELLO/ABORT・TX解放。新UI1743B/B9A6は5往復の記録時点で継続中、ESC未操作。モデルでの15往復・復帰試験を新UIの物理実測と混同しない。UIそのものの絵やサムネイルはまだ出さない。
次への導入: 次は「デモ：Gemmaとのチャット」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# 実装結果と今後の課題

<div class="split">
  <div>
    <h2>できたこと</h2>
    <ul class="constraints">
      <li>手入力のローダー(100B)から<br />常駐ローダーを導入</li>
      <li>HELLO・描画デモの<br />転送・検証・実行・復帰</li>
      <li>PCの入力・表示を<br />MacのLLM推論へ接続</li>
    </ul>
  </div>
  <div>
    <h2>今後の課題</h2>
    <ul class="constraints">
      <li>データレコーダーの購入</li>
      <li>ワイヤレス化(ESP32など)</li>
    </ul>
  </div>
</div>

<SlideFooter :number="24" chapter="05 / デモとまとめ" />

<!--
伝えること: 実装済みと新UIの未確認範囲を整理する。
前からのつながり: デモの後に、記録で確認した結果と未確認の範囲を整理する。
技術補足: 到達点はPC単体のLLM推論ではなく、Macとの協調による実機クライアント。耐久や次デプロイなどの残課題は前スライドとfactsの範囲を維持。
次への導入: 次は「Zig_80 / GitHub」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# Zig_80 / GitHub

<div class="closing-content">
  <a class="closing-link" href="https://github.com/moribit/Zig_80">github.com/moribit/Zig_80</a>
  <p class="muted">Z80アセンブラ / CPUモデル / CLI・TUI / 実機デプロイ</p>
  <a class="closing-link" href="https://github.com/moribit/Zig_80_LT"
    >github.com/moribit/Zig_80_LT</a
  >
  <p class="small muted">本編はここまで。Appendixは質疑時に下のリンクから開く。</p>
  <AppendixLinks />
</div>

<SlideFooter :number="25" chapter="05 / デモとまとめ" />

<!--
伝えること: ソースへのリンクで本編を終え質疑用Appendixへ案内する。
前からのつながり: 結果と課題を踏まえて参照先を示し、本編を終えて質疑へ移る。
技術補足: リンクはGitHub正本。発表HTMLはリンクを開く操作をしなければネット接続不要。QRコードは未提供で生成しない。
次への導入: 本編は25で終了。質疑では26–43のAppendixを索引から選ぶ。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md
-->

---
src: ./appendix.md
---
