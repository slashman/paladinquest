import Random from './Random'
import MONSTERS from './MONSTERS'

const WIDTH = 3
const HEIGHT = 3

const ROOM_WIDTH = 5
const ROOM_HEIGHT = 5

const MONSTERS_IDS = ['headless', 'ghost', 'head']

export default {
  generate (depth) {
    this.rooms = []
    this.WIDTH = WIDTH
    this.HEIGHT = HEIGHT
    for (let x = 0; x < WIDTH; x++) {
      this.rooms[x] = []
      for (let y = 0; y < HEIGHT; y++) {
        this.rooms[x][y] = this.generateRoom(depth)
      }
    }
    const exit = this.rooms[Random.range(0, WIDTH - 1)][Random.range(0, HEIGHT - 1)]
    exit.exitX = Math.floor(ROOM_WIDTH / 2)
    exit.exitY = Math.floor(ROOM_HEIGHT / 2)
  },

  generateRoom (depth) {
    const ret = {}
    if (Random.chance(25)) {
      ret.monster = Random.from(MONSTERS_IDS)
      const monsterInfo = MONSTERS[ret.monster]
      ret.monsterX = Random.range(0, ROOM_WIDTH - 1)
      ret.monsterY = Random.range(0, ROOM_HEIGHT - 1)
      ret.monsterHP = monsterInfo.hp + depth
    }
    if (Random.chance(10)) {
      // Add weapon
      ret.swordX = Random.range(0, ROOM_WIDTH - 1)
      ret.swordY = Random.range(0, ROOM_HEIGHT - 1)
    }
    if (Random.chance(15)) {
      // Add shield
      ret.shieldX = Random.range(0, ROOM_WIDTH - 1)
      ret.shieldY = Random.range(0, ROOM_HEIGHT - 1)
    }
    return ret
  }

}