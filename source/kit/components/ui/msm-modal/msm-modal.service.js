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
        backdrop: config.backdrop || 'static',
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
            translationContext: options.translationContext || {},
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'OK',
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
            translationContext: options.translationContext || {},
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'OK',
              style: 'btn-primary',
              onClick: onClick
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'CANCEL',
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
            translationContext: options.translationContext || {},
            buttons: [angular.extend({
              icon: 'check-circle',
              title: 'SELECT',
              style: 'btn-primary',
              onClick: select,
              hideMobile: true
            }, options.close), angular.extend({
              icon: 'close-circle',
              title: 'CANCEL',
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
