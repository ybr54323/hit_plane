<template>
  <div>
    <div class="header">
      <span class="text-des">验证：请摁住鼠标左键，刮出两只小鸡</span>
      <svg @click="onReload" t="1601347403565" class="icon" viewBox="0 0 1024 1024" version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           p-id="3257" width="16" height="16">
        <path
            d="M257.6 462.4c28.8 1.6 43.2-11.2 43.2-36.8 0-25.6-17.6-43.2-43.2-43.2H150.4C201.6 208 358.4 84.8 542.4 84.8c187.2 0 348.8 128 395.2 310.4 4.8 20.8 30.4 38.4 51.2 30.4 20.8-4.8 38.4-30.4 30.4-51.2C958.4 153.6 763.2 0 537.6 0 337.6 0 163.2 123.2 80 305.6v-92.8c0-22.4-9.6-43.2-35.2-43.2S1.6 187.2 0 212.8v200c1.6 30.4 25.6 51.2 57.6 49.6h200zM966.4 590.4H779.2c-12.8 0-27.2 3.2-36.8 11.2-11.2 8-19.2 20.8-19.2 36.8 0 20.8 19.2 32 43.2 32h105.6c-59.2 163.2-208 265.6-374.4 265.6-174.4 0-326.4-110.4-382.4-280-8-20.8-30.4-33.6-56-25.6-20.8 8-33.6 30.4-25.6 56C104 888 286.4 1024 499.2 1024c187.2 0 352-105.6 444.8-272v97.6c1.6 24 9.6 43.2 35.2 43.2s43.2-17.6 44.8-43.2V649.6c-1.6-28.8-27.2-54.4-57.6-59.2z"
            p-id="3258" fill="#bfbfbf"></path>
      </svg>
    </div>
    <div class="main-box" v-show="isOk">
      <img class="img-c" src="./texture/chicken2.png" alt="鸡">
      <div class="sub-box">
        <svg t="1601341697648" class="icon-success" viewBox="0 0 1024 1024" version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             p-id="1375" width="16" height="16">
          <path
              d="M512 976.742c-256.67 0-464.742-208.071-464.742-464.737C47.258 255.33 255.329 47.258 512 47.258S976.742 255.329 976.742 512c0 256.67-208.071 464.742-464.742 464.742z m225.413-754.268C575.754 328.69 473.231 647.337 473.231 647.337l-63.088-156.795-130.12 101.161c55.209 25.288 134.067 106.214 201.093 212.429C528.43 692.864 674.324 465.254 745.298 445.02c-27.597-80.921-11.822-146.678-7.885-222.546z m0 0"
              p-id="1376" fill="#1afa29"></path>
        </svg>
        <div class="success-text">恭喜您成功刮出小鸡，继续下一步操作吧</div>
      </div>
    </div>
    <canvas v-show="!isOk" id="canvas">请换一个现代浏览器</canvas>
  </div>
</template>

<script>
import {Chicken, Tap} from './entity'

