# mindsmash-ui
A Bootstrap 3 Theme by mindsmash.

 > **Heads up!** This theme uses a non-default font called "Source Sans Pro".
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

### Development mode
`$ npm install` Install all dependencies
`$ gulp dev` Start development mode: a demo page is started. Edit html or scss and see updates in realtime

### Publish a new version
`$ gulp build` Create new release files in `dist/`.
`$ npm login`  Login as npm project owner (if you work for mindsmash, look in the project wiki for credentials).
`$ npm version <patch|minor|major>` Automatically update package.json and create a git tag.
`$ npm publish` Publish the new version on npm
`$ git push --follow-tags` Push the tagged version, this creates a new **bower** version.

### Contribute
If you want to contribute to this project, simply fork it on Github, do your changes and create a pull request that
describes your changes. If it's all nice and clean, it might get merged.


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
  <!-- add the mindsmash-ui theme -->
  <link rel="stylesheet" href="path/to/mindsmash-ui/css/mindsmash-ui.css">

  <!-- then add your custom styles -->
  <link rel="stylesheet" href="path/to/custom.css">
</head>
```
