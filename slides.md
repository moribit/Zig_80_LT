---
theme: default
favicon: /favicon.svg
title: 47年前のPCでローカルLLMクライアントを動かしてみた
info: Zig_80 PC-8001実機開発の物語 / 本編25枚 / Appendix17枚
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

<div class="photo-grid spec-grid"><div><table class="fact-table spec-table"><thead><tr><th>項目</th><th>仕様</th></tr></thead><tbody><tr><td>発売</td><td>1979年</td></tr><tr><td>CPU</td><td>μPD780C-1(Z80互換)</td></tr><tr><td>クロック</td><td>4 MHz</td></tr><tr><td>RAM</td><td>標準16 KB</td></tr><tr><td>ROM</td><td>24 KB / N-BASIC</td></tr><tr><td>テキスト表示</td><td>40/80文字 × 20/25行</td></tr><tr><td>シリアル通信</td><td>S10 / μPD8251</td></tr></tbody></table></div><MediaAsset asset="pc8001" compact /></div>

<SlideFooter :number="2" chapter="01 / 1979年の開発環境" />

<!--
伝えること: 初代PC-8001の仕様とN-BASIC搭載を紹介する。
前からのつながり: まず対象のPCを共有し、現代の開発環境との前提の違いを説明する。
技術補足: CPUはμPD780C-1、Z80互換。標準RAM16KBは機種仕様であり所有機の増設量は未確認。写真は未提供で実機を模した図を作らない。
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

<div class="split"><div>

```text
10 PRINT "HELLO"
20 END
LIST
RUN
```

<p class="caption">教材用コード例。実機での実演記録ではない。</p></div><div><h2>行番号で更新</h2><p><code>15 PRINT "PC-8001"</code>：追加<br><code>10 PRINT "HELLO!"</code>：置換<br><code>15</code>：その行を削除</p><p><strong>LIST</strong>：ソースを表示<br><strong>RUN</strong>：RAM上のコードを実行</p></div></div><p class="takeaway">ソースファイルを開く代わりに、メモリ上の行を直接更新する。</p>

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

<CassetteFlow /><div class="split"><div>

```text
CSAVE "HELLO"
CLOAD "HELLO"
```

</div><div><p><strong>CSAVE</strong>：RAM → テープ<br><strong>CLOAD</strong>：テープ → RAM</p><p class="muted">電源断で消えるプログラムを保存。</p></div></div><p class="caption">当時のBASICプログラム保存の説明。今回カセット保存は実施していない。<br>機械語のカセットロードとは別の手順。</p>

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

# とても大変。

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

<div class="manual-grid"><MediaAsset asset="manual" /><div class="manual-labels"><p>S10</p><p>シリアル通信</p><p>8251</p></div></div>

<SlideFooter :number="6" chapter="01 / 1979年の開発環境" />

<!--
伝えること: マニュアルでS10に着目した経緯とシリアル通信の存在を紹介する。
前からのつながり: 操作の手間から、別の入力・転送経路を探す話へつなぐ。
技術補足: マニュアルを見てS10に着目したという経緯は今回のユーザー提供情報。日付・発見場所・冊子の正式名・版・ページ番号は未提供で追加しない。S10と8251を使う初代PC-8001の技術関係はZig_80 serial-validationの初代対象記述と実機記録で照合。NEC原本回路の完全照合は元文書でも未完了。既存のPC-8001B User’s Manual参照を、所有機のマニュアル写真やS10端子図の証拠に転用しない。素材提供後に表紙・対象機種・該当箇所を確認する。
口頭補足: 当時の操作手順を紹介した後、マニュアルを読みシリアル通信に着目した経緯へ移る。
次への導入: 次は「これで通信できたら、色々できそう！」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
-->

---
layout: message
---

# これで通信できたら、色々できそう！

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

# MacとPC-8001を接続する

<MediaAsset asset="connection" />

