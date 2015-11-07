var config = {
  instanceName: {
    highlightjs: 'hljs',
    angular: 'angular'
  },
  npmName: {
    highlightjs: 'highlight.js',
    angular: 'angular'
  },
  amdName: {
    highlightjs: 'hljs',
    angular: 'angular'
  },
  moduleName: 'hljs'
};

module.exports = function(grunt) {
  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),

    dir: {
      src: 'src',
      build: 'build'
    },
    meta: {
      banner: 
        '/*! <%= pkg.name %>\n' + 
        'version: <%= pkg.version %>\n' +
        'build date: <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
        'author: <%= pkg.author.name %>\n' + 
        '<%= pkg.repository.url %> */'
    },
    jshint: {
      beforeuglify: ['<%= dir.src %>/<%= pkg.name %>.js'],
      gruntfile: ['Gruntfile.js']
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>\n\n'+
                '(function (root, factory) {\n'+
                '  if (typeof exports === "object" || (typeof module === "object" && module.exports)) {\n'+
                '    module.exports = factory(require("<%= config.npmName.angular %>"), require("<%= config.npmName.highlightjs %>"));\n'+
                '  } else if (typeof define === "function" && define.amd) {\n'+
                '    define(["<%= config.amdName.angular %>", "<%= config.amdName.highlightjs %>"], factory);\n'+
                '  } else {\n'+
                '    root.returnExports = factory(root.<%= config.instanceName.angular %>, root.<%= config.instanceName.highlightjs %>);\n'+
                '  }\n'+
                '}(this, function (angular, hljs) {\n\n',
        footer: '\n\n'+
                '  return "<%= config.moduleName %>";\n'+
                '}));'
      },
      build: {
        src: '<%= ngAnnotate.build.dest %>',
        dest: '<%= ngAnnotate.build.dest %>'
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: {},
        banner: '<%= meta.banner %>\n'
      },
      build: {
        src: '<%= concat.build.dest %>',
        dest: '<%= dir.build %>/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      build: {
        expand: true,
        flatten: true,
        src: '<%= dir.build %>/*',
        dest: '.'
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
      },
      src: {
        files: '<%= dir.src %>/<%= pkg.name %>.js',
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
    },
    ngAnnotate: {
      build: {
        src: '<%= dir.src %>/<%= pkg.name %>.js',
        dest: '<%= dir.build %>/<%= pkg.name %>.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', [
    'jshint:beforeuglify',
    'ngAnnotate:build', 'concat:build', 'uglify:build', 'copy:build'
  ]);
};

