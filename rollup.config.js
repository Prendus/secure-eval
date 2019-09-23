import typescript from 'rollup-plugin-typescript'

export default {
    input: {
        'secure-eval': 'secure-eval.ts',
    },
    output: [
        {
            dir: 'dist',
            format: 'cjs'
        }
    ],
	plugins: [
		typescript()
	]
}
