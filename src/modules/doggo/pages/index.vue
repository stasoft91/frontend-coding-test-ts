<template>
  <div class="doggo-page">
    <div class="doggo-page__header">
      <h1 class="doggo-page__title">Doggo Game</h1>
      <p class="doggo-page__subtitle">Find pairs of doggos to win!</p>
    </div>
    <div class="doggo-page__content">
      <div class="doggo-page__list">
        <GridComponent v-bind:cards="doggoGame.cards.value" v-on:flip="onFlip" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import GridComponent from '@/modules/doggo/components/GridComponent.vue'
import { DoggoGame } from '@/modules/doggo/utils/DoggoGame.ts'
import { CardSettings } from '@/modules/doggo/types/index.ts'

const doggoGame: DoggoGame = new DoggoGame()

onMounted(() => {
  doggoGame.initGame()
})

const onFlip = (card: CardSettings) => {
  doggoGame.flipCard(card)
}
</script>

<style scoped lang="scss">
.doggo-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.doggo-page__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.doggo-page__title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
</style>
