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
        WELCOME: 'Welcome!'
      });
      $translateProvider.translations('de', {
        BUTTON_DELETE: 'Löschen',
        WELCOME: 'Willkommen!'
      });

      $translateProvider.preferredLanguage('en');
      $translateProvider.useSanitizeValueStrategy(null);
    })

    .config(function ($urlRouterProvider, $stateProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider.state('test', {
        url: '',
        template: '<h1>it works</h1>'
      })

    })

    .config(function(NotificationProvider) {
      NotificationProvider.setOptions({
        delay: 113500,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'bottom'
      });
    })

    .run(Main)

    .controller('NotificationController', NotificationController);

    function Main(msmNotification) {
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

    /**
     * Main method
     */
    (function initController() {
      $log.debug('[NotificationController] Initializing...');
    })();
  }

})(angular);
