/*!
 * angular-ra-flash.js v0.1.0
 * https://github.com/red-ant/angular-ra-flash
 */

(function() {
'use strict';

angular.module('ra.flash', [
  'ra.flash.directives',
  'ra.flash.services'
]);

angular.module('ra.flash.directives', ['ra.flash.services']).
  directive('flash', ['$timeout', '$interpolate', 'Flash', function($timeout, $interpolate, Flash) {
    var Controller = function() {
      this.show    = false;
      this.data    = {};
      this.classes = '';
    };

    Controller.prototype.init = function(data) {
      this.data = data;

      // Set the alert classes
      this.setClasses();

      // Auto dide the alert
      if (data.auto_hide) {
        this.delay();
      }

      this.show = true;
    };

    Controller.prototype.setClasses = function() {
      var classes = [];

      // Set the correct alert class
      if (this.data.type && this.data.type.indexOf('alert-') !== 0) {
        this.data.type = 'alert-' + this.data.type;
      }

      classes.push(this.data.type);

      // Add dismissable class for alerts that close
      if (this.data.close) {
        classes.push('alert-dismissable');
      }

      this.classes = classes.join(' ');
    };

    Controller.prototype.delay = function() {
      var delay     = 10,
          auto_hide = parseInt(this.data.auto_hide, 10),
          self      = this;

      if (isNaN(auto_hide) === false) {
        delay = auto_hide;
      }

      $timeout(function() {
        Flash.hide();
        self.show = false;
      }, delay * 1000);
    };

    return {
      restrict:     'EA',
      replace:      true,
      scope:        true,
      controllerAs: 'flash',
      controller:   Controller,

      template: '<div class="alert" ng-show="flash.show" ng-class="flash.classes">' +
                '  <button ng-show="flash.data.close" type="button" class="close" ng-click="flash.show = false">×</button>' +
                '  <span ng-bind-html="flash.data.message"></span>' +
                '</div>',

      link: function(scope) {
        scope.service = Flash;

        scope.$watch('service.active', function(active) {
          if (active && active.message) {
            if (angular.isString(active.message)) {
              active.message = $interpolate(active.message)(scope);
            }

            scope.flash.init(active);
          }
        });
      }
    };
  }]);

angular.module('ra.flash.services', []).
  run(['$rootScope', 'Flash', function($rootScope, Flash) {
    $rootScope.$on('$routeChangeSuccess', function() {
      Flash.showOnNextPage();
    });
  }]).

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
}());