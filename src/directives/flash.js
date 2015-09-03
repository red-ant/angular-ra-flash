angular.module('ra.flash.directives', ['ra.flash.services']).
  directive('flash', function($timeout, $interpolate, Flash) {
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
  });
