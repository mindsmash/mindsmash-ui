angular.module('msm.components.ui', [
  'ui.router',
  'pascalprecht.translate',
  'ui-notification',
  'ui.bootstrap',
  'ui.select',
  'ngSanitize',
  'ui.bootstrap.datetimepicker'
]);

angular.module('msm.components.util', []);

angular.module('msm.components.ui')

.config(function($provide) {
  var replaceTemplate = function(mode) {
    $provide.decorator('uib' + mode + 'pickerDirective', function($delegate) {
      $delegate[0].templateUrl = 'components/ui/msm-datepicker/msm-datepicker-' + mode.toLowerCase() + '.html';
      return $delegate;
    });
  };

  replaceTemplate('Day');
  replaceTemplate('Month');
  replaceTemplate('Year');
})

.config(function(uibDatepickerConfig) {
  uibDatepickerConfig.showWeeks = false;
  uibDatepickerConfig.startingDay = 1;
})

.config(function(uibDatepickerPopupConfig) {
  uibDatepickerPopupConfig.showButtonBar = false;
  uibDatepickerPopupConfig.datepickerPopupTemplateUrl = 'components/ui/msm-datepicker/msm-datepicker-popup.html';
})

.constant('uiDatetimePickerConfig', {
  dateFormat: 'yyyy-MM-dd HH:mm:ss',
  defaultTime: '00:00:00',
  html5Types: {
    date: 'yyyy-MM-dd',
    'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
    'month': 'yyyy-MM'
  },
  initialPicker: 'date',
  reOpenDefault: false,
  enableDate: true,
  enableTime: true,
  buttonBar: {
    show: false
  },
  closeOnDateSelection: true,
  appendToBody: true,
  altInputFormats: [],
  ngModelOptions: {}
});

/*
 * Based on: https://github.com/sebastianha/angular-bootstrap-checkbox
 *   commit: 7e531169ab680f5ac9209040ecbb89fd55ac619e
 */

