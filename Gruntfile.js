module.exports = function(grunt) {
  var Fs = require('fs');
  var extend = require('util')._extend;

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);


  grunt.util.linefeed = '\n';

  //init configuration
  grunt.config.init({
    pkg: grunt.file.readJSON('package.json')
  });

  //clean
  grunt.config('clean', {
    dist: 'dist'
  });

  //js hint
  grunt.config('jshint', {
    options: { },
    all: [
      'Gruntfile.js',
      'src/**/*.js'
    ]
  });

  var banner = '/*!\n<%= pkg.name %> - <%= pkg.version %>\n' +
              '<%= pkg.description %>\n'+
              'Build date: <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n';

  //concat
  grunt.config('concat', {
  	dist: {
      options: {
        banner: banner
      },
      src: ['src/module.js', 'src/**/*.js'],
      dest: 'dist/angular-validateme.js'
    }
  });

  //uglify
  grunt.config('uglify', {
    options: {
      banner: banner
    },
    dist: {
      src: ['<%= concat.dist.dest %>'],
      dest: 'dist/angular-validateme.min.js'
    }
  });

  //compress
  grunt.config('compress', {
    dist: {
      options: {
        archive: 'zip/angular-validateme-<%= pkg.version %>.zip'
      },
      expand: true,
      cwd: 'dist/',
      src: ['**/*'],
      dest: '/'
    }
  });

  //jade
  var marked_ = require('marked');
  var marked = function(text) {
    var tok = marked_.lexer(text);
    text = marked_.parser(tok);
    // workaround to replace marked `<pre><code>` with '<pre class="prettyprint">'
    text = text.replace(/<pre><code>(.*)<\/code><\/pre>/ig, '<pre class="prettyprint">$1</pre>');
    return text;
  };

  var minFile;
  if (Fs.existsSync('dist/angular-validateme.min.js')) {
    minFile = Fs.statSync('dist/angular-validateme.min.js');
  }
  
  var jadeData = {
    fs: require('fs'),
    md: marked,
    version: '<%= pkg.version %>',
    size: minFile ? Math.floor(minFile.size / 1024) : 0,
    structure: require('./docs/js/structure.js'),
    jsdoc: '<%= jsdocdata %>'
  };

  grunt.config('jade', {
    docs: {
      options: {
        pretty: true,
        data: extend(extend({}, jadeData), {env: 'prod'})
      },
      files: [{src: 'docs/jade/main.jade', dest: 'index.html'}]
    },
    docsdev: {
      options: {
        pretty: true,
        data: extend(extend({}, jadeData), {env: 'dev'})
      },
      files: [{src: 'docs/jade/main.jade', dest: 'dev.html'}]
    }
  });

  //connect
  grunt.config('connect', {
    server: {
      options: {
        port: 8000,
        base: '.'
      }
    }
  });

  //watch
  grunt.config('watch', {
    jade: {
      files: ['docs/**/*', 'jsdoc.json'],
      tasks: ['loadjsdoc', 'jade:docsdev'],
      options: {
        spawn: false
      }
    },
    jsdoc: {
      files: ['src/**/*.js'],
      tasks: ['shell:jsdoc'],
      options: {
        spawn: false
      }
    }
  });

  // jsdoc
  // grunt jsdoc cant output to plain json
  grunt.config('shell', {
    jsdoc: {
      options: { 
        stdout: true,
        stderr: true,
        failOnError: true
      },
      command: '"node_modules/grunt-jsdoc/node_modules/jsdoc/jsdoc" -c jsdoc.conf.json > jsdoc.json'
    }
  });

  // loadjsdoc
  grunt.config.set('jsdocdata', {namespaces: []});
  grunt.registerTask('loadjsdoc', function() {
    if (grunt.file.exists('./jsdoc.json')) {
      grunt.config.set('jsdocdata', require('./jsdoc.json'));
    }
  });

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'concat',
    'uglify',
    'compress',
    'docs'
  ]);

  grunt.registerTask('docs', [
    'shell:jsdoc',
    'loadjsdoc',
    'jade'
  ]);

  grunt.registerTask('server', [
    'connect:server:keepalive'
  ]);

};