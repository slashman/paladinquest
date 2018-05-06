export default {
  init (game) {
    this.game = game
  },
  after (millis, fn) {
    return this.game.time.events.add(millis, fn)
  },
  wait (millis) {
    return new Promise(resolve => this.after(millis, resolve))
  }
}
