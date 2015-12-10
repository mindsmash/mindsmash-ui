(function (angular) {
  'use strict';

  angular
    .module('app', [
      'msm.components.ui',
      'ui.bootstrap',
      'ui.bootstrap.datepicker',
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

    .controller('ClickToEditController', ClickToEditController);

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

    function ClickToEditController($scope, $log, msmNotification) {
      $scope.model = {
        text1: 'First text',
        text2: 'Second text',
        isEditing: false
      };

      $scope.changed = function(value) {
        msmNotification.success('Successfully changed the value to \'' + value + '\'', false);
      };

      (function initController() {
        $log.debug('[ClickToEditController] Initializing...');
      })();
    }
})(angular);
