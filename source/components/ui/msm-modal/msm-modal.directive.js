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
        console.log(parameters.text(), parameters.title());
        return $modal.open({
          animation: true,
          templateUrl: 'components/ui/msm-modal/modal-ok-cancel.html',
          controller: controller,
          controllerAs: 'vm',
          size: size || '',
          resolve: parameters,
          windowClass: 'app-modal-window'
        });
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
          controllerAs: 'vm',
          size: size || '',
          resolve: parameters,
          windowClass: 'app-modal-window'
        });
      }
    }
  }

})();
