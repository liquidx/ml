const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		}
	},
	darkMode: 'class',

	plugins: [require('flowbite/plugin')],
};

module.exports = config;
