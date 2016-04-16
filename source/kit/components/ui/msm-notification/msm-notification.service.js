(function () {
  'use strict';

  /**
   * A service for raising notifications.
   *
   * This service wraps all methods provided by the angular-ui-notification service and translates the
   * message key if needed.
   *
   * Provided message functions:
   *   * primary  - displays a primary notification
   *   * error    - displays an error notification
   *   * success  - displays a success notification
   *   * info     - displays an info notification
   *   * warning  - displays a warning notification
   *   * clearAll - clears all notifications that are currently displayed
   *
   * Usage:
   * msmNotification.<function>('i18nKey'); // use i18n
   * msmNotification.<function>('i18nKey', true); // use i18n
   * msmNotification.<function>('i18nKey', false); // don't use i18n
   * msmNotification.<function>('i18nKey', { i18nArg: 'someArg' }); // use i18n with i18n options
   * msmNotification.<function>({ message: 'i18nKey', delay: 1000 }); // use 18n with notify options
   * msmNotification.<function>({ message: 'i18nKey', delay: 1000 }, { i18nArg: 'someArg' }); // use 18n with i18n & notify options
   */
  angular
      .module('msm.components.ui')
      .factory('msmNotification', NotificationService);

  function NotificationService($q, $translate, Notification) {
    var doFlash = function (args, i18n, notify) {
      if (typeof args !== 'object') {
        args = {
          message: args
        };
      }

      if (i18n === false) {
        notify(args);
      } else {
        var promises = [];

        if(args.title) {
          promises.push($translate(args.title, i18n === true ? undefined : i18n));
        } else {
          promises.push(null);
        }

        if(args.message) {
          promises.push($translate(args.message, i18n === true ? undefined : i18n));
        } else {
          promises.push(null);
        }

        $q.all(promises).then(function (data) {
          notify(angular.extend(args, {title: data[0], message: data[1]}));
        }, function () {
          notify(args);
        });
      }
    };
    return {
      primary: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.primary(args);
        });
      },
      error: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.error(args);
        });
      },
      success: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.success(args);
        });
      },
      info: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.info(args);
        });
      },
      warning: function (args, i18n) {
        doFlash(args, i18n, function (args) {
          Notification.warning(args);
        });
      },
      clearAll: function () {
        Notification.clearAll();
      }
    };
  }

})();
