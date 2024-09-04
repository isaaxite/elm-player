import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import inject from '@rollup/plugin-inject';

export default {
	input: {
    'renderer': 'src/renderer/index.ts',
  },
	output: {
    dir: 'dist/',
		format: 'iife',
    // globals: {
    //   'global/window': 'window',
    //   'global/document': 'document',
    //   'safe-json-parse/tuple': 'safeJsonParseTuple',
    //   '@videojs/vhs-utils/es/byte-helpers': 'byteHelpers',
    //   '@videojs/vhs-utils/es/resolve-url': 'resolveUrl',
    //   '@videojs/vhs-utils/es/media-groups': 'mediaGroups',
    //   '@videojs/vhs-utils/es/decode-b64-to-uint8-array': 'decodeB64ToUint8Array',
    //   'mux.js/lib/tools/parse-sidx': 'parseSidx',
    //   '@videojs/vhs-utils/es/id3-helpers': 'id3Helpers',
    //   '@videojs/vhs-utils/es/containers': 'containers',
    //   'mux.js/lib/utils/clock': 'clock',
    // }
	},
  // external: [
  //   'global/window',
  //   'global/document',
  //   'safe-json-parse/tuple',
  //   '@videojs/vhs-utils/es/byte-helpers',
  //   '@videojs/vhs-utils/es/resolve-url',
  //   '@videojs/vhs-utils/es/media-groups',
  //   '@videojs/vhs-utils/es/decode-b64-to-uint8-array',
  //   'mux.js/lib/tools/parse-sidx',
  //   '@videojs/vhs-utils/es/id3-helpers',
  //   '@videojs/vhs-utils/es/containers',
  //   'mux.js/lib/utils/clock',
  // ],
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
    }),
    inject({
      window123: 'global/window',       // 将 `window` 自动注入为 `global/window` 模块
      include: 'src/renderer/index.ts'
    }),
  ]
};
