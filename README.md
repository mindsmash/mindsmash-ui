# mindsmash-ui

## Install with bower to use the theme
```shell
$ bower install mindsmash-ui
```

## Install with npm to change and deploy the theme
```shell
# Clone the project, then run
$ npm install
```

## Use in a Sass (SCSS) project
Include the theme variables before adding any bootstrap files

```SCSS
@import "path/to/mindsmash-ui/dist/scss/variables.scss";
@import "/path/to/bootstrap-sass/assets/stylesheets/bootstrap";
@import "path/to/mindsmash-ui/dist/scss/mindsmash-ui.scss";
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
