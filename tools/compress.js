// 先判断是否存在./products目录，若无则先创建，否则直接输出.tar文件到此目录
const fs = require('fs') // 项目本身不支持require写法，此js文件是在打包时交于node直接运行
const tar = require('tar-fs')
if (fs.existsSync('./products')) {
  if (fs.existsSync('./products/web.tar')) {
    fs.unlinkSync('./products/web.tar'); // 删除文件
  }
} else {
  fs.mkdirSync('./products', (err) => {
    if (err) {
      console.log('error:', err)
    }
  })
}
// packing a directory
tar.pack('dist').pipe(fs.createWriteStream('products/web.tar'))
