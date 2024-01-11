<template>
  <div class="grid" :style="getGridStyle()">
      <div v-for="card in cards" :key="card.url" class="grid-cell" :class="getClasses(card)" >
        <dog-card :card="card" @click="onClick(card)" />
      </div>
  </div>
</template>

<script setup lang="ts">
import {CardSettings} from "@/modules/doggo/types";
import DogCard from "@/modules/doggo/components/DogCard.vue";
import {GRID_COLUMNS} from "@/modules/doggo/constants";

const getGridStyle = () => {
  return {
    gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
  }
}

defineProps<{
  cards: CardSettings[]
}>()

const emit = defineEmits({
  flip: (card: CardSettings) => true,
})

const onClick = (card: CardSettings) => {
  emit('flip', card)
}

const getClasses = (card: CardSettings) => {
  return {
    paired: card.isPaired
  }
}
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-gap: 1rem;
}

.grid-cell {
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
}

.flip-enter-active {
  transition: all 0.4s ease;
}

.flip-leave-active {
  display: none;
}

.flip-enter, .flip-leave {
  transform: rotateY(180deg);
  opacity: 0;
}

.paired {
  opacity: 0.5;
  flex-direction: column;
  justify-content: center;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '✓';
    color: chartreuse;
    font: 5rem sans-serif;
    width: 100%;
    height: 100%;
  }
}
</style>
