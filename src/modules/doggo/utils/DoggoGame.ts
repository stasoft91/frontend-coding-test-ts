import { type Ref, ref } from 'vue'
import {
  GRID_COLUMNS,
  GRID_ROWS,
  TIME_BEFORE_FLIP_BACK_MS,
  TIME_BEFORE_FLIP_BACK_START_MS,
} from '@/modules/doggo/constants.ts'
import { useToast } from '@/modules/doggo/utils/useToast.ts'
import type { CardSettings } from '@/modules/doggo/types'

export class DoggoGame {
  public cards: Ref<CardSettings[]> = ref<CardSettings[]>([])

  public $toast = useToast()

  public checkForWin() {
    const isWin = this.cards.value.every((card) => card.isPaired)

    if (isWin) {
      this.$toast.success(
        'You have won the game! Hooray! Refresh page to play again!',
        {
          duration: 10000,
        },
      )
    }
  }

  public hideAllCards() {
    let counter = TIME_BEFORE_FLIP_BACK_START_MS / 1000
    const countdown = setInterval(() => {
      if (counter < 2) {
        clearInterval(countdown)
        this.$toast.info(`Game starts now!`)

        return
      }
      counter -= 1
      this.$toast.info(`Game starts in ${counter} seconds`)
    }, 1000)

    setTimeout(() => {
      this.cards.value.forEach((card) => {
        // eslint-disable-next-line no-param-reassign
        card.isOpen = false
      })
    }, TIME_BEFORE_FLIP_BACK_START_MS)
  }

  public async initGame() {
    const response = await fetch(
      `https://dog.ceo/api/breeds/image/random/${
        (GRID_COLUMNS * GRID_ROWS) / 2
      }`,
    )

    const data = await response.json()

    this.cards.value = this.populateCards(data.message)

    this.hideAllCards()
  }

  public flipCard(card: CardSettings) {
    // we will use this function to get currently opened cards at any time
    const getOpenedCards = () =>
      this.cards.value.filter((_) => _.isOpen && !_.isPaired)

    let currentlyOpenedCards = getOpenedCards()

    // If both cards are already flipped, do nothing
    if (currentlyOpenedCards.length >= 2 || card.isOpen || card.isPaired) {
      return
    }

    // open the card
    const cardFromStore: CardSettings = this.cards.value.find(
      (c) => c.id === card.id,
    )
    if (cardFromStore) {
      cardFromStore.isOpen = true
    }

    currentlyOpenedCards = getOpenedCards()
    // If both cards are flipped, check if they are the same
    if (
      currentlyOpenedCards.length === 2 &&
      currentlyOpenedCards[0]?.url === currentlyOpenedCards[1]?.url &&
      currentlyOpenedCards[0]?.id !== currentlyOpenedCards[1]?.id
    ) {
      currentlyOpenedCards[0].isPaired = true
      currentlyOpenedCards[1].isPaired = true

      currentlyOpenedCards[0].isOpen = true
      currentlyOpenedCards[1].isOpen = true

      this.$toast.success('You did it!')

      this.checkForWin()
    } else {
      // If they are not the same, flip them back
      const openedCards = getOpenedCards()

      if (openedCards.length >= 2) {
        this.$toast.error('Oops!')

        // If they are not the same, flip them back
        setTimeout(() => {
          openedCards[0].isOpen = false
          openedCards[1].isOpen = false
        }, TIME_BEFORE_FLIP_BACK_MS)
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public populateCards(urls: string[]): CardSettings[] {
    return [...urls, ...urls]
      .map((url) => {
        return {
          id: Math.random().toString(36).substring(2, 9),
          url,
          isOpen: true,
          isPaired: false,
        } as CardSettings
      })
      .sort(() => Math.random() - 0.51)
  }
}
