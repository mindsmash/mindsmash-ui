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
  function msmModal($modal, msmModalDefaults) {
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
     * @param {object=} parameters
     *     The modal's scope parameters. All parameters will automatically
     *     converted to resolvable functions and bound to the controller
     *     instance using the object's key name.
     * @param {object=} controller
     *     The modal's controller. A default controller will be provided
     *     with all parameter bindings.
     */
    function open(parameters, controller, size) {
      parameters = parameters || {};

      // auto-generate controller if missing
      if (angular.isUndefined(controller)) {
        var keys = Object.keys(parameters);
        var args = keys.join(',');
        var assign =
          'var vm = this;' +
          'angular.extend(this, $controller(\'MsmModalController\'));' +
          keys.map(function (arg) {
            return 'this[\'' + arg + '\'] = ' + arg + ';';
          }).join('');
        eval('controller = function ($controller, ' + args + ') {' + assign + '};');
        controller = angular.extend(controller, msmModalDefaults.get(), controller);
      }

      // convert parameters to functions
      angular.forEach(parameters, function (value, key) {
        parameters[key] = angular.isFunction(value) ? value : function () {
          return value;
        };
      });

      return $modal.open({
        animation: true,
        templateUrl: 'components/ui/msm-modal/msm-modal.html',
        controller: controller,
        controllerAs: 'vm',
        size: size || '',
        resolve: parameters,
        bindToController: true,
        windowClass: 'app-modal-window'
      });
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#note
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal notification dialog.
     * @param {string} title
     *     The modal's title.
     * @param {string} text
     *     The modal's text.
     * @param {string=} size
     *     The modal's size.
     * @param {string=Ok} closeTitle
     *     The label of the modal's close button.
     */
    function note(title, text, size, closeTitle) {
      return open(null, function () {
        var vm = this;

        angular.extend(vm, msmModalDefaults.get(), {
          title: title,
          text: text,
          dismiss: false
        });

        if (angular.isDefined(closeTitle)) {
          vm.close.title = closeTitle;
        }
      }, size);
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#confirm
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal confirmation dialog.
     * @param {string} title
     *     The modal's title.
     * @param {string} text
     *     The modal's text.
     * @param {string=} size
     *     The modal's size.
     * @param {string=Ok} closeTitle
     *     The label of the modal's confirm button.
     * @param {string=Cancel} dismissTitle
     *     The label of the modal's cancel button.
     */
    function confirm(title, text, size, closeTitle, dismissTitle) {
      return open(null, function () {
        var vm = this;

        angular.extend(vm, msmModalDefaults.get(), {
          title: title,
          text: text
        });

        if (angular.isDefined(closeTitle)) {
          vm.close.title = closeTitle;
        }
        if (angular.isDefined(dismissTitle)) {
          vm.dismiss.title = dismissTitle;
        }
      }, size);
    }

    /**
     * @ngdoc method
     * @name components.ui.msmModal#select
     * @methodOf components.ui.msmModal
     *
     * @description
     *     Display a modal selection dialog.
     * @param {string} title
     *     The modal's title.
     * @param {string} text
     *     The modal's text.
     * @param {array} options
     *     The modal's selection options.
     * @param {string=} size
     *     The modal's size.
     * @param {string=Ok} closeTitle
     *     The label of the modal's confirm button.
     * @param {string=Cancel} dismissTitle
     *     The label of the modal's cancel button.
     */
    function select(title, text, options, size, closeTitle, dismissTitle) {

      return open({ options: options }, function ($modalInstance, options) {
        var vm = this;

        angular.extend(vm, msmModalDefaults.get(), {
          title: title,
          text: text,
          templateUrl: 'components/ui/msm-modal/msm-modal-select.html',
          templateUrlMobile: 'components/ui/msm-modal/msm-modal-select-mobile.html'
        });

        vm.close.title = closeTitle || 'Select';
        if (angular.isDefined(dismissTitle)) {
          vm.dismiss.title = dismissTitle;
        }

        vm.options = {
          values: options,
          selected: options[0]
        };

        vm.onClose = function (option) {
          $modalInstance.close(option || vm.options.selected);
        };
      }, size);
    }
  }

})();
