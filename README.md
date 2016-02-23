# OO-JS-Tree-Menu
A tree menu developed with pure JavaScript using object oriented approach. The source for the menu is loaded from a JSON file.

In order to be able to view the project locally:

1. Install NodeJS - nodejs.org
2. cmd->"npm install -g static-server"
3. Then go to the project folder and do 'static-server' in the command promt
4. It will start a local server on http://localhost:9080 via which you can load the json file and see the project
5. Gulp task runner introduced, in order to use it:
	- Install Gulp globaly via cmd 'npm install --global gulp'
	- Install Gulp as a devDependencies in the project's folder - 'npm install --save-dev gulp'
	- Install jshint package - 'npm install --save-dev gulp-jshint jshint-stylish' 
	- Install the following packages - 'npm install --save-dev gulp-util gulp-concat gulp-sourcemaps uglify'
	- Run 'gulp' in the command promt to start the default task which is the watcher for js/sass changes
	- Run 'gulp build-js' (use '--type production' if you want to minify) or 'gulp build-css' to build respectively the javascript or the styles.