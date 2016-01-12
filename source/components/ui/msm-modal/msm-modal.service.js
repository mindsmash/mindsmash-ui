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
  function msmModal($modal, $q, $document) {
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
              onClick: onClick
            }, options.close)]
          });

          function onClick() {
            unbindKeyUp();
            $modalInstance.close();
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
              $modalInstance.close();
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
            $modalInstance.close();
          }

          function onDismiss() {
            unbindKeyUp();
            $modalInstance.dismiss();
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
              $modalInstance.close();
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
              onClick: onDismiss
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

          function onDismiss() {
            unbindKeyUp();
            $modalInstance.dismiss();
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
                $modalInstance.close(values[key].key);
                found = true;
                break;
              }
            }
            if (!found) {
              unbindKeyUp();
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
              constraint: 'vm.form.$invalid'
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'Cancel',
              style: 'btn-default',
              onClick: onDismiss
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

          function bindKeyUp() {
            $document.bind('keyup', onEnterKeyUp);
          }

          function unbindKeyUp() {
            $document.unbind('keyup', onEnterKeyUp);
          }

          function onDismiss() {
            unbindKeyUp();
            $modalInstance.dismiss();
          }

          var onEnterKeyUp = function(event) {
            if (event.which === 13) {
              event.preventDefault();
              if(vm.formScope.form.$valid) {
                var enter = onModalSubmit();
                if(enter.then) {
                  enter.then(
                      function() {
                        unbindKeyUp();
                      }
                  );
                } else {
                  unbindKeyUp();
                }
              }
            }
          };
          bindKeyUp();

          function onModalSubmit() {
            return $q(function(resolve, reject) {
              setLoadingButton();
              vm.status.error = false;
              vm.status.errorMessage = '';
              vm.status.loading = true;
              var check = options.formOptions.onSubmit(vm.model);

              // check whether the given callback is a promise
              if(check.then) {
                check.then(function(result) {
                  if(!result.error) {
                    resolve(vm.status.error);
                    $modalInstance.close(vm.model);
                    unbindKeyUp();
                  } else {
                    vm.status.error = true;
                    vm.status.errorMessage = result.errorMessage;
                    reject(vm.status.error);
                  }
                }).catch(function(result) {
                  vm.status.error = true;
                  vm.status.errorMessage = result.errorMessage;
                  reject(vm.status.error);
                }).finally(function() {
                  vm.status.loading = false;
                  setSaveButtonButton();
                });
              } else {
                if(!check.error) {
                  resolve(vm.status.error);
                  $modalInstance.close(vm.model);
                  unbindKeyUp();
                } else {
                  vm.status.error = true;
                  vm.status.errorMessage = check.errorMessage;
                }
                vm.status.loading = false;
                setSaveButtonButton();
                reject(vm.status.error);
              }
            });
          }
        }
      });
    }
  }

})();
