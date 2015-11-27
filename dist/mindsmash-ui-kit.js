angular.module('msm.components.ui', ['ui.router', 'pascalprecht.translate']);

(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmButton
   * @restrict 'E'
   *
   * @description Renders a delete button which executes the callback you passed on click
   *
   * @param {function} cb the function that should be executed on click
   */
  angular
    .module('msm.components.ui')
    .directive('msmButton', MsmButtonFactory('', 'btn-default'))
    .directive('msmDeleteButton', MsmButtonFactory('zmdi zmdi-delete', 'btn-danger'));


  function MsmButtonFactory (iconClass, btnClass) {
    return function MsmButton($translate) {
      return {
        restrict: 'E',
        scope: {
          labelText: '@',
          isMobileMenuItem: '='
        },
        templateUrl: 'components/ui/msm-button/msm-button.html',
        controller: function ($scope) {
          $translate($scope.labelText).then(function (translatedValue) {
            $scope.text = translatedValue;
          });

          $scope.iconClass = iconClass || '';
          $scope.btnClass = btnClass || '';
        }
      };
    }
  }

})();

(function() {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name commons.ui.msmMobileMenuItem:msmMobileMenuItem
	 * @scope
	 * @restrict 'E'
	 * @element ANY
	 *
	 * @description Directive that renders a menu point for the mobile view with an icon, name, preview and link
	 *
	 * @param {string} targetState the string that identifies the state to go to
	 * @param {string} name the string that reperesents the message key for the target
	 * @param {string} preview the value to be previewed
	 * @param {string} icon the classes for the icon
	 */
	angular
		.module('msm.components.ui')
		.directive('msmMobileMenuItem', MobileMenuItem);

	function MobileMenuItem($state, $translate) {
		return {
			templateUrl: 'components/ui/msm-mobile-menu-item/msm-mobile-menu-item.html',
			scope: {
				previewValue: '=',
				targetState: '=',
				labelText: '=',
				icon: '='
			},
			controller: function($scope) {

				$scope.goToState = function() {
					$state.go($scope.targetState);
				};

        $translate($scope.labelText).then(function(translatedValue) {
          $scope.labelText = translatedValue;
        });
			}
		};
	}
})();

