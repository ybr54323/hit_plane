// 导入组件，组件必须声明 name
import Scratch from './Scratch'

// 为组件提供 install 安装方法，供按需引入
Scratch.install = function (Vue) {
  Vue.component(Scratch.name, Scratch)
}

// 导出组件
export default Scratch
