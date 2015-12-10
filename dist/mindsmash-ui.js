angular.module('msm.components.ui', ['ui.router', 'pascalprecht.translate', 'ui-notification']);

angular.module('msm.components.util', []);

/** Based on https://github.com/GabiGrin/angular-editable-text */
(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmClickToEdit
   * @restrict 'E'
   *
   * @description Renders an editable text input
   *
   * @param {string} msmClickToEdit The model to be edited
   * @param {string} editMode The edit mode
   * @param {string} placeholder The placeholder for the model if empty
   * @param {function} onChange A callback function on model change
   */
  angular.module('msm.components.ui')
      .directive('msmClickToEdit', ClickToEdit);

  function ClickToEdit() {
    return {
      scope: {
        msmClickToEdit: '=',
        editMode: '=',
        placeholder: '@',
        onChange: '&'
      },
      transclude: true,
      templateUrl: 'components/ui/msm-click-to-edit/msm-click-to-edit.html',
      link: function (scope, elem, attrs) {
        var input = elem.find('input');
        var lastValue;
        var KEYCODES = {
          ENTER: 13,
          ESCAPE: 27
        };
        scope.saveValue = true;
        scope.isEditing = !!scope.editMode;
        scope.editingValue = scope.msmClickToEdit;

        elem.addClass('msm-click-to-edit');

        /**
         *  Event handlers
         */

        scope.onBlur = function() {
          scope.isEditing = false;
        };

        scope.onKeyPress = function(event) {
          if (event) {
            if (event.which === KEYCODES.ENTER) {
              scope.isEditing = false;
            } else if (event.which === KEYCODES.ESCAPE) {
              scope.saveValue = false;
              scope.isEditing = false;
            }
          }
        };

        scope.enableEditingMode = function() {
          scope.isEditing = true;
        };

        /**
         *  Helper functions
         */

        function handleEditingPromise(promise) {
          scope.isBusy = true;
          promise.then(
              function (value) {
                scope.msmClickToEdit = value;
                scope.editingValue = value;
                scope.isBusy = false;
              }, function () {
                scope.editingValue = scope.msmClickToEdit;
                scope.isBusy = false;
              }
          );
        }

        /**
         * Method for handling the start of editing
         */
        function handleStartEditing() {
          var inputElement = input[0];
          var length = scope.editingValue ? scope.editingValue.length : 0;

          elem['addClass']('editing');
          inputElement.focus();
          // fix for FF
          inputElement.selectionStart = length;
          inputElement.selectionEnd = length;
        }

        /**
         * Method for handling the end of editing
         *
         * @param {boolean} wasEditing True if the previous mode was Editing, false else
         */
        function handleDoneEditing(wasEditing) {
          var editingPromise;

          elem['removeClass']('editing');

          // Check whether to save the value of not
          if (!scope.saveValue) {
            scope.saveValue = true;
            scope.editingValue = scope.msmClickToEdit;
            return;
          }

          if (attrs.onChange &&
              wasEditing &&
              scope.editingValue !== lastValue) {
            // accept promise, or a normal function
            editingPromise = scope.onChange({value: scope.editingValue});
            if (editingPromise && editingPromise.then) {
              handleEditingPromise(editingPromise);
            } else if (editingPromise) {
              scope.msmClickToEdit = editingPromise;
              scope.editingValue = editingPromise;
            } else {
              scope.msmClickToEdit = scope.editingValue;
            }
          } else {
            scope.msmClickToEdit = scope.editingValue;
          }
        }

        /**
         *  Watch tasks
         */

        scope.$watch('isEditing',
            function (value, oldValue) {
              if (attrs.editMode !== undefined) {
                scope.editMode = value;
              }
              if (value) {
                handleStartEditing();
              } else {
                handleDoneEditing(oldValue);
              }
            }
        );

        scope.$watch('editMode', function (val) {
          scope.isEditing = !!val;
        });

        scope.$watch('msmClickToEdit', function (newVal) {
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
        restrict: 'E',
        scope: {
          labelText: '@',
          isMobileMenuItem: '='
        },
        templateUrl: 'components/ui/msm-button/msm-button.html',
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

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmEditableText
   * @restrict 'A'
   *
   * @description Adds functionality to conditionally display text only to input elements.
   *
   * @param {expression} msmEditableText Shows the edit view if the expression is truthy.
   * @param {expression} msmEditableDisplay The display value in non-edit view.
   *                     The value of ngModel will be used in absence of this value.
   */
  angular.module('msm.components.ui')
      .directive('msmEditableText', EditableText);

  function EditableText($compile) {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        edit: '=msmEditableText',
        value: '=msmEditableDisplay'
      },
      compile: function compile(tElem, tAttrs) {
        var tText = $compile('<p ng-show="!edit" class="form-control-static">{{ value }}</p>');
        return {
          post: function postLink(scope, iElem, iAttrs, ctrl) {
            iElem.after(tText(scope));

            // setup watch on ngModel in absence of msm-editable-display
            if (angular.isUndefined(iAttrs.msmEditableDisplay) && ctrl) {
              scope.$watch(function () {
                return ctrl.$modelValue;
              }, function(newVal, oldVal) {
                scope.value = newVal;
              });
            }

            // setup watch to show / hide input element
            scope.$watch('edit', function(newVal, oldVal) {
              iElem.attr('style', newVal ? '' : 'display: none');
            });
          }
        }
      }
    }
  }

})();

angular.module("msm.components.ui").run(["$templateCache", function($templateCache) {$templateCache.put("components/ui/msm-click-to-edit/msm-click-to-edit.html","<span class=\"msm-click-to-edit-container\"\n      ng-class=\"{\'is-placeholder\': placeholder && !editingValue}\"\n      ng-click=\"enableEditingMode()\">\n  <input ng-show=\"isEditing\"\n         ng-blur=\"onBlur()\"\n         ng-keyup=\"onKeyPress($event)\"\n         ng-model=\"editingValue\"\n         placeholder=\"{{placeholder}}\"/>\n  <span ng-hide=\"isEditing || isBusy\"\n        class=\"original-text\"\n        tabindex=\"0\"\n        ng-focus=\"enableEditingMode()\">\n    {{placeholder ? (editingValue ? editingValue : placeholder) : editingValue}}\n  </span>\n  <span ng-hide=\"isEditing\"\n        ng-transclude>\n  </span>\n  <i ng-hide=\"isEditing\" class=\"zmdi zmdi-edit\"></i>\n</span>\n");
$templateCache.put("components/ui/msm-button/msm-button.html","<button type=\"button\" ng-class=\"{\'is-msm-mobile-menu-item\': isMobileMenuItem}\" class=\"btn {{ btnClass }}\">\n  <i class=\"mr-0 {{ iconClass }}\"></i>\n  <span>{{ text }}</span>\n</button>\n");
$templateCache.put("components/ui/msm-modal/modal-ok-cancel.html","<div class=\"modal-header modal-desktop\">\n    <div class=\"modal-header-inner clearfix\">\n        <h3 class=\"pull-left\">{{ title || \'\' }}</h3>\n        <span class=\"pull-right modal-close\" ng-click=\"cancel()\"><i class=\"zmdi zmdi-close img-close\"></i></span>\n    </div>\n</div>\n<div class=\"modal-body modal-desktop\">\n    <div class=\"modal-body-inner clearfix\">\n        {{ text || \'\'}}\n    </div>\n</div>\n<div class=\"modal-footer modal-desktop\">\n    <span class=\"pull-right modal-ok\" ng-click=\"ok()\"><i class=\"zmdi zmdi-check-circle inner\"></i></span>\n</div>\n\n<div class=\"modal-mobile\">\n    <div class=\"modal-mobile-header\" ng-click=\"ok()\">\n        <i class=\"zmdi zmdi-arrow-left pull-left img-back\" ng-click=\"cancel()\"></i>\n        <span class=\"modal-mobile-header-title pull-left\">{{ title || \'\' }}</span>\n        <i class=\"zmdi zmdi-check pull-right img-ok\" ng-click=\"ok()\"></i>\n    </div>\n    <div class=\"modal-mobile-body-ok-cancel\">\n        <div class=\"modal-mobile-body-inner clearfix\">\n            {{ text || \'\'}}\n        </div>\n    </div>\n</div>\n");
$templateCache.put("components/ui/msm-modal/modal-select-from-listing.html","<div class=\"modal-header modal-desktop\">\n    <div class=\"modal-header-inner clearfix\">\n        <h3 class=\"pull-left\">{{ title || \'\' }}</h3>\n        <span class=\"pull-right modal-close\" ng-click=\"cancel()\"><i class=\"zmdi zmdi-close img-close\"></i></span>\n    </div>\n</div>\n<div class=\"modal-body modal-desktop\">\n    <div class=\"modal-body-inner clearfix\">\n        <form action=\"\" class=\"form-inline items-form\">\n            <div class=\"form-group items-form-group\">\n                <label for=\"items\">{{ text || \'Select:\'}}</label>\n                <select id=\"items\" class=\"form-control items-form-select\" ng-model=\"items.selected\"\n                        ng-options=\"item for item in items.values\"></select>\n            </div>\n        </form>\n    </div>\n</div>\n<div class=\"modal-footer modal-desktop\">\n    <span class=\"pull-right modal-ok\" ng-click=\"ok()\"><i class=\"zmdi zmdi-check-circle inner\"></i></span>\n</div>\n\n<div class=\"modal-mobile\">\n    <div class=\"modal-mobile-header\">\n        <i class=\"zmdi zmdi-arrow-left pull-left img-back\" ng-click=\"cancel()\"></i>\n        <span class=\"modal-mobile-header-title pull-left\">{{ title || \'\' }}</span>\n        <i class=\"zmdi zmdi-check pull-right img-ok\" ng-click=\"ok()\"></i>\n    </div>\n    <div class=\"modal-mobile-body-select-from-listing\">\n        <div class=\"modal-mobile-body-inner clearfix\">\n            <div ng-repeat=\"item in items.values\" class=\"modal-mobile-item img-item-selection\"\n                 ng-click=\"items.selected = item\">\n                <i class=\"zmdi zmdi-circle\" ng-class=\n                        \"{\'img-item-selected\': item === items.selected,\n                        \'img-item-not-selected\': item !== items.selected}\"></i>\n                <span class=\"modal-mobile-item-text\">{{ item }}</span>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("components/ui/msm-mobile-menu-item/msm-mobile-menu-item.html","<div class=\"msm-mobile-menu-item\">\n  <i ng-class=\"icon\" class=\"left-icon\"></i>\n	<div class=\"menu-label\">{{ labelText }}</div>\n	<div class=\"preview-value\">{{ previewValue }}</div>\n	<i class=\"icon-arrow-right\" data-ng-click=\"goToState()\"></i>\n</div>\n");}]);
(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmModal
   * @restrict 'A'
   *
   * @description Renders a styled modal
   */
  angular
      .module('msm.components.ui')
      .service('msmModalOkCancel', MsmModalOkCancel)
      .service('msmModalSelectFromListing', MsmModalSelectFromListing);

  function MsmModalOkCancel($modal) {
    return {
      open: function(controller, parameters, size) {
        return $modal.open({
          animation: true,
          templateUrl: 'components/ui/msm-modal/modal-ok-cancel.html',
          controller: controller,
          size: size || '',
          resolve: parameters,
          windowClass: 'app-modal-window'
        })
      }
    }
  }

  function MsmModalSelectFromListing($modal) {
    return {
      open: function(controller, parameters, size) {
        return $modal.open({
          animation: true,
          templateUrl: 'components/ui/msm-modal/modal-select-from-listing.html',
          controller: controller,
          size: size || '',
          resolve: parameters,
          windowClass: 'app-modal-window'
        })
      }
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

angular.module('msm.components.util')
.directive('scrollLink', ScrollLink);

/**
 * @ngdoc directive
 * @name components.util:ScrollLink
 * @scope
 * @restrict 'E'
 *
 * @description
 *    Directive that renders a link to jump to via #hash in url.
 */
function ScrollLink() {
  return {
    template: '<a href="#{{ name }}" id="{{ name }}" class="scroll-link"></a>',
    scope      : {
      name: '@'
    }
  };
}

;
