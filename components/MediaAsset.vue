<script setup lang="ts">
import { computed } from 'vue'
import manifest from '../config/media.json'
const props=defineProps<{ asset: keyof typeof manifest; compact?: boolean }>()
const item=computed(()=>manifest[props.asset] as {kind:string;title:string;hint:string;src:string|null;poster:string|null;slide:number;label?:string})
const assetUrl=(path:string)=>import.meta.env.BASE_URL+path.replace(/^\//,'')
const poster=computed(()=>assetUrl(item.value.poster || '/videos/placeholder-poster.svg'))
</script>
<template>
  <figure class="media-asset" :class="{'is-compact':compact}" :data-asset="asset" :data-missing="!item.src">
    <SlidevVideo v-if="item.kind==='video' && item.src" controls :autoplay="false" preload="metadata"
      class="video-area" :poster="poster" :printPoster="poster">
      <source :src="assetUrl(item.src)" type="video/mp4" />
    </SlidevVideo>
    <img v-else-if="item.kind==='photo' && item.src" class="real-photo" :src="assetUrl(item.src)" :alt="item.title" />
    <div v-else class="asset-placeholder">
      <div class="asset-type">{{ item.label || (item.kind==='video' ? '実機動画' : '実機写真') }}・未提供</div>
      <b>{{ item.title }}</b><span>{{ item.hint }}</span>
    </div>
    <figcaption>
      {{ item.kind==='video' ? `独立MP4: ${item.src ? item.src.split('/').pop() : asset+'.mp4（予定）'} ／ スライド ${item.slide}` : item.title }}
      <span v-if="!item.src"> ／ 素材待ち</span><span v-else-if="item.kind==='video'"> ／ 手動再生・停止</span>
    </figcaption>
  </figure>
</template>
