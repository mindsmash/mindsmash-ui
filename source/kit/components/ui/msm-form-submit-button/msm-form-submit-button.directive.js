(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmFormSubmitButton
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description Directive for a form submit button. When used in combination with the msmFormSubmit directive,
   * the button will automatically toggle a loading state when the form is submitted and when processing is done.
   *
   * @example <msm-form-submit-button label="LABEL" form-ctrl="formControllerName"></msm-form-submit-button>
   */
  angular
      .module('msm.components.ui')
      .directive('msmFormSubmitButton', MsmFormSubmitButton);

  function MsmFormSubmitButton() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/ui/msm-form-submit-button/msm-form-submit-button.html',
      scope: {
        formCtrl: '=',
        icon: '@',
        label: '@'
      }
    };
  }
})();
