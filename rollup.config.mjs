import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

const reactBuilderConf = {
	input: {
    'renderer': 'src/renderer/index.tsx',
  },
	output: {
    dir: 'dist/',
		format: 'iife'
	},
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'), // 自定义环境变量
      preventAssignment: true, // 确保替换在编译时完成
    }),
    resolve({
      extensions: ['.ts', '.tsx'] // 支持这些扩展名的文件解析
    }),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: 'bundled', // 将 Babel 的 helper 函数打包进代码
      presets: [
        '@babel/preset-env', // 编译现代 JavaScript
        '@babel/preset-react', // 编译 React 代码
        '@babel/preset-typescript' // 编译 TypeScript 代码
      ],
      extensions: ['.ts', '.tsx'], // 处理这些扩展名的文件
      exclude: 'node_modules/**' // 排除 node_modules 目录
    })
  ]
};

const coreBuilderConf = {
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
}

export default [reactBuilderConf, coreBuilderConf];
