<template>
  <VueFlip
    v-bind:model-value="!card.isOpen"
    height="128px"
    width="128px"
    v-on:update:model-value="onCardFlip"
  >
    <template #front>
      <img class="w-full" v-bind:src="card.url" alt="doggo" />
    </template>
    <template #back>
      <img class="w-full" src="/placeholder.png" alt="doggo" />
    </template>
  </VueFlip>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-unresolved
import { VueFlip } from 'vue-flip'
import type { CardSettings } from '@/modules/doggo/types'

defineProps<{
  card: CardSettings
}>()

const emit = defineEmits({
  flip: (card: CardSettings) => true,
})

const onCardFlip = () => {
  emit('flip', card)
}
</script>

<style scoped lang="scss">
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
