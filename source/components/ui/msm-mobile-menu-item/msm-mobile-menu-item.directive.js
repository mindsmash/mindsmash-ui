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

	function MobileMenuItem($state) {
		return {
			templateUrl: 'msm-mobile-menu-item.html',
			scope: {
				previewValue: '=',
				targetState: '=',
				name: '=',
				icon: '='
			},
			link: function(scope) {

				scope.goToState = function() {
					$state.go(scope.targetState);
				};
			}
		};
	}
})();
