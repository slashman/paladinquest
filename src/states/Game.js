import Phaser from 'phaser'
import Time from '../Time'
import Player from '../Player'
import World from '../World'
import MONSTERS from '../MONSTERS'

const WIDTH = 5
const HEIGHT = 5

const MAPX = 85
const MAPY = 83

const shapes = []

const HPMAX = 10
const ATKMAX = 10
// const DEFMAX = 5

export default class extends Phaser.State {
  create () {
    this.gameOver = true
    this.game.add.image(0, 0, 'frame')
    for (let x = 0; x < WIDTH; x++) {
      shapes[x] = []
      for (let y = 0; y < HEIGHT; y++) {
        shapes[x][y] = [
          this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 0),
          this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 1),
          this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 2),
          this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 3)
        ]
        this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 4)
        this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 5)
        this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 6)
        this.game.add.image(MAPX + x * 96, MAPY + y * 96, 'tileset', 7)
      }
    }
    this.hpIcons = []
    for (let i = 0; i < HPMAX; i++) {
      this.game.add.image(650, 60 + i * 48, 'uitileset', 6)
      this.hpIcons.push(this.game.add.image(650, 60 + i * 48, 'uitileset', 2))
    }

    this.attackIcons = []
    for (let i = 0; i < ATKMAX; i++) {
      this.game.add.image(700, 60 + i * 48, 'uitileset', 5)
      this.attackIcons.push(this.game.add.image(700, 60 + i * 48, 'uitileset', 1))
    }

    /*this.defenseIcons = []
    for (let i = 0; i < DEFMAX; i++) {
      this.game.add.image(i * 48 + 400, 600 - 48, 'uitileset', 6)
      this.defenseIcons.push(this.game.add.image(i * 48 + 400, 600 - 48, 'uitileset', 2))
    }*/

    World.generate(1)
    Time.init(this.game)
    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(() => this.goLeft())
    this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(() => this.goDown())
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(() => this.goRight())
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(() => this.goUp())

    const TEXTX = 650;
    this.game.add.text(TEXTX, 550, 88, {font: "55px lcd", fill: "#757870"})
    this.levelTxt = this.game.add.text(TEXTX, 550, 88, {font: "55px lcd", fill: "#000000"})

    this.game.add.text(TEXTX + 130, 200, 8, {font: "55px lcd", fill: "#757870"})
    this.mapXTxt = this.game.add.text(TEXTX + 130, 200, 8, {font: "55px lcd", fill: "#000000"})    

    this.game.add.text(TEXTX + 130, 260, 8, {font: "55px lcd", fill: "#757870"})
    this.mapYTxt = this.game.add.text(TEXTX + 130, 260, 8, {font: "55px lcd", fill: "#000000"})

    Time.wait(1000).then(() => this.start())

    this.moveSFX = new Audio()
    this.moveSFX.src = jsfxr([0,,0.0823,,0.1064,0.6785,,-0.6987,,,,,,0.0701,,,,,1,,,,,0.5])
    this.attackSFX = new Audio()
    this.attackSFX.src = jsfxr([1,,0.0787,,0.1254,0.7238,,-0.5236,,,,,,,,,,,1,,,0.0896,,0.5])
    this.powerupSFX = new Audio()
    this.powerupSFX.src = jsfxr([1,,0.2784,,0.1848,0.2379,,0.2061,,,,,,,,0.6334,,,1,,,,,0.5])
    this.newLevelSFX = new Audio()
    this.newLevelSFX.src = jsfxr([1,,0.3453,,0.3575,0.2107,,0.1295,,0.3937,0.5834,,,,,,,,1,,,,,0.5])
    this.gameOverSFX = new Audio()
    this.gameOverSFX.src = jsfxr([3,,0.3412,0.78,0.2907,0.1237,,,,,,,,,,0.3467,,,1,,,,,0.5])
  }

  goLeft () {
    if (this.gameOver) {
      return
    }
    if (Player.x > 0) {
      this.tryMove(-1, 0)
    } else if (Player.y === Math.floor(HEIGHT / 2) && Player.roomX > 0) {
      Player.roomX--
      Player.x = WIDTH - 1
      this.enterRoom(Player.roomX, Player.roomY)
    }
    this.endTurn()
  }

  goRight () {
    if (this.gameOver) {
      return
    }
    if (Player.x < WIDTH - 1) {
      this.tryMove(1, 0)
    } else if (Player.y === Math.floor(HEIGHT / 2) && Player.roomX < World.WIDTH - 1) {
      Player.roomX++
      Player.x = 0
      this.enterRoom(Player.roomX, Player.roomY)
    }
    this.endTurn()
  }

  goUp () {
    if (this.gameOver) {
      return
    }
    if (Player.y > 0) {
      this.tryMove(0, -1)
    } else if (Player.x === Math.floor(WIDTH / 2) && Player.roomY > 0) {
      Player.roomY--
      Player.y = HEIGHT - 1
      this.enterRoom(Player.roomX, Player.roomY)
    }
    this.endTurn()
  }

  goDown () {
    if (this.gameOver) {
      return
    }
    if (Player.y < HEIGHT - 1) {
      this.tryMove(0, 1)
    } else if (Player.x === Math.floor(WIDTH / 2) && Player.roomY < World.HEIGHT - 1) {
      Player.roomY++
      Player.y = 0
      this.enterRoom(Player.roomX, Player.roomY)
    }
    this.endTurn()
  }

  tryMove (x, y) {
    if (this.currentRoom.monster && this.currentRoom.monsterX === Player.x + x && this.currentRoom.monsterY === Player.y + y) {
      this.currentRoom.monsterHP -= Player.attack
      if (this.currentRoom.monsterHP <= 0) {
        this.currentRoom.monster = undefined
      }
      this.attackSFX.play()

    } else {
      Player.x += x
      Player.y += y
      this.moveSFX.play()
      if (this.currentRoom.swordX && this.currentRoom.swordX === Player.x && this.currentRoom.swordY === Player.y) {
        Player.attack++
        if (Player.attack > ATKMAX) {
          Player.attack = ATKMAX
        }
        this.currentRoom.swordX = undefined
        this.powerupSFX.play()
      }
      if (this.currentRoom.shieldX && this.currentRoom.shieldX === Player.x && this.currentRoom.shieldY === Player.y) {
        Player.hp += 3
        if (Player.hp > HPMAX) {
          Player.hp = HPMAX
        }
        this.currentRoom.shieldX = undefined
        this.powerupSFX.play()
      }
      if (this.currentRoom.exitX && this.currentRoom.exitX === Player.x && this.currentRoom.exitX === Player.y) {
        Player.level++
        World.generate(Player.level)
        this.enterRoom(Player.roomX, Player.roomY)
        this.newLevelSFX.play()
      }
    }
  }

  endTurn () {
    if (this.currentRoom.monster) {
      if (Math.abs(this.currentRoom.monsterX - Player.x) + Math.abs(this.currentRoom.monsterY - Player.y) === 1) {
        const monsterInfo = MONSTERS[this.currentRoom.monster]
        Player.hp -= monsterInfo.atk
        if (Player.hp <= 0) {
          Player.hp = 0
          this.setGameOver()
        }
      } else {
        const moveX = Math.sign(Player.x - this.currentRoom.monsterX)
        if (moveX === 0) {
          this.currentRoom.monsterY += Math.sign(Player.y - this.currentRoom.monsterY)
        } else {
          this.currentRoom.monsterX += moveX
        }
      }
    }
    this.refresh()
  }

  setGameOver () {
    this.gameOver = true
    this.gameOverSFX.play()
  }

  start () {
    this.gameOver = false
    this.enterRoom(Player.roomX, Player.roomY)
    this.refresh()
  }

  enterRoom (rx, ry) {
    this.currentRoom = World.rooms[rx][ry]
  }

  cls () {
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        this.set(x, y, 'none')
      }
    }
  }

  refresh () {
    this.cls()
    if (this.currentRoom.swordX) {
      this.set(this.currentRoom.swordX, this.currentRoom.swordY, 'sword')
    }
    if (this.currentRoom.shieldX) {
      this.set(this.currentRoom.shieldX, this.currentRoom.shieldY, 'shield')
    }
    if (this.currentRoom.monster) {
      this.set(this.currentRoom.monsterX, this.currentRoom.monsterY, this.currentRoom.monster)
    }
    this.set(Player.x, Player.y, 'player')

    for (let i = 0; i < HPMAX; i++) {
      this.hpIcons[i].visible = i < Player.hp
    }
    for (let i = 0; i < ATKMAX; i++) {
      this.attackIcons[i].visible = i < Player.attack
    }
    /*for (let i = 0; i < DEFMAX; i++) {
      this.defenseIcons[i].visible = i < Player.defense
    }*/
    this.levelTxt.text = Player.level > 9 ? Player.level : '0' + Player.level
    this.mapXTxt.text = Player.roomX
    this.mapYTxt.text = Player.roomY
  }

  set (x, y, type) {
    shapes[x][y][0].visible = false
    shapes[x][y][1].visible = false
    shapes[x][y][2].visible = false
    shapes[x][y][3].visible = false
    switch (type) {
      case 'player':
        shapes[x][y][0].visible = true
        shapes[x][y][1].visible = true
        shapes[x][y][2].visible = true
        shapes[x][y][3].visible = true
        break
      case 'headless':
        shapes[x][y][0].visible = true
        break
      case 'ghost':
        shapes[x][y][1].visible = true
        shapes[x][y][3].visible = true
        break
      case 'head':
        shapes[x][y][2].visible = true
        break
      case 'sword':
        shapes[x][y][1].visible = true
        break
      case 'shield':
        shapes[x][y][3].visible = true
        break
    }
  }
}