angular.module("msm.components.ui").run(["$templateCache", function($templateCache) {$templateCache.put("docs/index.html","<!doctype html>\n<html lang=\"en\" ng-app=\"app\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1\">\n  <title>mindsmash-UI | Pattern Library</title>\n  <link href=\"https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,400italic\" rel=\"stylesheet\">\n  <link rel=\"stylesheet\" href=\"../../bower_components/css-spaces/dist/spaces.css\">\n  <link rel=\"stylesheet\" href=\"../../bower_components/highlightjs/styles/color-brewer.css\">\n  <link rel=\"stylesheet\" href=\"../../bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.css\">\n  <link rel=\"stylesheet\" href=\"../../bower_components/simple-line-icons/css/simple-line-icons.css\">\n  <link rel=\"stylesheet\" href=\"css/mindsmash-ui.css\">\n  <link rel=\"stylesheet\" href=\"doc.styles.css\">\n</head>\n\n<body class=\"container-fluid\">\n<h1>mindsmash-UI</h1>\n\n<hr>\n\n<section class=\"mb-xl p-s bg-gray-light\" data-ng-init=\"exampleValue=\'look at this\'\">\n  <h1>Button directive</h1>\n  <msm-delete-button label-text=\"BUTTON_DELETE\" is-mobile-menu-item=\"true\" button-type=\"delete\"></msm-delete-button>\n  <msm-mobile-menu-item targetState=\"test\" label-text=\"\'Foo\'\" preview-value=\"exampleValue\" icon=\"\'icon-close\'\"></msm-mobile-menu-item>\n  <msm-mobile-menu-item targetState=\"test\" label-text=\"\'Hallo Welt\'\" preview-value=\"exampleValue\" icon=\"\'zmdi zmdi-globe\'\"></msm-mobile-menu-item>\n</section>\n\n<section class=\"mb-xl p-s bg-gray-light\">\n  <h1>Definition List</h1>\n\n  <div class=\"panel panel-default\">\n    <div class=\"panel-heading panel-heading-main panel-dl\">\n      <h1 class=\"panel-title\">General</h1>\n    </div>\n    <div class=\"panel-body\">\n      <dl class=\"dl-horizontal\">\n        <dt>first name</dt>\n        <dd>Robert</dd>\n        <dt>last name</dt>\n        <dd>Lang</dd>\n        <dt>last name</dt>\n        <dd>Lang</dd>\n      </dl>\n    </div>\n  </div>\n</section>\n\n\n<section class=\"mb-xl p-s\">\n  <h1>Headings</h1>\n\n  <div class=\"row\">\n    <div class=\"col-xs-6\">\n      <h1>h1 heading <code>h1, .h1</code></h1>\n      <h2>h2 heading <code>h2, .h2</code></h2>\n      <h3>h3 heading <code>h3, .h3</code></h3>\n      <h4>h4 heading <code>h4, .h4</code></h4>\n    </div>\n    <div class=\"col-xs-6\">\n      <h1 class=\"normal text-uppercase gray\">Example</h1>\n      <h1>This is a normal h1 heading <br>that spans over two lines</h1>\n      <h2>This is a normal h2 heading <br>that spans over two lines</h2>\n    </div>\n  </div>\n</section>\n\n<section class=\"mb-xl\">\n  <h1>Colors</h1>\n\n  <div class=\"row\">\n    <div class=\"col-xs-2 bg-white pv-xs\">.bg-white</div>\n    <div class=\"col-xs-2 bg-blue pv-xs white\">.bg-blue</div>\n    <div class=\"col-xs-2 bg-green pv-xs white\">.bg-green</div>\n    <div class=\"col-xs-2 bg-blue-light pv-xs white\">.bg-blue-light</div>\n    <div class=\"col-xs-2 bg-yellow pv-xs white\">.bg-yellow</div>\n    <div class=\"col-xs-2 bg-red pv-xs white\">.bg-red</div>\n  </div>\n  <div class=\"row mt-s\">\n    <div class=\"col-xs-2 bg-black white pv-xs\">.white</div>\n    <div class=\"col-xs-2 bg-white blue pv-xs\">.blue</div>\n    <div class=\"col-xs-2 bg-white green pv-xs\">.green</div>\n    <div class=\"col-xs-2 bg-white yellow pv-xs\">.yellow</div>\n    <div class=\"col-xs-2 bg-white red pv-xs\">.red</div>\n    <div class=\"col-xs-2 bg-white black pv-xs\">.black</div>\n  </div>\n  <div class=\"row mt-s\">\n    <div class=\"col-xs-2 bg-gray-lighter pv-xs\">.bg-gray-lighter</div>\n    <div class=\"col-xs-2 bg-gray-light pv-xs\">.bg-gray-light</div>\n    <div class=\"col-xs-2 bg-gray pv-xs\">.bg-gray</div>\n    <div class=\"col-xs-2 bg-gray-dark pv-xs\">.bg-gray-dark</div>\n    <div class=\"col-xs-2 bg-gray-darker white pv-xs\">.bg-gray-darker</div>\n    <div class=\"col-xs-2 bg-black white pv-xs\">.bg-black</div>\n  </div>\n</section>\n\n<section>\n  <h1>Buttons</h1>\n\n  <h2>Options</h2>\n\n  <div class=\"mb-l\">\n    <button class=\"btn btn-default mr-s\">Default</button>\n    <button class=\"btn btn-primary mr-s\">Primary</button>\n    <button class=\"btn btn-success mr-s\">Success</button>\n    <button class=\"btn btn-info mr-s\">Info</button>\n    <button class=\"btn btn-warning mr-s\">Warning</button>\n    <button class=\"btn btn-danger mr-s\">Danger</button>\n    <button class=\"btn btn-link mr-s\">Link</button>\n  </div>\n\n  <h2>Sizes</h2>\n\n  <div class=\"mb-l\">\n    <div class=\"mb-s\">\n      <button class=\"btn btn-primary btn-lg mr-s\">Large button</button>\n      <button class=\"btn btn-default btn-lg\">Large button</button>\n    </div>\n    <div class=\"mb-s\">\n      <button class=\"btn btn-primary mr-s\">Default button</button>\n      <button class=\"btn btn-default\">Default button</button>\n    </div>\n    <div class=\"mb-s\">\n      <button class=\"btn btn-primary btn-sm mr-s\">Small button</button>\n      <button class=\"btn btn-default btn-sm\">Small button</button>\n    </div>\n    <div class=\"mb-s\">\n      <button class=\"btn btn-primary btn-xs mr-s\">Extra small button</button>\n      <button class=\"btn btn-default btn-xs\">Extra small button</button>\n    </div>\n    <br>\n  </div>\n</section>\n\n<section>\n  <h1>Panels</h1>\n\n  <p>For panels use the default panel classes from Bootstrap. These are additional classes for mindsmash-ui:</p>\n\n  <pre><code class=\"css\">\n    .panel-heading-image {} /* Make header image full-screen eg. `img.panel-header-image` */\n    .panel-heading-main {} /* Use for main headings the border-bottom has horizontal spaces */\n\n    .panel-title-small {} /* A small title without margins */\n  </code></pre>\n\n  <div class=\"example panel panel-default\">\n\n    <div class=\"panel-body bg-gray-lighter\" data-create-code=\".js-insert-code\">\n      <section class=\"panel panel-default\">\n        <div class=\"panel-heading panel-heading-main clearfix\">\n          <h1 class=\"panel-title pull-left\">Account Settings</h1>\n          <button class=\"btn btn-danger pull-right\"><i class=\"zmdi zmdi-delete mr-xxs\"></i> Delete account</button>\n        </div>\n        <div class=\"panel-body row\">\n          <div class=\"col-xs-12 col-sm-6\">\n            <dl class=\"dl-horizontal\">\n              <dt>first name</dt>\n              <dd>Robert</dd>\n              <dt>last name</dt>\n              <dd>Lang</dd>\n              <dt>Member since</dt>\n              <dd>11th April 2001</dd>\n              <dt>email</dt>\n              <dd>jeremias.dombrowski@mindsmash.com</dd>\n            </dl>\n          </div>\n          <div class=\"col-xs-12 col-sm-6\">\n            <dl class=\"dl-horizontal\">\n              <dt>first name</dt>\n              <dd>Robert</dd>\n              <dt>last name</dt>\n              <dd>Lang</dd>\n              <dt>Member since</dt>\n              <dd>11th April 2001</dd>\n            </dl>\n          </div>\n        </div>\n      </section>\n    </div>\n    <div class=\"panel-footer js-insert-code\"></div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-xs-6\">\n      <div class=\"example panel panel-default\">\n        <div class=\"panel-body bg-gray-lighter\" data-create-code=\".js-insert-code\">\n            <section class=\"panel panel-default\">\n              <img class=\"panel-heading-image\" data-src=\"holder.js/100px200/?text=Image&theme=sky\" alt=\"\">\n              <div class=\"panel-body\">\n                Panel content\n              </div>\n            </section>\n        </div>\n        <div class=\"panel-footer js-insert-code\"></div>\n      </div>\n    </div>\n\n    <div class=\"col-xs-6\">\n      <div class=\"example panel panel-default\">\n        <div class=\"panel-body bg-gray-lighter\" data-create-code=\".js-insert-code\">\n            <section class=\"panel panel-default\">\n              <img class=\"panel-heading-image\" data-src=\"holder.js/100px200/?text=Image&theme=sky\" alt=\"\">\n              <div class=\"panel-body\">\n                <span class=\"panel-title-small blue-light\">Company News</span>\n                <h3 class=\"panel-title-small\">Welcome to our new office</h3>\n                <span class=\"text-muted\">Blog article &bull; 3 hours ago by Jan Marquardt</span>\n              </div>\n              <div class=\"panel-footer\">Panel footer</div>\n            </section>\n\n        </div>\n        <div class=\"panel-footer js-insert-code\">\n        </div>\n      </div>\n    </div>\n\n  </div>\n</section>\n\n<script src=\"../../bower_components/angular/angular.js\"></script>\n<script src=\"../../bower_components/angular-bootstrap/ui-bootstrap.js\"></script>\n<script src=\"../../bower_components/anchor-js/anchor.js\"></script>\n<script src=\"../../bower_components/holderjs/holder.js\"></script>\n<script src=\"../../bower_components/highlightjs/highlight.pack.js\"></script>\n<script src=\"../../bower_components/angular-translate/angular-translate.js\"></script>\n<script src=\"../../bower_components/angular-ui-router/release/angular-ui-router.js\"></script>\n<script src=\"../../bower_components/highlightjs/highlight.pack.js\"></script>\n\n\n<script src=\"../components/ui/components.ui.module.js\"></script>\n<script src=\"../components/ui/msm-button/msm-button.directive.js\"></script>\n<script src=\"../components/ui/msm-mobile-menu-item/msm-mobile-menu-item.directive.js\"></script>\n<script src=\"scripts/app.js\"></script>\n<script>\n\n  createCodeExamples();\n  initHighlighting();\n  addAnchors();\n\n function createCodeExamples () {\n   var codeBlocks     = document.querySelectorAll(\'[data-create-code]\');\n\n   for (var i = 0; i < codeBlocks.length; i++) {\n     var code = codeBlocks[i],\n         targetSelector = code.dataset.createCode,\n         target = document.querySelectorAll(targetSelector)[i],\n         example = document.createElement(\'code\'),\n         codeText = code.innerHTML,\n         leadingWhitespace = codeText.match(/^\\s{3,}/)[0];\n\n     codeText = codeText.replace(RegExp(leadingWhitespace, \'g\'), \'\\n\');\n     example.textContent = codeText;\n     example.classList.add(\'html\', \'code\');\n     target.appendChild(example);\n     hljs.highlightBlock(example);\n   }\n }\n\n function initHighlighting () {\n  hljs.initHighlightingOnLoad();\n }\n\n function addAnchors () {\n  anchors.options.placement = \'left\';\n  anchors.add(\'h1, h2\');\n }\n\n</script>\n</body>\n</html>\n");
$templateCache.put("ui/msm-button/msm-button.html","<button type=\"button\" ng-class=\"{\'is-msm-mobile-menu-item\': isMobileMenuItem}\" class=\"btn {{ btnClass }}\">\n  <i class=\"mr-0 {{ iconClass }}\"></i>\n  <span>{{ text }}</span>\n</button>\n");
$templateCache.put("ui/msm-mobile-menu-item/msm-mobile-menu-item.html","<div class=\"msm-mobile-menu-item\">\n  <i ng-class=\"icon\" class=\"left-icon\"></i>\n	<div class=\"menu-label\">{{ labelText }}</div>\n	<div class=\"preview-value\">{{ previewValue }}</div>\n	<i class=\"icon-arrow-right\" data-ng-click=\"goToState()\"></i>\n</div>\n");}]);