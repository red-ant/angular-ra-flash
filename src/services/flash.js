'use strict';

angular.module('ra.flash.services', []).

  run(function($rootScope, Flash) {
    $rootScope.$on('$routeChangeSuccess', function() {
      Flash.showOnNextPage();
    });
  }).

  factory('Flash', function() {
    var service = {},
        active  = null,
        types   = [
          'generic',
          'success',
          'info',
          'warning',
          'danger',
          'error'
        ];

    var default_flash = {
      close:     true,
      trust_as:  false,
      auto_hide: false,
      next_page: false
    };

    function flashMessage(type) {
      return function(message, options) {
        if (type === 'error') {
          type = 'danger';
        }

        var flash = {
          type:    type,
          message: message
        };

        flash.show = function() {
          service.show(this);
        };

        flash.hide = function() {
          service.hide();
        };

        return angular.extend({}, default_flash, flash, options);
      };
    }

    angular.forEach(types, function(type) {
      service[type] = flashMessage(type);
    });

    service.show = function(flash) {
      this.active = angular.extend({}, flash);
    };

    service.hide = function() {
      this.active = null;
    };

    service.showOnNextPage = function() {
      if (this.active && this.active.next_page === true) {
        this.active.next_page = false;
      } else {
        service.hide();
      }
    };

    return service;
  });
