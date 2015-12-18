angular.module('msm.components.ui', ['ui.router', 'pascalprecht.translate', 'ui-notification', 'ui.bootstrap.datepicker']);

angular.module('msm.components.util', []);

angular.module('msm.components.ui')

.config(function($provide) {
  var replaceTemplate = function(mode) {
    $provide.decorator(mode + 'pickerDirective', function($delegate) {
      $delegate[0].templateUrl = '../components/ui/msm-datepicker/msm-datepicker-' + mode + '.html';
      return $delegate;
    });
  };

  replaceTemplate('day');
  replaceTemplate('month');
  replaceTemplate('year');
})

.config(function(datepickerConfig) {
  datepickerConfig.showWeeks = false;
  datepickerConfig.startingDay = 1;
})

.config(function(datepickerPopupConfig) {
  datepickerPopupConfig.showButtonBar = false;
  datepickerPopupConfig.datepickerPopupTemplateUrl = '../components/ui/msm-datepicker/msm-datepicker-popup.html';
});

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
      .directive('msmDeleteButton', MsmButtonFactory('zmdi zmdi-hc-fw zmdi-delete', 'btn-danger'))
      .directive('msmCreateButton', MsmButtonFactory('zmdi zmdi-hc-fw zmdi-plus-circle', 'btn-primary'))
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

(function () {
  'use strict';

  angular
      .module('msm.components.ui')
      .service('msmModal', msmModal);

  /**
   * @ngdoc service
   * @name components.ui.msmModal
   *
   * @description
   *     Renders styled modals.
   */
  function msmModal($window, $document, $modal) {
    return {
      open: open,
      note: note,
      confirm: confirm,
      select: select,
      form: form
    };

    /**
     * @ngdoc method
     * @name components.ui.msmModal#open
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal dialog.
     * @param {object} config
     *     A configuration object. The following configuration keys are valid:
     *       * size:
     *           The modal's size.
     *       * resolve:
     *           The modal's scope parameters. All parameters will automatically
     *           converted to resolvable functions and bound to the default controller
     *           using the object's key name.
     *       * controller:
     *           The modal's controller. A default controller will be provided
     *           with all parameter bindings.
     *       * templateUrl:
     *           The modal's template URL.
     */
    function open(config) {
      if (angular.isUndefined(config)) { config = {}; }
      if (angular.isUndefined(config.resolve)) { config.resolve = {}; }

      // auto-generate controller if missing
      if (angular.isUndefined(config.controller)) {
        var keys = Object.keys(config.resolve);
        var args = keys.join(',');
        var assign =
          'var vm = this;' +
          keys.map(function (arg) {
            return 'this[\'' + arg + '\'] = ' + arg + ';';
          }).join('');
        eval('config.controller = function (' + args + ') {' + assign + '};');
      }

      // convert parameters to functions
      angular.forEach(config.resolve, function (value, key) {
        config.resolve[key] = angular.isFunction(value) ? value : function () {
          return value;
        };
      });

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: config.templateUrl || 'components/ui/msm-modal/msm-modal.html',
        controller: config.controller,
        controllerAs: 'vm',
        size: config.size || '',
        resolve: config.resolve,
        bindToController: true,
      });

//      modalInstance.opened['finally'](function() {
//        modalInstance.pageXOffset = $window.pageXOffset;
//        modalInstance.pageYOffset = $window.pageYOffset;
//        angular.element($document[0].body).css('position', 'fixed');
//      });
//      
//      modalInstance.result['finally'](function() {
//        angular.element($document[0].body).css('position', 'inherit');
//        $window.scrollTo(modalInstance.pageXOffset, modalInstance.pageYOffset);
//      })

      return modalInstance;
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#note
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal notification dialog.
     * @param {object} options
     *     An options object. The following option keys are valid:
     *       * size:
     *           The modal's size.
     *       * title:
     *           The modal's title.
     *       * text:
     *           The modal's text.
     *       * close:
     *           The close button configuration.
     */
    function note(options) {
      return open({
        size: options.size,
        controller: function ($modalInstance) {
          var vm = angular.extend(this, {
            title: options.title || '',
            text: options.text || '',
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'Ok',
              style: 'btn-btn-primary',
              onClick: $modalInstance.close
            }, options.close)]
          });
        }
      });
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#confirm
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal confirmation dialog.
     * @param {object} options
     *     An options object. The following option keys are valid:
     *       * size:
     *           The modal's size.
     *       * title:
     *           The modal's title.
     *       * text:
     *           The modal's text.
     *       * close:
     *           The close button configuration.
     *       * dismiss:
     *           The dismiss button configuration.
     */
    function confirm(options) {
      // title, text, size, closeTitle, dismissTitle
      return open({
        size: options.size,
        controller: function ($modalInstance) {
          var vm = angular.extend(this, {
            title: options.title || '',
            text: options.text || '',
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'Ok',
              style: 'btn-primary',
              onClick: $modalInstance.close
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'Cancel',
              style: 'btn-default',
              onClick: $modalInstance.dismiss
            }, options.dismiss)]
          })
        }
      });
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#select
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal selection dialog.
     * @param {object} options
     *     An options object. The following option keys are valid:
     *       * size:
     *           The modal's size.
     *       * title:
     *           The modal's title.
     *       * text:
     *           The modal's text.
     *       * options:
     *           The modal's selection options.
     *       * close:
     *           The close button configuration.
     *       * dismiss:
     *           The dismiss button configuration.
     */
    function select(options) {
      // title, text, options, size, closeTitle, dismissTitle
      return open({
        size: options.size,
        templateUrl: 'components/ui/msm-modal/msm-modal-select.html',
        resolve: {
          values: options.options.values,
          selected: options.options.selected
        },
        controller: function ($modalInstance, values, selected) {
          var vm = angular.extend(this, {
            title: options.title || '',
            text: options.text || '',
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'Select',
              style: 'btn-primary',
              onClick: select,
              hideMobile: true
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'Cancel',
              style: 'btn-default',
              onClick: $modalInstance.dismiss
            }, options.dismiss)]
          });

          var valueList = [];
          var selectedVaL = null;
          for (var key in values) {
            var val = values[key].value;
            valueList.push(val);
            if (selected === values[key].key) {
              selectedVaL = val;
            }
          }

          vm.options = {
            values: valueList,
            selected: selectedVaL
          };

          vm.select = select;
          function select (option) {
            var found = false;
            var selectedItem = option || vm.options.selected;
            for (var key in values) {
              if (selectedItem === values[key].value) {
                $modalInstance.close(values[key].key);
                found = true;
                break;
              }
            }
            if (!found) {
              $modalInstance.close(selectedItem);
            }
          }
        }
      });
    }

    function form(options) {
      return open({
        size: options.size,
        templateUrl: 'components/ui/msm-modal/msm-modal-form.html',
        resolve: {
          model: options.formOptions.model,
          formOptions: options.formOptions.options,
          inputFields: options.formOptions.inputFields
        },
        controller: function ($modalInstance, model, formOptions, inputFields) {
          var vm = angular.extend(this, {
            title: options.title || '',
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'Save',
              style: 'btn-primary',
              onClick: onModalSubmit,
              constraint: 'vm.form.$invalid'
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'Cancel',
              style: 'btn-default',
              onClick: $modalInstance.dismiss
            }, options.dismiss)]
          });

          vm.model = model;
          vm.options = formOptions;
          vm.fields = inputFields;

          function onModalSubmit() {
            var check = options.formOptions.onSubmit(vm.model);
            // check whether the given callback is a promise
            if(check.then) {
              check.then(function(result) {
                if(result) {
                  $modalInstance.close(vm.model);
                } else {
                  // TODO: Error handling
                }
              }).catch(function() {
                // TODO: Error handling
              })
            } else if(check) {
              $modalInstance.close(vm.model);
            } else {
              // TODO: Error handling
            }
          }
        }
      });
    }
  }

})();

