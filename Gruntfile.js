module.exports = function(grunt) {
  grunt.initConfig({
    config: {
      browserifyExampleDir: 'example-browserify'
    },
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        multistr: true,
        expr: true,
        boss: true,
        undef: true
      },
      beforeuglify: ['<%= pkg.name %>.js'],
      gruntfile: ['Gruntfile.js']
    },
    uglify: {
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      },
      options: {
        mangle: true,
        compress: true,
        banner: 
          '/*! <%= pkg.name %>\n' + 
          'version: <%= pkg.version %>\n' +
          'build date: <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
          'author: <%= pkg.author %>\n' + 
          '<%= pkg.repository.url %> */\n'
      }
    },
    browserify: {
      build: {
        src: ['<%= config.browserifyExampleDir %>/scripts/main.js'],
        dest: '<%= config.browserifyExampleDir %>/build/bundle.js',
        options: {
          // transform: ['browserify-shim'],
          shim: {
            'angular': { path: './bower_components/angular/angular.min.js', exports: 'angular'},
            'angular-route': { path: './bower_components/angular-route/angular-route.min.js', exports: null},
            'highlight.js': { path: './bower_components/highlightjs/highlight.pack.js', exports: 'hljs'}
          }
        }
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
      },
      src: {
        files: '<%= pkg.name %>.js',
        tasks: ['default'],
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: '',
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint:beforeuglify', 'uglify']);
};

