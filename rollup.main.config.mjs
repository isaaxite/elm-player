import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
	input: {
    'main': 'src/main.ts',
    'preload': 'src/preload.ts',
  },
	output: {
    dir: 'dist/',
		format: 'cjs'
	},
  external: ['electron'],
  plugins: [
    resolve({
      extensions: ['.ts'] // 支持这些扩展名的文件解析
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled', // 将 Babel 的 helper 函数打包进代码
      presets: [
        '@babel/preset-env', // 编译现代 JavaScript
        // '@babel/preset-react', // 编译 React 代码
        '@babel/preset-typescript' // 编译 TypeScript 代码
      ],
      extensions: ['.ts'], // 处理这些扩展名的文件
      exclude: 'node_modules/**' // 排除 node_modules 目录
    })
  ]
};
