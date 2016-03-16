/**
 * Created by evaris on 25/11/2015.
 */


var app_src='app/';
var css_src=app_src+'css/';
var js_src=app_src+'ensp-angular/';
var ensp_angular = js_src+'ensp.built.js';
module.exports = function(grunt){

    //require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-angular-gettext');
   // var mozjpeg = require('imagemin-mozjpeg');
    grunt.initConfig({
        nggettext_extract:{
            pot:{
                files:{
                    'app/po/template.pot':['**/*.html']
                }
            }
        },
        nggettext_compile:{
          all:{
              files:{
                  'app/js/translation.js':['app/po/*.po']
              }
          }
        }
    });

    grunt.registerTask('default',['concat','uglify','cssmin','imagemin','replace']);

};