<SlideFooter :number="8" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: 接続全景の写真を見せる領域と構成図を分離する。
前からのつながり: 可能性を考える段階から、実際に接続する機器の紹介へ進む。
技術補足: connectionはMac・USBケーブル・Pico 2・PC-8001の接続全景を示す実機写真。未提供なのでプレースホルダー。wiringはAppendixのS10近接配線用と役割を分ける。配線があることだけで通信成功とは扱わず、詳細な障害と試験記録はAppendixで扱う。
口頭補足: Macとの接続を考え、USBとシリアルの間をPico 2で橋渡しする構成へ進む。
次への導入: 次は「MacとPC-8001の接続構成」。
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
前からのつながり: 前ページは接続全景の写真枠。ここでは機器ごとの担当を図で整理する。
技術補足: 図は論理構成。Pico GP0 TX→S10 /RXD、S10 /TXD→GP1 RX、GND共有。PIOがUARTを実装する。電圧や物理ピン番号の配線手順ではない。
次への導入: 次は「でも、どうやって受信する？」で、物理接続と受信プログラムを分けて考える。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
-->

---
layout: message
---

# でも、どうやって受信する？

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
layout: default
---

# 最初は機械語を直接入力

<div class="photo-grid"><div><p>初期ローダー：<strong>333 B</strong></p><p>Sコマンドで16進数を書き込み、Dコマンドで読み返す。</p><p class="muted">後に、手入力部分を<br>100 Bへ縮小。</p><p class="small muted">詳細：Appendix 35</p></div><MediaAsset asset="typing" compact /></div>

<SlideFooter :number="11" chapter="02 / 現代のビルドとデプロイ" />

<!--
伝えること: 最初の333B手入力と後の100B化を時系列で示す。
前からのつながり: 受信プログラム自体を転送できないため、最初の入口を機械語モニターから手入力する。
技術補足: NECモニターSで変更しDで表示する。具体的なMON画面は素材未提供。所要時間やミス回数は記録がないため記載しない。当初333Bを手入力したことは今回のユーザー提供の開発経緯。文字数は最新文書の従来経路の計算値。MONコード入力のみ813文字、全工程883。BASICのファイルサイズ1420Bと総入力1406文字を混同しない。333BはE400–E54C。後に中継へ再利用する。100Bの入口を追加し333Bコードは変更せず再利用。mini MONコード入力のみ249文字、全工程319文字。BASIC mini7行/757文字。CLEAR/WIDTH、D全バイト確認、DEFUSR/USR、RETURN/CTRL+Bを含む集計。入力時間の実測ではない。小型化は前の通信検証と並行し、後から着手したと断定しない。
次への導入: 次は「シリアルローダーの実装」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
-->

---
layout: default
---

# シリアルローダーの実装

<FlowDiagram :items='[{"title": "初回導入", "text": "小さな受信コードを\n手入力"}, {"title": "常駐ローダー", "text": "次段をシリアル転送\nRAMで待機"}, {"title": "アプリを実行", "text": "転送 → RAM検証\n実行 → ローダーへ復帰"}]' /><p>ローダーは、実機側で動く「受信・実行」のプログラム。</p><p class="muted">初回導入後は、アプリのソース修正と再転送を繰り返せる。</p>

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

<SlideFooter :number="13" chapter="02 / 現代のビルドとデプロイ" />

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

<FlowDiagram :items="[{'title': 'アプリA', 'text': '転送・検証・実行'}, {'title': 'RET', 'text': '常駐ローダー待機'}, {'title': 'アプリB', 'text': '再転送・検証・実行'}]" /><ul class="constraints"><li>常駐コードとスタックを保持している間は、手入力・USR不要。</li><li>電源断・RESET後は再導入。</li><li>アプリがローダーやスタックを破壊した場合の復帰は保証しない。</li></ul>

<SlideFooter :number="14" chapter="02 / 現代のビルドとデプロイ" />

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
layout: default
---

# HELLOプログラム

