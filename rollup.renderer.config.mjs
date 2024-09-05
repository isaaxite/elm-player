import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default {
	input: {
    'renderer': 'src/renderer/index.ts',
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
      browser: true,
      preferBuiltins: false, // 对于浏览器环境，设置为 false
      extensions: ['.ts', '.tsx', '.js'] // 支持这些扩展名的文件解析
    }),
    postcss({
      inject: true, // This will extract the CSS into a separate file
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled', // 将 Babel 的 helper 函数打包进代码
      babelrc: false,
      configFile: './.babelrc.renderer.json',
      extensions: [".tsx", ".ts"]
    })
  ]
};
