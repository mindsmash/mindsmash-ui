(function() {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name commons.ui.msmMobileMenuItem:msmMobileMenuItem
	 * @scope
	 * @restrict 'E'
	 * @element ANY
	 *
	 * @description Directive that renders a menu point for the mobile view with an icon, name, preview and link. You can
	 * apply your own ng-click directive to it or use the targetState param to handle click actions.
	 *
	 * @param {string} onClick (optional) the callback to be executed on click
	 * @param {string} targetState (optional) the string that identifies the state to go to
	 * @param {string} labelText the string that represents the message key for the target
	 * @param {string} previewValue the value to be previewed
	 * @param {string} icon the classes for the icon
	 */
	angular
		.module('msm.components.ui')
		.directive('msmMobileMenuItem', MobileMenuItem);

	function MobileMenuItem($state) {
		return {
			templateUrl: 'components/ui/msm-mobile-menu-item/msm-mobile-menu-item.html',
			scope: {
				onClick: '&',
				previewValue: '<',
				targetState: '@',
				labelText: '@',
				icon: '<'
			},
			controller: function($scope, $element) {
				$scope.open = angular.isDefined($element.attr('on-click')) ? $scope.onClick : function() {
					if($scope.targetState) {
						$state.go($scope.targetState);
					}
				};
			}
		};
	}
})();