<div class="split"><div><p><strong>44 B / HELLO FROM ZIG_80</strong><br>実機で全文一致を確認。</p><p class="muted">転送・RAM検証・実行・RET復帰。</p>

```asm
    inc de
    bit 0,c
    jr nz,next_character
    inc de
```

<p class="caption">40文字モードでは、さらに1セル進める。</p></div><MediaAsset asset="hello" compact /></div>

<SlideFooter :number="15" chapter="03 / 実機アプリの成果" />

<!--
伝えること: 44Bの表示プログラムと実機確認結果を示す。
前からのつながり: 反復可能な経路で、まず文字表示を確認した実機成果を紹介する。
技術補足: hello.asmの1回目のinc deから2回目のinc deまでの原文抜粋。HLは文字列、DEはVRAM。Cのbit0が0なら40文字で2バイト間隔。44B/CRC ADC1。2026-10-26オペレーターが全文一致、ホストがEXEC/RETURNを確認。動画は未提供なので映像再生成功を主張しない。
次への導入: 次は「ORBITAL RINGS」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/hello.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-bootstrap.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-26-hello-014.json
-->

---
layout: default
---

# ORBITAL RINGS

<div class="split"><div><p>64×64セミグラフィックで<br>2本のリングを描画。</p><ul class="constraints"><li>コード・テーブル：582 B</li><li>128フレーム後にRET</li><li>実機で動き・終了表示・復帰を確認</li></ul><p class="small muted">状態領域と属性保存領域は別途使用。</p></div><MediaAsset asset="orbital" compact /></div>

<SlideFooter :number="16" chapter="03 / 実機アプリの成果" />

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
layout: default
---

# 入力・表示・通信を組み合わせる

<FlowDiagram :items='[{"title": "入力", "text": "キー → 文字列\n編集・Return送信"}, {"title": "表示", "text": "文字列 → 画面\n入力欄・会話の更新"}, {"title": "通信", "text": "質問を送信\n回答を受信"}]' /><p>PC-8001側は、入力・表示・シリアル通信を担当。</p><p class="muted">LLM推論と会話履歴はMac側へ分離する。</p>

<SlideFooter :number="17" chapter="03 / 実機アプリの成果" />

<!--
伝えること: チャット端末を構成する三つの入出力を示す。
前からのつながり: 画面出力に入力と通信を組み合わせることで、対話するアプリを構成できる。
技術補足: Mini Invaders1361Bの左右/SPACE動作を実機確認。ESC等はモデル検証と分ける。チャットはROMや割り込みに頼らずactive-lowキーマトリクスを直接走査し、Shift、削除、64B入力を扱う。完成UIの画像はまだ出さない。
次への導入: 次は「PC-8001とローカルLLMの接続」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-invaders.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
-->

---
layout: default
---

# PC-8001とローカルLLMの接続

<LlmTopology /><p class="takeaway">Gemmaの推論はMac上。PC-8001ではクライアントが動く。</p><p class="caption">MacのZigホスト：HTTP接続・会話履歴・文字変換。Pico 2：通信の橋渡し。</p>

<SlideFooter :number="18" chapter="04 / LLMクライアントの設計" />

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
layout: default
---

# LLMクライアントの処理

<ChatSequence simple /><div class="split"><div><p>回答は通常<strong>8 Bずつ</strong>PCへ送る。</p></div><div><p>300bps / 8N1の理論上限：<strong>30 B/s</strong></p></div></div><p class="caption">通信の付加情報を含む実効速度はこれより低い。詳細はAppendix 41。</p>

<SlideFooter :number="19" chapter="04 / LLMクライアントの設計" />

<!--
伝えること: 質問とストリーミング回答のデータフローを示す。
前からのつながり: 機器の担当を示したので、質問から回答が届くまでの処理順を追う。
技術補足: NDJSONを逐次解析、TEXTは既定8B、LF、100ms、DONEでflush。1〜32B設定可。時間は送出の目標で伝送完了期限ではない。未ACKバイトを保持し、UART/ACK待ちはHTTP読出しを止める。ASCII大文字化と非ASCIIの?変換、160文字上限。完成回答に人工文字遅延を掛ける方式ではない。
次への導入: 次は「アプリ領域を2KBに制限した理由」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_queue.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_text.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_protocol.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/chat_ollama.zig
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# アプリ領域を2KBに制限した理由

