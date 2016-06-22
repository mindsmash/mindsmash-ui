(function (angular) {
  'use strict';

  angular.module('msm.docs', [
        'msm.components.ui',
        'msm.components.util',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'ui.router',
        'pascalprecht.translate',
        'hljs'
      ])

      .config(configTranslations)
      .config(configRoutes)
      .config(configNotifications)
      .config(configHighlightJs)

      .run(Main);

  // ------------------------------------------------------------------------------------------------------

  function configNotifications(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 3500,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'top'
    });
  }

  function configRoutes($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('welcome', {
          url: '',
          controller: 'WelcomeController',
          controllerAs: 'vm',
          templateUrl: 'app/views/welcome/welcome.html'
        })
        .state('grid', {url: '/grid', templateUrl: 'app/views/grid/grid.html'})
        .state('type', {url: '/type', templateUrl: 'app/views/type/type.html'})
        .state('breadcrumbs', {url: '/breadcrumbs', templateUrl: 'app/views/breadcrumbs/breadcrumbs.html'})
        .state('pagination', {url: '/pagination', templateUrl: 'app/views/pagination/pagination.html'})
        .state('panels', {url: '/panels', templateUrl: 'app/views/panels/panels.html'})
        .state('labels', {url: '/labels', templateUrl: 'app/views/labels/labels.html'})
        .state('badges', {url: '/badges', templateUrl: 'app/views/badges/badges.html'})
        .state('spinner', {url: '/spinner', templateUrl: 'app/views/spinner/spinner.html'})
        .state('buttons', {url: '/buttons', templateUrl: 'app/views/buttons/buttons.html'})
        .state('colors', {url: '/colors', templateUrl: 'app/views/colors/colors.html'})
        .state('navbar', {url: '/navbar', templateUrl: 'app/views/navbar/navbar.html'})
        .state('definition-list', {url: '/definition-list', templateUrl: 'app/views/definition-list/definition-list.html'})
        .state('navs', {
          url: '/navs',
          templateUrl: 'app/views/navs/navs.html',
          controller: 'NavsController',
          controllerAs: 'vm'
        }).state('tables', {
          url: '/tables',
          templateUrl: 'app/views/tables/tables.html',
          controller: 'TablesController',
          controllerAs: 'vm'
        }).state('forms', {
          url: '/forms',
          templateUrl: 'app/views/forms/forms.html',
          controller: 'FormsController',
          controllerAs: 'vm'
        }).state('notifications', {
          url: '/notifications',
          templateUrl: 'app/views/notifications/notifications.html',
          controller: 'NotificationsController',
          controllerAs: 'vm'
        }).state('modals', {
          url: '/modals',
          templateUrl: 'app/views/modals/modals.html',
          controller: 'ModalsController',
          controllerAs: 'vm'
        });
  }

  function configTranslations($translateProvider) {
    $translateProvider.translations('en', {
      BUTTON_DELETE: 'Delete',
      WELCOME: 'Welcome To The Mindsmash UI Kit!',
      WELCOME_TEXT: 'The kit is based on Twitter Bootstrap and also comes with custom components. Check them out!'
    });
    $translateProvider.translations('de', {
      BUTTON_DELETE: 'Löschen',
      WELCOME: 'Willkommen zum Mindsmash UI-Kit!',
      WELCOME_TEXT: 'Das Kit basiert auf Twitter Bootstrap, beinhaltet jedoch auf eigene Komponenten. Probier sie aus!'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
  }

  function configHighlightJs(hljsServiceProvider) {
    hljsServiceProvider.setOptions({
      // replace tab with 4 spaces
      tabReplace: '    '
    });
  }

  function Main(msmNotification) {
    // use an i18n key here
    msmNotification.primary({
      title: 'WELCOME',
      message: 'WELCOME_TEXT'
    });

    msmNotification.primary('WELCOME');
  }

})(angular);
