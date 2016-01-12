(function () {
  'use strict';

  angular
      .module('msm.components.ui')
      .directive('ngEnter', function($document) {
        return {
          scope: {
            ngEnter: "&"
          },
          link: function(scope) {
            var onEnterKeyUp = function(event) {
              if (event.which === 13) {
                scope.ngEnter();
                scope.$apply();
                event.preventDefault();
                $document.unbind('keyup', onEnterKeyUp);
              }
            };
            $document.bind('keyup', onEnterKeyUp);
          }
        }
      })
      .service('msmModal', msmModal);

  /**
   * @ngdoc service
   * @name components.ui.msmModal
   *
   * @description
   *     Renders styled modals.
   */
  function msmModal($modal) {
    return {
      open: open,
      note: note,
      confirm: confirm,
      select: select,
      formly: formly
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
              style: 'btn-primary',
              onClick: $modalInstance.close,
              onEnter: $modalInstance.close
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
              onClick: $modalInstance.close,
              onEnter: $modalInstance.close
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
              onEnter: select,
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

          if(angular.isFunction(options.onOpened)) {
            options.onOpened();
          }

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

    function formly(options) {
      return open({
        size: options.size,
        templateUrl: 'components/ui/msm-modal/msm-modal-formly-form.html',
        resolve: {
          model: options.formOptions.model,
          formOptions: options.formOptions.options,
          inputFields: options.formOptions.inputFields
        },
        controller: function ($modalInstance, $timeout, model, formOptions, inputFields) {
          var vm = angular.extend(this, {
            title: options.title || '',
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'Save',
              style: 'btn-primary',
              onClick: onModalSubmit,
              onEnter: onModalSubmit,
              constraint: 'vm.form.$invalid'
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'Cancel',
              style: 'btn-default',
              onClick: $modalInstance.dismiss
            }, options.dismiss)]
          });

          function setLoadingButton() {
            vm.buttons[0].icon = 'zmdi zmdi-refresh zmdi-hc-spin';
            vm.buttons[0].title = (options.loading && options.loading.title) ? options.loading.title : "Loading...";
            vm.buttons[0].style = 'btn-primary disabled';
            vm.buttons[0].onClick = angular.noop;
            vm.buttons[0].constraint = 'true';
          }

          function setSaveButtonButton() {
            vm.buttons[0].icon = 'check-circle';
            vm.buttons[0].title = (options.close && options.close.title) ? options.close.title : "Close";
            vm.buttons[0].style = 'btn-primary';
            vm.buttons[0].onClick = onModalSubmit;
            vm.buttons[0].constraint = 'vm.form.$invalid';
          }

          vm.status = {
            error: false,
            errorMessage: '',
            loading: false
          };
          vm.model = model;
          vm.options = formOptions;
          vm.fields = inputFields;

          function onModalSubmit() {
            setLoadingButton();
            vm.status.error = false;
            vm.status.errorMessage = '';
            vm.status.loading = true;
            var check = options.formOptions.onSubmit(vm.model);

            // check whether the given callback is a promise
            if(check.then) {
              check.then(function(result) {
                if(!result.error) {
                  $modalInstance.close(vm.model);
                } else {
                  vm.status.error = true;
                  vm.status.errorMessage = result.errorMessage;
                }
              }).catch(function(result) {
                vm.status.error = true;
                vm.status.errorMessage = result.errorMessage;
              }).finally(function() {
                vm.status.loading = false;
                setSaveButtonButton();
              });
            } else {
              if(!check.error) {
                $modalInstance.close(vm.model);
              } else {
                vm.status.error = true;
                vm.status.errorMessage = check.errorMessage;
              }
              vm.status.loading = false;
              setSaveButtonButton();
            }
          }
        }
      });
    }
  }

})();
