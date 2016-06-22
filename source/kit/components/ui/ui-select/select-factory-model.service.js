(function() {
  'use strict';

  /**
   * @ngdoc factory
   * @name components.ui.selectFactoryModel
   *
   * @param config configuration options:
   *        - refresh: (required) function to be called to retrieve (paged) data. Must return array of items with additional 'meta' property for paging information.
   *        - sublines: (optional) array of property names to display as sublines
   *        - transform: (optional) function to be called for each item (if not the entire item should be stored in ng-model)
   *        - emptyText: (optional) a i18n key to be translated and shown if no choices could be found
   *        - minSelectableItems: (optional) threshold of items required in the list (options minus selected items) before the next page is automatically fetched
   *        - pageSize: (optional) number of results per page (defaults to 100)
   *        - mobile: (optional): if true will replace ui-select with list + modal on small screens (xs)
   *        - mobileIcon: (optional): (zdmi) icon class to prepend to each list item in mobile view
   *        - mobileAddText: (optional): translation key of text to use in add button in mobile view
   *        - mobileModalTitle: (optional): tranlation key of title text for the modal in mobile view
   *
   * @description
   *     Factory to create a ui-select directive.
   */
  angular.module('msm.components.ui')

    .factory('selectFactoryModel', function($timeout, msmModal, $q) {
      return function(config) {
        return {
          restrict: 'E',
          require : 'ngModel',
          scope: {
            autoFill: '=?',
            placeholder: '@?',
            parameters: '<?'
          },
          templateUrl: 'components/ui/ui-select/select-factory-model' + (config.multiple ? '.multiple' : '') + '.html',
          link: function(scope, elem, attrs, ctrl) {
            var isLast = false;
            var isLoading = false;
            var pageSize = config.pageSize || 100;
            var pageable = { page: 0, size: pageSize };

            scope.sublines = config.sublines || [];
            scope.isString = angular.isString;
            scope.transform = config.transform || angular.identity;
            scope.emptyText = config.emptyText;
            scope.mobile = config.mobile || false;
            scope.mobileIcon = config.mobileIcon;
            scope.mobileAddText = config.mobileAddText;
            scope.options = [];
            scope.data = {};

            scope.refresh = selectRefresh;
            scope.onSelectCallback = onSelectCallback;
            scope.addItem = addItem;
            scope.removeItem = removeItem;

            ctrl.$render = function() {
              scope.data.ngModel = ctrl.$viewValue;
            };
            scope.$watch('data.ngModel', function(newVal, oldVal) {
              ctrl.$setViewValue(newVal || null);
            });
            attrs.$observe('disabled', function() {
              scope.isDisabled = angular.isDefined(attrs.disabled) ? attrs.disabled : false;
            });
            attrs.$observe('required', function() {
              scope.isRequired = angular.isDefined(attrs.required) ? attrs.required : false;
            });

            function selectRefresh(search, reset) {
              doRefresh(search, reset).then(function(response) {
                afterRefresh(response);

                // replace list items with pre-set model values
                // workaround for https://github.com/angular-ui/ui-select/issues/404
                function findModelValueById(id) {
                  return _.find(scope.data.ngModel, function (value) {
                    return value.id === id;
                  });
                }
                for (var i = 0; i < response.length; i++) {
                  if (scope.data.ngModel) {
                    var modelValue = findModelValueById(response[i].id);
                    if (modelValue) {
                      response[i] = modelValue;
                    }
                  }
                }

                scope.options = reset ? response : scope.options.concat(response);
                if (scope.autoFill && !scope.data.ngModel && scope.options.length) {
                  $timeout(function() {
                    scope.data.ngModel = scope.transform(scope.options[0]);
                  });
                }
              });
            }

            function doRefresh(search, reset) {
              if (reset) {
                pageable = { page: 0, size: pageSize };
              } else if (isLoading || isLast) {
                return $q.reject();
              }

              isLoading = true;
              return config.refresh(pageable, search, scope.parameters);
            }

            function afterRefresh(response) {
              isLast = response.meta.last;
              isLoading = false;
              pageable.page = response.meta.number + 1;
            }

            function onSelectCallback() {
              if (config.minSelectableItems &&
                  scope.options.length - scope.data.ngModel.length <= config.minSelectableItems) {
                scope.refresh(undefined, false);
              }
            }

            function addItem() {
              function nextPageForModal(reset) {
                return doRefresh(undefined, reset).then(function (response) {
                  afterRefresh(response);
                  return _.filter(response, function (item) {
                    return !_.find(scope.data.ngModel, function (modelItem) {
                      return modelItem.id === item.id;
                    });
                  }).map(function (item) {
                    return {
                      key: item,
                      value: item.displayName
                    };
                  });
                });
              }

              scope.modalLoading = true;
              msmModal.select({
                title: config.mobileModalTitle,
                close: {title: 'CLOSE'},
                dismiss: {title: 'CANCEL'},
                nextPage: nextPageForModal,
                options: {
                  values: function () {
                    return nextPageForModal(true);
                  }
                },
                onOpened: function () {
                  scope.modalLoading = false;
                }
              }).result.then(function (selection) {
                if (!scope.data.ngModel) {
                  scope.data.ngModel = [];
                }
                scope.data.ngModel.push(selection);
              });
            }

            function removeItem(item) {
              scope.data.ngModel.splice(scope.data.ngModel.indexOf(item), 1);
            }
          }
        };
      };
    });

})();
