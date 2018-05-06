import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.spritesheet('tileset', 'assets/images/tileset.png', 96, 96)
    this.load.spritesheet('uitileset', 'assets/images/uitileset.png', 48, 48)
    this.load.image('frame', 'assets/images/frame.png')
  }

  create () {
    this.state.start('Game')
  }
}
