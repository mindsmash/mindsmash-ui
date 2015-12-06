(function (angular) {
  'use strict';

  angular
    .module('app', [
      'msm.components.ui',
      'ui.bootstrap',
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

      $urlRouterProvider.otherwise('/');

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

    .controller('ModalController', ModalController)

    .controller('ModalInstanceControllerOkCancel', ModalInstanceControllerOkCancel)

    .controller('ModalInstanceControllerSelectItem', ModalInstanceControllerSelectItem);

    function Main(msmNotification) {
      // use an i18n key here
      msmNotification.primary('WELCOME');
    }

    function NotificationController($scope, $log, msmNotification) {
      $scope.primary = function() {
        msmNotification.primary('Primary', false);
      };

      $scope.error = function() {
        msmNotification.error('Error', false);
      };

      $scope.success = function() {
        msmNotification.success('Success', false);
      };

      $scope.info = function() {
        msmNotification.info('Info', false);
      };

      $scope.warning = function() {
        msmNotification.warning('Warning', false);
      };

      $scope.clearAll = function() {
        msmNotification.clearAll();
      };

      (function initController() {
        $log.debug('[NotificationController] Initializing...');
      })();
    }

    function ModalController($scope, $log, msmModalOkCancel, msmModalSelectFromListing, msmNotification) {
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
        textCurrentlySelected: function () {
          return 'Currently selected';
        },
        items: function() {
          return [
            'Item 1',
            'Item 2',
            'Item 3'
          ]
        }
      };

      $scope.openOkCancel = function(size) {
        msmModalOkCancel
            .open('ModalInstanceControllerOkCancel', parametersOkCancel, size)
            .result.then(
              function () {
                $log.info('Modal (Ok-cancel): Clicked OK.');
              },
              function () {
                $log.info('Modal (Ok-cancel): Cancelled.');
              }
            );
      };

      $scope.openSelectItem = function(size) {
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

  function ModalInstanceControllerOkCancel($scope, $log, $modalInstance, title, text) {
    $scope.title = title;
    $scope.text = text;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    (function initController() {
      $log.debug('[ModalInstanceController] Initializing...');
    })();
  }

  function ModalInstanceControllerSelectItem($scope, $log, $modalInstance, title, text, textCurrentlySelected, items) {
    $scope.title = title;
    $scope.text = text;
    $scope.textCurrentlySelected = textCurrentlySelected;
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    (function initController() {
      $log.debug('[ModalInstanceControllerSelectItem] Initializing...');
    })();
  }
})(angular);
