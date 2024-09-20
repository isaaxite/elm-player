import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
	input: {
    'temp': 'temp.ts',
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
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      babelrc: false,
      configFile: './.babelrc.main.json'
    })
  ]
};
