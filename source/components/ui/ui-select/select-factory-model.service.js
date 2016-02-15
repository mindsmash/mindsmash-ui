(function() {
  'use strict';

  angular.module('akee.commons')

    .factory('selectFactoryModel', function($timeout) {
      return function(model, sublines, refresh, transform, multiple) {
        return {
          restrict: 'E',
          require : 'ngModel',
          scope: {
            autoFill: '=?',
            placeholder: '@?'
          },
          templateUrl: 'components/ui-select/select-factory-model' + (multiple ? '.multiple' : '') + '.html',
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

            scope.sublines = sublines;
            scope.isString = angular.isString;
            scope.transform = transform || angular.identity;

            scope.options = [];
            scope.refresh = function(search, reset) {
              if (reset) {
                pageable = { page: 0, size: 100 };
              } else if (isLoading || isLast) {
                return;
              }

              isLoading = true;
              refresh(pageable, search).then(function(response) {
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
