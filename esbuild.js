const esbuild = require('esbuild');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function build() {
    const ctx = await esbuild.context({
        entryPoints: ['src/extension.ts'],
        bundle: true,
        outfile: 'out/extension.js',
        external: ['vscode'],
        format: 'cjs',
        platform: 'node',
        sourcemap: !production,
        minify: production,
        logLevel: 'info',
    });

    const webviewCtx = await esbuild.context({
        entryPoints: ['src/webview/app/index.tsx'],
        bundle: true,
        outfile: 'out/webview.js',
        format: 'iife',
        platform: 'browser',
        sourcemap: !production,
        minify: production,
        logLevel: 'info',
    });

    if (watch) {
        await ctx.watch();
        await webviewCtx.watch();
        console.log('Watching for changes...');
    } else {
        await ctx.rebuild();
        await webviewCtx.rebuild();
        await ctx.dispose();
        await webviewCtx.dispose();
    }
}

build().catch(() => process.exit(1));
