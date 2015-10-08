'use strict';


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
              '<%= pkg.setup.src %>/styles/main.css': '<%= pkg.setup.src %>/styles/main.scss'
            }
          }
       }


    });

    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['assemble','sass']);

};