(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmCheckbox
   * @restrict 'E'
   * @scope
   *
   * @description Renders a Bootstrap checkbox.
   */
  angular
    .module('msm.components.ui')
    .directive('msmCheckbox', msmCheckbox);

  function msmCheckbox() {
    return {
      scope: {},
      require: "ngModel",
      restrict: "E",
      replace: "true",
      template: "<button type=\"button\" class=\"msm-checkbox btn btn-default\" ng-class=\"{'checked': checked===true}\">" +
        "<i class=\"zmdi zmdi-hc-fw\" ng-class=\"{'zmdi-check': checked===true}\"></i>" +
        "</button>",
      link: function(scope, elem, attrs, ctrl) {
        var trueValue = true;
        var falseValue = false;

        // If defined set true value
        if(attrs.ngTrueValue !== undefined) {
          trueValue = attrs.ngTrueValue;
        }
        // If defined set false value
        if(attrs.ngFalseValue !== undefined) {
          falseValue = attrs.ngFalseValue;
        }

        // Check if name attribute is set and if so add it to the DOM element
        if(scope.name !== undefined) {
          elem.name = scope.name;
        }

        // Update element when model changes
        scope.$watch(function() {
          if(ctrl.$modelValue === trueValue || ctrl.$modelValue === true) {
            ctrl.$setViewValue(trueValue);
          } else {
            ctrl.$setViewValue(falseValue);
          }
          return ctrl.$modelValue;
        }, function(newVal, oldVal) {
          scope.checked = ctrl.$modelValue === trueValue;
        }, true);

        // On click swap value and trigger onChange function
        elem.bind("click", function() {
          scope.$apply(function() {
            if(ctrl.$modelValue === falseValue) {
              ctrl.$setViewValue(trueValue);
            } else {
              ctrl.$setViewValue(falseValue);
            }
          });
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

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmFormSubmit
   * @scope
   * @restrict 'A'
   *
   * @description Directive for setting a 'loading' true/false flag on a form controller. You need to make sure that
   * your submit function returns a promise for this to work. Use this as a replacement for angular's 'ngSubmit' directive.
   *
   * @example <form msm-form-submit="submitMyFormMethod">...</form>
   */
  angular
      .module('msm.components.ui')
      .directive('msmFormSubmit', MsmFormSubmit);

  function MsmFormSubmit() {
    return {
      restrict: 'A',
      require: '^form',
      transclude: true,
      template: '<fieldset ng-disabled="_form.loading"><ng-transclude></ng-transclude></fieldset>',
      scope: {
        msmFormSubmit: '&'
      },
      link: function (scope, element, attrs, formCtrl) {
        scope._form = formCtrl;

        element.on('submit', function () {
          formCtrl.loading = true;
          scope.$apply();

          scope.msmFormSubmit().finally(function () {
            formCtrl.loading = false;
          });
        });
      }
    };
  }
})();

(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmDelayForm', MsmDelayForm);

  function MsmDelayForm($parse) {
    return {
      restrict: 'A',
      require: 'form',
      link: function (scope, elem, attrs, ctrl) {
        var snapshot = null;

        // watch model reference - no deep watch!
        // to manually trigger copy, use angular.extend({}, model)
        scope.$watch(attrs.msmDelayForm, function(newVal, oldVal) {
          if (newVal && newVal.restangularized === true) {
            // restangular can't handle angular.copy! :-(
            snapshot = newVal.clone();
          } else {
            snapshot = angular.copy(newVal);
          }
        });

        scope.$on('msm.components.ui:msmDelayForm-refreshModel', function(e, newModel) {
          if (newModel && newModel.restangularized === true) {
            // restangular can't handle angular.copy! :-(
            snapshot = newModel.clone();
          } else {
            snapshot = angular.copy(newModel);
          }
        });

        elem.on('reset', function(event) {
          event.preventDefault();
          scope.$eval(attrs.ngReset);
          scope.$apply(function() {
            $parse(attrs.msmDelayForm).assign(scope, snapshot);
          });
        });
      }
    }
  }
})();

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmFormSubmitButton
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description Directive for a form submit button. When used in combination with the msmFormSubmit directive,
   * the button will automatically toggle a loading state when the form is submitted and when processing is done.
   *
   * @example <msm-form-submit-button label="LABEL" form-ctrl="formControllerName"></msm-form-submit-button>
   */
  angular
      .module('msm.components.ui')
      .directive('msmFormSubmitButton', MsmFormSubmitButton);

  function MsmFormSubmitButton() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/ui/msm-form-submit-button/msm-form-submit-button.html',
      scope: {
        formCtrl: '=',
        label: '@'
      }
    };
  }
})();

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmInfiniteScroll
   * @restrict 'A'
   *
   * @description Applies endless scrolling. Executed once during initialization and then whenever
   *              user scrolls near the end of the element. Execution on initialization can be turned off
   *              by setting msm-infinite-scroll-no-initial-load. This is "true" by default.
   *
   *              Scroll on div:            <div msm-infinite-scroll="loadMore()">...</div>
   *              Scroll on other element:  <div msm-infinite-scroll="loadMore()" msm-infinite-scroll-element=".selector">...</div>
   *              Scroll on window:         <div msm-infinite-scroll="loadMore()" msm-infinite-scroll-element="$window">...</div>
   *
   *              This directive only takes care of the scrolling event. Loading more data and stopping when the
   *              last page was reached is up to you.
   */
  angular.module('msm.components.ui')
    .directive('msmInfiniteScroll', MsmInfiniteScroll);

  function MsmInfiniteScroll($timeout, $log) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var initialLoad = angular.isUndefined(attrs.msmInfiniteScrollNoInitialLoad);

        // load first page if not turned off (inside correct digest)
        if (initialLoad) {
          $timeout(function () {
            $log.debug('[msmInfiniteScroll] Performing initial load.');
            $scope.$apply(attrs.msmInfiniteScroll);
          });
        }

        // pixels before end, default=200
        var threshold = 200;
        if(attrs.msmInfiniteScrollThreshold) {
          threshold = parseInt(attrs.msmInfiniteScrollThreshold);
        }

        // determine element to watch
        var bindTo, raw;
        if(attrs.msmInfiniteScrollElement) {
          if('$window' === attrs.msmInfiniteScrollElement) {
            bindTo = angular.element(window);
            raw = angular.element('body')[0];
          } else {
            bindTo = angular.element(attrs.msmInfiniteScrollElement);
            raw = bindTo[0];
          }
        } else {
          bindTo = element;
          raw = bindTo[0];
        }

        // watch for scroll events => every 100ms
        var blocked = false;
        bindTo.bind('scroll', function () {
          if (!blocked) {
            blocked = true;

            $timeout(function () {
              if ((raw.scrollTop + raw.offsetHeight + threshold) >= raw.scrollHeight) {
                $scope.$apply(attrs.msmInfiniteScroll);
              }

              blocked = false;
            }, 100);
          }
        });
      }
    };
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
			replace: true,
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
  function msmModal($uibModal, $q, $document) {
    return {
      open: open,
      note: note,
      confirm: confirm,
      select: select
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
     *           The modal's scope parameters. All parameters will automatically be
     *           bound to the default controller using the object's key name.
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

      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: config.backdrop || true,
        templateUrl: config.templateUrl || 'components/ui/msm-modal/msm-modal.html',
        controller: config.controller,
        controllerAs: 'vm',
        size: config.size || '',
        resolve: config.resolve,
        bindToController: true
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
     *       * translationContext:
     *           An object containing values to be used for translation interpolation.
     */
    function note(options) {
      return open({
        size: options.size,
        controller: /*@ngInject*/ function($uibModalInstance) {
          var vm = angular.extend(this, {
            title: options.title || '',
            text: options.text || '',
            translationContext: options.translationContext || {},
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'Ok',
              style: 'btn-primary',
              onClick: onClick
            }, options.close)]
          });

          function onClick() {
            unbindKeyUp();
            $uibModalInstance.close();
          }

          function bindKeyUp() {
            $document.bind('keyup', onEnterKeyUp);
          }

          function unbindKeyUp() {
            $document.unbind('keyup', onEnterKeyUp);
          }

          var onEnterKeyUp = function(event) {
            if (event.which === 13) {
              event.preventDefault();
              unbindKeyUp();
              $uibModalInstance.close();
            }
          };
          bindKeyUp();
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
     *       * translationContext:
     *           An object containing values to be used for translation interpolation.
     */
    function confirm(options) {
      // title, text, size, closeTitle, dismissTitle
      return open({
        size: options.size,
        controller: /*@ngInject*/ function($uibModalInstance) {
          var vm = angular.extend(this, {
            title: options.title || '',
            text: options.text || '',
            translationContext: options.translationContext || {},
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'Ok',
              style: 'btn-primary',
              onClick: onClick
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'Cancel',
              style: 'btn-default',
              onClick: onDismiss
            }, options.dismiss)]
          });

          function onClick() {
            unbindKeyUp();
            $uibModalInstance.close();
          }

          function onDismiss() {
            unbindKeyUp();
            $uibModalInstance.dismiss();
          }

          function bindKeyUp() {
            $document.bind('keyup', onEnterKeyUp);
          }

          function unbindKeyUp() {
            $document.unbind('keyup', onEnterKeyUp);
          }

          var onEnterKeyUp = function(event) {
            if (event.which === 13) {
              event.preventDefault();
              unbindKeyUp();
              $uibModalInstance.close();
            }
          };
          bindKeyUp();
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
     *       * translationContext:
     *           An object containing values to be used for translation interpolation.
     *       * loadAdditionalPage:
     *           A function to be called for loading more data in infinite scrolling mode
     *           (takes page number as argument, starting with 1 for second page - first page is always
     *           provided via resolve of options.values)
     */
    function select(options) {
      // title, text, options, size, closeTitle, dismissTitle
      return open({
        size: options.size,
        templateUrl: 'components/ui/msm-modal/msm-modal-select.html',
        resolve: {
          values: options.options.values || function () {},
          selected: options.options.selected || function () {}
        },
        controller: /*@ngInject*/ function($uibModalInstance, values, selected) {
          var vm = angular.extend(this, {
            title: options.title || '',
            text: options.text || '',
            translationContext: options.translationContext || {},
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
              onClick: onDismiss
            }, options.dismiss)]
          });

          var valueList;
          var selectedVaL;
          function processValueList(list) {
            valueList = [];
            selectedVaL = null;
            for (var key in list) {
              var val = list[key].value;
              valueList.push(val);
              if (selected === list[key].key) {
                selectedVaL = val;
              }
            }
            vm.options = {
              values: valueList,
              selected: selectedVaL
            };
          }
          processValueList(values);

          vm.addPage = function () {
            if (angular.isFunction(options.nextPage)) {
              vm.loading = true;
              options.nextPage().then(function (items) {
                values = values.concat(items);
                processValueList(values);
              }).finally(function () {
                vm.loading = false;
              });
            }
          };

          if(angular.isFunction(options.onOpened)) {
            options.onOpened();
          }

          function onDismiss() {
            unbindKeyUp();
            $uibModalInstance.dismiss();
          }

          function bindKeyUp() {
            $document.bind('keyup', onEnterKeyUp);
          }

          function unbindKeyUp() {
            $document.unbind('keyup', onEnterKeyUp);
          }

          var onEnterKeyUp = function(event) {
            if (event.which === 13) {
              event.preventDefault();
              if(select(options.selected)) {
                onDismiss();
              }
            }
          };
          bindKeyUp();

          vm.select = select;
          function select (option) {
            var found = false;
            var selectedItem = option || vm.options.selected;
            for (var key in values) {
              if (selectedItem === values[key].value) {
                unbindKeyUp();
                $uibModalInstance.close(values[key].key);
                found = true;
                break;
              }
            }
            if (!found) {
              unbindKeyUp();
              $uibModalInstance.close(selectedItem);
            }
          }
        }
      });
    }

  }

})();

