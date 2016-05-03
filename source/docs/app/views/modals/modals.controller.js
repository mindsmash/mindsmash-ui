(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('ModalsController', ModalsController);

  function ModalsController($log, $q, msmModal, msmNotification) {
    var vm = this;

    function valueAsync() {
      return $q(function (resolve) {
        setTimeout(function () {
          resolve('Some async value...');
        }, 1000);
      });
    }

    function valueFunction() {
      return 'Some return value...';
    }

    vm.openCustom = function (size) {
      return msmModal.open({
        size: size,
        resolve: {
          value: valueFunction,
          valueAsync: valueAsync()
        },
        controller: function (value, valueAsync) {
          var vm = this;
          vm.title = 'Customization';
          vm.text = valueAsync;
        }
      }).result.then(function (selectedItem) {
        $log.info('Modal (custom): Clicked OK.');
      }, function () {
        $log.info('Modal (custom): Cancelled.');
      });
    };

    vm.openNote = function (size) {
      return msmModal.note({
        size: size,
        title: 'Note',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. ',
      }).result.then(function (selectedItem) {
        $log.info('Modal (note): Clicked OK.');
        msmNotification.success('Closed', false);
      }, function () {
        $log.info('Modal (note): Cancelled.');
      });
    };

    vm.openConfirm = function (size) {
      return msmModal.confirm({
        size: size,
        title: 'Confirmation',
        text: 'Are you sure you want to continue?',
        close: {title: 'Yes'},
        dismiss: {title: 'No', style: 'btn-primary btn-condensed'}
      }).result.then(function () {
        $log.info('Modal (confirm): Confirmed.');
        msmNotification.success('Confirmed', false);
      }, function () {
        $log.info('Modal (confirm): Cancelled.');
      });
    };

    var values = [
      {
        key: 'KeyItem1',
        value: 'Item 1'
      },
      {
        key: 'KeyItem2',
        value: 'Item 2'
      },
      {
        key: 'KeyItem3',
        value: 'Item 3'
      }
    ];
    var selectedSelectModalItem = values[0].key;
    vm.openSelect = function (size) {
      return msmModal.select({
        size: size,
        title: 'Selection',
        text: 'Please select:',
        options: {
          values: function () { return values; },
          selected: function () { return selectedSelectModalItem; }
        }
      }).result.then(function (selectedItem) {
        $log.info('Modal (select): Clicked OK.');
        selectedSelectModalItem = selectedItem;
        msmNotification.success('Selected item: \'' + selectedItem + '\'', false);
      }, function () {
        $log.info('Modal (select): Cancelled.');
      });
    };

    (function initController() {
      $log.debug('[ModalsController] Initializing...');
    })();
  }
})(angular);