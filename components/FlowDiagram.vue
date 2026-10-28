<script setup lang="ts">
defineProps<{ items: {title:string; text?:string}[]; label?:string }>()
</script>
<template><div class="flow-diagram" role="group" :aria-label="label"><template v-for="(item,i) in items" :key="i"><div v-if="i" class="flow-arrow" aria-hidden="true">→</div><div class="flow-step"><b>{{ item.title }}</b><span v-if="item.text">{{ item.text }}</span></div></template></div></template>
