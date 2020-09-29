// module.exports = {
//   pages: {
//     index: {
//       entry: 'src/lib/scratch/index.js',
//       template: 'public/index.html',
//       filename: 'index.html'
//     }
//   },
//   // 扩展 webpack 配置，使 packages 加入编译
//   chainWebpack: config => {
//     config.module
//       .rule('js')
//       .include
//       .add('/lib')
//       .end()
//       .use('babel')
//       .loader('babel-loader')
//   }
// }
