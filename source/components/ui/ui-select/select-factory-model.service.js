(function() {
  'use strict';

  /**
   * @ngdoc factory
   * @name components.ui.selectFactoryModel
   *
   * @param config configuration options:
   *        - refresh: (required) function to be called to retrieve (paged) data. Must return array of items with additional 'meta' property for paging information.
   *        - transform: (optional) function to be called for each item (if not the entire item should be stored in ng-model)
   *        - sublines: (optional) array of property names to display as sublines
   *        - minSelectableItems: (optional) threshold of items required in the list (options minus selected items) before the next page is automatically fetched
   *
   * @description
   *     Factory to create a ui-select directive.
   */
  angular.module('msm.components.ui')

    .factory('selectFactoryModel', function($timeout) {
      return function(config) {
        return {
          restrict: 'E',
          require : 'ngModel',
          scope: {
            autoFill: '=?',
            placeholder: '@?'
          },
          templateUrl: 'components/ui/ui-select/select-factory-model' + (config.multiple ? '.multiple' : '') + '.html',
          link: function(scope, elem, attrs, ctrl) {
            attrs.$observe('disabled', function() {
              scope.isDisabled = angular.isDefined(attrs.disabled) ? attrs.disabled : false;
            });
            attrs.$observe('required', function() {
              scope.isRequired = angular.isDefined(attrs.required) ? attrs.required : false;
            });

            var isLast = false;
            var isLoading = false;
            var pageable = { page: 0, size: 100 };

            scope.sublines = config.sublines || [];
            scope.isString = angular.isString;
            scope.transform = config.transform || angular.identity;

            scope.options = [];
            scope.refresh = function(search, reset) {
              if (reset) {
                pageable = { page: 0, size: 100 };
              } else if (isLoading || isLast) {
                return;
              }

              isLoading = true;
              config.refresh(pageable, search).then(function(response) {

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

                isLast = response.meta.last;
                isLoading = false;
                pageable = { page: response.meta.number + 1, size: 3 };
                scope.options = reset ? response : scope.options.concat(response);
                if (scope.autoFill && !scope.data.ngModel && scope.options.length) {
                  $timeout(function() {
                    scope.data.ngModel = scope.transform(scope.options[0]);
                  });
                }
              });
            };

            scope.onSelectCallback = function () {
              console.log(arguments);
              if (config.minSelectableItems &&
                  scope.options.length - scope.data.ngModel.length <= config.minSelectableItems) {
                scope.refresh(undefined, false);
              }
            };

            scope.data = {};
            ctrl.$render = function() {
              scope.data.ngModel = ctrl.$viewValue;
            };
            scope.$watch('data.ngModel', function(newVal, oldVal) {
              ctrl.$setViewValue(newVal || null);
            });
          }
        };
      };
    });

})();
