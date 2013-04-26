/*global module:false, require:false*/
var path = require('path'),
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
        return connect.static(path.resolve(point));
    };

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        jade: {
            compile: {
                files: {
                    'www/index.html': 'www/src/index.jade'
                }
            }
        },
        stylus: {
            compile: {
                options: {
                    compress: false
                },
                files: {
                    'www/css/app.css': ['www/src/style/app.styl']
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'www/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'www/css/',
                ext: '.min.css'
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['www/lib/vendor/*.js', '!www/lib/vendor/*.min.js', 'www/lib/<%= pkg.name %>.js'],
                dest: 'www/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'www/js/<%= pkg.name %>.min.js'
            }
        },
        mocha: {
            all: ['www/test/index.html'],
            options: {
                reporter: 'Nyan',
                run: true
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['www/lib/**/*.js', 'www/test/**/*.js', '!www/lib/vendor/*.js']
            }
        },
        livereload: {
            port: 35729
        },
        connect: {
            livereload: {
                options: {
                    port: 9001,
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)];
                    }
                }
            }
        },
        regarde: {
            test: {
                files: 'www/test/*.test.js',
                tasks: ['default', 'livereload']
            },
            jade: {
                files: 'www/src/*.jade',
                tasks: ['default', 'livereload']
            },
            stylus: {
                files: 'www/src/style/*.styl',
                tasks: ['default', 'livereload']
            },
            js: {
                files: 'www/lib/*.js',
                tasks: ['default', 'livereload']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-mocha');

    // Default task.
    grunt.registerTask('default', ['mocha', 'jade', 'stylus', 'cssmin', 'concat', 'uglify']);
    grunt.registerTask('watch', ['livereload-start', 'connect', 'regarde']);

};
