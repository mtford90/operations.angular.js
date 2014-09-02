module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var userConfig = require('./build.config.js');

    var taskConfig = {

        connect: {
            server: {
                options: {
                    base: "",
                    port: 9999
                }
            }
        },

        pkg: grunt.file.readJSON("package.json"),

        uglify: {
            options: {
                mangle: true
            },
            dist: {
                files: {
                    '<%= compile_dir %>/operations.min.js': ['<%= build_dir %>/operation.js']
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {src: '<%= build_dir %>/operation.js', dest: '<%= compile_dir %>/operations.js'}
                ]
            }
        },

        clean: {
            build: '<%= build_dir %>',
            compile: '<%= compile_dir %>'
        },

        delta: {
            options: {
                livereload: true
            },
            node: {
                files: [
                    '<%= app_files.js %>',
                    '<%= app_files.jsunit %>',
                    '<%= test_dir %>/index.tpl.html'
                ],
                tasks: ['index']
            }
        },

        karma: {
            continuous: {
                configFile: '<%= build_dir %>/karma-unit.js',
                singleRun: false,
                background: true,
                port: 9019
            },
            unit: {
                configFile: '<%= build_dir %>/karma-unit.js',
                port: 9019
            },
            single: {
                configFile: '<%= build_dir %>/karma-unit.js',
                singleRun: true
            }
        },

        index: {
            build: {
                dir: '<%= test_dir %>',
                src: [
                    '<%= source_dir %>/**/*.js',
                    '<%= test_dir %>/**/*.spec.js'
                ]
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.renameTask('watch', 'delta');

    grunt.registerTask('watch', [ 'index', 'connect', 'delta' ]);
    grunt.registerTask('compile', [
        'uglify',
        'copy:dist'
    ]);

    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');
        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            return '../' + file.replace(dirRE, '');
        });

        grunt.file.copy('test/index.tpl.html', this.data.dir + '/index.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        specs: jsFiles
                    }
                });
            }
        });
    });

};