function Ele(x, y, {
  ctx,
  virtualCtx,
  virtualCanvas,
  r,
  fillStyle,
}) {
  this.ctx = ctx
  this.virtualCtx = virtualCtx
  this.virtualCanvas = virtualCanvas
  this.x = x
  this.y = y
  this.r = r
  this.fillStyle = fillStyle
}

Ele.prototype.draw = function () {
  this.ctx.beginPath()
  this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
  this.ctx.fillStyle = this.fillStyle
  this.ctx.fill()
  this.ctx.closePath()
}

function Point(x, y, params) {
  Ele.call(this, x, y, params)
  this.active = false
}


Point.prototype = Object.create(Ele.prototype)
Point.constructor = Point

Point.prototype.createPath = function () {
  this.ctx.beginPath()
  this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
  this.ctx.closePath()
}

function Chicken(x, y, params) {
  Ele.call(this, x, y, params)
  const {width, height, texture} = params
  this.width = width
  this.height = height
  this.texture = texture
  this.points = []
  this.activeCount = 0
  this.finish = false // 完成刮出
}

Chicken.prototype = Object.create(Chicken.prototype)
Chicken.constructor = Chicken
Chicken.prototype.draw = function () {
  this.virtualCtx.beginPath()
  this.virtualCtx.drawImage(this.texture, this.x, this.y, this.width, this.height)
  this.virtualCtx.closePath()
}

Chicken.prototype.initPoints = function () {
  if (this.points.length) return
  // const pRadius = least(this.width, this.height)
  // if (!pRadius) throw new Error('pRadius值错误:\n', pRadius)

  for (let i = 0; i < this.width / 20; i++) {
    for (let j = 0; j < this.height / 20; j++) {
      const p = new Point(i * 20 + this.x, j * 20 + this.y, {r: 10, ctx: this.ctx})
      this.points.push(p)
    }
  }
  console.log(this.points)
}

function Tap(x, y, params) {
  Ele.call(this, x, y, params)
  const {virtualCanvas} = params
  this.virtualCanvas = virtualCanvas // 画外的画
}

Tap.prototype = Object.create(Ele.prototype)
Tap.constructor = Tap

Tap.prototype.draw = function () {
  this.ctx.beginPath()
  this.ctx.drawImage(this.virtualCanvas, this.x, this.y, this.r, this.r, this.x, this.y, this.r, this.r)
  this.ctx.closePath()

}

module.exports = {
  Ele,
  Point,
  Chicken,
  Tap
}
