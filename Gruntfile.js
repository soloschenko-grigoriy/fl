'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        // watch list
        watch: {

            compass: {
                files: ['<%= yeoman.app %>/assets/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },

            livereload: {
                files: [
                    '<%= yeoman.app %>/*.hbs',
                    '{.tmp,<%= yeoman.app %>}/assets/css/{,**/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,**/}*.js',
                    '{.tmp,<%= yeoman.app %>}/templates/{,**/}*.html',
                    '<%= yeoman.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp}',

                    'test/spec/{,**/}*.js'
                ],
                // tasks: ['exec'],
                options: {
                    livereload: true
                }
            },
            express: {
                files:  [ 'server/**/*.js' ],
                tasks:  [ 'express:dev' ],
                options: {
                  spawn: false
                }
              },
            /* not used at the moment
            handlebars: {
                files: [
                    '<%= yeoman.app %>/templates/*.hbs'
                ],
                tasks: ['handlebars']
            }*/
        },

        // testing server
        connect: {
            testserver: {
                options: {
                    port: 1234,
                    base: '.'
                }
            }
        },

        // mocha command
        exec: {
            mocha: {
                command: 'mocha-phantomjs http://localhost:<%= connect.testserver.options.port %>/test',
                stdout: true
            }
        },


        express: {
            options: {
                // Override defaults here
                port: '9000'
            },
            dev: {
                options: {
                    script: 'start.js'
                }
            },
            prod: {
                options: {
                    script: 'start.js'
                }
            },
            test: {
                options: {
                    script: 'start.js'
                }
            }
        },


        // open app and test page
        open: {
            server: {
                path: 'http://localhost:<%= express.options.port %>',
                app: 'google chrome'
            }
        },

        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },

        // linting
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts{,*/}*.js',
                '!<%= yeoman.app %>/scripts/plugins/*',
                'test/spec/{,*/}*.js'
            ]
        },


        // compass
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/assets/css',
                cssDir: '.tmp/assets/css',
                imagesDir: '<%= yeoman.app %>/assets/img',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/assets/fonts',
                importPath: 'app/scripts/vendor',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },


        // require
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    // baseUrl: 'app/scripts',
                    optimize: 'uglify2',
                    // paths: {
                    //     'templates': '../../.tmp/scripts/templates'
                    // },
                    mainConfigFile : '<%= yeoman.app %>/scripts/init.js',
                    modules: [{
                        name: 'init',
                        exclude: ['infrastructure']
                    },{
                        name: 'infrastructure'
                    }],
                    findNestedDependencies: true,
                    dir: '<%= yeoman.dist %>/scripts',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    removeCombined: true,
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                    pragmasOnSave: {
                        //removes Handlebars.Parser code (used to compile template strings) set
                        //it to `false` if you need to parse template strings even after build
                        excludeHbsParser : true,
                        // kills the entire plugin set once it's built.
                        excludeHbs: true,
                        // removes i18n precompiler, handlebars and json2
                        excludeAfterBuild: true
                    }
                }
            }
        },

        useminPrepare: {
            html: '<%= yeoman.app %>/index.hbs',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },

        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/assets/css/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/assets/img',
                    src: '{,*/}*.{png,jpg,jpeg,ico}',
                    dest: '<%= yeoman.dist %>/assets/img'
                }]
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/assets/css/style.css': [
                        '<%= yeoman.app %>/scripts/vendor/bootstrap/dist/css/bootstrap.min.css',
                        '<%= yeoman.app %>/scripts/vendor/bootstrap-select/dist/css/bootstrap-select.min.css',
                        '<%= yeoman.app %>/scripts/vendor/summernote/dist/summernote.css',
                        '<%= yeoman.app %>/scripts/vendor/nanoscroller/bin/css/nanoscroller.css',
                        '<%= yeoman.app %>/scripts/vendor/chosen/chosen.min.css',
                        '<%= yeoman.app %>/scripts/vendor/components-font-awesome/css/font-awesome.min.css',

                        '.tmp/assets/css/{,*/}*.css',
                        '<%= yeoman.app %>/assets/css/{,*/}*.css'
                    ]
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.hbs',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        remove: {
          main:{
            fileList: [],
            dirList: [
              '<%= yeoman.dist %>/scripts/collections',
              '<%= yeoman.dist %>/scripts/controllers',
              '<%= yeoman.dist %>/scripts/models',
              '<%= yeoman.dist %>/scripts/plugins',
              '<%= yeoman.dist %>/scripts/vendor',
              '<%= yeoman.dist %>/scripts/tmpl',
              '<%= yeoman.dist %>/scripts/views',
              '<%= yeoman.dist %>/scripts/translations',
            ]
          },
          before:{
            fileList: [],
            dirList: [
              '<%= yeoman.dist %>'
            ]
          },
          options: {
            trace: true
          },
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'assets/img/{,*/}*.{webp,gif,ico}',
                        'scripts/vendor/requirejs/require.js',
                        'assets/fonts/{,*/}*.{eot,svg,woff,woff2,ttf}'
                    ]
                }]
            }
        },

        bower: {
            all: {
                rjsConfig: '<%= yeoman.app %>/scripts/init.js'
            }
        },

        // handlebars
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    amd: true
                },
                files: {
                    '.tmp/scripts/templates.js': ['<%= yeoman.app %>/templates/**/*.html']
                }
            }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    // starts express server with live testing via testserver
    grunt.registerTask('default', function (target) {

        // what is this??
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.option('force', true);

        grunt.task.run([
            'clean:server',
            'compass:server',
            'connect:testserver',
            'express:dev',
            'exec',
            'open',
            'watch'
        ]);
    });

    // todo fix these
    grunt.registerTask('test', [
        'clean:server',
        'createDefaultTemplate',
        'handlebars',
        // 'compass',
        'connect:testserver',
        'exec:mocha'
    ]);

    grunt.registerTask('build', [
        'remove:before',
        'createDefaultTemplate',
        'handlebars',
        // 'compass:dist',
        'useminPrepare',
        'requirejs',
        'imagemin',
        'htmlmin',
        // 'concat',
        'cssmin',
        // 'uglify',
        'remove:main',
        'copy',
        'usemin'
    ]);

};
