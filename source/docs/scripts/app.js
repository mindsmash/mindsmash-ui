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
        BUTTON_DELETE: 'Delete'
      });
      $translateProvider.translations('de', {
        BUTTON_DELETE: 'Löschen'
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
    });
})(angular);
