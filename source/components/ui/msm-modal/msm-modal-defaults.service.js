(function () {
  'use strict';

  angular
      .module('msm.components.ui')
      .service('msmModalDefaults', msmModalDefaults);

  function msmModalDefaults() {
    return {
      get: get
    };
    
    function get() {
      return {
        title: '',
        text: '',
        templateUrl: 'components/ui/msm-modal/msm-modal-default.html',
        templateUrlMobile: 'components/ui/msm-modal/msm-modal-default-mobile.html',
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
      };
    }
  }

})();
