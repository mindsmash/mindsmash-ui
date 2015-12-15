(function () {
  'use strict';

  angular
      .module('msm.components.ui')
      .controller('MsmModalController', MsmModalController);

  function MsmModalController(msmModalDefaults) {
    angular.extend(this, msmModalDefaults.get());
  }

})();
