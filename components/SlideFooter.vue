<script setup lang="ts">
import deck from '../docs/deck.json'
defineProps<{ number: number; chapter: string }>()
</script>
<template><footer class="deck-footer"><span>{{ chapter }}</span><span>{{ String(number).padStart(2,'0') }} / {{ deck.count }}</span></footer></template>
