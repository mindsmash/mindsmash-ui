(function () {
  'use strict';

  angular
      .module('msm.components.ui')
      .constant('msmModalDefaults', {
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
      });
})();
