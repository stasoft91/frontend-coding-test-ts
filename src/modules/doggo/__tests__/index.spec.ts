/* eslint-disable import/no-extraneous-dependencies */

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { DoggoGame } from '@/modules/doggo/utils/DoggoGame.ts'

const message = [
  'https://images.dog.ceo/breeds/terrier-norwich/n02094258_1090.jpg',
  'https://images.dog.ceo/breeds/terrier-norwich/n02094259_1090.jpg',
]

const getMockCards = () => [
  {
    id: '3rvgqdr',
    url: 'https://images.dog.ceo/breeds/terrier-norwich/n02094258_1090.jpg',
    isOpen: false,
    isPaired: false,
  },
  {
    id: 'xikxg1o',
    url: 'https://images.dog.ceo/breeds/terrier-norwich/n02094259_1090.jpg',
    isOpen: false,
    isPaired: false,
  },
  {
    id: 'fxftimb',
    url: 'https://images.dog.ceo/breeds/terrier-norwich/n02094259_1090.jpg',
    isOpen: false,
    isPaired: false,
  },
  {
    id: 'epfaaig',
    url: 'https://images.dog.ceo/breeds/terrier-norwich/n02094258_1090.jpg',
    isOpen: false,
    isPaired: false,
  },
]

describe('Doggo Game', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()

    global.fetch = vi.fn()

    const createFetchResponse = (data) => {
      return {
        json: () =>
          new Promise((resolve) => {
            resolve(data)
          }),
      }
    }

    fetch.mockResolvedValue(
      createFetchResponse({
        message,
      }),
    )

    vi.mock('@/modules/doggo/utils/useToast.ts', () => {
      return {
        useToast: () => {
          return {
            success: vi.fn(),
            error: vi.fn(),
          }
        },
      }
    })
  })

  it('Is composable', () => {
    const doggoGame: DoggoGame = new DoggoGame()
    expect(doggoGame).to.be.an('object')
  })

  it('Inits', async () => {
    const doggoGame = new DoggoGame()

    const hideCardsSpy = vi.spyOn(doggoGame, 'hideAllCards')
    const populateCardsSpy = vi.spyOn(doggoGame, 'populateCards')

    await doggoGame.initGame()

    expect(fetch).toHaveBeenCalled()

    expect(populateCardsSpy).toHaveBeenCalled()
    expect(hideCardsSpy).toHaveBeenCalled()

    expect(doggoGame.cards.value).to.have.length.at.least(message.length * 2)
  })

  it('Flips the first card', async () => {
    const doggoGame: DoggoGame = new DoggoGame()

    doggoGame.cards.value = getMockCards()

    doggoGame.flipCard(doggoGame.cards.value.at(0))

    expect(doggoGame.cards.value.at(0).isOpen).toBeTruthy()
  })

  it('Flips the second card', async () => {
    const doggoGame: DoggoGame = new DoggoGame()

    doggoGame.cards.value = getMockCards()

    doggoGame.flipCard(doggoGame.cards.value[0])
    doggoGame.flipCard(doggoGame.cards.value[1])

    expect(doggoGame.cards.value.at(0).isOpen).toBeTruthy()
    expect(doggoGame.cards.value.at(1).isOpen).toBeTruthy()
  })

  it('Shows error toast after 2 wrong cards', async () => {
    const doggoGame: DoggoGame = new DoggoGame()

    doggoGame.cards.value = getMockCards()

    doggoGame.flipCard(doggoGame.cards.value[0])
    doggoGame.flipCard(doggoGame.cards.value[1])

    expect(doggoGame.$toast.error).toHaveBeenCalled()
    expect(doggoGame.$toast.success).not.toHaveBeenCalled()
  })

  it('Shows success toast upon finding same doggo', async () => {
    const doggoGame: DoggoGame = new DoggoGame()

    doggoGame.cards.value = getMockCards()

    doggoGame.flipCard(doggoGame.cards.value[1])
    doggoGame.flipCard(doggoGame.cards.value[2])

    expect(doggoGame.$toast.error).not.toHaveBeenCalled()
    expect(doggoGame.$toast.success).toHaveBeenCalled()
  })

  it('Finishes', async () => {
    const doggoGame: DoggoGame = new DoggoGame()

    doggoGame.cards.value = getMockCards()

    doggoGame.flipCard(doggoGame.cards.value[1])
    doggoGame.flipCard(doggoGame.cards.value[2])
    doggoGame.flipCard(doggoGame.cards.value[0])
    doggoGame.flipCard(doggoGame.cards.value[3])

    expect(doggoGame.$toast.error).not.toHaveBeenCalled()
    expect(doggoGame.$toast.success).toHaveBeenCalledTimes(3) // 2 pairs + 1 win
  })
})
