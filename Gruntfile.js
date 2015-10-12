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
                data: '<%=pkg.setup.src%>/data/*.{json,yml}',
                assets: '<%= pkg.setup.dist%>/assets',
                layout: '<%= pkg.setup.src%>/templates/layouts/default.hbs',
                partials: '<%= pkg.setup.src%>/templates/partials/*.hbs'
              },
              files: {
                '<%= pkg.setup.dist %>/': ['<%= pkg.setup.src %>/templates/pages/*.hbs']
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
              '<%= pkg.setup.dist %>/scripts/styles/main.css': '<%= pkg.setup.src %>/scripts/styles/main.scss'
            }
          }
       },

       // Renames files for browser caching purposes
       filerev: {
         dist: {
           src: [
             '<%= pkg.setup.dist %>/scripts/{,*/}*.{css,js}'
           ]
         }
       },

       useminPrepare: {
         options: {
           dest: '<%= pkg.setup.dist %>'
         },
         html: '<%= pkg.setup.dist %>/index.html'
       },

       //Compact the final file
      usemin:{html:['<%= pkg.setup.dist %>/index.html']},


       watch: {
         sass: {
           files: ['<%= pkg.setup.src %>/scripts/styles/**/*.{scss,sass}',
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
          options: {
            browser: "google chrome",
             watchTask: true,
            //  startPath: "/html/index.html",
             server:{
                baseDir: '<%=pkg.setup.dist%>',
                routes: {'/bower_components': './bower_components'}
             }
          },
          reload: {
                bsFiles: {
                    src : ['<%= pkg.setup.dist %>/styles/*.css',
                        '<%= pkg.setup.dist %>/*.html'
                    ]
                }
            }
        },
        copy: {
          jsDir: {
            expand:true,
            cwd: '<%= pkg.setup.src %>/',
            src: 'scripts/js/**',
            dest: '<%= pkg.setup.dist%>/'
          }
        },

       clean: {
          dist:{
            src:['<%= pkg.setup.dist %>/*']
          }
        },

    });
    // Automatically load required grunt tasks
    require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin'
    });
    // grunt.loadNpmTasks('assemble');
    // grunt.loadNpmTasks('grunt-wiredep');
    // grunt.loadNpmTasks('grunt-contrib-sass');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-browser-sync');
    // grunt.loadNpmTasks('grunt-contrib-clean');

    // Compact all scripts task
    grunt.registerTask('compact', [
      'useminPrepare',
      'concat:generated',
      'cssmin:generated',
      'uglify:generated',
      'filerev',
      'usemin'
    ]);

    //Build the site without compating scripts. Suitable for development 
    grunt.registerTask('local-build', ['clean','assemble','sass','copy:jsDir']);
    grunt.registerTask('dist-build', ['local-build','compact']);

    grunt.registerTask('default', ['local-build','browserSync', 'watch']);

};