<div class="memory-layout"><MemoryMap /><div><p><strong>D000–D7FFだけを<br>アプリ転送に許可</strong></p><p>ローダーとBASIC等の<br>領域を保護する。</p><p class="muted">2KBは現在の設計上の制限。<br>ハードの上限ではない。</p><p class="small muted"><code>CLEAR 300,&HCFFF</code>でBASIC領域を制限。詳細はAppendix 26。</p></div></div>

<SlideFooter :number="20" chapter="04 / LLMクライアントの設計" />

<!--
伝えること: 2KBがハード上限ではなく転送プロファイルの設計制限だと説明する。
前からのつながり: データの流れに加え、実機側プログラムが置けるメモリ範囲を明らかにする。
技術補足: memory profile v1の保守的な転送境界。D800–DCFFは常駐固定1280B、E400–E5FFは中継予約、E600以降はバッファ/スタック/状態でE900以上は全域転送禁止。DD00–E3FFの一部に手入力mini E300–E363が置かれるが通常deploy対象ではない。CLEAR成功とE400読書検証などが導入条件。ハードの絶対上限ではなく、拡大は所有機のRAM/BASICワークを調べ別プロファイルにする。転送制限はMMUや実行時サンドボックスではない。図はアドレス昇順、各帯の高さは縮尺外。
次への導入: 次は「2KBに収めたZ80アプリ」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/src/serial/loader_protocol.zig
-->

---
layout: default
---

# 2KBに収めたZ80アプリ

<p>アプリ領域：<strong>D000–D7FF = 2,048 B</strong></p><MemoryBudget /><p>作業領域：入力64 B・送受信フレーム・キー状態など</p><p class="small muted">スタックは常駐ローダーの別領域（E700–E7FF）を使用。<br>1,743 Bはコード・テーブル等を含む転送イメージ。<br>未割当94 Bのうち、コード直後の空きは70 B。</p>

<SlideFooter :number="21" chapter="04 / LLMクライアントの設計" />

<!--
伝えること: 1743Bと211Bと94Bの配分を示す。
前からのつながり: 2KBという設計制限の中に、コードと作業用データをどう配置したかを示す。
技術補足: D000–D6CE 1743B、D6CF–D714 70B空き、TX35B、前回RX37B、key10B、状態28B、prompt64B、RX37B=211B。D767–D76Fの9BとD7F1–D7FFの15Bも未割当で計94B。1743+211+94=2048。スタックE700–E7FFは常駐の既存256Bで、この2048へ加算する数値ではない。
次への導入: 次は「PC-8001のチャットUI」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
-->

---
layout: default
---

# PC-8001のチャットUI

<table class="fact-table "><thead><tr><th>機能</th><th>実装</th></tr></thead><tbody><tr><td>入力</td><td>最大64 B / 編集 / Returnで送信</td></tr><tr><td>入力欄</td><td>固定位置。40文字時は横スクロール</td></tr><tr><td>会話表示</td><td>回答を逐次表示。会話領域だけスクロール</td></tr><tr><td>状態</td><td>接続・送信・推論待ち・受信・入力可能</td></tr></tbody></table><p class="caption">設計の説明。完成画面・動画は次のデモで初めて表示する。</p>

<SlideFooter :number="22" chapter="04 / LLMクライアントの設計" />

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
layout: video-focus
---

# デモ：Gemmaとのチャット

<MediaAsset asset="gemma" />

<SlideFooter :number="23" chapter="05 / デモとまとめ" />

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

# 実装結果と今後の課題

