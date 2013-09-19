'use strict';
// Source: src/angular-ra-flash.js
angular.module('ra.flash', ['ra.flash.directives', 'ra.flash.services']);

// Source: src/directives/flash.js
angular.module('ra.flash.directives', ['ra.flash.services']).

  directive('flash', function($injector, $timeout, Flash) {

    // Make compatible with 1.0.* and 1.2.0
    var delegated = $injector.has && $injector.has('$sceDelegate'),
        template  = '<div class="alert" ng-show="show" ng-class="flash.type">' +
                      '<button ng-show="flash.close" type="button" class="close" data-dismiss="alert">×</button>' +
                      '<span ng-hide="flash.trust_as" ng-bind="flash.message"></span>' +
                      '<span ng-show="flash.trust_as" ng-bind-html-unsafe="flash.message"></span>' +
                    '</div>';

    if (delegated) {
      template = template.replace('ng-bind-html-unsafe', 'ng-bind-html');
    }

    return {
      restrict: 'EA',
      replace:  true,
      scope:    true,
      template: template,

      link: function($scope, element, attrs) {
        $scope.init = function() {
          // Move the service into the scope to watch for changes
          $scope.flash_service = Flash;
          $scope.$watch('flash_service.active', $scope.active);
        };

        $scope.active = function() {
          $scope.flash = $scope.flash_service.active;

          if ($scope.flash) {
            $scope.show = true;

            // Set the correct alert Bootstrap class
            if ($scope.flash.type && $scope.flash.type.indexOf('alert-') !== 0) {
              $scope.flash.type = 'alert-' + $scope.flash.type;
            }

            if ($scope.flash.trust_as) {
              if (delegated) {
                var $sceDelegate = $injector.get('$sceDelegate');
                $scope.flash.message_html = $sceDelegate.trustAs($scope.flash.trust_as, $scope.flash.message);
              } else {
                $scope.flash.message_html = $scope.flash.message;
              }
            }

            // Auto Hide the Flash
            if ($scope.flash.auto_hide) {
              var delay = (angular.isNumber($scope.flash.auto_hide) ? $scope.flash.auto_hide : 10) * 1000;

              $timeout(function() {
                $scope.flash_service.hide();
                $scope.show = false;
              }, delay);
            }
          } else {
            $scope.show = false;
          }
        };

        $scope.init();
      }
    };
  });

// Source: src/services/flash.js
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
