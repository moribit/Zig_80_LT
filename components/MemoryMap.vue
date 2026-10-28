<script setup lang="ts">
defineProps<{ detailed?: boolean }>()
const overview = [
 ['0000–CFFF','ROM / BASICプログラム等',''],
 ['D000–D7FF','アプリ：2,048 B','app'],
 ['D800–DCFF','常駐：固定イメージ1,280 B',''],
 ['DD00–E3FF','予約（miniはE300–E363）',''],
 ['E400–E5FF','中継ローダー予約領域',''],
 ['E600–E8FF','通信バッファ / スタック / 状態',''],
 ['E900–FFFF','BASICワーク・VRAM等を保護','protected'],
]
const details = [
 ['0000–7FFF','BASIC / 拡張ROM',''],['RAM開始–CFFF','BASICプログラム・呼出元スタック',''],
 ['D000–D7FF','アプリ転送許可（2,048 B）','app'],['D800–DCFF','常駐1,134 B＋padding146 B',''],
 ['DD00–E3FF','予約 / mini E300–E363',''],['E400–E5FF','中継予約512 B（実コード333 B）',''],
 ['E600–E6FF','受信・前回要求・応答 各80 B＋予約',''],['E700–E7FF','プライベートスタック256 B',''],
 ['E800–E8FF','保存SP・状態・応答退避・予約',''],['E900–FFFF','BASICワーク / VRAM / scratchpad','protected'],
]
</script>
<template><div class="address-map" :class="{ detailed }" role="img" aria-label="アドレス昇順のメモリマップ。アプリはD000からD7FFだけを転送許可。高さは縮尺外。"><div v-for="[range,label,kind] in detailed ? details : overview" :key="range" :class="kind"><code>{{ range }}</code><span>{{ label }}</span></div><small>上→下：アドレス昇順 / 高さは縮尺外</small></div></template>
<style scoped>
.address-map>div { display:grid; grid-template-columns:173px 1fr; padding:11px 13px; border:1px solid var(--line); border-bottom:0; font-size:19px; line-height:1.5; }
.address-map>div:last-of-type { border-bottom:1px solid var(--line); }
.address-map code { font-size:18px; white-space:nowrap; }
.address-map .app { background:#e9f3ec; border-left:4px solid var(--green); font-weight:650; }
.address-map .protected { background:#f4f5f4; }
.address-map small { display:block; color:var(--muted); font-size:14px; margin-top:8px; }
.address-map.detailed>div { padding:4px 10px; font-size:17px; }
.address-map.detailed code { font-size:16px; }
</style>