(function () {
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

  function NotificationService($q, $translate, Notification) {
    var doFlash = function (args, i18n, notify) {
      if (typeof args !== 'object') {
        args = {
          message: args
        };
      }

      if (i18n === false) {
        notify(args);
      } else {
        var promises = [];

        if(args.title) {
          promises.push($translate(args.title, i18n === true ? undefined : i18n));
        } else {
          promises.push(null);
        }

        if(args.message) {
          promises.push($translate(args.message, i18n === true ? undefined : i18n));
        } else {
          promises.push(null);
        }

        $q.all(promises).then(function (data) {
          notify(angular.extend(args, {title: data[0], message: data[1]}));
        }, function () {
          notify(args);
        });
      }
    };
    return {
      primary: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.primary(args);
        });
      },
      error: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.error(args);
        });
      },
      success: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.success(args);
        });
      },
      info: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.info(args);
        });
      },
      warning: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.warning(args);
        });
      },
      clearAll: function () {
        Notification.clearAll();
      }
    };
  }

})();

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmSpinner
   * @restrict 'E'
   *
   * @description Displays a spinner
   */
  angular.module('msm.components.ui')
    .directive('msmSpinner', MsmSpinner);

  function MsmSpinner() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        size: '@',
        inverted: '<'
      },
      templateUrl: 'components/ui/msm-spinner/msm-spinner.html'
    };
  }
})();

