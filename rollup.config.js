import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
const fileName = process.env.FILE;
export default {
    input: `./lib/${fileName}/index.js`,
    output: {
        file: `./lib/${fileName}/dist/${fileName}.min.js`,
        format: 'cjs'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        })
    ]
};