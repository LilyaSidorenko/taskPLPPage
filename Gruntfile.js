/*
 * Project Gruntfile
 *
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/**/*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function (grunt) {

    /*
     * Defining the default config values
      * */
    var config = {
            src: 'src',
            tmp: 'tmp',
            build: 'build',
            port: '8094',
            livereloadport: '1337'
    },
    lessExamplesFiles = {};

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('assemble');

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		config: config,

		assemble: {
			options: {
				flatten: true,
				assets: '<%= config.build %>/assets',
				javascript: '/js',
				data: '<%= config.src %>/data/*.{json,yml}',
				helpers: '<%= config.src %>/templates/helpers/**/*.js',
				layout: '<%= config.src %>/templates/layouts/1column.hbs',
				partials: '<%= config.src %>/templates/partials/**/*.hbs',
				plugins: [
					'assemble-contrib-permalinks',
					'assemble-contrib-sitemap'
				],
				sitemap: {
					homepage: '<%= pkg.homepage %>',
					changefreq: 'weekly'
				}
			},
			pages: {
				src: ['<%= config.src %>/templates/pages/*.hbs'],
				dest: '<%= config.build %>/'
			}
		},

		// Before generating any new files,
		// remove any previously-created files (optimization needed here).
		clean: {
			pages: {
				src: [
					'<%= config.build %>/**/*.{html,xml}'
				]
			},
			assets: {
				src: [
					'<%= config.build %>/assets/**/*.{css,js}'
				]
			},
            deploy: {
                src: [
                    '**/*.{html,xml}',
                    '!lost+found/*',
                    '!node_modules/*',
                    'assets/',
                    'js/'
                ]
            }
		},

		// @todo see below to build out project js > bundle.js
		concat: {
			options: {
				separator: "\n\n"
			},
			build: {
				src: [
					'<%= config.src %>/js/vendor/jquery-1.9.min.js'
				],
				dest: '<%= config.build %>/js/plugins.js'
			}
		},

		// Concurrent allows processing tasks concurrently!
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			build: [
				'watch:sass',
				'watch:fonts',
				'watch:js',
				'watch:images',
				'watch:assemble',
				'watch:livereload',
				'connect:server'
			]
		},

		connect: {
			server: {
				options: {
					port: '<%= config.port %>',
					livereload: '<%= config.livereloadport %>',
					// change this to your IP address to access the server from outside (from a VM, etc.)
					hostname: 'localhost',
					keepalive: true,
					open: true,
					base: '<%= config.build %>'
				}
			}
		},

		copy: {
			css: {
				expand: true,
				cwd: '<%= config.src %>/assets/css/',
				src: '**/*.css',
				dest: '<%= config.build %>/assets/css'
			},
			js: {
				expand: true,
				cwd: '<%= config.src %>/js/',
				src: '**/*.js',
				dest: '<%= config.build %>/js'
			},
			fonts: {
				expand: true,
				cwd: '<%= config.src %>/assets/fonts',
				src: '**/*',
				dest: '<%= config.build %>/assets/fonts'
			},
			data: {
				expand: true,
				cwd: '<%= config.src %>/data',
				src: '**/*',
				dest: '<%= config.build %>/data'
			},
			images: {
				expand: true,
				cwd: '<%= config.src %>/assets/images',
				src: '**/*',
				dest: '<%= config.build %>/assets/images'
			},
            deploy: {
                expand: true,
                cwd: '<%= config.build %>',
                src: '**/*',
                dest: ''
            },
		},

		// Image minification
		imagemin: {
			png: {
				options: {
					progressive: 6
				},
				files: [{
					expand: true,
					cwd: '<%= config.src %>/assets/images/',
					src: ['**/*.png'],
					dest: '<%= config.build %>/assets/images/',
					ext: '.png'
				}]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.src %>/assets/images/',
					src: ['**/*.jpg'],
					dest: '<%= config.build %>/assets/images/',
					ext: '.jpg'
				}]
			}
		},

		sass: {
			build: {
				options: {
					paths: [
						'<%= config.src %>/assets/scss/**/*.scss'
					],
					compress: true,
					sourceMap: false
				},
				files: {
					'<%= config.build %>/assets/css/styles.css': '<%= config.src %>/assets/scss/styles.scss'
				}
			}
		},

        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['> 1%', 'last 2 versions', 'not ie <= 9']
                    })
                ]
            },
            dist: {
                src: ['<%= config.build %>/assets/css/*.css', '<%= config.build %>/assets/css/examples/**.css']
            }
        },

		// Minifies our javascript files
		uglify: {
			options: {
				banner: '/*! <%=pkg.name %> - v<%=pkg.version %> -' + '<%=grunt.template.today("yyyy-mm-dd") %> */' + "\n",
				mangle: true,
				compress: {
					drop_console: true
				}
			},
			deploy: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/js/',
					src: [
						'**/*.js',
						'!vendor/**/*.js',
						'!plugins/**/*.js'
					],
					dest: '<%= config.build %>/js'
				}]
			}
		},
		sprite:{
			all: {
				src: ['<%= config.src %>/assets/images/icons/**/*.png'],
				dest: '<%= config.src %>/assets/images/spritesheet.png',
				destCss: '<%= config.src %>/assets/scss/sprites.scss'
			}
		},
		// Config to handle all watching for development
		watch: {
            css : {
                files: ['<%= config.src %>/assets/css/**/*.css'],
                tasks: ['newer:copy:css']
            },
            sass : {
				files: ['<%= config.src %>/assets/scss/**/*.scss'],
				tasks: ['sass', 'postcss']
			},
			fonts: {
				files: ['<%= config.src %>/assets/fonts/**/*'],
				tasks: ['newer:copy:fonts']
			},
			js: {
				files: [
					'Gruntfile.js',
					'<%= config.src %>/js/**/*.js',
					'!<%= concat.build.dest %>**/*.js'
				],
				tasks: [
					'newer:concat:build',
					'newer:copy:js'
				],
				options: {
					reload: true		// set this to reload the gruntfile on change
				}
			},
			images: {
				files: ['<%= config.src %>/assets/images/**/*'],
				tasks: ['newer:copy:images']
			},
			data: {
				files: ['<%= config.src %>/data/**/*'],
				tasks: ['newer:copy:data']
			},
			imagejpg: {
				files: ['<%= config.src %>/assets/images/**/*.jpg'],
				tasks: ['newer:imagemin:jpg']
			},
			imagepng: {
				files: ['<%= config.src %>/assets/images/**/*.png'],
				tasks: ['newer:imagemin:png']
			},
			assemble: {
				files: ['<%= config.src %>/{content,data,templates}/**/*.{md,hbs,yml,json}'],
				tasks: ['assemble']
			},
			livereload: {
				options: {
					livereload: '<%= connect.server.options.livereload %>'
				},
				files: [
					'<%= config.build %>/**/*.html',
					'<%= config.build %>/assets/**/*.{css,png,jpg,jpeg,gif,webp,svg}',
					'<%= config.build %>/js/**/*.js'
				]
			}
		}
	});


	/**
	 * Code test tasks
	 * Build our assets after jshinting for testing
	 */
	grunt.registerTask('test', [
		'jshint',
		'assets'
	]);


	// Default task
	grunt.registerTask('default', [
		// cleanup
		'clean:pages',
		'clean:assets',

		// compile sass > css
		'sass:build',
        'postcss',
		'sprite',

		// build js
		'concat:build',
		'copy:js',

		// copy imagery over during builds
		'copy:images',
        'copy:fonts',
		'copy:css',
		'copy:data',

		'assemble'
	]);


	grunt.registerTask('build', [
		'default'
	]);


	/**
	 * Server specific workflow and watchers
	 */
		// Watch task aliased for our concurrent processing
	grunt.registerTask('watch:build', [
		'build',
		'concurrent:build'
	]);


	grunt.registerTask('server', [
		'watch:build'
	]);


	/**
	 * Deployments should be run to prep for QA deployment
	 */
	grunt.registerTask('deploy', [
        // cleanup
        'clean',

        // compile sass > css
        'sass:build',
        'sass:examples',
        'postcss',
		'sprite',

        // build js
        'concat:build',
        'copy:js',

        // copy imagery over during builds
        'copy:images',
        'copy:fonts',
        'copy:css',
        'copy:data',

        'assemble',

        'copy:deploy'
	]);
};