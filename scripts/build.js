const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const banner = require('./banner');


pack('src/index.ts');
pack('src/vuex.ts');
pack('src/vue-router.ts');


async function pack(file) {
    const bundle = await rollup.rollup({
        input: file,
        external: [
            '@vue/composition-api',
            'vuex',
            'vue-router',
        ],
        plugins: [
            typescript(),
            terser(),
        ],
    });
    await bundle.write({
        dir: 'dist',
        banner,
        format: 'esm',
        sourcemap: true,
    });
}