angular.module("msm.components.ui").run(["$templateCache", function($templateCache) {$templateCache.put("components/ui/msm-button/msm-button.html","<button type=\"button\" ng-class=\"{\'is-msm-mobile-menu-item\': isMobileMenuItem}\" class=\"btn {{ btnClass }}\">\n  <i class=\"{{ iconClass }}\"></i>\n  <span>{{ text }}</span>\n</button>\n");
$templateCache.put("components/ui/msm-mobile-menu-item/msm-mobile-menu-item.html","<div class=\"msm-mobile-menu-item\">\n  <i ng-class=\"icon\" class=\"left-icon\"></i>\n	<div class=\"menu-label\">{{ labelText }}</div>\n	<div class=\"preview-value\">{{ previewValue }}</div>\n	<i class=\"icon-arrow-right\" data-ng-click=\"goToState()\"></i>\n</div>\n");
$templateCache.put("components/ui/msm-click-to-edit/msm-click-to-edit.html","<span class=\"msm-click-to-edit-container\"\n      ng-class=\"{\'is-placeholder\': placeholder && !editingValue}\"\n      ng-click=\"enableEditingMode()\">\n  <input ng-show=\"isEditing\"\n         ng-blur=\"onBlur()\"\n         ng-keyup=\"onKeyPress($event)\"\n         ng-model=\"editingValue\"\n         placeholder=\"{{placeholder}}\"/>\n  <span ng-hide=\"isEditing || isBusy\"\n        class=\"original-text\"\n        tabindex=\"0\"\n        ng-focus=\"enableEditingMode()\">\n    {{placeholder ? (editingValue ? editingValue : placeholder) : editingValue}}\n  </span>\n  <span ng-hide=\"isEditing\"\n        ng-transclude>\n  </span>\n  <i ng-hide=\"isEditing\" class=\"zmdi zmdi-edit\"></i>\n</span>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-day.html","<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <thead>\n    <tr>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-left\"></i></button></th>\n      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong><span class=\"caret\"></span></button></th>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-right\"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"row in rows track by $index\">\n      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt), current: dt.current}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{\'text-muted\': dt.secondary, \'text-info\': dt.current}\">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-month.html","<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <thead>\n    <tr>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-left\"></i></button></th>\n      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong><span class=\"caret\"></span></button></th>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-right\"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"row in rows track by $index\">\n      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt), current: dt.current}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{\'text-info\': dt.current}\">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-popup.html","<ul class=\"dropdown-menu msm-datepicker\" ng-if=\"isOpen\" style=\"display: block\" ng-style=\"{top: position.top+\'px\', left: position.left+\'px\'}\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <li ng-transclude></li>\n  <li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n    <span class=\"btn-group pull-left\">\n      <button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"select(\'today\')\" ng-disabled=\"isDisabled(\'today\')\">{{ getText(\'current\') }}</button>\n      <button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText(\'clear\') }}</button>\n    </span>\n    <button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText(\'close\') }}</button>\n  </li>\n</ul>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-year.html","<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <thead>\n    <tr>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-left\"></i></button></th>\n      <th colspan=\"3\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-right\"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"row in rows track by $index\">\n      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt), current: dt.current}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{\'text-info\': dt.current}\">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("components/ui/msm-modal/msm-modal-form.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">{{ vm.title | translate }}</h3>\n  <span class=\"modal-close\" ng-click=\"vm.onDismiss ? vm.onDismiss() : $dismiss(\'cancel\')\"><i class=\"zmdi zmdi-close img-close\"></i></span>\n</div>\n<div class=\"modal-body\">\n  <div>\n    <form name=\"form\" id=\"modal-form\" role=\"form\">\n      <formly-form model=\"vm.model\" fields=\"vm.fields\" options=\"vm.options\" form=\"vm.form\"></formly-form>\n    </form>\n  </div>\n</div>\n<div class=\"modal-footer\">\n  <button ng-repeat=\"button in vm.buttons\" class=\"btn {{ button.style }}\" data-ng-disabled=\"{{ button.constraint }}\"\n          ng-class=\"{ \'btn-zmdi\': !button.title, \'modal-mobile-hide\': button.hideMobile }\" ng-click=\"button.onClick()\">\n    <i ng-if=\"button.icon\" class=\"zmdi zmdi-hc-fw zmdi-{{ button.icon }}\"></i>{{ button.title | translate }}\n  </button>\n</div>\n");
$templateCache.put("components/ui/msm-modal/msm-modal-select.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">{{ vm.title | translate }}</h3>\n  <span class=\"modal-close\" ng-click=\"vm.onDismiss ? vm.onDismiss() : $dismiss(\'cancel\')\"><i class=\"zmdi zmdi-close img-close\"></i></span>\n</div>\n<div class=\"modal-body modal-mobile-show\">\n  <ul class=\"modal-mobile-options\">\n    <li ng-repeat=\"option in vm.options.values\" class=\"modal-mobile-option\" ng-click=\"vm.select(option)\">\n      <i class=\"zmdi zmdi-check-circle item-selected\" ng-if=\"vm.options.selected === option\"></i>\n      <i class=\"zmdi zmdi-circle-o item-not-selected\" ng-if=\"vm.options.selected !== option\"></i>\n      {{ option }}\n    </li>\n  </ul>\n</div>\n<div class=\"modal-body modal-mobile-hide\">\n  <form class=\"form-horizontal\">\n    <div class=\"form-group\">\n      <label for=\"selectItems\" class=\"col-sm-3 control-label\">{{ vm.text | translate }}</label>\n      <div class=\"col-sm-9\">\n      <select id=\"selectItems\" class=\"form-control\" id=\"selectItems\"\n              ng-model=\"vm.options.selected\"\n              ng-options=\"option for option in vm.options.values\"></select>\n      </div>\n    </div>\n  </form>\n</div>\n<div class=\"modal-footer\">\n  <button ng-repeat=\"button in vm.buttons\" class=\"btn {{ button.style }}\"\n          ng-class=\"{ \'btn-zmdi\': !button.title, \'modal-mobile-hide\': button.hideMobile }\" ng-click=\"button.onClick()\">\n    <i ng-if=\"button.icon\" class=\"zmdi zmdi-hc-fw zmdi-{{ button.icon }}\"></i>{{ button.title | translate }}</button>\n</div>\n");
$templateCache.put("components/ui/msm-modal/msm-modal.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">{{ vm.title | translate }}</h3>\n  <span class=\"modal-close\" ng-click=\"vm.onDismiss ? vm.onDismiss() : $dismiss(\'cancel\')\"><i class=\"zmdi zmdi-close img-close\"></i></span>\n</div>\n<div class=\"modal-body\">\n  <span>{{ vm.text | translate }}</span>\n</div>\n<div class=\"modal-footer\">\n  <button ng-repeat=\"button in vm.buttons\" class=\"btn {{ button.style }}\"\n          ng-class=\"{ \'btn-zmdi\': !button.title, \'modal-mobile-hide\': button.hideMobile }\" ng-click=\"button.onClick()\">\n    <i ng-if=\"button.icon\" class=\"zmdi zmdi-hc-fw zmdi-{{ button.icon }}\"></i>{{ button.title | translate }}\n  </button>\n</div>\n");}]);