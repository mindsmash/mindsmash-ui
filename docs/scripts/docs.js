(function (angular) {
  'use strict';

  angular.module('msm.docs', [
        'msm.components.ui',
        'msm.components.util',
        'ui.bootstrap',
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
      WELCOME: 'Welcome to the Mindsmash UI kit!'
    });
    $translateProvider.translations('de', {
      BUTTON_DELETE: 'Löschen',
      WELCOME: 'Willkommen zum Mindsmash UI-Kit!'
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
    msmNotification.primary('WELCOME');
  }

})(angular);

(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('ClickToEditController', ClickToEditController);

  function ClickToEditController($log, msmNotification) {
    var vm = this;

    vm.model = {
      text1: 'First text',
      text2: 'Second text',
      isEditing: false
    };

    vm.changed = function (value) {
      msmNotification.success('Successfully changed the value to \'' + value + '\'', false);
    };

    (function initController() {
      $log.debug('[ClickToEditController] Initializing...');
    })();
  }
})(angular);
(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('EditableTextController', EditableTextController);

  function EditableTextController($log) {
    var vm = this;

    vm.isEditable = false;
    vm.model = {
      text1: 'First text',
      text2: 'Second text'
    };

    vm.submit = function () {
      vm.model = angular.extend({}, vm.model); // reset model reference
      vm.isEditable = false;
    };

    vm.reset = function () {
      vm.isEditable = false;
    };

    (function initController() {
      $log.debug('[EditableTextController] Initializing...');
    })();
  }
})(angular);
(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('FormsController', FormsController);

  function FormsController($log, $q, $timeout) {
    var vm = this;

    vm.submit = function () {
      $log.debug('[FormsController] Submit called');

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve('Success');
      }, 1000);

      return deferred.promise;
    };

    (function initController() {
      $log.debug('[FormsController] Initializing...');
    })();
  }
})(angular);
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
          value: valueFunction,
          valueAsync: valueAsync()
        },
        controller: function (value, valueAsync) {
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
(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('NavsController', NavsController);

  function NavsController($log) {
    var vm = this;

    vm.active = 1;
    vm.states = ['Step 1', 'Step 2', 'Step 3'];

    (function initController() {
      $log.debug('[NavsController] Initializing...');
    })();
  }
})(angular);
(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('NotificationsController', NotificationsController);

  function NotificationsController($log, msmNotification) {
    var vm = this;

    vm.primary = function () {
      msmNotification.primary('Primary', false);
    };

    vm.error = function () {
      msmNotification.error('Error', false);
    };

    vm.success = function () {
      msmNotification.success('Success', false);
    };

    vm.info = function () {
      msmNotification.info('Info', false);
    };

    vm.warning = function () {
      msmNotification.warning('Warning', false);
    };

    vm.clearAll = function () {
      msmNotification.clearAll();
    };

    (function initController() {
      $log.debug('[NotificationsController] Initializing...');
    })();
  }

})(angular);
(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('TablesController', TablesController);

  function TablesController($log) {
    var vm = this;

    vm.model = {
      isHover: false,
      isStriped: false,
      isBordered: false,
      isCondensed: false
    };

    (function initController() {
      $log.debug('[TablesController] Initializing...');
    })();
  }
})(angular);
(function (angular) {
  'use strict';

  angular.module('msm.docs').controller('WelcomeController', WelcomeController);

  function WelcomeController() {
  }
})(angular);
angular.module("msm.docs").run(["$templateCache", function($templateCache) {$templateCache.put("app/templates/nav.html","<nav class=\"navbar msm-navbar navbar-fixed-top modal-blur\">\n  <div class=\"msm-navbar-flex\" ng-class=\"{\'nav-search-open\' : searchVisible}\">\n    <div class=\"nav-brand-box\">\n      <h1 class=\"nav-brand\">mindsmash UI</h1>\n    </div>\n    <ul class=\"nav nav-left\">\n      <li class=\"nav-item\" uib-dropdown is-open=\"general.isopen\">\n        <a uib-dropdown-toggle href=\"\">General <span class=\"caret\"></span></a>\n        <ul uib-dropdown-menu class=\"dropdown-menu\" role=\"menu\">\n          <li role=\"menuitem\"><a ui-sref=\"colors\">Colors</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"type\">Type & Headings</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"grid\">Grid system</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"panels\">Panels</a></li>\n        </ul>\n      </li>\n\n      <li class=\"nav-item\" uib-dropdown is-open=\"small.isopen\">\n        <a uib-dropdown-toggle href=\"\">Small Stuff <span class=\"caret\"></span></a>\n        <ul uib-dropdown-menu class=\"dropdown-menu\" role=\"menu\">\n          <li role=\"menuitem\"><a ui-sref=\"breadcrumbs\">Breadcrumbs</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"pagination\">Pagination</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"labels\">Labels</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"badges\">Badges</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"buttons\">Buttons</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"spinner\">Spinner</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"definition-list\">Definition List</a></li>\n        </ul>\n      </li>\n\n      <li class=\"nav-item\" uib-dropdown is-open=\"big.isopen\">\n        <a uib-dropdown-toggle href=\"\">Big Stuff <span class=\"caret\"></span></a>\n        <ul uib-dropdown-menu class=\"dropdown-menu\" role=\"menu\">\n          <li role=\"menuitem\"><a ui-sref=\"forms\">Forms</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"tables\">Tables</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"navs\">Navs</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"notifications\">Notifications</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"modals\">Modals</a></li>\n          <li role=\"menuitem\"><a ui-sref=\"navbar\">Navbar</a></li>\n        </ul>\n      </li>\n    </ul>\n\n    <div class=\"nav-search\">\n      <a ng-hide=\"searchVisible\" class=\"search-icon search-icon-open\" ng-click=\"searchVisible = !searchVisible\"><i class=\"icon-magnifier\"></i></a>\n      <a ng-show=\"searchVisible\" class=\"search-icon search-icon-close\" ng-click=\"searchVisible = false\"><i class=\"icon-close\"></i></a>\n      <input type=\"text\" class=\"form-control\" ng-class=\"{\'open\' : searchVisible}\">\n    </div>\n\n    <ul class=\"nav nav-right\">\n    </ul>\n  </div>\n</nav>");
$templateCache.put("app/views/badges/badges.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Badges</h1>\n  </div>\n  <div class=\"panel-body\">\n    <a href=\"#\" class=\"mr-l\">Inbox <span class=\"badge\">42</span></a>\n\n    <a href=\"#\" class=\"mr-l\">Inbox <span class=\"badge badge-red\">5</span></a>\n\n    <button class=\"btn btn-primary mr-l\" type=\"button\">\n      Messages <span class=\"badge\">4</span>\n    </button>\n\n      <span class=\"mr-l\">\n        <code>.badge-muted</code>\n        <span class=\"badge badge-muted\">Muted Badge</span>\n      </span>\n\n      <span class=\"mr-l\">\n        <code>.badge-lg</code>\n        <span class=\"badge badge-muted badge-lg\">Muted Badge</span>\n      </span>\n  </div>\n</div>");
$templateCache.put("app/views/breadcrumbs/breadcrumbs.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Breadcrumbs</h1>\n  </div>\n  <div class=\"panel-body\">\n\n    <ul class=\"breadcrumb\">\n      <li class=\"active\">Home</li>\n    </ul>\n    <ul class=\"breadcrumb\">\n      <li><a href=\"#\">Home</a></li>\n      <li class=\"active\">Library</li>\n    </ul>\n    <ul class=\"breadcrumb\">\n      <li><a href=\"#\">Home</a></li>\n      <li><a href=\"#\">Library</a></li>\n      <li class=\"active\">Data</li>\n    </ul>\n\n  </div>\n</div>");
$templateCache.put("app/views/buttons/buttons.html","<div class=\"panel panel-default\" data-ng-init=\"exampleValue=\'look at this\'\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Buttons</h1>\n  </div>\n  <div class=\"panel-body\">\n    <h2>Options</h2>\n\n    <div class=\"mb-l\">\n      <button class=\"btn btn-default mr-s\">Default</button>\n      <button class=\"btn btn-primary mr-s\">Primary</button>\n      <button class=\"btn btn-success mr-s\">Success</button>\n      <button class=\"btn btn-info mr-s\">Info</button>\n      <button class=\"btn btn-warning mr-s\">Warning</button>\n      <button class=\"btn btn-danger mr-s\">Danger</button>\n      <button class=\"btn btn-link mr-s\">Link</button>\n    </div>\n\n    <h2>Sizes</h2>\n\n    <div class=\"mb-l\">\n      <div class=\"mb-s\">\n        <button class=\"btn btn-primary btn-lg mr-s\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Large button</button>\n        <button class=\"btn btn-default btn-lg mr-s\">Large button</button>\n        <button class=\"btn btn-default btn-lg mr-s\">Badge <span class=\"badge badge-red\">42</span></button>\n        <button class=\"btn btn-default btn-lg btn-zmdi\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i></button>\n      </div>\n      <div class=\"mb-s\">\n        <button class=\"btn btn-primary mr-s\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Default button</button>\n        <button class=\"btn btn-default mr-s\">Default button</button>\n        <button class=\"btn btn-default mr-s\">Badge <span class=\"badge badge-red\">42</span></button>\n        <button class=\"btn btn-default btn-zmdi\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i></button>\n      </div>\n      <div class=\"mb-s\">\n        <button class=\"btn btn-primary btn-sm mr-s\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Small button</button>\n        <button class=\"btn btn-default btn-sm mr-s\">Small button</button>\n        <button class=\"btn btn-default btn-sm mr-s\">Badge <span class=\"badge badge-red\">42</span></button>\n        <button class=\"btn btn-default btn-sm btn-zmdi\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i></button>\n      </div>\n      <div class=\"mb-s\">\n        <button class=\"btn btn-primary btn-xs mr-s\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Extra small button</button>\n        <button class=\"btn btn-default btn-xs mr-s\">Extra small button</button>\n        <button class=\"btn btn-default btn-xs mr-s\">Badge <span class=\"badge badge-red\">42</span></button>\n        <button class=\"btn btn-default btn-xs btn-zmdi\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i></button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"panel panel-default\" data-ng-init=\"exampleValue=\'look at this\'\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Button directive</h1>\n  </div>\n  <div class=\"panel-body\">\n    <msm-delete-button label-text=\"BUTTON_DELETE\" is-mobile-menu-item=\"true\" button-type=\"delete\"></msm-delete-button>\n    <msm-create-button label-text=\"Create\" is-mobile-menu-item=\"true\" button-type=\"delete\"></msm-create-button>\n    <hr>\n    <div class=\"p-s bg-gray-lighter\">\n      <msm-mobile-menu-item target-state=\"\'test\'\" label-text=\"\'Foo\'\" preview-value=\"exampleValue\" icon=\"\'icon-close\'\"></msm-mobile-menu-item>\n      <span ui-view=\"mobile-menu-test\"></span>\n      <msm-mobile-menu-item target-state=\"\'test\'\" label-text=\"\'Hallo Welt\'\" preview-value=\"exampleValue\" icon=\"\'zmdi zmdi-globe\'\"></msm-mobile-menu-item>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/colors/colors.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main panel-dl\">\n    <h1 class=\"panel-title\">Colors</h1>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"row\">\n      <div class=\"col-xs-2 bg-white pv-xs\">.bg-white</div>\n      <div class=\"col-xs-2 bg-blue pv-xs white\">.bg-blue</div>\n      <div class=\"col-xs-2 bg-green pv-xs white\">.bg-green</div>\n      <div class=\"col-xs-2 bg-blue-light pv-xs white\">.bg-blue-light</div>\n      <div class=\"col-xs-2 bg-yellow pv-xs white\">.bg-yellow</div>\n      <div class=\"col-xs-2 bg-red pv-xs white\">.bg-red</div>\n    </div>\n    <div class=\"row mt-s\">\n      <div class=\"col-xs-2 bg-black white pv-xs\">.white</div>\n      <div class=\"col-xs-2 bg-white blue pv-xs\">.blue</div>\n      <div class=\"col-xs-2 bg-white green pv-xs\">.green</div>\n      <div class=\"col-xs-2 bg-white yellow pv-xs\">.yellow</div>\n      <div class=\"col-xs-2 bg-white red pv-xs\">.red</div>\n      <div class=\"col-xs-2 bg-white black pv-xs\">.black</div>\n    </div>\n    <div class=\"row mt-s\">\n      <div class=\"col-xs-2 bg-gray-lighter pv-xs\">.bg-gray-lighter</div>\n      <div class=\"col-xs-2 bg-gray-light pv-xs\">.bg-gray-light</div>\n      <div class=\"col-xs-2 bg-gray pv-xs\">.bg-gray</div>\n      <div class=\"col-xs-2 bg-gray-dark pv-xs\">.bg-gray-dark</div>\n      <div class=\"col-xs-2 bg-gray-darker white pv-xs\">.bg-gray-darker</div>\n      <div class=\"col-xs-2 bg-black white pv-xs\">.bg-black</div>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/definition-list/definition-list.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main panel-dl\">\n    <h1 class=\"panel-title\">Definition List</h1>\n  </div>\n  <div class=\"panel-body\">\n    <dl class=\"dl-horizontal\">\n      <dt>first name</dt>\n      <dd>Robert</dd>\n      <dt>last name</dt>\n      <dd>Lang</dd>\n      <dt>last name</dt>\n      <dd>Lang</dd>\n    </dl>\n  </div>\n</div>");
$templateCache.put("app/views/forms/forms.html","<form class=\"form-horizontal\" name=\"msmSampleForm\" msm-form-submit=\"vm.submit()\">\n  <div class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n      <h3 class=\"panel-title\">Basic Form</h3>\n    </div>\n    <div class=\"panel-body\">\n      <div class=\"form-group\">\n        <label for=\"inputText\" class=\"col-sm-2 control-label\">Text</label>\n        <div class=\"col-sm-10\">\n          <input type=\"text\" class=\"form-control\" id=\"inputText\" placeholder=\"Text\">\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"inputText2\" class=\"col-sm-2 control-label\">Text with Addon</label>\n        <div class=\"col-sm-10\">\n          <div class=\"input-group\">\n            <span class=\"input-group-addon\">Prefix</span>\n            <input type=\"text\" class=\"form-control\" id=\"inputText2\" placeholder=\"Text\">\n          </div>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"selectText\" class=\"col-sm-2 control-label\">Select</label>\n        <div class=\"col-sm-10\">\n          <select class=\"form-control\" id=\"selectText\" placeholder=\"Select something\">\n            <option>Option 1</option>\n            <option>Option 2</option>\n          </select>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"inputText\" class=\"col-sm-2 control-label\">Text (disabled)</label>\n        <div class=\"col-sm-10\">\n          <input type=\"text\" class=\"form-control\" id=\"inputText\" placeholder=\"Text (disabled)\" disabled>\n        </div>\n      </div>\n      <div class=\"form-group form-group-checkbox\">\n        <label for=\"checkBoolean\" class=\"col-sm-2 control-label\">Checkbox</label>\n        <div class=\"col-sm-10\">\n          <msm-checkbox ng-model=\"boolModel\" id=\"checkBoolean\"></msm-checkbox>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"radioExample\" class=\"col-sm-2 control-label\">Radio</label>\n        <div class=\"col-sm-10\">\n          <div class=\"radio\">\n            <label>\n              <input type=\"radio\" id=\"radioExample\">\n              <i class=\"zmdi zmdi-globe\"></i> Activate to be cool\n            </label>\n          </div>\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"inputPassword\" class=\"col-sm-2 control-label\">Password</label>\n        <div class=\"col-sm-10\">\n          <input type=\"password\" class=\"form-control\" id=\"inputPassword\" placeholder=\"Password\">\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"inputTextarea\" class=\"col-sm-2 control-label\">Textarea</label>\n        <div class=\"col-sm-10\">\n          <textarea class=\"form-control\" id=\"inputTextarea\" placeholder=\"Textarea\" rows=\"3\"></textarea>\n        </div>\n      </div>\n    </div>\n    <div class=\"panel-footer panel-actions\">\n      <div class=\"row\">\n        <div class=\"col-sm-10 col-sm-push-2\">\n          <msm-form-submit-button label=\"Save now\" form-ctrl=\"msmSampleForm\"></msm-form-submit-button>\n          <button type=\"button\" class=\"btn btn-default\"><i class=\"zmdi zmdi-close\"></i> Cancel</button>\n        </div>\n      </div>\n    </div>\n    <div class=\"panel-footer pt-m\">\n      <p><b>Note:</b> Use the helper class <code>.form-group-checkbox</code> to fix margin offsets for form groups with checkboxes.</p>\n    </div>\n  </div>\n</form>\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\">More Form Styles</h3>\n  </div>\n  <div class=\"panel-body\">\n    <h3>Validation States</h3>\n    <div class=\"example mt-s mb-l\">\n      <form class=\"form-horizontal\">\n        <div class=\"form-group has-success\">\n          <label class=\"col-sm-2 control-label\" for=\"inputSuccess\">Input with success</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" class=\"form-control\" id=\"inputSuccess\">\n            <p class=\"help-block\">This is some help text.</p>\n          </div>\n        </div>\n        <div class=\"form-group has-warning\">\n          <label class=\"col-sm-2 control-label\" for=\"inputWarning\">Input with warning</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" class=\"form-control\" id=\"inputWarning\">\n            <p class=\"help-block\">This is some help text.</p>\n          </div>\n        </div>\n        <div class=\"form-group has-error\">\n          <label class=\"col-sm-2 control-label\" for=\"inputError\">Input with error</label>\n          <div class=\"col-sm-10\">\n            <div class=\"input-group\">\n              <span class=\"input-group-addon\"><i class=\"zmdi zmdi-edit\"></i></span>\n              <input type=\"text\" class=\"form-control\" id=\"formGroupInputNormal\" placeholder=\"Normal input\">\n            </div>\n            <p class=\"help-block\">This is some help text.</p>\n          </div>\n        </div>\n      </form>\n    </div>\n\n    <h3>Control Sizing</h3>\n    <div class=\"example mt-s mb-l\">\n      <form class=\"form-horizontal\">\n        <div class=\"form-group form-group-lg\">\n          <label class=\"col-sm-2 control-label\" for=\"formGroupInputLarge\">Large label</label>\n          <div class=\"col-sm-9\">\n            <div class=\"input-group input-group-lg\">\n              <span class=\"input-group-addon\"><i class=\"zmdi zmdi-edit\"></i></span>\n              <input type=\"text\" class=\"form-control\" id=\"formGroupInputLarge\" placeholder=\"Large input\">\n            </div>\n          </div>\n          <div class=\"col-sm-1\">\n            <msm-checkbox ng-model=\"boolModel2\" id=\"checkBoolean\"></msm-checkbox>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\" for=\"formGroupInputNormal\">Normal label</label>\n          <div class=\"col-sm-9\">\n            <div class=\"input-group\">\n              <span class=\"input-group-addon\"><i class=\"zmdi zmdi-edit\"></i></span>\n              <input type=\"text\" class=\"form-control\" id=\"formGroupInputNormal\" placeholder=\"Normal input\">\n            </div>\n          </div>\n          <div class=\"col-sm-1\">\n            <msm-checkbox ng-model=\"boolModel3\" id=\"checkBoolean2\"></msm-checkbox>\n          </div>\n        </div>\n        <div class=\"form-group form-group-sm\">\n          <label class=\"col-sm-2 control-label\" for=\"formGroupInputSmall\">Small label</label>\n          <div class=\"col-sm-9\">\n            <div class=\"input-group input-group-sm\">\n              <span class=\"input-group-addon\"><i class=\"zmdi zmdi-edit\"></i></span>\n              <input type=\"text\" class=\"form-control\" id=\"formGroupInputSmall\" placeholder=\"Small input\">\n            </div>\n          </div>\n          <div class=\"col-sm-1\">\n            <msm-checkbox ng-model=\"boolModel4\" id=\"checkBoolean3\"></msm-checkbox>\n          </div>\n        </div>\n      </form>\n    </div>\n\n    <div ng-controller=\"EditableTextController as etc\">\n      <button class=\"btn btn-sm btn-default mt-xxs pull-right\" ng-click=\"etc.isEditable = !etc.isEditable\">Toggle</button>\n      <h3>Toggle State</h3>\n      <div class=\"example\">\n        <div class=\"mt-s mb-l\">\n          <form class=\"form-horizontal\" ng-submit=\"etc.submit()\" ng-reset=\"etc.reset()\" msm-toggle-form=\"etc.isEditable\" msm-delay-form=\"etc.model\">\n            <div class=\"form-group\">\n              <label for=\"inputEditableText\" class=\"col-sm-2 control-label\">Text</label>\n              <div class=\"col-sm-10\">\n                <input type=\"text\" class=\"form-control\" id=\"inputEditableText\" ng-model=\"etc.model.text1\" msm-toggle-field>\n              </div>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"inputEditableText2\" class=\"col-sm-2 control-label\">Text 2</label>\n              <div class=\"col-sm-10\">\n                <input type=\"text\" class=\"form-control\" id=\"inputEditableText2\" ng-model=\"etc.model.text2\" msm-toggle-field=\"etc.model.text2 | uppercase\">\n              </div>\n            </div>\n            <div class=\"form-group\" ng-if=\"etc.isEditable\">\n              <div class=\"col-sm-10 col-sm-offset-2\">\n                <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n                <button type=\"reset\" class=\"btn btn-default\">Reset</button>\n              </div>\n            </div>\n          </form>\n        </div>\n        <div class=\"panel-footer\" hljs>\n<form class=\"form-horizontal\" msm-toggle-form=\"vm.isEditable\" msm-delay-form=\"vm.model\">\n  <div class=\"form-group\">\n    <label for=\"input\" class=\"col-sm-2 control-label\">Text</label>\n    <div class=\"col-sm-10\">\n      <input type=\"text\" class=\"form-control\" id=\"input\" ng-model=\"vm.model.text1\" msm-toggle-field>\n    </div>\n  </div>\n  <div class=\"form-group\" ng-if=\"vm.isEditable\">\n    <div class=\"col-sm-10 col-sm-offset-2\">\n      <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n    </div>\n  </div>\n</form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<section class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Datepicker</h1>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"example panel panel-default\">\n      <div class=\"panel-body\">\n        <form class=\"form-horizontal\">\n          <div class=\"form-group\">\n            <label for=\"inputDate\" class=\"col-sm-2 control-label\">Date</label>\n            <div class=\"col-sm-10\">\n              <input type=\"text\" class=\"form-control\" uib-datepicker-popup ng-model=\"date\" is-open=\"opened\"\n                     ng-click=\"opened = !opened\"/>\n              <span class=\"help-block pull-right\">Selected date is: <em>{{ (date | date:\'fullDate\') || \'None\'\n                }}</em></span>\n            </div>\n          </div>\n        </form>\n      </div>\n      <div class=\"panel-footer\" hljs>\n<div class=\"form-group\">\n  <label for=\"inputDate\" class=\"col-sm-2 control-label\">Date</label>\n  <div class=\"col-sm-10\">\n    <input type=\"text\" class=\"form-control\" uib-datepicker-popup ng-model=\"date\" is-open=\"opened\"\n           ng-click=\"opened = !opened\"/>\n    <span class=\"help-block pull-right\">Selected date is: <em>{{ (date | date:\'fullDate\') || \'None\'\n      }}</em></span>\n  </div>\n</div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<section class=\"panel panel-default\" ng-controller=\"FormsController as dtc\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Datetimepicker</h1>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"example panel panel-default\">\n      <div class=\"panel-body\">\n        <form class=\"form-horizontal\">\n          <div class=\"form-group\">\n            <label for=\"datetime\" class=\"col-sm-2 control-label\">Date & time</label>\n            <div class=\"col-sm-10\">\n              <div class=\"input-group\">\n                <input id=\"publishDate\" type=\"text\" class=\"form-control\" name=\"datetime\"\n                       datetime-picker=\"dd MMM yyyy HH:mm\"\n                       ng-model=\"dtc.datetime\"\n                       is-open=\"isOpen\"\n                       timepicker-options=\"{\'showMeridian\': false}\"/>\n                <span class=\"input-group-addon\">\n                  <a ng-click=\"isOpen = !isOpen\"><i class=\"zmdi zmdi-calendar\"></i></a>\n                </span>\n              </div>\n              <span class=\"help-block pull-right\">Selected date & time is: <em>{{ (dtc.datetime | date:\'MMM dd, yyyy HH:mm:ss\')\n                || \'None\' }}</em></span>\n            </div>\n          </div>\n        </form>\n      </div>\n       <div class=\"panel-footer\" hljs>\n<div class=\"form-group\">\n <label for=\"datetime\" class=\"col-sm-2 control-label\">Date & time</label>\n <div class=\"col-sm-10\">\n   <div class=\"input-group\">\n     <input id=\"publishDate\" type=\"text\" class=\"form-control\" name=\"datetime\"\n            datetime-picker=\"dd MMM yyyy HH:mm\"\n            ng-model=\"dtc.datetime\"\n            is-open=\"isOpen\"\n            timepicker-options=\"{\'showMeridian\': false}\"/>\n      <span class=\"input-group-addon\">\n        <a ng-click=\"isOpen = !isOpen\"><i class=\"zmdi zmdi-calendar\"></i></a>\n      </span>\n   </div>\n    <span class=\"help-block pull-right\">Selected date & time is: <em>{{ (dtc.datetime | date:\'MMM dd, yyyy HH:mm:ss\')\n      || \'None\' }}</em></span>\n </div>\n</div>\n       </div>\n     </div>\n    </div>\n  </div>\n</section>\n\n<section class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">In-place editing</h1>\n  </div>\n  <div class=\"panel-body\">\n    <div ng-controller=\"ClickToEditController as cte\">\n      <div msm-click-to-edit=\"cte.model.text1\" on-change=\"cte.changed(value)\"\n           placeholder=\"Text 1 placeholder\"></div>\n      <div msm-click-to-edit=\"cte.model.text2\" on-change=\"cte.changed(value)\"\n           style=\"text-decoration: underline\" edit-mode=\"cte.model.isEditing\"></div>\n      <div>\n        <span ng-show=\"cte.model.isEditing\">You are editing the second text.</span>\n        <span ng-show=\"!cte.model.isEditing\">You are not editing the second text.</span>\n      </div>\n    </div>\n  </div>\n</section>");
$templateCache.put("app/views/grid/grid.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Grid system</h1>\n  </div>\n  <div class=\"panel-body\">\n    <h3>Extra large devices <small>Desktops (≥1400px)</small></h3>\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-xl-8 bg-gray-lighter\"><code class=\"inline-block mv-xs\">.col-xl-8</code></div>\n        <div class=\"col-xl-4 bg-gray-light\"><code class=\"inline-block mv-xs\">.col-xl-4</code></div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-xl-4 col-xl-offset-8 bg-gray-lighter\"><code class=\"inline-block mv-xs\">.col-xl-4 .col-xl-offset-8</code></div>\n      </div>\n    </div>\n  </div>\n  <div class=\"panel-footer\" hljs>\n<div class=\"row\">\n  <div class=\"col-xl-8\"><!-- ... --></div>\n  <div class=\"col-xl-4\"><!-- ... --></div>\n</div>\n<div class=\"row\">\n  <div class=\"col-xl-4 col-xl-offset-8\"><!-- ... --></div>\n</div>\n  </div>\n</div>\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Responsive utilities</h1>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"container-fluid\">\n      <div class=\"row\">\n        <div class=\"col-sm-6\"><div class=\"well mt-xs visible-xl-block\"><code>.visible-xl-block</code></div></div>\n        <div class=\"col-sm-6\"><div class=\"well mt-xs hidden-xl\"><code>.hidden-xl</code></div></div>\n      </div>\n    </div>\n  </div>\n  <div class=\"panel-footer\" hljs>\n<div class=\"well mt-xs visible-xl-block\"><!-- ... --></div>\n<div class=\"well mt-xs hidden-xl\"><!-- ... --></div>\n  </div>\n</div>");
$templateCache.put("app/views/labels/labels.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Labels</h1>\n  </div>\n  <div class=\"panel-body\">\n    <span class=\"label label-default\">Default</span>\n    <span class=\"label label-primary\">Primary</span>\n    <span class=\"label label-success\">Success</span>\n    <span class=\"label label-info\">Info</span>\n    <span class=\"label label-warning\">Warning</span>\n    <span class=\"label label-danger\">Danger</span>\n    <span class=\"label label-muted\">Muted</span>\n  </div>\n</div>");
$templateCache.put("app/views/modals/modals.html","<div class=\"mb-l\">\n  <h1>Modals</h1>\n  <p><b>Note:</b> When a modal window is opened, a CSS blur filter is applied to all DOM elements having the <code>.modal-blur</code> class\n    and a CSS grayscale filter is applied to all DOM elements having the <code>.modal-gray</code> class.</p>\n</div>\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\">Custom modals</h3>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"container-fluid\">\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openCustom()\">Default</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openCustom(\'sm\')\">Small</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openCustom(\'lg\')\">Large</button>\n    </div>\n  </div>\n  <div class=\"panel-footer\" hljs>\n<script>\n  showCustom = function(size) {\n    return msmModal.open({\n      size: size,\n      resolve: {\n        value: valueFunction,    // resolve function\n        valueAsync: valueAsync() // $q promise (1sec. delay)\n      },\n      controller: function(value, valueAsync) {\n        var vm = this;\n        vm.title = \'Customization\';\n        vm.text = valueAsync;\n      }\n    });\n  };\n</script>\n  </div>\n</div>\n\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\">Notification modals</h3>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"container-fluid\">\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openNote()\">Default</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openNote(\'sm\')\">Small</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openNote(\'lg\')\">Large</button>\n    </div>\n  </div>\n  <div class=\"panel-footer\" hljs>\n<script>\n  showNotification = function(size) {\n    return msmModal.note({\n      size: size,\n      title: \'Note\',\n      text: \'This is some very important information.\'\n    });\n  };\n</script>\n  </div>\n</div>\n\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\">Confirmation modals</h3>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"container-fluid\">\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openConfirm()\">Default</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openConfirm(\'sm\')\">Small</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openConfirm(\'lg\')\">Large</button>\n    </div>\n  </div>\n  <div class=\"panel-footer\" hljs>\n<script>\n  showConfirmation = function(size) {\n    return msmModal.confirm({\n      size: size,\n      title: \'Confirmation\',\n      text: \'Are you sure you want to continue?\',\n      close: { title: \'Yes\' },\n      dismiss: { title: \'No\', style: \'btn-primary btn-condensed\' }\n    }).result.then(function() { /* ... */ });\n  };\n</script>\n  </div>\n</div>\n\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\">Selection modals</h3>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"container-fluid\">\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openSelect()\">Default</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openSelect(\'sm\')\">Small</button>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.openSelect(\'lg\')\">Large</button>\n    </div>\n  </div>\n  <div class=\"panel-footer\" hljs>\n<script>\n  showSelection = function(size) {\n    return msmModal.select({\n      size: size,\n      title: \'Selection\',\n      text: \'Please select:\',\n      options: {\n        values: [{ key: \'key1\', value: \'Item 1\' }, { key: \'key2\', value: \'Item 2\' }, { key: \'key3\', value: \'Item 3\' }],\n        selected: \'key1\'\n      }\n    }).result.then(function(selectedItem) { /* ... */ });\n  };\n</script>\n  </div>\n</div>");
$templateCache.put("app/views/navbar/navbar.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Mindsmash Navbar</h1>\n  </div>\n  <div class=\"panel-body\">\n    <p>There is a special version of Bootstrap\'s navbar for mindsmash applications. It is based on flex-box and can be activated with the following classes and sub-elements:</p>\n\n    <nav class=\"navbar msm-navbar\">\n      <div class=\"msm-navbar-flex\" ng-class=\"{\'nav-search-open\' : searchVisible}\">\n        <div class=\"nav-brand-box\">\n          <h1 class=\"nav-brand\">Title</h1>\n        </div>\n        <ul class=\"nav nav-left\">\n          <li class=\"nav-item visible-xs\">\n            <a class=\"nav-item-icon icon-menu\"></a>\n          </li>\n          <li class=\"nav-item hidden-xs\">\n            <a class=\"nav-item-icon icon-globe\"></a>\n          </li>\n          <li class=\"nav-item active hidden-xs\">\n            <a class=\"nav-item-icon icon-book-open\"></a>\n          </li>\n          <li class=\"nav-item hidden-xs\">\n            <a class=\"nav-item-icon icon-grid\"></a>\n          </li>\n          <li class=\"nav-item hidden-xs\">\n            <a class=\"nav-item-icon icon-calendar\"></a>\n          </li>\n        </ul>\n        <div class=\"nav-search\">\n          <a ng-hide=\"searchVisible\" class=\"search-icon search-icon-open\" ng-click=\"searchVisible = !searchVisible\"><i class=\"icon-magnifier\"></i></a>\n          <a ng-show=\"searchVisible\" class=\"search-icon search-icon-close\" ng-click=\"searchVisible = false\"><i class=\"icon-close\"></i></a>\n          <input type=\"text\" class=\"form-control\" ng-class=\"{\'open\' : searchVisible}\">\n        </div>\n        <ul class=\"nav nav-right\">\n          <li class=\"nav-item hidden-xs\">\n            <a class=\"nav-item-icon icon-bell\"></a>\n          </li>\n          <li class=\"nav-item hidden-xs\">\n            <a class=\"nav-item-icon icon-people\"></a>\n          </li>\n          <li class=\"nav-item hidden-xs\">\n            <a class=\"nav-item-icon icon-bubbles\"></a>\n          </li>\n          <li class=\"nav-item hidden-xs\" uib-dropdown is-open=\"status.isopen\">\n            <a class=\"nav-item-profile\" uib-dropdown-toggle>\n              <span class=\"profile-thumb\"></span>\n              <i class=\"zmdi zmdi-caret-down\"></i>\n            </a>\n            <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n              <li role=\"menuitem\"><a href=\"#\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Action</a></li>\n              <li role=\"menuitem\"><a href=\"#\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Another action</a></li>\n              <li role=\"menuitem\"><a href=\"#\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Something else here</a></li>\n              <li class=\"divider\"></li>\n              <li role=\"menuitem\"><a href=\"#\"><i class=\"zmdi zmdi-hc-fw zmdi-star\"></i>Separated link</a></li>\n            </ul>\n          </li>\n        </ul>\n      </div>\n    </nav>\n  </div>\n  <div class=\"panel-footer\" hljs>\n.msm-navbar {} /* Apply mindsmash style and colors to classic boostrap navbar */\n.msm-navbar-flex {} /* Applied to the direct child of .navbar for flex organization */\n  </div>\n</div>\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Default Navbar</h1>\n  </div>\n  <div class=\"panel-body\">\n    <p>For navbar use the default navbar classes from Bootstrap. These are additional classes for mindsmash-ui:</p>\n\n    <nav class=\"navbar msm-navbar\">\n      <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n          <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n          </button>\n          <a class=\"navbar-brand\" href=\"#\">Brand</a>\n        </div>\n\n        <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n          <ul class=\"nav navbar-nav\">\n            <li class=\"active\"><a href=\"#\">Link <span class=\"sr-only\">(current)</span></a></li>\n            <li><a href=\"#\">Link</a></li>\n            <li uib-dropdown is-open=\"status2.isopen\">\n              <a href=\"#\" uib-dropdown-toggle>Dropdown <span class=\"caret\"></span></a>\n              <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n                <li role=\"menuitem\"><a href=\"#\">Action</a></li>\n                <li role=\"menuitem\"><a href=\"#\">Another action</a></li>\n                <li role=\"menuitem\"><a href=\"#\">Something else here</a></li>\n                <li class=\"divider\"></li>\n                <li role=\"menuitem\"><a href=\"#\">Separated link</a></li>\n                <li class=\"divider\"></li>\n                <li role=\"menuitem\"><a href=\"#\">One more separated link</a></li>\n              </ul>\n            </li>\n          </ul>\n          <form class=\"navbar-form navbar-left\" role=\"search\">\n            <div class=\"form-group\">\n              <input type=\"text\" class=\"form-control\" placeholder=\"Search\">\n            </div>\n          </form>\n          <ul class=\"nav navbar-nav navbar-right\">\n            <li><a href=\"#\">Link</a></li>\n            <li uib-dropdown is-open=\"status3.isopen\">\n              <a href=\"#\" uib-dropdown-toggle>Dropdown <span class=\"caret\"></span></a>\n              <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n                <li role=\"menuitem\"><a href=\"#\">Action</a></li>\n                <li role=\"menuitem\"><a href=\"#\">Another action</a></li>\n                <li role=\"menuitem\"><a href=\"#\">Something else here</a></li>\n                <li class=\"divider\"></li>\n                <li role=\"menuitem\"><a href=\"#\">Separated link</a></li>\n              </ul>\n            </li>\n          </ul>\n        </div>\n      </div>\n    </nav>\n  </div>\n  <div class=\"panel-footer\" hljs>\n.msm-navbar {} /* Apply mindsmash style and colors to navbar */\n  </div>\n</div>");
$templateCache.put("app/views/navs/navs.html","<div class=\"row\">\n  <div class=\"col-md-8\">\n    <section class=\"panel panel-default\">\n      <div class=\"panel-heading panel-heading-main\">\n        <h1 class=\"panel-title\">Navs</h1>\n      </div>\n      <div class=\"panel-body\">\n\n        <!-- Wizard -->\n        <h3>Wizard</h3>\n        <msm-wizard ng-model=\"sdf\" states=\"vm.states\" active=\"vm.active\" class=\"m-s\"></msm-wizard>\n        <br>\n        <div class=\"well bg-gray\">\n          <msm-wizard ng-model=\"sdf\" states=\"vm.states\" active=\"vm.active\" class=\"m-s inverse\"></msm-wizard>\n        </div>\n\n        <!-- Tabs -->\n        <div class=\"row\">\n          <div class=\"col-lg-6\">\n            <h3>Tabs</h3>\n            <ul class=\"nav nav-tabs\">\n              <li class=\"active\"><a href=\"#home\" data-toggle=\"tab\">Home</a></li>\n              <li class=\"disabled\"><a>Disabled</a></li>\n              <li class=\"dropdown\">\n                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" aria-expanded=\"false\">\n                  Dropdown <span class=\"caret\"></span>\n                </a>\n                <ul class=\"dropdown-menu\">\n                  <li><a href=\"#dropdown1\" data-toggle=\"tab\">Action</a></li>\n                  <li class=\"divider\"></li>\n                  <li><a href=\"#dropdown2\" data-toggle=\"tab\">Another action</a></li>\n                </ul>\n              </li>\n            </ul>\n\n            <h3 class=\"mt-s\">Tabs (justified)</h3>\n            <ul class=\"nav nav-tabs nav-justified\">\n              <li class=\"active\"><a href=\"#home\" data-toggle=\"tab\">Home</a></li>\n              <li class=\"disabled\"><a>Disabled with long text may overflow</a></li>\n              <li class=\"dropdown\">\n                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" aria-expanded=\"false\">\n                  Dropdown <span class=\"caret\"></span>\n                </a>\n                <ul class=\"dropdown-menu\">\n                  <li><a href=\"#dropdown1\" data-toggle=\"tab\">Action</a></li>\n                  <li class=\"divider\"></li>\n                  <li><a href=\"#dropdown2\" data-toggle=\"tab\">Another action</a></li>\n                </ul>\n              </li>\n            </ul>\n          </div>\n\n          <!-- Pills -->\n          <div class=\"col-lg-6\">\n            <h3>Pills</h3>\n            <ul class=\"nav nav-pills\">\n              <li class=\"active\"><a href=\"#\">Home</a></li>\n              <li><a href=\"#\">Profile</a></li>\n              <li class=\"disabled\"><a href=\"#\">Disabled</a></li>\n              <li class=\"dropdown\">\n                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">\n                  Dropdown <span class=\"caret\"></span>\n                </a>\n                <ul class=\"dropdown-menu\">\n                  <li><a href=\"#\">Action</a></li>\n                  <li><a href=\"#\">Another action</a></li>\n                  <li><a href=\"#\">Something else here</a></li>\n                  <li class=\"divider\"></li>\n                  <li><a href=\"#\">Separated link</a></li>\n                </ul>\n              </li>\n            </ul>\n            <br>\n            <ul class=\"nav nav-pills nav-stacked\">\n              <li class=\"active\"><a href=\"#\">Home</a></li>\n              <li><a href=\"#\">Profile</a></li>\n              <li class=\"disabled\"><a href=\"#\">Disabled</a></li>\n              <li class=\"dropdown\">\n                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" aria-expanded=\"false\">\n                  Dropdown <span class=\"caret\"></span>\n                </a>\n                <ul class=\"dropdown-menu\">\n                  <li><a href=\"#\">Action</a></li>\n                  <li><a href=\"#\">Another action</a></li>\n                  <li><a href=\"#\">Something else here</a></li>\n                  <li class=\"divider\"></li>\n                  <li><a href=\"#\">Separated link</a></li>\n                </ul>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n\n  <div class=\"col-md-4\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-body\">\n        <div class=\"text-muted text-uppercase\">Nav in panel</div>\n      </div>\n      <ul class=\"nav nav-default pb-s\">\n        <li class=\"active\"><a href=\"#\"><i class=\"zmdi zmdi-globe\"></i> Home</a></li>\n        <li><a href=\"#\"><i class=\"zmdi zmdi-account\"></i> Profile</a></li>\n        <li><a href=\"#\"><i class=\"zmdi zmdi-search\"></i> Search <span class=\"badge badge-default pull-right\">3</span></a></li>\n        <li class=\"divider\"></li>\n        <li><a href=\"#\"><i class=\"zmdi zmdi-settings\"></i> Account</a></li>\n        <li class=\"disabled\"><a href=\"#\"><i class=\"zmdi zmdi-globe\"></i> Disabled</a></li>\n      </ul>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/notifications/notifications.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Notifications</h1>\n  </div>\n  <div class=\"panel-body\">\n    <div>\n      <button class=\"btn btn-primary mr-s\" ng-click=\"vm.primary()\">Primary</button>\n      <button class=\"btn btn-danger mr-s\" ng-click=\"vm.error()\">Error</button>\n      <button class=\"btn btn-success mr-s\" ng-click=\"vm.success()\">Success</button>\n      <button class=\"btn btn-info mr-s\" ng-click=\"vm.info()\">Info</button>\n      <button class=\"btn btn-warning mr-s\" ng-click=\"vm.warning()\">Warning</button>\n      <button class=\"btn btn-default mr-s\" ng-click=\"vm.clearAll()\">Clear all</button>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/pagination/pagination.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Pagination</h1>\n  </div>\n  <div class=\"panel-body\">\n\n    <div class=\"row\">\n\n      <!-- Pagination -->\n      <div class=\"col-lg-6\">\n        <h3>Pagination</h3>\n        <ul class=\"pagination\">\n          <li class=\"disabled\"><a href=\"#\">«</a></li>\n          <li class=\"active\"><a href=\"#\">1</a></li>\n          <li><a href=\"#\">2</a></li>\n          <li><a href=\"#\">3</a></li>\n          <li><a href=\"#\">4</a></li>\n          <li><a href=\"#\">5</a></li>\n          <li><a href=\"#\">»</a></li>\n        </ul>\n        <br>\n        <ul class=\"pagination pagination-lg\">\n          <li class=\"disabled\"><a href=\"#\">«</a></li>\n          <li class=\"active\"><a href=\"#\">1</a></li>\n          <li><a href=\"#\">2</a></li>\n          <li><a href=\"#\">3</a></li>\n          <li><a href=\"#\">»</a></li>\n        </ul>\n        <br>\n        <ul class=\"pagination pagination-sm\">\n          <li class=\"disabled\"><a href=\"#\">«</a></li>\n          <li class=\"active\"><a href=\"#\">1</a></li>\n          <li><a href=\"#\">2</a></li>\n          <li><a href=\"#\">3</a></li>\n          <li><a href=\"#\">4</a></li>\n          <li><a href=\"#\">5</a></li>\n          <li><a href=\"#\">»</a></li>\n        </ul>\n      </div>\n\n      <!-- Pager -->\n      <div class=\"col-lg-6\">\n        <h2 id=\"pager\">Pager</h2>\n        <ul class=\"pager\">\n          <li><a href=\"#\">Previous</a></li>\n          <li><a href=\"#\">Next</a></li>\n        </ul>\n        <hr>\n        <ul class=\"pager\">\n          <li class=\"previous disabled\"><a href=\"#\">← Older</a></li>\n          <li class=\"next\"><a href=\"#\">Newer →</a></li>\n        </ul>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/panels/panels.html","<h3>Large Panels</h3>\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <button class=\"btn btn-primary pull-right\"><i class=\"zmdi zmdi-star\"></i> Action</button>\n    <h3 class=\"panel-title\"><i class=\"zmdi zmdi-plus-circle-o\"></i> Panel title <small>Subtitle</small></h3>\n  </div>\n  <div class=\"panel-body\">\n    Panel content\n  </div>\n  <div class=\"panel-footer panel-actions\">\n    <button type=\"button\" class=\"btn btn-primary\"><i class=\"zmdi zmdi-check\"></i> Save</button>\n    <button type=\"button\" class=\"btn btn-default\"><i class=\"zmdi zmdi-close\"></i> Cancel</button>\n  </div>\n</div>\n\n<h3>Medium Panels</h3>\n<div class=\"row\">\n  <div class=\"col-md-6\">\n    <div class=\"panel panel-sm panel-default\">\n      <div class=\"panel-heading\">\n        <button class=\"btn btn-sm btn-primary pull-right\"><i class=\"zmdi zmdi-star\"></i> Action</button>\n        <h3 class=\"panel-title\">Panel title</h3>\n      </div>\n      <div class=\"panel-body\">\n        Panel content\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-6\">\n    <div class=\"panel panel-sm panel-default\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Panel title</h3>\n      </div>\n      <div class=\"panel-body\">\n        Panel content\n      </div>\n    </div>\n  </div>\n</div>\n\n<h3>Small Panels</h3>\n<div class=\"row\">\n  <div class=\"col-md-4\">\n    <div class=\"panel panel-xs panel-default\">\n      <div class=\"panel-heading\">\n        <button class=\"btn btn-xs btn-primary pull-right\"><i class=\"zmdi zmdi-star\"></i> Action</button>\n        <h3 class=\"panel-title\">Panel title</h3>\n      </div>\n      <div class=\"panel-body\">\n        Panel content\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-4\">\n    <div class=\"panel panel-xs panel-default\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\"><i class=\"zmdi zmdi-plus-circle\"></i> Panel title</h3>\n      </div>\n      <div class=\"panel-body\">\n        Panel content\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-4\">\n    <div class=\"panel panel-xs panel-default\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Panel title <small>Subtitle</small></h3>\n      </div>\n      <div class=\"panel-body\">\n        Panel content\n      </div>\n    </div>\n  </div>\n</div>\n\n<h3>Image Panels</h3>\n<div class=\"row\">\n  <div class=\"col-xs-6\">\n    <div class=\"panel panel-default\">\n      <img class=\"panel-heading-image\" data-src=\"holder.js/100px200/?text=Image&theme=sky\" alt=\"\">\n      <div class=\"panel-body\">\n        Panel content\n      </div>\n    </div>\n  </div>\n  <div class=\"col-xs-6\">\n    <div class=\"panel panel-default\">\n      <img class=\"panel-heading-image\" data-src=\"holder.js/100px200/?text=Image&theme=sky\" alt=\"\">\n      <div class=\"panel-body\">\n        <span class=\"panel-title-small blue-light\">Company News</span>\n        <h3 class=\"panel-title-small\">Welcome to our new office</h3>\n        <span class=\"text-muted\">Blog article &bull; 3 hours ago by Jan Marquardt</span>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/spinner/spinner.html","<div class=\"panel panel-default\" data-ng-init=\"exampleValue=\'look at this\'\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Spinner directive</h1>\n  </div>\n  <div class=\"panel-body text-center\">\n    <msm-spinner size=\"large\"></msm-spinner>\n    <msm-spinner></msm-spinner>\n    <msm-spinner size=\"small\"></msm-spinner>\n  </div>\n</div>");
$templateCache.put("app/views/tables/tables.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Tables</h1>\n  </div>\n  <div class=\"panel-body\">\n    <h3>Basic example</h3>\n    <form class=\"form-inline mb-xxs\">\n      <div class=\"form-group mr-xs\">\n        <label><input type=\"checkbox\" ng-model=\"vm.model.isStriped\"> <code>.table-striped</code>: {{vm.model.isStriped ? \"Yes\" : \"No\"}}</label>\n      </div>\n      <div class=\"form-group mr-xs\">\n        <label><input type=\"checkbox\" ng-model=\"vm.model.isBordered\"> <code>.table-bordered</code>: {{vm.model.isBordered ? \"Yes\" : \"No\"}}</label>\n      </div>\n      <div class=\"form-group mr-xs\">\n        <label><input type=\"checkbox\" ng-model=\"vm.model.isHover\"> <code>.table-hover</code>: {{vm.model.isHover ? \"Yes\" : \"No\"}}</label>\n      </div>\n      <div class=\"form-group\">\n        <label><input type=\"checkbox\" ng-model=\"vm.model.isCondensed\"> <code>.table-condensed</code>: {{vm.model.isCondensed ? \"Yes\" : \"No\"}}</label>\n      </div>\n    </form>\n    <div class=\"example panel panel-default\">\n      <div class=\"panel-body\" style=\"overflow: hidden\">\n        <table class=\"table m-0\" ng-class=\"{\'table-striped\': vm.model.isStriped, \'table-bordered\': vm.model.isBordered, \'table-hover\': vm.model.isHover, \'table-condensed\': vm.model.isCondensed}\">\n          <thead>\n          <tr>\n            <th>#</th>\n            <th>First Name</th>\n            <th>Last Name</th>\n            <th>Username</th>\n          </tr>\n          </thead>\n          <tbody>\n          <tr>\n            <th scope=\"row\">1</th>\n            <td>Mark</td>\n            <td>Otto</td>\n            <td>@mdo</td>\n          </tr>\n          <tr>\n            <th scope=\"row\">2</th>\n            <td>Jacob</td>\n            <td>Thornton</td>\n            <td>@fat</td>\n          </tr>\n          <tr>\n            <th scope=\"row\">3</th>\n            <td>Larry</td>\n            <td>the Bird</td>\n            <td>@twitter</td>\n          </tr>\n          </tbody>\n        </table>\n      </div>\n      <div class=\"panel-footer\" hljs>\n<table class=\"table\">\n  <!-- Use Bootstrap\'s table classes for further styling options: -->\n  <!-- .table-striped -->\n  <!-- .table-bordered -->\n  <!-- .table-hover -->\n  <!-- .table-condensed -->\n</table>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/type/type.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main\">\n    <h1 class=\"panel-title\">Typography</h1>\n  </div>\n  <div class=\"panel-body\">\n    <!-- Headings -->\n    <div class=\"row\">\n      <div class=\"col-lg-4\">\n        <h1>Heading 1</h1>\n        <h2>Heading 2</h2>\n        <h3>Heading 3</h3>\n        <h4>Heading 4</h4>\n        <h5>Heading 5</h5>\n        <h6>Heading 6</h6>\n      </div>\n      <div class=\"col-lg-4\">\n        <h2>Example body text</h2>\n        <p>Nullam quis risus eget <a href=\"#\">urna mollis ornare</a> vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>\n        <p><small>This line of text is meant to be treated as fine print.</small></p>\n        <p>The following snippet of text is <strong>rendered as bold text</strong>.</p>\n        <p>The following snippet of text is <em>rendered as italicized text</em>.</p>\n        <p>An abbreviation of the word attribute is <abbr title=\"attribute\">attr</abbr>.</p>\n      </div>\n      <div class=\"col-lg-4\">\n        <h2>Emphasis classes</h2>\n        <p class=\"text-muted\">Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh.</p>\n        <p class=\"text-primary\">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>\n        <p class=\"text-warning\">Etiam porta sem malesuada magna mollis euismod.</p>\n        <p class=\"text-danger\">Donec ullamcorper nulla non metus auctor fringilla.</p>\n        <p class=\"text-success\">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>\n        <p class=\"text-info\">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>\n      </div>\n    </div>\n\n    <hr>\n\n    <!-- Blockquotes -->\n    <div class=\"row\">\n      <div class=\"col-lg-12\">\n        <h3>Blockquotes</h3>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-6\">\n        <blockquote>\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n          <small>Someone famous in <cite title=\"Source Title\">Source Title</cite></small>\n        </blockquote>\n      </div>\n      <div class=\"col-lg-6\">\n        <blockquote class=\"blockquote-reverse\">\n          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>\n          <small>Someone famous in <cite title=\"Source Title\">Source Title</cite></small>\n        </blockquote>\n      </div>\n    </div>\n\n    <hr>\n\n    <!-- Addresses -->\n    <div class=\"row\">\n      <div class=\"col-lg-12\">\n        <h3>Addresses</h3>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-6\">\n        <address>\n          <strong>Twitter, Inc.</strong><br>\n          1355 Market Street, Suite 900<br>\n          San Francisco, CA 94103<br>\n          <abbr title=\"Phone\">P:</abbr> (123) 456-7890\n        </address>\n      </div>\n      <div class=\"col-lg-6\">\n        <address>\n          <strong>Full Name</strong><br>\n          <a href=\"mailto:#\">first.last@example.com</a>\n        </address>\n      </div>\n    </div>\n\n    <hr>\n\n    <!-- Codes -->\n    <div class=\"row\">\n      <div class=\"col-lg-12\">\n        <h3>Code</h3>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-6\">\n        <p>For example, <code>&lt;section&gt;</code> should be wrapped as inline.</p>\n        <p>To switch directories, type <kbd>cd</kbd> followed by the name of the directory.<br>To edit settings, press <kbd><kbd>ctrl</kbd> + <kbd>,</kbd></kbd></p>\n        <p><var>y</var> = <var>m</var><var>x</var> + <var>b</var></p>\n      </div>\n      <div class=\"col-lg-6\">\n        <pre>&lt;p&gt;Sample text here...&lt;/p&gt;</pre>\n        <samp>This text is meant to be treated as sample output from a computer program.</samp>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"panel panel-default\">\n  <div class=\"panel-heading panel-heading-main panel-dl\">\n    <h1 class=\"panel-title\">Headings</h1>\n  </div>\n  <div class=\"panel-body\">\n    <div class=\"row\">\n      <div class=\"col-xs-6\">\n        <h1>h1 heading <code>h1, .h1</code></h1>\n        <h2>h2 heading <code>h2, .h2</code></h2>\n        <h3>h3 heading <code>h3, .h3</code></h3>\n        <h4>h4 heading <code>h4, .h4</code></h4>\n      </div>\n      <div class=\"col-xs-6\">\n        <h1 class=\"normal text-uppercase gray\">Example</h1>\n        <h1>This is a normal h1 heading <br>that spans over two lines</h1>\n        <h2>This is a normal h2 heading <br>that spans over two lines</h2>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("app/views/welcome/welcome.html","<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h1 class=\"panel-title\">Welcome to the mindsmash-UI kit!</h1>\n  </div>\n  <div class=\"panel-body\">\n    <p><strong>Hey there!</strong></p>\n    <p>Please use the navigation to browse the components and styles.</p>\n    <p>Have fun!</p>\n  </div>\n</div>");}]);