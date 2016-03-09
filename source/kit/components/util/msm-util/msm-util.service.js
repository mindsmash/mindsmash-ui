(function () {
  'use strict';

  angular
      .module('msm.components.util')
      .factory('msmUtil', Util);

  function Util() {
    return {
      /**
       * @ngdoc method
       * @name msm.components.util.Util#hash
       * @methodOf msm.components.util.Util
       *
       * @description
       *     A simple string hashing function using the {@link http://www.cse.yorku.ca/~oz/hash.html djb2}.
       * @param {string} str
       *     The input string.
       * @returns {number}
       *     The absolute numeric hash of the input string.
       */
      hash: function (str) {
        if(!str) {
          return -1;
        }

        var h = 5381;
        for (var i = 0; i < str.length; i++) {
          h = ((h << 5) + h) + str.charCodeAt(i);
        }
        return Math.abs(h);
      },

      /**
       * @ngdoc method
       * @name msm.components.util.Util#uuid
       * @methodOf msm.components.util.Util
       *
       * @description
       *     Generates a new UUID.
       * @returns {string}
       *     A UUID string, e.g. *4f87322d-f337-996f-8a9b-1ad08b82853c*.
       */
      uuid: function () {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
    };
  }
})();
