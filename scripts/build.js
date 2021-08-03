const rollup = require('rollup')
const typescript = require('@rollup/plugin-typescript')
const { terser } = require('rollup-plugin-terser')
const banner = require('./banner')
const fs = require('fs')


compile('src/index.ts')
compile('src/vuex.ts')
compile('src/vue-router.ts')
copyFile('package.json')
copyFile('README.md')
copyFile('LICENSE')


async function compile(file) {
    const bundle = await rollup.rollup({
        input: file,
        external: [
            'vue',
            '@vue/composition-api',
            'vuex',
            'vue-router',
        ],
        plugins: [
            typescript(),
            terser(),
        ],
    })
    await bundle.write({
        dir: 'dist',
        banner,
        format: 'esm',
        sourcemap: true,
    })
}

function copyFile(file) {
    fs.copyFile(file, `dist/${file}`, err => {
        if (err) console.log(err);
    })
}