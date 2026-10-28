---
theme: default
favicon: /favicon.svg
title: 47年前のPCでローカルLLMクライアントを動かしてみた
info: Zig_80 PC-8001実機開発 LT / 4枚のプロトタイプ
aspectRatio: 16/9
canvasWidth: 1100
colorSchema: dark
fonts:
  provider: none
  sans: Noto Sans JP Variable
  mono: IBM Plex Mono
lineNumbers: true
transition: none
drawings:
  persist: false
mdc: true
layout: cover
---

<div class="eyebrow">ZIG_80 / PC-8001</div>

# 47年前のPCで<br>ローカルLLMクライアントを<br>動かしてみた

<div class="subtitle">PC-8001 実機開発の話</div>

<!--
完成画面はまだ見せない。まず、このPCへプログラムを届けるまでの話をする。
47年は1979年と2026年の年差。発表者名・開催日は確定後に追記する。
出典: https://jpn.nec.com/profile/corp/history/pdf/history-120.pdf
-->

---
layout: default
---

# PC-8001という、1979年のパソコン

<div class="photo-grid"><div>
<p>NECの<strong>8ビットPC</strong></p>
<p>BASICとキーボードから<br>始まる実機開発</p>
<p class="muted">今回使うのは<br>初代 PC-8001</p>
</div><div class="photo-placeholder">実機写真をここに<span>本体とキーボード、CRTが分かる写真<br>横位置 4:3 ／ 写真未提供</span></div></div>
<span class="page">02 / 04</span>

<!--
手元の実機と周辺機器を紹介する。写真はpublic/photos/へ。生成画像で代用しない。
1979年・8ビット・BASIC: NEC社史 https://jpn.nec.com/profile/corp/history/pdf/history-120.pdf
初代・N-BASIC対象: Zig_80 docs/pc8001-memory-map.md（参照コミットはdocs/facts.md）。
増設RAM量やROM版を確認したとは言わない。
-->

---
layout: default
---

# 最初の壁は、機械語の手入力

<div class="story-grid"><div>
<p>転送プログラムを入れるにも、<br>まず転送する手段が要る。</p>
<p class="muted">16進数を打つ。全バイトを照合する。<br>入力ミスも、自分で見つける。</p>
<div class="crt input-sample">MON<br>S E300 …<br>D E300,E363</div>
<p class="small muted">入力の雰囲気を示す模式表記</p>
</div><div>
<p class="small muted">初回に手入力する機械語</p>
<div class="number">333 <small>B</small></div>
<p class="small muted">従来の Stage 0</p>
<div class="number" style="margin-top:24px">100 <small>B</small></div>
<p class="small muted">mini Stage 0 に小型化</p>
<p class="small">それでも、照合まで含めて<strong>319文字</strong>。</p>
</div></div>
<span class="page">03 / 04</span>

<!--
自身の作業時のエピソードをここで話す。所要時間や入力ミス回数は未確認なので書かない。
模式表記は操作手順ではない。100B miniのMON方式319文字はCLEAR/WIDTH、全バイト確認、DEFUSR/USRまで含む集計。
333Bは旧Stage 0。現行構成では中継Stage 1として使う。新miniから333B中継、常駐ローダーへ進む。
出典: Zig_80 docs/pc8001-bootstrap.md「生成と入力負担の実測」。
-->

---
layout: default
---

# Pico 2を、実機への橋渡しに

<HardwareTopology />

<span class="page">04 / 04</span>

<!--
PC-8001はS10の8251をポーリングし、Pico 2がUSB/PIOブリッジになる。300bps、8N1、反転。
S10のピン番号を図で断定しない。公開回路の候補と実機照合の区別を維持する。
出典: Zig_80 docs/pc8001-serial-validation.md、docs/pc8001-chat.md。
ここでは接続構成まで。完成チャット画面・動画は後半の成果紹介まで出さない。
-->
