# Practice-Project
Practice project for HTH

## Installation and build
_Note: Before you begin work make sure you have installed the Node.JS runtime._

Once you have cloned the repsoitory, open a shell in the root of the project directory and use the following command to install the local and global dependencies:

```
npm run install
```

After the script has finished executing your local environment should be ready to begin development and testing. To build the project you can run the following command:

```
grunt build
```

This will generate some JavaScript files and more importantly the distribution folder. Serve the contents of the dist folder to run the project.

Before making any changes to the source you may want to try the following command:

```
grunt
```

This will run the default task where it will watch the source folder for changes and then run the build command.

You may wish to remove all of the generated files from the project. To do so run the following command:

```
grunt clean
```