<script setup lang="ts">
// Logical signal flow, not a physical connector drawing.
const nodes = [{title:'開発用ホスト', detail:'Zig_80 CLI'}, {title:'Pico 2', detail:'USB / PIO ブリッジ'}, {title:'PC-8001', detail:'S10 / 8251'}]
</script>
<template><div class="topology" role="img" aria-label="ホストからUSBでPico 2へ接続。Pico GP0からS10 RXDへ送信し、S10 TXDからGP1へ受信。GNDを共有。"><div class="nodes"><template v-for="(n,i) in nodes" :key="n.title"><div v-if="i" class="link">{{ i===1 ? 'USB' : '300 bps' }}<br>⟷</div><div class="node"><b>{{ n.title }}</b><span>{{ n.detail }}</span></div></template></div><div class="wire-map">Pico GP0 (TX) ───→ S10 /RXD<br>Pico GP1 (RX) ←─── S10 /TXD<br>Pico GND ───────── S10 GND</div><p class="small muted">8N1・反転UART。信号の役割を示した論理構成図。<br>端子番号・電圧条件は実機資料と照合する。</p></div></template>
