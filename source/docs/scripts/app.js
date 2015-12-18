(function(angular) {
  'use strict';

  angular.module('app', [
      'msm.components.ui',
      'msm.components.util',
      'ui.bootstrap',
      'ui.bootstrap.datepicker',
      'ui.bootstrap.dropdown',
      'ui.router',
      'pascalprecht.translate',
      'formly',
      'formlyBootstrap'
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
        size: size,
        resolve: {
          value: 'Some value...',
          valueAsync: valueAsync(),
          valueFunction: valueFunction
        },
        controller: function(value, valueAsync, valueFunction) {
          var vm = this;
          vm.title = 'Customization';
          vm.text = valueAsync;
        }
      }).result.then(function(selectedItem) {
        $log.info('Modal (custom): Clicked OK.');
      }, function() {
        $log.info('Modal (custom): Cancelled.');
      });
    };

    vm.openNote = function(size) {
      return msmModal.note({
        size: size,
        title: 'Note',
        text: 'This is some very important information.',
      }).result.then(function(selectedItem) {
        $log.info('Modal (note): Clicked OK.');
        msmNotification.success('Closed', false);
      }, function() {
        $log.info('Modal (note): Cancelled.');
      });
    };

    vm.openConfirm = function(size) {
      return msmModal.confirm({
        size: size,
        title: 'Confirmation',
        text: 'Are you sure you want to continue?',
        close: { title: 'Yes' },
        dismiss: { title: 'No' }
      }).result.then(function() {
        $log.info('Modal (confirm): Confirmed.');
        msmNotification.success('Confirmed', false);
      }, function() {
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
    vm.openSelect = function(size) {
      return msmModal.select({
        size: size,
        title: 'Selection',
        text: 'Please select:',
        options: {
          values: values,
          selected: selectedSelectModalItem
        }
      }).result.then(function(selectedItem) {
        $log.info('Modal (select): Clicked OK.');
        selectedSelectModalItem = selectedItem;
        msmNotification.success('Selected item: \'' + selectedItem + '\'', false);
      }, function() {
        $log.info('Modal (select): Cancelled.');
      });
    };

    vm.openForm = function(size) {
      function onModalFormSubmit(models) {
        console.log(models);
        return true;
      }

      return msmModal.form({
        size: size,
        title: 'Form',
        formOptions: {
          onSubmit: onModalFormSubmit,
          model: {
            selected: true
          },
          options: {
            formState: {
              selectedIsForced: false
            }
          },
          inputFields: [
            {
              key: 'text',
              type: 'input',
              templateOptions: {
                label: 'Text',
                placeholder: 'This is terrific!'
              }
            },
            {
              key: 'nested.story',
              type: 'textarea',
              templateOptions: {
                label: 'A text area',
                placeholder: 'Text area placeholder',
                description: ''
              },
              expressionProperties: {
                'templateOptions.focus': 'formState.selectedIsForced',
                'templateOptions.description': function(viewValue, modelValue, scope) {
                  if (scope.formState.selectedIsForced) {
                    return 'This field magically got focus!';
                  }
                }
              }
            },
            {
              key: 'selected',
              type: 'checkbox',
              templateOptions: { label: '' },
              expressionProperties: {
                'templateOptions.disabled': 'formState.selectedIsForced',
                'templateOptions.label': function(viewValue, modelValue, scope) {
                  if (scope.formState.selectedIsForced) {
                    return 'This is really awesome!';
                  } else {
                    return 'Is this totally awesome? (uncheck this and see what happens)';
                  }
                }
              }
            },
            {
              key: 'whyNot',
              type: 'textarea',
              expressionProperties: {
                'templateOptions.placeholder': function(viewValue, modelValue, scope) {
                  if (scope.formState.selectedIsForced) {
                    return 'This is really awesome!';
                  } else {
                    return 'Type in here...';
                  }
                },
                'templateOptions.disabled': 'formState.selectedIsForced'
              },
              hideExpression: 'model.selected',
              templateOptions: {
                label: 'Why Not?',
                placeholder: 'Type in here...'
              }
            }
          ]
        }
      }).result.then(
          function(result) {
            $log.info('Modal (form): Ok.', result);
            msmNotification.success('Ok', false);
          },
          function() {
            $log.info('Modal (form): Cancel.');
          }
      );
    };

    (function initController() {
      $log.debug('[ModalController] Initializing...');
    })();
  }

})(angular);
