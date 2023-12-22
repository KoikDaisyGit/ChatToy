module.exports = function (grunt)
{
    grunt.initConfig({
        watch: {
            options: {
                atBegin: true
            },
            debug: {
                files: ['src/**/*', 'styles/**/*', './*'],
                tasks: ['run:build', 'concat:tsc', 'concat:css', 'cssmin:style', 'run:clean']
            },
            prod: {
                files: ['src/**/*', 'styles/**/*', './*'],
                tasks: ['run:build', 'concat:tsc', 'concat:css', 'uglify:app', 'cssmin:style', 'run:clean']
            }
        },
        run: {
            build: {
                exec: 'tsc'
            },
            clean: {
                exec: 'tsc --build --clean'
            }
        },
        concat: {
            options: {
                separator: '\n',
            },
            tsc: {
                src: ['ts-built/**/*.js'],
                dest: 'dist/src/app.js',
            },
            css: {
                src: ['styles/**/*.css'],
                dest: 'dist/style.css'
            }
        },
        uglify: {
            options: {
                output: {
                    comments: /(?:^!|@(?:license|preserve|cc_on))/
                },
                mangle: true
            },
            app: {
                files: {
                    'dist/src/app.js': ['dist/src/app.js']
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            style: {
                files: {
                    'dist/style.css': ['dist/style.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
};