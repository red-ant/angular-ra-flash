angular.module('ra.flash.services', []).
  run(function($rootScope, Flash) {
    $rootScope.$on('$routeChangeSuccess', function() {
      Flash.showOnNextPage();
    });
  }).

  factory('Flash', function() {
    var service = {},
        types = [
          'generic',
          'success',
          'info',
          'warning',
          'danger',
          'error'
        ];

    var default_flash = {
      close:     true,
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

        flash.nextPage = function() {
          service.show(this, { next_page: true });
        };

        return angular.extend({}, default_flash, flash, options);
      };
    }

    angular.forEach(types, function(type) {
      service[type] = flashMessage(type);
    });

    service.show = function(flash, options) {
      flash = angular.extend({}, flash, options);

      if (flash.next_page === true) {
        this.next_page = flash;
      } else {
        this.active = flash;
      }
    };

    service.hide = function() {
      this.active = null;
    };

    service.showOnNextPage = function() {
      if (this.next_page) {
        this.active = this.next_page;
        this.active.next_page = false;
        this.next_page = false;
      } else {
        this.hide();
      }
    };

    return service;
  });
