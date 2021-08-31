/*
*   修改了package.json中"scripts"指向的是 react-app-rewired 后在运行项目的时候会自动读取该文件
* */

// const {override, fixBabelImports,addLessLoader} = require('customize-cra');
//
// module.exports = override(
//     // 针对antd实现按需打包: 根据import来打包(使用babel-plugin-import)
//     fixBabelImports('import', {
//       libraryName: 'antd',
//       libraryDirectory: 'es',
//       style: 'css',  // 自动打包相关的样式
//     }),
//
//     // 使用Less-Loader对源码中的less的变量进行重新指定
//     addLessLoader({
//       modifyVars: { '@primary-color': '#1DA57A' },
//       javascriptEnabled: true,
//     })
// )

const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};