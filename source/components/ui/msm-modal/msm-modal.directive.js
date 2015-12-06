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
      .service('msmModalOkCancel', MsmModalOkCancel);

  function MsmModalOkCancel($modal) {
    return {
      open: function(controller, resolveObj, size) {
        return $modal.open({
          animation: true,
          templateUrl: 'components/ui/msm-modal/modal-ok-cancel.html',
          controller: controller,
          size: size || '',
          resolve: resolveObj
        })
      }
    }
  }
})();
