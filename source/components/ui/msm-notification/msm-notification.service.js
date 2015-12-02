(function() {
    'use strict';

    /**
     * A service for showing i18n flash notifications. The service wraps all methods provided
     * by the angular-ui-notification service and interprets the flash message as an i18n
     * key if necessary.
     *
     * Usage:
     * msmNotification.success('i18nKey'); // use i18n
     * msmNotification.success('i18nKey', true); // use i18n
     * msmNotification.success('i18nKey', false); // don't use i18n
     * msmNotification.success('i18nKey', { i18nArg: 'someArg' }); // use i18n with i18n options
     * msmNotification.success({ message: 'i18nKey', delay: 1000 }); // use 18n with notify options
     * msmNotification.success({ message: 'i18nKey', delay: 1000 }, { i18nArg: 'someArg' }); // use 18n with i18n & notify options
     */
    angular
        .module('msm.components.ui')
        .factory('msmNotification', NotificationService);

    function NotificationService($translate, Notification) {
        var doFlash = function(args, i18n, notify) {
            if (typeof args !== 'object') {
                args = {
                    message : args
                };
            }

            if (i18n === false) {
                notify(args);
            } else {
                $translate(args.message, i18n === true ? undefined : i18n).then(function(msg) {
                    notify(angular.extend(args, { message: msg }));
                }, function(msg) {
                    notify(angular.extend(args, { message: msg }));
                });
            }
        };
        return {
            primary : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.primary(args);
                });
            },
            error : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.error(args);
                });
            },
            success : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.success(args);
                });
            },
            info : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.info(args);
                });
            },
            warning : function(args, i18n) {
                doFlash(args, i18n, function(args) {
                    Notification.warning(args);
                });
            },
            clearAll : function() {
                Notification.clearAll();
            }
        };
    }

})();
