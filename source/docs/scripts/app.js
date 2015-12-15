(function(angular) {
  'use strict';

  angular.module('app', [
        'msm.components.ui',
        'msm.components.util',
        'ui.bootstrap',
        'ui.bootstrap.dropdown',
        'ui.router',
        'pascalprecht.translate'
      ])

      .config(configTranslations)
      .config(configRoutes)
      .config(configNotifications)

      .run(Main)

      .controller('NotificationController', NotificationController)
      .controller('EditableTextController', EditableTextController)
      .controller('ModalController', ModalController)
      .controller('ClickToEditController', ClickToEditController)
      .controller('TableController', TableController);

  //////////////

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

  function configRoutes($stateProvider) {

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
  }

  function configTranslations($translateProvider) {
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
  }

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

  function EditableTextController($log) {
    var vm = this;

    vm.model = {
      text1: 'First text',
      text2: 'Second text',
      isEditable: false,
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

  function TableController($log) {
    var vm = this;

    vm.model = {
      isHover: false,
      isStriped: false,
      isBordered: false,
      isCondensed: false
    };

    (function initController() {
      $log.debug('[TableController] Initializing...');
    })();
  }

  function ModalController($log, $q, msmModal, msmNotification) {
    var vm = this;

    function valueAsync() {
      return $q(function(resolve) {
        setTimeout(function() {
          resolve('Some async value...');
        }, 1000);
      });
    }

    function valueFunction() {
      return 'Some return value...';
    }

    vm.openCustom = function(size) {
      return msmModal.open({
        value: 'Some value...',
        valueAsync: valueAsync(),
        valueFunction: valueFunction
      }, function($controller, value, valueAsync, valueFunction) {
        var vm = angular.extend(this, $controller('MsmModalController'));
        vm.title = 'Customization';
        vm.text = valueAsync;
      }, size).result.then(function(selectedItem) {
        $log.info('Modal (custom): Clicked OK.');
      }, function() {
        $log.info('Modal (custom): Cancelled.');
      });
    };

    vm.openNote = function(size) {
      return msmModal.note(
        'Note',
        'This is some very important information.',
        size
      ).result.then(function(selectedItem) {
        $log.info('Modal (note): Clicked OK.');
        msmNotification.success('Closed', false);
      }, function() {
        $log.info('Modal (note): Cancelled.');
      });
    };

    vm.openConfirm = function(size) {
      return msmModal.confirm(
          'Confirmation',
          'Are you sure you want to continue?',
          size, 'Yes', 'No'
      ).result.then(function() {
        $log.info('Modal (confirm): Confirmed.');
        msmNotification.success('Confirmed', false);
      }, function() {
        $log.info('Modal (confirm): Cancelled.');
      });
    };

    vm.openSelect = function(size) {
      return msmModal.select(
          'Selection',
          'Please select:',
          ['Item 1', 'Item 2', 'Item 3'],
          size
      ).result.then(function(selectedItem) {
        $log.info('Modal (select): Clicked OK.');
        msmNotification.success('Selected item: \'' + selectedItem + '\'', false);
      }, function() {
        $log.info('Modal (select): Cancelled.');
      });
    };

    (function initController() {
      $log.debug('[ModalController] Initializing...');
    })();
  }

})(angular);
