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

    .controller('ModalInstanceControllerOkCancel', ModalInstanceControllerOkCancel);

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

    function ModalController($scope, $log, msmModalOkCancel, msmNotification) {
      var resolve = {
        title: function() {
          return 'Ok-cancel modal';
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

      $scope.open = function(size) {
        msmModalOkCancel
            .open('ModalInstanceControllerOkCancel', resolve, size)
            .result.then(
              function (selectedItem) {
                $log.info('Modal: Clicked OK.');
                msmNotification.success('Selected item: \'' + selectedItem + '\'', false);
              },
              function () {
                $log.info('Modal: Cancelled.');
              }
            );
      };

      (function initController() {
        $log.debug('[ModalController] Initializing...');
      })();
    }

    function ModalInstanceControllerOkCancel($scope, $log, $modalInstance, title, text, items) {
      $scope.title = title;
      $scope.text = text;
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
        $log.debug('[ModalInstanceController] Initializing...');
      })();
    }
})(angular);