<div class="split"><div><h2>実装結果</h2><ul class="constraints"><li>mini Stage 0（100 B）から<br>常駐ローダーを導入</li><li>HELLO・描画デモの<br>転送・検証・実行・復帰</li><li>PCの入力・表示を<br>MacのLLM推論へ接続</li></ul></div><div><h2>未確認・今後の課題</h2><ul class="constraints"><li>新UIの実機ESC復帰・次のdeploy</li><li>実機80文字モード</li><li>30分耐久試験</li></ul></div></div>

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

<div class="closing-content"><a class="closing-link" href="https://github.com/moribit/Zig_80">github.com/moribit/Zig_80</a><p class="muted">Z80アセンブラ / CPUモデル / CLI・TUI / 実機デプロイ</p><a class="closing-link" href="https://github.com/moribit/Zig_80_LT">github.com/moribit/Zig_80_LT</a><p class="small muted">本編はここまで。Appendixは質疑時に下のリンクから開く。</p><AppendixLinks /></div>

<SlideFooter :number="25" chapter="05 / デモとまとめ" />

<!--
伝えること: ソースへのリンクで本編を終え質疑用Appendixへ案内する。
前からのつながり: 結果と課題を踏まえて参照先を示し、本編を終えて質疑へ移る。
技術補足: リンクはGitHub正本。発表HTMLはリンクを開く操作をしなければネット接続不要。QRコードは未提供で生成しない。
次への導入: 本編は25で終了。質疑では26（メモリ）、27–29（接続）、30–34（障害・試験）、35–36（導入・CRC）、37–40（入力・描画）、41（HTTP）、42（実機記録）を索引から選ぶ。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.md
-->

---
layout: default
hideInToc: true
---

# Appendix：詳細メモリマップ

<div class="memory-layout"><MemoryMap detailed /><div>

```text
CLEAR 300,&HCFFF
```

<p class="detail">BASICの上限をCFFFへ制限。<br>初期SP：E800付近 / DI<br>通常はRETで常駐へ復帰。</p><p class="small muted">両端で長さ・範囲・entryを検査。<br>4KB/8KBは現プロファイルで拒否。</p><p class="small muted">実行したアプリ自身の破壊を防ぐ<br>ハード隔離ではない。</p></div></div>

<SlideFooter :number="26" chapter="Appendix" />

<!--
伝えること: CLEAR予約と転送許可範囲とABIを詳述する。
前からのつながり: 本編を終えて質疑で参照する補足資料。
技術補足: 常駐プロトコルはCRC16付き。VERIFYは受信時の累積CRCでなく配置済みRAMを再計算。EXECは独立要求。RETは規約を守るアプリのみ。任意コードの実行時隔離や暴走復帰は保証しない。miniはREADY37hを送り333B+SUM8を受信する。SUM8はCRC16より弱く複数誤りや順序交換をすべて検知しない。中継は旧stage0.asm、常駐はstage1.asmという互換ファイル名。実コード1134+ゼロ埋め146=1280。常駐のスタックE700–E7FFはアプリ2KBとは別。E900以降は転送禁止。
次への導入: 次は「Appendix：S10と8251」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-memory-map.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/loader/layout.inc
-->

---
layout: default
hideInToc: true
---

# Appendix：S10と8251

<div class="photo-grid"><div><p><strong>S10 / μPD8251</strong></p><p>TX：送信<br>RX：受信<br>GND：信号基準の共有</p><p class="small muted">TTLレベルの反転信号。<br>一般的なRS-232の電気条件とは区別。</p></div><MediaAsset asset="wiring" compact /></div>

<SlideFooter :number="27" chapter="Appendix" />

<!--
伝えること: S10の論理信号と物理配線の区別を示す。
前からのつながり: 前ページ「Appendix：詳細メモリマップ」の説明を受ける。
技術補足: 公開資料のTTL反転信号に基づき実機条件を確認する。物理ピン番号、電圧、向きの推測図は作らない。UARTは8251。候補接続表と所有機の実測を区別する。
次への導入: 次は「Appendix：UARTフレームと反転信号」。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-validation.md
-->

