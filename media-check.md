---
theme: default
favicon: /favicon.svg
title: 検証専用・本編に含めない
aspectRatio: 16/9
canvasWidth: 1100
colorSchema: light
fonts:
  provider: none
layout: video-focus
---

# 動画表示の検証用プレースホルダー

<SlidevVideo controls :autoplay="false" preload="metadata" class="video-area" poster="/videos/placeholder-poster.svg" printPoster="/videos/placeholder-poster.svg">
  <source src="/videos/playback-check.mp4" type="video/mp4" />
</SlidevVideo>

<div class="media-caption">再生・一時停止を手動操作 ／ 実機映像ではありません ／ 本編には含めません</div>

---
layout: code-focus
---

::header::
# 実コード表示の検証

::default::
Picoと通信する前の<br>USART初期化の一部。

<div class="small muted">Zig_80 mini_stage0.asm<br>抜粋。単独実行用ではありません。</div>

::code::
```asm
    xor a
    out (0x21),a
    out (0x21),a
    out (0x21),a
    ld a,0x40
    out (0x21),a
    ld a,0x4e
    out (0x21),a
```
