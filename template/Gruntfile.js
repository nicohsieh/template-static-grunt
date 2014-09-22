module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        options: {
            src: 'public/'
        },
        // compile .scss/.sass to .css using Compass
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        // https://github.com/gruntjs/grunt-contrib-compass
        compass: {
            dist: {
                options: {
                    cssDir: '<%= options.src %>stylesheets',
                    sassDir: 'sass'
                }
            }
        },
        // specifying JSHint options and globals
        // http://jshint.org
        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            all: [
                    'Gruntfile.js',
                    '<%= options.src %>javascripts/*.js',
                    '<%= options.src %>javascripts/**/*.js',
                    //ignore vendor libraries
                    '!<%= options.src %>javascripts/vendor/*.js',
                    '!<%= options.src %>javascripts/vendor/**/*.js'
            ],
            options: {
                camelcase: true, //force all variable names to either cameCalse or UPPER_CASE
                curly: true, //use curly braces even on one-liners
                eqeqeq: true, //use strict equality (===, !==)
                immed: true, //wrap self-invoking functions in parentheses
                newcap: true, //capitalize first letter of all constructor functions (i.e. new MyObject())
                noarg: true, //prohibit the use of arguments.caller & arguments.callee (which are forbidden in strict mode of es5+)
                sub: true, //supress warnings for using brace syntax instead of dot syntax on objects
                undef: true, //prohibit the use of undeclared variables (spot leaks + globals)
                eqnull: true, //suppress warnings about using "== null"
                browser: true, //define globals exposed by modern browsers
                maxlen: 150, //generously allowing 150 characters per line, try to stick to standard gutter of 80
                globals: {
                    module: true, //commonjs global
                    define: true, //AMD global
                    require: true, //AMD + CommonJS global
                    console: true //turn this to false when supporting real-old browsers
                }
            }
        },
        // compile requirejs files for production
        // http://requirejs.org
        // https://github.com/gruntjs/grunt-contrib-requirejs
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
        // use the jade template engine to stay DRY
        // http://jade-lang.com
        // https://github.com/gruntjs/grunt-contrib-jade
        jade: {
            //these are any client-side templates you choose to have,
            //they become one AMD module at javascripts/templates.js
            client: {
                files: {
                    '<%= options.src %>javascripts/templates.js': [
                        //any client-side templates go here
                    ]
                },
                options: {
                    compileDebug: false,
                    amd: true,
                    //namespace: false,
                    processName: function(filename){
                        //take out the "views/" path
                        //and the .jade at the end
                        return filename.slice(0, -('.jade'.length)).slice('views/'.length,filename.length);
                    },
                    client: true
                }
            },
            pages: {
                files: {
                    '<%= options.src %>index.html': ['views/index.jade']
                },
                options: {
                    //the data for every template is read from a locals module
                    data: function( dest, src ){
                        return require('./locals');
                    }
                }
            }
        },
        // watch your files for changes
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            options: {
            },
            stylesheets: {
                files: [ '<%= compass.dist.options.sassDir %>/*.{scss,sass}' ],
                tasks: 'compass'
            },
            views: {
                files: [ 'views/*' ],
                tasks: 'jade'
            },
            livereload: {
                //watch the output files, not the pre-processed
                files: ['<%= compass.dist.options.cssDir %>/*.css','<%= Object.keys(jade.pages.files) %>'],
                options: {
                    livereload: true
                }
            },
            hint: {
                files: [ '<%= options.src %>/javascripts/app/**/*.js' ],
                tasks: 'jshint'
            }
        }
    });

    //load all of the NPM Tasks out of the package.json
    Object.keys(require('./package.json').devDependencies).forEach(function(dep){
        if( dep.match(/grunt-/) ){
            grunt.loadNpmTasks(dep);
        }
    });

    grunt.registerTask('default', ['compass', 'jade']);
};
