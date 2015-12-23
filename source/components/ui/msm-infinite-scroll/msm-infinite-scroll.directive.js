(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmInfiniteScroll
   * @restrict 'A'
   *
   * @description Applies endless scrolling. Executed once during initialization and then whenever
   *              user scrolls near the end of the element.
   *
   *              Usage: <div msm-infinite-scroll="loadMore()">...</div>
   *
   *              This directive only takes care of the scrolling event. Loading more data and stopping when the
   *              last page was reached is up to you.
   */
  angular.module('msm.components.ui')
    .directive('msmInfiniteScroll', MsmInfiniteScroll);

  function MsmInfiniteScroll($timeout) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        // load first page (inside correct digest)
        $timeout(function () {
          $scope.$apply(attrs.msmInfiniteScroll);
        });

        // pixels before end, default=200
        var threshold = 200;
        if(attrs.msmInfiniteScrollThreshold) {
          threshold = parseInt(attrs.msmInfiniteScrollThreshold);
        }

        // watch for scroll events => every 100ms
        var raw = element[0];
        var blocked = false;
        element.bind('scroll', function () {
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
