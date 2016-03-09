angular.module('msm.components.ui')

.config(function($provide) {
  var replaceTemplate = function(mode) {
    $provide.decorator('uib' + mode + 'pickerDirective', function($delegate) {
      $delegate[0].templateUrl = 'components/ui/msm-datepicker/msm-datepicker-' + mode.toLowerCase() + '.html';
      return $delegate;
    });
  };

  replaceTemplate('Day');
  replaceTemplate('Month');
  replaceTemplate('Year');
})

.config(function(uibDatepickerConfig) {
  uibDatepickerConfig.showWeeks = false;
  uibDatepickerConfig.startingDay = 1;
})

.config(function(uibDatepickerPopupConfig) {
  uibDatepickerPopupConfig.showButtonBar = false;
  uibDatepickerPopupConfig.datepickerPopupTemplateUrl = 'components/ui/msm-datepicker/msm-datepicker-popup.html';
});