---
layout: default
hideInToc: true
---

# Appendix：UARTフレームと反転信号

<UartFrame /><div class="split"><div><p><strong>8N1</strong><br>8bit / パリティなし / 停止1bit</p><p class="muted">1バイト = start 1 + data 8 + stop 1</p></div><div><div class="number">30 <small>B/s</small></div><p class="small muted">300bit/s ÷ 10bitの理論上限。<br>反転UARTのアイドルはLow。<br>PIOで信号の極性を処理する。</p></div></div>

<SlideFooter :number="28" chapter="Appendix" />

<!--
伝えること: 8N1と反転極性と理論転送量を示す。
前からのつながり: 前ページ「Appendix：S10と8251」の説明を受ける。
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

<div class="split"><div><h2>Pico 2のPIOで信号を処理</h2><p>USB側のファームウェアと<br>UART波形生成・受信を分離。</p><p>RX：16 cycle / bit<br>TX：8 cycle / bit</p><p class="muted">300bps / 8N1<br>反転もPIO内で処理。</p></div><div>

```asm
bits:
    in pins, 1
    jmp x-- bits [14]
    in pins, 1
    mov isr, ~isr
    push noblock
```

<p class="caption">uart.pio / s10_rx_inverted原文。<br>データ8bitとstopを読み、極性を反転してFIFOへ。</p></div></div>

<SlideFooter :number="29" chapter="Appendix" />

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

<div class="split"><div><h2>現象</h2><p>USB要求がタイムアウト。</p><h2>切り分け</h2><p>PC電源OFF・信号線切り離し。<br>UART無効でも再現。</p></div><div><h2>観測値</h2><div class="log-extract">Pico 単体<br>uptime 減少<br>watchdog_reboot = 1</div><p class="caption">実機記録の要約</p></div></div><p class="takeaway">PCのローダーやUART信号を必要としない再現条件を確認。</p>

<SlideFooter :number="30" chapter="Appendix" />

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

<div class="split"><div><h2>変更</h2><p>停止直前の記録は待機区間。<br>アラーム/WFE起床経路を回避。</p><div class="log-extract">sleep_us(50)<br>↓<br>busy_wait_us_32(50)</div></div><div><h2>実測結果</h2><div class="number">120 <small>秒</small></div><p>USB単体試験が正常終了</p><p class="muted">714応答 / watchdogフラグ0<br>同一アダプター・UART無効</p></div></div><p class="caption">SDK内部の停止箇所・根本原因は未確定。長時間の無再発を保証しない。</p>

<SlideFooter :number="31" chapter="Appendix" />

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

<div class="split"><div><h2>現象</h2><p>返送00–B8の185 Bは一致。<br>B9を期待した位置で6Eを受信。</p><p class="muted">framing flag = 1</p></div><div class="log-extract">期待: … B7 B8 B9 BA …<br>受信: … B7 B8 6E<br><br>条件: 実機からの連続返送</div></div><p class="takeaway">単体ループバックは追加idleあり。隙間なし条件は未検証だった。</p>

<SlideFooter :number="32" chapter="Appendix" />

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

<div class="split"><div><h2>再現条件</h2><p>隙間なし・クロック差・位相差を<br>実PIOモデルへ追加。</p><p class="muted">変更前：相手が1〜2%速い<br>16ケースで失敗。</p></div><div><h2>変更と結果</h2><p><strong>RX：8 → 16 cycle</strong><br>次フレームの開始待ちを調整。</p><p class="muted">変更後：40条件すべてで<br>256 B一致。</p></div></div><p class="caption">300bps・8N1・TX側は維持。モデルでの検証結果であり、実機確認は次ページ。</p>

<SlideFooter :number="33" chapter="Appendix" />

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

<div class="split"><div><div class="large-number">256 <small>/ 256</small></div><p>00〜FFが完全一致。</p><p class="muted">実機PC-8001 / Pico 0.1.4</p></div><div><div class="log-extract">missing = 0<br>extra = 0<br>mismatch = 0<br>CRC16 = OK</div><p class="caption">往復 約17.84秒。再送0。<br>記録値の抜粋。実行しない通信試験。</p></div></div>