(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmToggleField', MsmToggleField);

  function MsmToggleField($compile) {
    return {
      restrict: 'A',
      require: '^^msmToggleForm',
      link: function(scope, elem, attrs) {
        elem.addClass('msm-toggle-show');
        var body = attrs.msmToggleField || attrs.ngModel;
        var html = $compile('<p class="form-control-static msm-toggle-hide">{{ ' + body + ' }}</p>')(scope);
        elem.after(html);
      }
    }
  }
})();

(function () {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmToggleForm', MsmToggleForm);

  function MsmToggleForm() {
    return {
      restrict: 'A',
      require: 'form',
      controller: angular.noop,
      link: function (scope, elem, attrs) {
        scope.$watch(attrs.msmToggleForm, function(isEditable) {
          if (isEditable) {
            elem.addClass('msm-toggle-active');
            elem.removeClass('msm-toggle-inactive');
          } else {
            elem.addClass('msm-toggle-inactive');
            elem.removeClass('msm-toggle-active');
          }
        });
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmValidateField', MsmValidateField);

  function MsmValidateField($compile) {
    return {
      restrict: 'A',
      require: '^^msmValidateForm',
      link: function(scope, elem, attrs, ctrl) {
        var fieldKey = attrs.validatedField;
        if (!fieldKey) {
          if (attrs.ngModel) {
            var ngModelParts = attrs.ngModel.split('.');
            fieldKey = ngModelParts[ngModelParts.length - 1];
          } else {
            throw 'Missing field key or ngModel';
          }
        }

        var repeat = 'error in ' + ctrl.key + '.fieldErrors | filter: { key: \'' + fieldKey + '\' }';
        elem.after($compile('<p class="help-block" ng-repeat="' + repeat + '" translate="{{ error.code }}"></p>')(scope));
        scope.$watch(ctrl.key, function(newVal, oldVal) {
          if (newVal !== oldVal) {
            var hasError = newVal && _.some(newVal.fieldErrors, { key: fieldKey });
            elem.closest('.form-group')[hasError ? 'addClass' : 'removeClass']('has-error');
          }
        });
      }
    }
  }
})();

angular.module("msm.components.ui").run(["$templateCache", function($templateCache) {$templateCache.put("components/ui/msm-button/msm-button.html","<button type=\"button\" ng-class=\"{\'is-msm-mobile-menu-item\': isMobileMenuItem}\" class=\"btn {{ btnClass }}\">\n  <i class=\"{{ iconClass }}\"></i>\n  <span>{{ text }}</span>\n</button>\n");
$templateCache.put("components/ui/msm-click-to-edit/msm-click-to-edit.html","<span class=\"msm-click-to-edit-container\"\n      ng-class=\"{\'is-placeholder\': placeholder && !editingValue}\"\n      ng-click=\"enableEditingMode()\">\n  <input ng-show=\"isEditing\"\n         ng-blur=\"onBlur()\"\n         ng-keyup=\"onKeyPress($event)\"\n         ng-model=\"editingValue\"\n         placeholder=\"{{placeholder}}\"/>\n  <span ng-hide=\"isEditing || isBusy\"\n        class=\"original-text\"\n        tabindex=\"0\"\n        ng-focus=\"enableEditingMode()\">\n    {{placeholder ? (editingValue ? editingValue : placeholder) : editingValue}}\n  </span>\n  <span ng-hide=\"isEditing\"\n        ng-transclude>\n  </span>\n  <i ng-hide=\"isEditing\" class=\"zmdi zmdi-edit\"></i>\n</span>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-day.html","<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <thead>\n    <tr>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-left\"></i></button></th>\n      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong><span class=\"caret\"></span></button></th>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-right\"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"row in rows track by $index\">\n      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt), current: dt.current}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{\'text-muted\': dt.secondary, \'text-info\': dt.current}\">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-month.html","<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <thead>\n    <tr>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-left\"></i></button></th>\n      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong><span class=\"caret\"></span></button></th>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-right\"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"row in rows track by $index\">\n      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt), current: dt.current}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{\'text-info\': dt.current}\">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-popup.html","<ul class=\"dropdown-menu msm-datepicker\" ng-if=\"isOpen\" style=\"display: block\" ng-style=\"{top: position.top+\'px\', left: position.left+\'px\'}\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <li ng-transclude></li>\n  <li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n    <span class=\"btn-group pull-left\">\n      <button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"select(\'today\')\" ng-disabled=\"isDisabled(\'today\')\">{{ getText(\'current\') }}</button>\n      <button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText(\'clear\') }}</button>\n    </span>\n    <button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText(\'close\') }}</button>\n  </li>\n</ul>\n");
$templateCache.put("components/ui/msm-datepicker/msm-datepicker-year.html","<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n  <!-- Copied and edited from angular-ui/bootstrap/template/datepicker/ -->\n  <thead>\n    <tr>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-left\"></i></button></th>\n      <th colspan=\"3\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"zmdi zmdi-chevron-right\"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat=\"row in rows track by $index\">\n      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt), current: dt.current}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{\'text-info\': dt.current}\">{{::dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("components/ui/msm-form-submit-button/msm-form-submit-button.html","<button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"formCtrl.loading || formCtrl.$invalid\">\n  <span ng-hide=\"formCtrl.loading\"><i class=\"zmdi zmdi-check\"></i> {{::label | translate}}</span>\n  <span ng-show=\"formCtrl.loading\"><i class=\"zmdi zmdi-spinner zmdi-hc-spin\"></i> {{::\'LOADING\' | translate}}</span>\n</button>");
$templateCache.put("components/ui/msm-mobile-menu-item/msm-mobile-menu-item.html","<div class=\"msm-mobile-menu-item\" ng-click=\"open()\">\n  <i class=\"left-icon\" ng-class=\"icon\"></i>\n	<div class=\"menu-label\">{{:: labelText | translate }}</div>\n	<div class=\"preview-value\">{{ previewValue }}</div>\n	<i class=\"icon-arrow-right\"></i>\n</div>\n");
$templateCache.put("components/ui/msm-modal/msm-modal-select.html","<div class=\"modal-content-wrapper\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title\">{{:: vm.title | translate:vm.translationContext }}</h3>\n    <span class=\"modal-close\" ng-click=\"vm.onDismiss ? vm.onDismiss() : $dismiss(\'cancel\')\"><i class=\"zmdi zmdi-close img-close\"></i></span>\n  </div>\n  <div class=\"modal-body modal-mobile-show\"\n       msm-infinite-scroll=\"vm.addPage()\"\n       msm-infinite-scroll-threshold=\"50\"\n       msm-infinite-scroll-no-initial-load=\"true\">\n    <ul class=\"modal-mobile-options\">\n      <li ng-repeat=\"option in vm.options.values\" class=\"modal-mobile-option\" ng-click=\"vm.select(option)\">\n        <i class=\"zmdi zmdi-check-circle item-selected\" ng-if=\"::vm.options.selected === option\"></i>\n        <i class=\"zmdi zmdi-circle-o item-not-selected\" ng-if=\"::vm.options.selected !== option\"></i>\n        {{ ::option }}\n      </li>\n    </ul>\n    <div class=\"text-center m-m\" data-ng-show=\"vm.loading\">\n      <msm-spinner></msm-spinner>\n    </div>\n  </div>\n  <div class=\"modal-body modal-mobile-hide\">\n    <form class=\"form-horizontal mt-xxs mb-xs\">\n          <ui-select id=\"selectItems\" ng-model=\"vm.options.selected\" append-to-body=\"true\">\n            <ui-select-match placeholder=\"{{ vm.text | translate:vm.translationContext }}\" allow-clear=\"false\" class=\"ui-select-match\">\n              {{ vm.options.selected }}\n            </ui-select-match>\n            <ui-select-choices repeat=\"option in ::vm.options.values | filter: $select.search\" class=\"ui-select-choices\"\n                               msm-infinite-scroll=\"vm.addPage()\"\n                               msm-infinite-scroll-threshold=\"50\"\n                               msm-infinite-scroll-no-initial-load=\"true\">\n              <div ng-bind-html=\"::option | highlight: $select.search\"></div>\n            </ui-select-choices>\n          </ui-select>\n    </form>\n  </div>\n  <div class=\"modal-footer\">\n    <button ng-repeat=\"button in vm.buttons\" class=\"btn {{ button.style }}\"\n            ng-class=\"{ \'btn-zmdi\': !button.title, \'modal-mobile-hide\': button.hideMobile }\"\n            ng-click=\"button.onClick()\">\n      <i ng-if=\"button.icon\" class=\"zmdi zmdi-hc-fw zmdi-{{ button.icon }}\"></i>{{ button.title | translate:vm.translationContext }}</button>\n  </div>\n</div>\n");
$templateCache.put("components/ui/msm-modal/msm-modal.html","<div class=\"modal-content-wrapper\">\n  <div class=\"modal-header\">\n    <h3 class=\"modal-title\">{{ vm.title | translate:vm.translationContext }}</h3>\n    <span class=\"modal-close\" ng-click=\"vm.onDismiss ? vm.onDismiss() : $dismiss(\'cancel\')\"><i class=\"zmdi zmdi-close img-close\"></i></span>\n  </div>\n  <div class=\"modal-body\">\n    <span>{{ vm.text | translate:vm.translationContext }}</span>\n  </div>\n  <div class=\"modal-footer\">\n    <button ng-repeat=\"button in vm.buttons\" class=\"btn {{ button.style }}\"\n            ng-class=\"{ \'btn-zmdi\': !button.title, \'modal-mobile-hide\': button.hideMobile }\"\n            ng-click=\"button.onClick()\">\n      <i ng-if=\"button.icon\" class=\"zmdi zmdi-hc-fw zmdi-{{ button.icon }}\"></i>{{ button.title | translate:vm.translationContext }}\n    </button>\n  </div>\n</div>");
$templateCache.put("components/ui/msm-spinner/msm-spinner.html","<div class=\"msm-spinner {{size}}\" ng-class=\"{ inverted: inverted }\">...</div>");
$templateCache.put("components/ui/msm-wizard/msm-wizard.html","<ul class=\"msm-wizard {{class}}\">\n  <li ng-repeat-start=\"state in states\"\n      class=\"msm-wizard-state\"\n      ng-class=\"{ passed: $index < active, active: $index === active }\">\n    <i class=\"zmdi zmdi-hc-fw zmdi-check msm-wizard-icon\"></i>\n    <span class=\"msm-wizard-label\" translate=\"{{ state }}\"></span>\n  </li>\n  <li ng-repeat-end ng-if=\"!$last\" class=\"msm-wizard-divider\"></li>\n</ul>\n");
$templateCache.put("components/ui/ui-select/select-factory-model.html","<div class=\"ui-select\">\n  <ui-select ng-model=\"data.ngModel\" ng-required=\"isRequired\" ng-disabled=\"isDisabled\">\n    <ui-select-match class=\"ui-select-match\" placeholder=\"{{:: placeholder | translate }}\" allow-clear=\"{{ !isRequired }}\">\n      <span>{{ $select.selected.displayName }}</span>\n    </ui-select-match>\n    <ui-select-choices class=\"ui-select-choices\" repeat=\"transform(option) as option in options\" refresh=\"refresh($select.search, true)\" refresh-delay=\"250\"\n                       msm-infinite-scroll=\"refresh($select.search, false)\" msm-infinite-scroll-threshold=\"50\" msm-infinite-scroll-no-initial-load=\"true\">\n      <span ng-bind-html=\"::option.displayName | highlight: $select.search\"></span>\n      <small class=\"text-muted\" ng-repeat=\"subline in ::sublines\">{{:: isString(subline) ? option[subline] : subline(option) }}</small>\n    </ui-select-choices>\n  </ui-select>\n</div>\n");
$templateCache.put("components/ui/ui-select/select-factory-model.multiple.html","<div>\n  <div class=\"ui-select\" ng-class=\"{\'hidden-xs\': mobile}\">\n  <ui-select ng-model=\"data.ngModel\" ng-required=\"isRequired\" ng-disabled=\"isDisabled\" multiple on-select=\"onSelectCallback()\">\n    <ui-select-match class=\"ui-select-match\" placeholder=\"{{:: placeholder | translate }}\" allow-clear=\"{{ !isRequired }}\">\n      <span>{{:: $item.displayName }}</span>\n    </ui-select-match>\n    <ui-select-choices class=\"ui-select-choices\" repeat=\"transform(option) as option in options | filter:{} track by option.id\" refresh=\"refresh($select.search, true)\" refresh-delay=\"250\"\n                       msm-infinite-scroll=\"refresh($select.search, false)\" msm-infinite-scroll-threshold=\"50\" msm-infinite-scroll-no-initial-load=\"true\">\n      <span ng-bind-html=\"::option.displayName | highlight: $select.search\"></span>\n      <small class=\"text-muted\" ng-repeat=\"subline in ::sublines\">{{:: isString(subline) ? option[subline] : subline(option) }}</small>\n    </ui-select-choices>\n  </ui-select>\n</div>\n  <ul class=\"ui-select-mobile-list list-unstyled visible-xs\" ng-if=\"mobile\">\n    <li ng-repeat=\"item in data.ngModel\" class=\"text-muted\">\n      <i ng-if=\"mobileIcon\" class=\"zmdi {{mobileIcon}}\"></i> {{::item.displayName}} <span class=\"pull-right\"><i class=\"zmdi zmdi-close pointer\" ng-click=\"removeItem(item)\"></i></span>\n    </li>\n    <li>\n      <a href ng-click=\"addItem()\" class=\"btn btn-block btn-default\"><i class=\"zmdi zmdi-plus\" ng-class=\"{\n        \'zmdi-plus\': !modalLoading,\n        \'zmdi-spinner zmdi-hc-spin\': modalLoading\n      }\"></i> {{::mobileAddText | translate}}</a>\n    </li>\n  </ul>\n</div>");}]);
(function() {
  'use strict';

  angular.module('msm.components.ui')
      .directive('msmValidateForm', validatedForm);

  function validatedForm() {
    return {
      restrict: 'A',
      require: 'form',
      controller: function($attrs) {
        this.key = $attrs.msmValidateForm;
      }
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('msm.components.ui')
    .directive('msmWizard', msmWizard);

  function msmWizard() {
    return {
      restrict: "AE",
      replace: true,
      scope: {
        active: "=",
        states: "="
      },
      templateUrl: 'components/ui/msm-wizard/msm-wizard.html'
    }
  }
})();
(function() {
  'use strict';

  /**
   * @ngdoc factory
   * @name components.ui.selectFactoryModel
   *
   * @param config configuration options:
   *        - refresh: (required) function to be called to retrieve (paged) data. Must return array of items with additional 'meta' property for paging information.
   *        - transform: (optional) function to be called for each item (if not the entire item should be stored in ng-model)
   *        - sublines: (optional) array of property names to display as sublines
   *        - minSelectableItems: (optional) threshold of items required in the list (options minus selected items) before the next page is automatically fetched
   *        - pageSize: (optional) number of results per page (defaults to 100)
   *        - mobile: (optional): if true will replace ui-select with list + modal on small screens (xs)
   *        - mobileIcon: (optional): (zdmi) icon class to prepend to each list item in mobile view
   *        - mobileAddText: (optional): translation key of text to use in add button in mobile view
   *        - mobileModalTitle: (optional): tranlation key of title text for the modal in mobile view
   *
   * @description
   *     Factory to create a ui-select directive.
   */
  angular.module('msm.components.ui')

    .factory('selectFactoryModel', function($timeout, msmModal, $q) {
      return function(config) {
        return {
          restrict: 'E',
          require : 'ngModel',
          scope: {
            autoFill: '=?',
            placeholder: '@?'
          },
          templateUrl: 'components/ui/ui-select/select-factory-model' + (config.multiple ? '.multiple' : '') + '.html',
          link: function(scope, elem, attrs, ctrl) {
            var isLast = false;
            var isLoading = false;
            var pageSize = config.pageSize || 100;
            var pageable = { page: 0, size: pageSize };

            scope.sublines = config.sublines || [];
            scope.isString = angular.isString;
            scope.transform = config.transform || angular.identity;
            scope.mobile = config.mobile || false;
            scope.mobileIcon = config.mobileIcon;
            scope.mobileAddText = config.mobileAddText;
            scope.options = [];
            scope.data = {};

            scope.refresh = selectRefresh;
            scope.onSelectCallback = onSelectCallback;
            scope.addItem = addItem;
            scope.removeItem = removeItem;

            ctrl.$render = function() {
              scope.data.ngModel = ctrl.$viewValue;
            };
            scope.$watch('data.ngModel', function(newVal, oldVal) {
              ctrl.$setViewValue(newVal || null);
            });
            attrs.$observe('disabled', function() {
              scope.isDisabled = angular.isDefined(attrs.disabled) ? attrs.disabled : false;
            });
            attrs.$observe('required', function() {
              scope.isRequired = angular.isDefined(attrs.required) ? attrs.required : false;
            });

            function selectRefresh(search, reset) {
              doRefresh(search, reset).then(function(response) {
                afterRefresh(response);

                // replace list items with pre-set model values
                // workaround for https://github.com/angular-ui/ui-select/issues/404
                function findModelValueById(id) {
                  return _.find(scope.data.ngModel, function (value) {
                    return value.id === id;
                  });
                }
                for (var i = 0; i < response.length; i++) {
                  if (scope.data.ngModel) {
                    var modelValue = findModelValueById(response[i].id);
                    if (modelValue) {
                      response[i] = modelValue;
                    }
                  }
                }

                scope.options = reset ? response : scope.options.concat(response);
                if (scope.autoFill && !scope.data.ngModel && scope.options.length) {
                  $timeout(function() {
                    scope.data.ngModel = scope.transform(scope.options[0]);
                  });
                }
              });
            }

            function doRefresh(search, reset) {
              if (reset) {
                pageable = { page: 0, size: pageSize };
              } else if (isLoading || isLast) {
                return $q.reject();
              }

              isLoading = true;
              return config.refresh(pageable, search);
            }

            function afterRefresh(response) {
              isLast = response.meta.last;
              isLoading = false;
              pageable.page = response.meta.number + 1;
            }

            function onSelectCallback() {
              if (config.minSelectableItems &&
                  scope.options.length - scope.data.ngModel.length <= config.minSelectableItems) {
                scope.refresh(undefined, false);
              }
            }

            function addItem() {
              function nextPageForModal(reset) {
                return doRefresh(undefined, reset).then(function (response) {
                  afterRefresh(response);
                  return _.filter(response, function (item) {
                    return !_.find(scope.data.ngModel, function (modelItem) {
                      return modelItem.id === item.id;
                    });
                  }).map(function (item) {
                    return {
                      key: item,
                      value: item.displayName
                    };
                  });
                });
              }

              scope.modalLoading = true;
              msmModal.select({
                title: config.mobileModalTitle,
                close: {title: 'CLOSE'},
                dismiss: {title: 'CANCEL'},
                nextPage: nextPageForModal,
                options: {
                  values: function () {
                    return nextPageForModal(true);
                  }
                },
                onOpened: function () {
                  scope.modalLoading = false;
                }
              }).result.then(function (selection) {
                if (!scope.data.ngModel) {
                  scope.data.ngModel = [];
                }
                scope.data.ngModel.push(selection);
              });
            }

            function removeItem(item) {
              scope.data.ngModel.splice(scope.data.ngModel.indexOf(item), 1);
            }
          }
        };
      };
    });

})();

(function () {
  'use strict';

  angular
      .module('msm.components.util')
      .factory('msmUtil', Util);

  function Util() {
    return {
      /**
       * @ngdoc method
       * @name msm.components.util.Util#hash
       * @methodOf msm.components.util.Util
       *
       * @description
       *     A simple string hashing function using the {@link http://www.cse.yorku.ca/~oz/hash.html djb2}.
       * @param {string} str
       *     The input string.
       * @returns {number}
       *     The absolute numeric hash of the input string.
       */
      hash: function (str) {
        if(!str) {
          return -1;
        }

        var h = 5381;
        for (var i = 0; i < str.length; i++) {
          h = ((h << 5) + h) + str.charCodeAt(i);
        }
        return Math.abs(h);
      },

      /**
       * @ngdoc method
       * @name msm.components.util.Util#uuid
       * @methodOf msm.components.util.Util
       *
       * @description
       *     Generates a new UUID.
       * @returns {string}
       *     A UUID string, e.g. *4f87322d-f337-996f-8a9b-1ad08b82853c*.
       */
      uuid: function () {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
