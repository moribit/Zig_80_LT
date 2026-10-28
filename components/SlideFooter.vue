<script setup lang="ts">
defineProps<{ number: number; chapter: string }>()
</script>
<template><footer class="deck-footer"><span>{{ chapter }}</span><span>{{ String(number).padStart(2,'0') }} / 33</span></footer></template>
