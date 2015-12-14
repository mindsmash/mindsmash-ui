angular.module('msm.components.ui')

.config(function($provide) {
  var replaceTemplate = function(mode) {
    $provide.decorator(mode + 'pickerDirective', function($delegate) {
      $delegate[0].templateUrl = '../components/ui/msm-datepicker/msm-datepicker-' + mode + '.html';
      return $delegate;
    });
  };

  replaceTemplate('day');
  replaceTemplate('month');
  replaceTemplate('year');
})

.config(function(datepickerConfig) {
  datepickerConfig.showWeeks = false;
  datepickerConfig.startingDay = 1;
})

.config(function(datepickerPopupConfig) {
  datepickerPopupConfig.showButtonBar = false;
  datepickerPopupConfig.datepickerPopupTemplateUrl = '../components/ui/msm-datepicker/msm-datepicker-popup.html';
});
