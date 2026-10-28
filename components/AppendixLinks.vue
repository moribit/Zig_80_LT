<script setup lang="ts">
const links = [[25,'メモリ'],[26,'S10 / UART / PIO'],[29,'USB / Watchdog'],[31,'受信エラー / 256B'],[34,'導入 / CRC・再送'],[36,'キー入力'],[38,'VRAM / 表示モード'],[40,'HTTP'],[41,'実機検証']] as const
</script>
<template><nav class="appendix-links" aria-label="質疑用Appendix索引"><RouterLink v-for="[page,label] in links" :key="page" :to="{path:'/'+page,query:{appendix:'1'}}">{{ page }} — {{ label }}</RouterLink></nav></template>
<style scoped>.appendix-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px 20px;margin-top:18px;font-size:19px}.appendix-links a{color:var(--green);text-decoration:underline;text-underline-offset:4px}</style>
