<template>
  <div class="chat-sequence" role="img" aria-label="PC-8001の質問がPico 2経由でMacへ届き、MacがOllamaへHTTP接続。逐次応答を受信してPCへTEXTを返送する。">
    <div class="sequence-actors"><div><b>PC-8001</b><span>入力・表示</span></div><div><b>Pico 2</b><span>USB–UART</span></div><div><b>Mac</b><span>Zigホスト</span></div><div><b>Ollama</b><span>Gemma推論</span></div></div>
    <div class="sequence-row"><div class="sequence-message span-three to-right" style="grid-column:1/4">質問 / UART・USB</div></div>
    <div class="sequence-row"><div class="sequence-message span-two to-right" style="grid-column:3/5">HTTP POST /api/chat</div></div>
    <div class="sequence-row"><div class="sequence-message span-two to-left" style="grid-column:3/5">NDJSON stream</div></div>
    <div class="sequence-row"><div class="sequence-message span-three to-left" style="grid-column:1/4">TEXT（CRC付き）</div></div>
    <div class="sequence-row"><div class="sequence-message span-three to-right" style="grid-column:1/4">ACK</div></div>
  </div>
</template>
<style scoped>
.chat-sequence { margin:0 0 24px; }
.sequence-actors,.sequence-row { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); }
.sequence-actors>div { border-top:2px solid var(--green); margin:0 14px; padding:12px 0; text-align:center; }
.sequence-actors b { display:block; font-size:24px; }
.sequence-actors span { display:block; font-size:18px; color:var(--muted); }
.sequence-row { min-height:44px; }
.sequence-message { position:relative; border-bottom:1px solid var(--green); margin:0 0 8px; text-align:center; font-size:21px; line-height:1.5; }
.sequence-message:after { position:absolute; bottom:-18px; color:var(--green); font-size:29px; line-height:1; }
.span-three { margin-inline:16.6667%; }
.span-two { margin-inline:25%; }
.to-right:after { content:'→'; right:-3px; }
.to-left:after { content:'←'; left:-3px; }
</style>
