(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name components.ui.msmModal
   *
   * @description
   *     Renders styled modals.
   */
  angular
      .module('msm.components.ui')
      .service('msmModal', MsmModal);

  function MsmModal($modal) {
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
    function open(parameters, controller) {
      var modalSize = parameters.size || '';
      parameters = withDefaults(parameters);

      // auto-generate controller if missing
      if (angular.isUndefined(controller)) {
        var keys = Object.keys(parameters);
        var args = keys.join(',');
        var assign =
          'var vm = this;' +
          'vm.onClose = function() { $modalInstance.close(); };' +
          'vm.onDismiss = function() { $modalInstance.dismiss(\'cancel\'); };' +
          keys.map(function (arg) {
            return 'this[\'' + arg + '\'] = ' + arg + ';';
          }).join('');
        eval('controller = function($modalInstance,' + args + ') {' + assign + '};');
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
        size: modalSize,
        resolve: parameters,
        bindToController: true,
        windowClass: 'app-modal-window'
      });
    }

    /*
     * Provides default values for all parameters.
     */
    function withDefaults(parameters) {
      return angular.merge({
        title: '',
        text: '',
        templateUrl: 'components/ui/msm-modal/msm-modal-default.html',
        templateUrl: 'components/ui/msm-modal/msm-modal-default-mobile.html',
        templateUrlMobile: null,
        close: {
          icon: 'check-circle',
          iconMobile: 'check',
          title: 'Ok'
        },
        dismiss: {
          icon: 'close-circle',
          iconMobile: 'arrow-left',
          title: 'Cancel'
        }
      }, parameters);
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
      return open(angular.merge({
        title: title,
        text: text,
        size: size || '',
        dismiss: false
      }, angular.isDefined(closeTitle) ? { close: { title: closeTitle }} : {}
      ));
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
      return open(angular.merge({
        title: title,
        text: text,
        size: size || ''
      }, angular.isDefined(closeTitle) ? { close: { title: closeTitle }} : {},
         angular.isDefined(dismissTitle) ? { dismiss: { title: dismissTitle }} : {},
         { dismiss: { iconMobile: 'close' }}
      ));
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
      return open({
        size: size || '',
        options: options
      }, function ($modalInstance, options) {
        var vm = this;
        vm.title = title || '';
        vm.text = text || '';
        vm.options = {
          values: options,
          selected: options[0]
        };
        vm.templateUrl = 'components/ui/msm-modal/msm-modal-select.html';
        vm.templateUrlMobile = 'components/ui/msm-modal/msm-modal-select-mobile.html';
        vm.close = {
          icon: 'check-circle',
          iconMobile: false,
          title: closeTitle || 'Select'
        };
        vm.dismiss = {
          icon: 'close-circle',
          iconMobile: 'arrow-left',
          title: dismissTitle || 'Cancel'
        };
        vm.onClose = function (option) {
          $modalInstance.close(option || vm.options.selected);
        };
        vm.onDismiss = function () {
          $modalInstance.dismiss('cancel');
        };
      });
    }
  }

})();
