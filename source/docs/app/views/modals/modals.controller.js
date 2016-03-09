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
          value: 'Some value...',
          valueAsync: valueAsync(),
          valueFunction: valueFunction
        },
        controller: function (value, valueAsync, valueFunction) {
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
        text: 'This is some very important information.',
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
      },
      {
        key: 'KeyItem31',
        value: 'Item 3.1'
      },
      {
        key: 'KeyItem31',
        value: 'Item 3.2'
      }
    ];
    var selectedSelectModalItem = values[0].key;
    vm.openSelect = function (size) {
      return msmModal.select({
        size: size,
        title: 'Selection',
        text: 'Please select:',
        options: {
          values: values,
          selected: selectedSelectModalItem
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