<SlideFooter :number="34" chapter="Appendix" />

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

<FlowDiagram :items="[{'title': 'mini Stage 0', 'text': '100 B / 手入力\nE300–E363'}, {'title': '中継 Stage 1', 'text': '333 B / 転送\nE400–E54C'}, {'title': '常駐ローダー', 'text': '実コード 1,134 B\n転送 1,280 B'}]" /><p class="small muted">mini → 中継は加算チェックサム（SUM8）。中継 → 常駐はCRC16。</p><p class="detail">初期333 B / MON総入力883文字 → mini100 B / 319文字。<br>常駐は1,134 B＋ゼロ埋め146 B＝固定1,280 B。</p>

<SlideFooter :number="35" chapter="Appendix" />

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

<div class="split"><div><h2>デプロイ</h2><FlowDiagram :items='[{"title": "DATA", "text": "RAMへ書込"}, {"title": "VERIFY", "text": "RAMを再読"}, {"title": "EXEC", "text": "明示実行"}]' /><p class="detail">CRC16で転送・RAMを検査。<br>NAKやtimeoutで再送制御。<br>RET後は再VERIFYが必要。</p></div><div><h2>チャット</h2><p class="detail">A5 5A / TYPE / SEQ / LEN<br>PAYLOAD / CRC16</p><p class="detail">1フレーム送出 → ACK待ち。<br>未ACKなら最大2回再送。<br>同一フレームの重複は再表示しない。</p></div></div><p class="caption">チャットにNAKはなく、不正フレームは破棄。CRC-16/CCITT-FALSE。</p>

<SlideFooter :number="36" chapter="Appendix" />

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

<div class="split"><div><KeyboardMatrix /><p class="detail">ポート1〜9を走査。0＝押下。<br>反転して「現在ONかつ前回OFF」を抽出。</p></div><div>

```asm
key_row:
    in a,(c)
    cpl
    ld e,a
    xor (hl)
    and e
    ld (hl),e
```

<p class="caption">chat.asm 原文。C＝走査ポート、HL＝前回状態。</p></div></div>

<SlideFooter :number="37" chapter="Appendix" />

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

<div class="split"><div>

```asm
    in a,(8)
    and 0x40
    jr nz,key_lookup
    ld hl,key_shift-27
```

<p class="caption">chat.asm key_table内。SHIFTのbit6が0で記号表を選ぶ。</p></div><div><ul class="constraints"><li>英字は大文字へ統一</li><li>新規押下後に短いdebounce待機<br><span class="small muted">BC=1500の減算ループ</span></li><li>ポート9のbit0/7でESC/STOP<br>→ CANCEL送信後にRET</li></ul></div></div><p class="caption">旧UIの実機ESC復帰を、新UIの確認済み結果として流用しない。</p>

<SlideFooter :number="38" chapter="Appendix" />

<!--
伝えること: SHIFT変換と入力遅延とESC/STOPの扱いを示す。
前からのつながり: 前ページ「Appendix：キーマトリクスと押下判定」の説明を受ける。
技術補足: key先頭はIN A,(9) AND 81h CP 81hでESC/STOPを検出。終了CANCELはACKと送信完了を待ってRET。debounceはキー入力のみに適用し通信へ人工遅延を付けない。SHIFTは記号表、英字はuppercase。キーを押したままではedgeが発生しない。
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

<VramMap /><div class="split"><div>

```asm
    call cell
    pop af
    ld (hl),a
```

<p class="caption">chat.asm putc内。cellが座標からHLを計算。</p></div><div><p class="detail">アドレス＝F300h＋行×120<br>＋列×STRIDE（1または2）</p><p class="detail">文字更新は対象セルのみ。<br>スクロールは会話15行だけ。</p></div></div>

