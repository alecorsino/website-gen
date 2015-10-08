'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //Assemble task
        assemble: {
            pages: {
              options: {
                flatten: true,
                assets: '<%= pkg.setup.dist %>/assets',
                layout: '<%= pkg.setup.src %>/templates/layouts/default.hbs',
                partials: '<%= pkg.setup.src %>/templates/partials/*.hbs'
              },
              files: {
                '<%= pkg.setup.dist %>/html/': ['<%= pkg.setup.src %>/templates/pages/*.hbs']
              }
            }
        },

        wiredep: {
          task: {
            src: ['<%= pkg.setup.src %>/templates/layouts/default.hbs']
          }
        },

        sass: {
          dist: {
            options: {
              style: 'expanded',
              loadPath: ['bower_components/foundation/scss',
                          'bower_components/foundation/scss/foundation'
                        ]
            },
            files: {
              '<%= pkg.setup.dist %>/styles/main.css': '<%= pkg.setup.src %>/styles/main.scss'
            }
          }
       },

       watch: {
         bower: {
           files: ['bower.json'],
           tasks: ['wiredep']
         },
         sass: {
           files: ['<%= pkg.setup.src %>/styles/**/*.{scss,sass}',
                   'bower_components/foundation/scss/{,*/}*.{scss,sass}'
                  ],
           tasks: ['sass']
         },
         assemble: {
           files: ['<%= pkg.setup.src %>/templates/**/*.hbs'],
           tasks: ['assemble']
         }
       },
       browserSync: {
            dev: {
                bsFiles: {
                    src : ['<%= pkg.setup.dist %>/styles/*.css',
                        '<%= pkg.setup.dist %>/html/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: '<%= pkg.setup.dist%>'
                }
            }
        },

       clean: {
          dist:{
            src:['<%= pkg.setup.dist %>/*']
          }
        },

    });

    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask('build', ['clean','assemble','sass']);
    grunt.registerTask('default', ['browserSync', 'watch']);

};
