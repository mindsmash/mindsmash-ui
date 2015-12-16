(function () {
  'use strict';

  angular
    .module('msm.components.ui')
    .constant('msmModalDefaults', {
      title: '',
      text: '',
      templateUrl: 'components/ui/msm-modal/msm-modal-default.html',
      templateUrlMobile: 'components/ui/msm-modal/msm-modal-default-mobile.html',
      buttons: []
    });
})();
