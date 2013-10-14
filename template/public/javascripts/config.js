/*global requirejs*/
requirejs.config({
	baseUrl: 'javascripts/vendor',
	shim: {
		'async': { exports: 'async' },
		'modernizr': { exports: 'Modernizr' }
	},
	paths: {
		'app': '../app',
        'templates': '../templates'
	}
});
