angular.module('msm.components.ui', ['ui.router', 'pascalprecht.translate', 'ui-notification']);

/** Based on https://github.com/GabiGrin/angular-editable-text */
(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmEditableText
   * @restrict 'E'
   *
   * @description Renders an editable text input
   *
   * @param {string} msmEditableText The model to be edited
   * @param {string} editMode The edit mode
   * @param {string} placeholder The placeholder for the model if empty
   * @param {function} onChange A callback function on model change
   */
  angular.module('msm.components.ui')
      .directive('msmEditableText', EditableText);

  function EditableText() {
    return {
      scope: {
        msmEditableText: '=',
        editMode: '=',
        placeholder: '@',
        onChange: '&'
      },
      transclude: true,
      templateUrl: 'components/ui/msm-click-to-edit/msm-click-to-edit.html',
      link: function (scope, elem, attrs) {
        var input = elem.find('input');
        var lastValue;
        scope.saveValue = true;
        scope.isEditing = !!scope.editMode;
        scope.editingValue = scope.msmEditableText;

        scope.onBlur = function() {
          scope.isEditing = false;
        };

        scope.onKeyPress = function(event) {
          if (event) {
            // enter
            if (event.which === 13) {
              scope.isEditing = false;
            }
            // escape
            if (event.which === 27) {
              scope.saveValue = false;
              scope.isEditing = false;
            }
          }
        };

        scope.onClick = function() {
          scope.isEditing = true;
        };

        scope.onFocus = function() {
          scope.isEditing = true;
        };

        elem.addClass('editable-text');

        scope.$watch('isEditing',
            function (val, oldVal) {
              if(!val && !scope.saveValue) {
                scope.saveValue = true;
                scope.editingValue = scope.msmEditableText;
                return;
              }
              if (attrs.editMode !== undefined) {
                scope.editMode = val;
              }
              if (val) {
                elem['addClass']('editing');
                var inputElm = input[0];
                inputElm.focus();
                // fix for FF
                var tmp = scope.editingValue ? scope.editingValue.length : 0;
                inputElm.selectionStart = tmp;
                inputElm.selectionEnd = tmp;
              } else {
                elem['removeClass']('editing');
                var editPromise;
                if (attrs.onChange && val !== oldVal && scope.editingValue !== lastValue) {
                  // accept promise, or a normal function
                  editPromise = scope.onChange({value: scope.editingValue});
                  if (editPromise && editPromise.then) {
                    scope.isWorking = true;
                    editPromise.then(
                        function (value) {
                          scope.msmEditableText = value;
                          scope.editingValue = value;
                          scope.isWorking = false;
                        }, function () {
                          scope.editingValue = scope.msmEditableText;
                          scope.isWorking = false;
                        }
                    );
                  } else if (editPromise) {
                    scope.msmEditableText = editPromise;
                    scope.editingValue = editPromise;
                  } else {
                    scope.msmEditableText = scope.editingValue;
                  }
                } else {
                  scope.msmEditableText = scope.editingValue;
                }
              }
            }
        );

        scope.$watch('editMode', function (val) {
          scope.isEditing = !!val;
        });

        scope.$watch('msmEditableText', function (newVal) {
          lastValue = newVal;
          scope.editingValue = newVal;
        });
      }
    }
  }

})();

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
      .directive('msmDeleteButton', MsmButtonFactory('zmdi zmdi-delete', 'btn-danger'))
      .directive('msmCreateButton', MsmButtonFactory('zmdi zmdi-plus-circle', 'btn-primary'))
  ;


  function MsmButtonFactory(iconClass, btnClass) {
    return function MsmButton($translate) {
      return {
        restrict: 'A',
        scope: {
          labelText: '@',
          isMobileMenuItem: '='
        },
        controller: function ($scope) {
          $translate($scope.labelText)
              .then(function (translatedValue) {
                $scope.text = translatedValue;
              }, function () {
                $scope.text = $scope.labelText;
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

angular.module("msm.components.ui").run(["$templateCache", function($templateCache) {$templateCache.put("components/ui/msm-click-to-edit/msm-click-to-edit.html","<span ng-class=\"{\'is-placeholder\': placeholder && !editingValue}\">\n  <input ng-show=\"isEditing\"\n         ng-blur=\"onBlur()\"\n         ng-keyup=\"onKeyPress($event)\"\n         ng-model=\"editingValue\"\n         placeholder=\"{{placeholder}}\"/>\n  <span ng-hide=\"isEditing || isWorking\"\n        class=\"original-text\"\n        tabindex=\"0\"\n        ng-click=\"onClick()\"\n        ng-focus=\"onFocus()\">\n    {{placeholder ? (editingValue ? editingValue : placeholder) : editingValue}}\n  </span>\n  <span ng-hide=\"isEditing\"\n        ng-transclude>\n  </span>\n  <i ng-hide=\"isEditing\" class=\"zmdi zmdi-edit\"></i>\n</span>\n");
$templateCache.put("components/ui/msm-button/msm-button.html","<button type=\"button\" ng-class=\"{\'is-msm-mobile-menu-item\': isMobileMenuItem}\" class=\"btn {{ btnClass }}\">\n  <i class=\"mr-0 {{ iconClass }}\"></i>\n  <span>{{ text }}</span>\n</button>\n");
$templateCache.put("components/ui/msm-mobile-menu-item/msm-mobile-menu-item.html","<div class=\"msm-mobile-menu-item\">\n  <i ng-class=\"icon\" class=\"left-icon\"></i>\n	<div class=\"menu-label\">{{ labelText }}</div>\n	<div class=\"preview-value\">{{ previewValue }}</div>\n	<i class=\"icon-arrow-right\" data-ng-click=\"goToState()\"></i>\n</div>\n");}]);
(function() {
    'use strict';

    /**
     * A service for raising notifications.
     *
     * This service wraps all methods provided by the angular-ui-notification service and translates the
     * message key if needed.
     *
     * Provided message functions:
     *   * primary  - displays a primary notification
     *   * error    - displays an error notification
     *   * success  - displays a success notification
     *   * info     - displays an info notification
     *   * warning  - displays a warning notification
     *   * clearAll - clears all notifications that are currently displayed
     *
     * Usage:
     * msmNotification.<function>('i18nKey'); // use i18n
     * msmNotification.<function>('i18nKey', true); // use i18n
     * msmNotification.<function>('i18nKey', false); // don't use i18n
     * msmNotification.<function>('i18nKey', { i18nArg: 'someArg' }); // use i18n with i18n options
     * msmNotification.<function>({ message: 'i18nKey', delay: 1000 }); // use 18n with notify options
     * msmNotification.<function>({ message: 'i18nKey', delay: 1000 }, { i18nArg: 'someArg' }); // use 18n with i18n & notify options
     */
    angular
        .module('msm.components.ui')
        .factory('msmNotification', NotificationService);

    function NotificationService($translate, Notification) {
        var doFlash = function(args, i18n, notify) {
            if (typeof args !== 'object') {
                args = {
                    message : args
                };
            }

            if (i18n === false) {
                notify(args);
            } else {
                $translate(args.message, i18n === true ? undefined : i18n).then(function(msg) {
                    notify(angular.extend(args, { message: msg }));
                }, function(msg) {
                    notify(angular.extend(args, { message: msg }));
                });
            }
        };
        return {
            primary : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.primary(args);
                });
            },
            error : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.error(args);
                });
            },
            success : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.success(args);
                });
            },
            info : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.info(args);
                });
            },
            warning : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.warning(args);
                });
            },
            clearAll : function() {
                Notification.clearAll();
            }
        };
    }

})();
