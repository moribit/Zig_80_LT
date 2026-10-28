<script setup lang="ts">
const links = [[26,'メモリ'],[27,'S10 / UART / PIO'],[30,'USB / Watchdog'],[32,'受信エラー / 256B'],[35,'導入 / CRC・再送'],[37,'キー入力'],[39,'VRAM / 表示モード'],[41,'HTTP'],[42,'実機検証']] as const
</script>
<template><nav class="appendix-links" aria-label="質疑用Appendix索引"><RouterLink v-for="[page,label] in links" :key="page" :to="{path:'/'+page,query:{appendix:'1'}}">{{ page }} — {{ label }}</RouterLink></nav></template>
<style scoped>.appendix-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px 20px;margin-top:18px;font-size:19px}.appendix-links a{color:var(--green);text-decoration:underline;text-underline-offset:4px}</style>
