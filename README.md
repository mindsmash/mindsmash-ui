# mindsmash-ui
A Bootstrap 3 Theme by mindsmash.

 > **Heads up!** This theme uses a non-default font called "Source Sans Pro"
 > Please add the following line of code to your `<head>`:
 ```html
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic" rel="stylesheet">
 ```


## Install with bower to use the theme (CSS or SCSS version)
```shell
$ bower install mindsmash-ui
```

## Install with npm to change and deploy the theme
You need:
- node.js with npm
- gulp
Clone the project, then run the following inside the main directory

```shell
$ npm install # to load all dependencies
$ gulp dev # to start a watch task and a server to show a demo file
$ gulp build # to create a release version
$ npm login # login as mindsmash
$ npm version <patch|minor|major> # to create a new version
$ git push --tags # to push the tagged version, this creates a new bower version
$ npm publish # to publish the new version on npmjs.com
```

## Use in a Sass (SCSS) project
Include the theme variables before adding any bootstrap files

```SCSS
@import "path/to/mindsmash-ui/dist/scss/variables";
@import "/path/to/bootstrap-sass/assets/stylesheets/bootstrap";
@import "path/to/mindsmash-ui/dist/scss/mindsmash-ui";
```

## Use with pure CSS
Include the mindsmash-ui.css to your website, it includes
the complete bootstrap css files:

```html
<head>

<!-- then add the mindsmash-ui theme -->
<link rel="stylesheet" href="path/to/mindsmash-ui/css/mindsmash-ui.css">

<!-- then add your custom styles -->
<link rel="stylesheet" href="path/to/custom.css">
</head>
```
