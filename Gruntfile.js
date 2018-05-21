module.exports = function(grunt) {
    const mozjpeg = require('imagemin-mozjpeg');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            compile_min_css: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'assets/css/style.min.css': 'assets/src/sass/style.scss'
                }
            }
        }, //sass

        uglify: {
            options: {
                mangle: false
            },
            min_js: {
                files: {
                    'assets/js/app.min.js': ['assets/src/js/app.js']
                }
            }
        }, //uglify

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'index.html': 'html/index.html'
                }
            },
        }, // htmlmin

        concat: {
            sass: {
                src: 'assets/src/sass/modules/*.scss',
                dest: 'assets/src/sass/style.scss',
            },
            js: {
                src: 'assets/src/js/modules/*.js',
                dest: 'assets/src/js/app.js',
            }
        }, // concat

        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'assets/src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'assets/img/'
                }]
            }
        }, // imagemin

        watch: {
            css: {
                files: ['assets/src/sass/**/*'],
                tasks: ['concat:sass','sass'],
                options: { livereload: true }
            }, // watch - sass
            js: {
                files: ['assets/src/js/**/*'],
                tasks: ['concat:js','uglify'],
                options: { livereload: true }
            }, // watch - js
            html: {
                files: ['html/**/*.html'],
                tasks: ['htmlmin'],
                options: { livereload: true }
            }, // watch - js
            img: {
                files: ['assets/src/img/**/*'],
                tasks: ['imagemin'],
                options: { livereload: true }
            } // watch - img
        }, // watch

        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '*',
                    livereload: true,
                    open: {
                        target: 'http://localhost:8000'
                    }
                }
            }
        }, // connect

        shell: {
            options: {
                stderr: false
            },
            mkdir: {
                command: function(dir) {
                    return 'mkdir ' + dir;
                }
            }
        }, // shell
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['concat','sass','uglify','htmlmin','imagemin','serve']);
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('html', ['htmlmin']);
    grunt.registerTask('img', ['imagemin']);
    grunt.registerTask('serve', ['connect','watch']);

    grunt.registerTask('mk', function(dir) {
        grunt.task.run('shell:mkdir:' + dir);
    });
};
