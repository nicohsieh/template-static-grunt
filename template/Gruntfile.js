module.exports = function(grunt) {
	grunt.initConfig({
		// compile .scss/.sass to .css using Compass
		// http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
		compass: {
			dist: {
				options: {
					cssDir: 'public/stylesheets',
					sassDir: 'sass'
				}
			}
		},
		// specifying JSHint options and globals
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
		jshint: {
			all: [
					'Gruntfile.js',
                    'public javascripts/*.js',
					'public/javascripts/**/*.js',
                    //ignore vendor libraries
                    '!public/javascripts/vendor/*.js',
                    '!public/javascripts/vendor/**/*.js'
			],
			options: {
				curly: true, //use curly braces even on one-liners
				eqeqeq: true, //use strict equality (===, !==)
				immed: true, //wrap self-invoking functions in parentheses
				newcap: true, //capitalize first letter of all constructor functions (i.e. new MyObject())
				noarg: true, //prohibit the use of arguments.caller & arguments.callee (which are forbidden in strict mode of es5+)
				sub: true, //supress warnings for using brace syntax instead of dot syntax on objects
				undef: true, //prohibit the use of undeclared variables (spot leaks + globals)
				eqnull: true, //suppress warnings about using "== null"
				browser: true, //define globals exposed by modern browsers
				globals: {
					module: true, //commonjs global
					define: true, //AMD global
					require: true, //AMD + CommonJS global
					console: true //turn this to false when supporting real-old browsers
				}
			}
		},
		//compile requirejs files for production
		requirejs: {
			compile: {
				options: {
					appDir: 'www-dev/',
					baseUrl: 'javascripts',
					dir: 'dist/',
					optimizeCss: 'standard',
					optimize: 'none',
					//findNestedDependencies: true,
					preserveLicenseComments: false,
					//re-route libs to top-level
					paths: {},
					pragmasOnSave: {
						excludeJade: true
					},
					modules: [{
							name: 'app/main',
							exclude: [
									'jquery',
									'backbone',
									'underscore'
							]
						}
					]
				}
			}
		},
		//better-than-watch
		watch: {
			options: {
				livereload: true
			},
			stylesheets: {
				files: [
						'sass/*.{scss,sass}'
				],
				tasks: 'compass'
			},
			views: {
				files: [
						'views/*'
				],
				tasks: 'template'
			}
		},
		//watch templates using consolidated.js
		//setup for jade but can use many templating engines: https://github.com/rockwood/grunt-templater#supported-template-engines
		template: {
			index: {
				src: 'views/index.jade',
				dest: 'public/index.html',
				variables: {
					title: "Index - Sketchplate",
					pretty: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-templater');
	grunt.registerTask('default', ['compass', 'template', 'jshint']);
};
