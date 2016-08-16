'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
const path = require('path');

module.exports = yeoman.Base.extend({
  initializing: function(){
    this.props = {};
  },

  prompting: function () {
    this.log("\n"+
"\n"+chalk.red('██████╗ ███████╗ █████╗  ██████╗████████╗    ███╗   ██╗ █████╗ ████████╗██╗██╗   ██╗███████╗    ██╗    ██╗███████╗██████╗ ')+
"\n"+chalk.red('██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝    ████╗  ██║██╔══██╗╚══██╔══╝██║██║   ██║██╔════╝    ██║    ██║██╔════╝██╔══██╗')+
"\n"+chalk.red('██████╔╝█████╗  ███████║██║        ██║       ██╔██╗ ██║███████║   ██║   ██║██║   ██║█████╗      ██║ █╗ ██║█████╗  ██████╔╝')+
"\n"+chalk.red('██╔══██╗██╔══╝  ██╔══██║██║        ██║       ██║╚██╗██║██╔══██║   ██║   ██║╚██╗ ██╔╝██╔══╝      ██║███╗██║██╔══╝  ██╔══██╗')+
"\n"+chalk.red('██║  ██║███████╗██║  ██║╚██████╗   ██║       ██║ ╚████║██║  ██║   ██║   ██║ ╚████╔╝ ███████╗    ╚███╔███╔╝███████╗██████╔╝')+
"\n"+chalk.red('╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝     ╚══╝╚══╝ ╚══════╝╚═════╝ ')+
"\n"
    );
    
    // Start Propmts
    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Application Name: ',
      default: path.basename(process.cwd())
    },{
      type: 'input',
      name: 'desc',
      message: 'Please describe your application',
      default: 'A base skeleton template'
    },{
      type: 'input',
      name: 'author',
      message: 'Author:',
      default: ""
    },{
      type: 'input',
      name: 'email',
      message: 'Email:',
      default: ""
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  configuring: function(){
  },

  writing: function () {
    console.log("React Native Init");
    this.spawnCommandSync('react-native', ['init', this.props.name]);
    this.spawnCommandSync('mv', [`${this.destinationPath()}/${this.props.name}/android`,`${this.destinationPath()}/`]);
    this.spawnCommandSync('mv', [`${this.destinationPath()}/${this.props.name}/ios`,`${this.destinationPath()}/`]);
    this.spawnCommandSync('mv', [`${this.destinationPath()}/${this.props.name}/node_modules`,`${this.destinationPath()}/`]);
    //this.spawnCommandSync('mv', [`${this.destinationPath()}/${this.props.name}/package.json`,`${this.destinationPath()}/`]);
    this.spawnCommandSync('mv', [`${this.destinationPath()}/${this.props.name}/index.android.js`,`${this.destinationPath()}/`]);
    this.spawnCommandSync('mv', [`${this.destinationPath()}/${this.props.name}/index.ios.js`,`${this.destinationPath()}/`]);
    //this.spawnCommandSync('rm', ['-Rf',`${this.destinationPath()}/${this.props.name}`]);

    let npmSettings = this.fs.readJSON(`${this.destinationPath()}/${this.props.name}/package.json`);
    npmSettings.name = this.props.name;
    npmSettings.description = this.props.desc;
    npmSettings.author = this.props.author;
    npmSettings.email = this.props.email;

    npmSettings.scripts = Object.assign({}, npmSettings.scripts, {
      "web": "webpack-dev-server --port 3000 --config web/webpack.config.dev.js --inline --hot --colors"
    });

    npmSettings.dependencies = Object.assign({},npmSettings.dependencies, {
      "react": "^15.2.1",
      "react-native": "^0.30.0",
      "react-native-web": "^0.0.39",
      "url-loader": "^0.5.7"      
    });
    npmSettings.devDependencies = Object.assign({}, npmSettings.devDependencies, {
      "babel-core": "^6.9.1",
      "babel-loader": "^6.2.4",
      "babel-plugin-transform-decorators-legacy": "^1.3.4",
      "babel-preset-es2015": "^6.9.0",
      "babel-preset-react": "^6.5.0",
      "babel-preset-stage-1": "^6.5.0",
      "babel-runtime": "^6.9.2",
      "webpack": "^1.13.1",
      "webpack-dev-server": "^1.14.1"    
    });

    // write back to package.json
    this.fs.writeJSON(this.destinationPath('package.json'), npmSettings);

    // copy template file to destination path
    this.fs.copy(this.sourceRoot(), this.destinationRoot());
    this.fs.copyTpl(`${this.sourceRoot()}/.babelrc`, `${this.destinationPath()}/.babelrc`,{
      "APP_NAME": this.props.name
    });    
    this.fs.copyTpl(`${this.sourceRoot()}/web/src/index.html`, `${this.destinationPath()}/web/src/index.html`,{
      "APP_NAME": this.props.name
    });
    this.fs.copyTpl(`${this.sourceRoot()}/index.ios.js`, `${this.destinationPath()}/index.ios.js`,{
      "APP_NAME": this.props.name
    });
    this.fs.copyTpl(`${this.sourceRoot()}/index.android.js`, `${this.destinationPath()}/index.android.js`,{
      "APP_NAME": this.props.name
    });        
  },

  install: function () {    
    this.installDependencies({
      callback: ()=>{
        //Clear files
        this.spawnCommandSync('rm', ['-Rf',`${this.destinationPath()}/${this.props.name}`]);

        this.log("\n"
        +"\n" + chalk.white('React Native trinity (iOS, Android, Web) basic usage:')      
        +"\n" + chalk.white('Run iOS/Android:')
        +"\n" + chalk.yellow('    react-native start')
        +"\n" + chalk.white('Run Web: ')
        +"\n" + chalk.yellow('    npm run web')
        );
      }
    });


  },

  end: function(){

  }
});