<SlideFooter :number="39" chapter="Appendix" />

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

<div class="split"><div><table class="fact-table "><thead><tr><th>モード</th><th>STRIDE</th><th>文字列の書込先</th></tr></thead><tbody><tr><td>80文字</td><td>1 B</td><td>F300, F301, F302…</td></tr><tr><td>40文字</td><td>2 B</td><td>F300, F302, F304…</td></tr></tbody></table><p class="detail">EA66hのport30保存値bit0を読む。<br>表示モード自体は変更しない。</p></div><div>

```asm
    ld a,0x81
    out (0x51),a
```

<p class="detail">続けてport50hへX/Yを送る。<br>40文字ではXを2倍。<br>カーソル形状・属性は保持。</p></div></div><p class="caption">初期29B HELLOの表示不一致 → 40/80対応44Bへ修正。実機80文字モードは未確認。</p>

<SlideFooter :number="40" chapter="Appendix" />

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

<FlowDiagram :items="[{'title': 'Ollama', 'text': 'NDJSONを逐次受信'}, {'title': 'Zigホスト', 'text': 'ASCIIへ正規化\n通常8 Bずつに分割'}, {'title': 'PC-8001', 'text': 'CRC検査後に表示\nACKを返送'}]" /><div class="split"><div><p>送出条件：8 B・改行<br>100ms・回答完了</p><p class="muted">小さいチャンクは表示更新を細分化。<br>CRC・ACKのオーバーヘッドは増加。</p></div><div><div class="number">30 <small>B/s</small></div><p class="small muted">300bps / 8N1の理論上限。<br>プロトコル込みの実効速度とは異なる。</p></div></div><p class="caption">送信・ACK待ちの間はHTTP読出しを停止。未ACK分はキューに保持。</p>

<SlideFooter :number="41" chapter="Appendix" />

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

<table class="fact-table"><thead><tr><th>版</th><th>実機で確認</th><th>残っている確認</th></tr></thead><tbody><tr><td>旧UI / 1,683 B</td><td>10往復・ESC復帰<br>常駐の再応答</td><td>30分耐久・80文字モード</td></tr><tr><td>新UI / 1,743 B</td><td>入力・横スクロール<br>会話スクロール</td><td>この版のESC復帰<br>次のdeploy</td></tr></tbody></table><p class="takeaway">新UIでは<strong>入力欄を固定</strong>し、会話だけをスクロール。</p><p class="caption">2026-10-27の記録時点。新UIも30分耐久・実機80文字モードは未確認。</p>

<SlideFooter :number="42" chapter="Appendix" />

<!--
伝えること: 新旧UIの成功範囲と未確認を区別する。
前からのつながり: 前ページ「Appendix：HTTPとバックプレッシャー」の説明を受ける。
技術補足: 旧UI1683B/F1A3は10往復・ESC・HELLO/ABORT・TX解放。新UI1743B/B9A6は5往復の記録時点で継続中、ESC未操作。モデルでの15往復・復帰試験を新UIの物理実測と混同しない。UIそのものの絵やサムネイルはまだ出さない。Zig製の2パスアセンブラ、Z80 CPU、CLI/TUIを提供。PC8001の検証は専用テストの8251/CRTC等モデル。汎用CLI runへhello.binを渡すだけでPC8001実機を再現するとは言わない。Mini Invaders1361Bの左右/SPACE動作を実機確認。ESC等はモデル検証と分ける。チャットはROMや割り込みに頼らずactive-lowキーマトリクスを直接走査し、Shift、削除、64B入力を扱う。完成UIの画像はまだ出さない。
次への導入: 質疑に応じて25の索引へ戻る。
出典:
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-screen20-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-validation-records/2026-10-27-chat-classic-014.json
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-chat.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/README.ja.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-serial-loader.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/docs/pc8001-invaders.md
- https://github.com/moribit/Zig_80/blob/9c38139d018f787902dc4c4785b83ea4b3f14e3d/examples/pc8001/chat.asm
-->
