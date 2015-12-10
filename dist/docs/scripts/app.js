(function (angular) {
  'use strict';

  angular
      .module('app', [
        'msm.components.ui',
        'ui.bootstrap',
        'ui.bootstrap.dropdown',
        'ui.router',
        'pascalprecht.translate'
      ])

      .config(function ($translateProvider) {
        $translateProvider.translations('en', {
          BUTTON_DELETE: 'Delete',
          WELCOME: 'Welcome to the Mindsmash UI kit!'
        });
        $translateProvider.translations('de', {
          BUTTON_DELETE: 'Löschen',
          WELCOME: 'Willkommen zum Mindsmash UI-Kit!'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);
      })

      .config(function ($urlRouterProvider, $stateProvider) {

        //$urlRouterProvider.otherwise('/');

        $stateProvider
            .state('test', {
              url: '/mobile-menu-test',
              views: {
                'mobile-menu-test': {template: '<span>it works! <a ui-sref="index">close</a></span>'}
              }
            })
            .state('index', {
              url: '',
              views: {
                'mobile-menu-test': {template: ''}
              }
            })
      })

      .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
          delay: 3500,
          startTop: 20,
          startRight: 10,
          verticalSpacing: 20,
          horizontalSpacing: 20,
          positionX: 'right',
          positionY: 'top'
        });
      })

      .run(Main)

      .controller('NotificationController', NotificationController)

      .controller('EditableTextController', EditableTextController)

      .controller('ModalController', ModalController)

      .controller('ModalInstanceControllerOkCancel', ModalInstanceControllerOkCancel)

      .controller('ModalInstanceControllerSelectItem', ModalInstanceControllerSelectItem)

      .controller('ClickToEditController', ClickToEditController);

  function Main(msmNotification) {
    // use an i18n key here
    msmNotification.primary('WELCOME');
  }

  function NotificationController($log, msmNotification) {
    var vm = this;

    vm.primary = function() {
      msmNotification.primary('Primary', false);
    };

    vm.error = function() {
      msmNotification.error('Error', false);
    };

    vm.success = function() {
      msmNotification.success('Success', false);
    };

    vm.info = function() {
      msmNotification.info('Info', false);
    };

    vm.warning = function() {
      msmNotification.warning('Warning', false);
    };

    vm.clearAll = function() {
      msmNotification.clearAll();
    };

    (function initController() {
      $log.debug('[NotificationController] Initializing...');
    })();
  }

  function EditableTextController($scope, $log) {
    $scope.data = {
      isEditable: false,
      value: 'Text value',
      value2: 'Textarea value'
    };
    
    (function initController() {
      $log.debug('[EditableTextController] Initializing...');
    })();
  }

  function ClickToEditController($log, msmNotification) {
    var vm = this;

    vm.model = {
      text1: 'First text',
      text2: 'Second text',
      isEditing: false
    };

    vm.changed = function(value) {
      msmNotification.success('Successfully changed the value to \'' + value + '\'', false);
    };

    (function initController() {
      $log.debug('[ClickToEditController] Initializing...');
    })();
  }

  function ModalController($log, msmModalOkCancel, msmModalSelectFromListing, msmNotification) {
    var vm = this;

    var parametersOkCancel = {
      title: function() {
        return 'Ok-cancel modal';
      },
      text: function () {
        return 'Here some information text.';
      }
    };
    var parametersSelectItem = {
      title: function() {
        return 'Select-from-listing modal';
      },
      text: function () {
        return 'Please select an item:';
      },
      items: function() {
        return [
          'Item 1',
          'Item 2',
          'Item 3'
        ]
      }
    };

    vm.openOkCancel = function(size) {
      msmModalOkCancel
          .open('ModalInstanceControllerOkCancel', parametersOkCancel, size)
          .result.then(
          function () {
            $log.info('Modal (Ok-cancel): Clicked OK.');
            msmNotification.success('Clicked ok', false);
          },
          function () {
            $log.info('Modal (Ok-cancel): Cancelled.');
          }
      );
    };

    vm.openSelectItem = function(size) {
      msmModalSelectFromListing
          .open('ModalInstanceControllerSelectItem', parametersSelectItem, size)
          .result.then(
          function (selectedItem) {
            $log.info('Modal (select-from-listing): Clicked OK.');
            msmNotification.success('Selected item: \'' + selectedItem + '\'', false);
          },
          function () {
            $log.info('Modal (select-from-listing): Cancelled.');
          }
      );
    };

    (function initController() {
      $log.debug('[ModalController] Initializing...');
    })();
  }

  function ModalInstanceControllerOkCancel($log, $modalInstance, title, text) {
    var vm = this;

    vm.title = title;
    vm.text = text;

    vm.ok = function () {
      $modalInstance.close();
    };

    vm.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    (function initController() {
      $log.debug('[ModalInstanceController] Initializing...');
    })();
  }

  function ModalInstanceControllerSelectItem($log, $modalInstance, title, text, items) {
    var vm = this;

    vm.title = title;
    vm.text = text;
    vm.items = {
      "type": "select",
      "selected": items[0],
      "values": items
    };

    vm.ok = function () {
      $modalInstance.close(vm.items.selected);
    };

    vm.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    (function initController() {
      $log.debug('[ModalInstanceControllerSelectItem] Initializing...');
    })();
  }

})(angular);
