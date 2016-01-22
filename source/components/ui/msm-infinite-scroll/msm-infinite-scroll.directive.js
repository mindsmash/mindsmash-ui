(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmInfiniteScroll
   * @restrict 'A'
   *
   * @description Applies endless scrolling. Executed once during initialization and then whenever
   *              user scrolls near the end of the element. Execution on initialization can be turned off
   *              by setting msm-infinite-scroll-no-initial-load. This is "true" by default.
   *
   *              Scroll on div:            <div msm-infinite-scroll="loadMore()">...</div>
   *              Scroll on other element:  <div msm-infinite-scroll="loadMore()" msm-infinite-scroll-element=".selector">...</div>
   *              Scroll on window:         <div msm-infinite-scroll="loadMore()" msm-infinite-scroll-element="$window">...</div>
   *
   *              This directive only takes care of the scrolling event. Loading more data and stopping when the
   *              last page was reached is up to you.
   */
  angular.module('msm.components.ui')
    .directive('msmInfiniteScroll', MsmInfiniteScroll);

  function MsmInfiniteScroll($timeout, $log) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var initialLoad = angular.isUndefined(attrs.msmInfiniteScrollNoInitialLoad);

        // load first page if not turned off (inside correct digest)
        if (initialLoad) {
          $timeout(function () {
            $log.debug('[msmInfiniteScroll] Performing initial load.');
            $scope.$apply(attrs.msmInfiniteScroll);
          });
        }

        // pixels before end, default=200
        var threshold = 200;
        if(attrs.msmInfiniteScrollThreshold) {
          threshold = parseInt(attrs.msmInfiniteScrollThreshold);
        }

        // determine element to watch
        var bindTo, raw;
        if(attrs.msmInfiniteScrollElement) {
          if('$window' === attrs.msmInfiniteScrollElement) {
            bindTo = angular.element(window);
            raw = angular.element('body')[0];
          } else {
            bindTo = angular.element(attrs.msmInfiniteScrollElement);
            raw = bindTo[0];
          }
        } else {
          bindTo = element;
          raw = bindTo[0];
        }

        // watch for scroll events => every 100ms
        var blocked = false;
        bindTo.bind('scroll', function () {
          if (!blocked) {
            blocked = true;

            $timeout(function () {
              if ((raw.scrollTop + raw.offsetHeight + threshold) >= raw.scrollHeight) {
                $scope.$apply(attrs.msmInfiniteScroll);
              }

              blocked = false;
            }, 100);
          }
        });
      }
    };
  }
})();