export default {
  name: "Scratch",
  props: {
    configParams: {
      default() {
        return {
          rId: ''
        }
      }
    }
  },
  data() {
    return {
      isOk: false
    }
  },
  mounted() {
    window.onload = () => {
      this.init(this.configParams)
    }
  },
  methods: {
    init({
           width: customWidth = 300,
           height: customHeight = 200,
           id = 'canvas',
           layerBgColor = 'gray',
           bottomBgColor = 'skyBlue',
           targetWidth = 50,
           targetHeight = 50,
           targetCount = 2,
           tapRadius = 20,
         } = {}) {
      const vm = this
      vm.isOk = false
      const canvas = document.querySelector(id)
      canvas.style.display = id === 'canvas' ? 'unset' : 'none'
      const ctx = canvas.getContext('2d')

      const virtual = document.createElement('canvas'); // 画布外画
      const virtualCtx = virtual.getContext('2d')


      const width = canvas.width = virtual.width = customWidth
      const height = canvas.height = virtual.height = customHeight

      changeDomSize('.main-box', width, height)
      changeDomSize('.header', width, 30)

      let chickenTextureList = [] // 鸡图
      const chickenList = [] // 鸡的数组
      const tapTail = [] // 运动轨迹
      let rId = vm.rId = '' // animation id

      let count = 0

      function changeDomSize(domId = null, w = 300, h) {
        const dom = document.querySelector(domId)
        if (w) dom.style.width = w + 'px'
        if (h) dom.style.height = h + 'px'
      }

      for (let i = 1; i <= 2; i++) {
        const url = require('./texture/chicken' + i + '.png')
        const img = new Image()
        img.src = url
        img.onload = () => {
          count++
          chickenTextureList.push(img)
          if (count === 2) {
            let isMouseDown = false
            bindMouseEvent()
            bindTouchEvent()
            loop()

            function bindTouchEvent() {
              const {offsetTop, offsetLeft} = canvas
              canvas.addEventListener('touchstart', (e) => {
                isMouseDown = true
                e.preventDefault()
              })
              canvas.addEventListener('touchend', (e) => {
                isMouseDown = false
                e.preventDefault()
              })
              canvas.addEventListener('touchcancel', (e) => {
                isMouseDown = false
                e.preventDefault()
              })
              canvas.addEventListener('touchmove', (e) => {
                if (!isMouseDown) return
                e.preventDefault()
                const {changedTouches: [touch]} = e
                const {pageX, pageY} = touch
                const offsetX = pageX - offsetLeft
                const offsetY = pageY - offsetTop
                console.log(offsetX, offsetY)
                for (let i = 0; i < tapTail.length; i++) { // handle repeat
                  if (tapTail[i].x === offsetX && tapTail[i].y === offsetY) {
                    return
                  }
                }
                tapTail.push(new Tap(offsetX, offsetY, {r: tapRadius, virtualCanvas: virtual, ctx}))
                for (let i = 0; i < chickenList.length; i++) {
                  const c = chickenList[i]
                  for (let i = 0; i < c.points.length; i++) {
                    const p = c.points[i]
                    p.createPath()
                    if (ctx.isPointInPath(offsetX, offsetY) && !p.active) {
                      p.active = true
                      c.activeCount++
                    }
                    ctx.closePath()
                  }
                  console.log(`总个数: ${c.points.length}\n点中个数: ${c.activeCount}`)
                  if (c.activeCount >= c.points.length) { // all active
                    c.finish = true
                  }
                }
              })
            }

            function bindMouseEvent() {
              canvas.addEventListener('mousedown', function (e) {
                isMouseDown = true
              })
              canvas.addEventListener('mouseup', function (e) {
                isMouseDown = false
              })

              canvas.addEventListener('mousemove', function (e) {
                if (!isMouseDown) return
                const {offsetX, offsetY} = e
                for (let i = 0; i < tapTail.length; i++) { // handle repeat
                  if (tapTail[i].x === offsetX && tapTail[i].y === offsetY) {
                    return
                  }
                }
                tapTail.push(new Tap(offsetX, offsetY, {r: tapRadius, virtualCanvas: virtual, ctx}))
                for (let i = 0; i < chickenList.length; i++) {
                  const c = chickenList[i]
                  for (let i = 0; i < c.points.length; i++) {
                    const p = c.points[i]
                    p.createPath()
                    if (ctx.isPointInPath(offsetX, offsetY) && !p.active) {
                      p.active = true
                      c.activeCount++
                    }
                    ctx.closePath()
                  }
                  console.log(`总个数: ${c.points.length}\n点中个数: ${c.activeCount}`)
                  if (c.activeCount >= c.points.length) { // all active
                    c.finish = true
                  }
                }
              })
            }

            function random(min, max) {
              return Math.random() * (max - min)
            }

            function loop() {
              if (!rId) {
                drawBase() // 画外画布画一次就够
              }
              const gradient = ctx.createLinearGradient(0, 0, width, height)
              gradient.addColorStop(0, "#333");
              gradient.addColorStop(0.2, "white");
              gradient.addColorStop(0.5, "#666");
              gradient.addColorStop(0.8, "white");
              gradient.addColorStop(1, "#333");
              ctx.fillStyle = gradient
              ctx.fillRect(0, 0, width, height)
              tapTail.forEach(t => {
                t.draw()
              })
              const allFinish = chickenList.every((c) => {
                return c.finish
              })
              if (allFinish) {
                cancelAnimationFrame(rId)
                vm.$emit('on-ok', true)
                vm.isOk = true
                return
              }
              vm.rId = rId = requestAnimationFrame(loop)
            }

            function drawBase() {
              let cWidth, cHeight
              cWidth = targetWidth
              cHeight = targetHeight

              const gradient = ctx.createLinearGradient(0, 0, width, 0)
              gradient.addColorStop(0, "#6495ED");
              gradient.addColorStop(0.1, "#AFEEEE");
              gradient.addColorStop(0.5, "#B0E0E6");
              gradient.addColorStop(0.9, "#AFEEEE");
              gradient.addColorStop(1, "#6495ED");
              virtualCtx.fillStyle = gradient
              virtualCtx.fillRect(0, 0, width, height)
              while (chickenList.length < targetCount) {
                const c = new Chicken(random(cWidth, width - cWidth), random(cHeight, height - cHeight), {
                  width: cWidth,
                  height: cHeight,
                  texture: chickenTextureList[Math.floor(Math.random() * 2)],
                  ctx,
                  virtualCtx
                })
                c.initPoints()
                chickenList.push(c)
              }
              console.log(chickenList)
              chickenList.forEach(c => {
                c.draw()
              })
            }
          }
        }
      }
    },
    onReload() {
      this.$nextTick(() => {
        this.init()
      })
    }
  },
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.text-des {
  font-size: 10px;
}

.main-box {
  display: flex;
  justify-content: center;
  background-color: #ccf5cf;
}


.img-c {
  max-height: 100%;
  object-fit: scale-down;
  margin: 0 5px 0 0;
}

.sub-box {
  max-height: 100%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-success {
  width: 16px;
  height: 16px;
}

.success-text {
  max-height: 90%;
}

</style>
