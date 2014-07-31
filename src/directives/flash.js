'use strict';

angular.module('ra.flash.directives', ['ra.flash.services']).

  directive('flash', function($injector, $timeout, $interpolate, Flash) {

    // Make compatible with 1.0.* and 1.2.0
    var delegated = $injector.has && $injector.has('$sceDelegate');

    var bind_directive = 'ng-bind-html-unsafe',
        show_directive = 'ng-show';

    if (delegated) {
      bind_directive = 'ng-bind-html';
      show_directive = 'ng-if';
    }

    var template  = '<div class="alert" ng-show="show" ng-class="flash.classes">' +
                      '<button ng-show="flash.close" type="button" class="close" ng-click="show = false">×</button>' +
                      '<span '+ show_directive +'="!flash.trust_as" ng-bind="flash.message"></span>' +
                      '<span '+ show_directive +'="flash.trust_as" '+ bind_directive +'="flash.message_html"></span>' +
                    '</div>';

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

            if (angular.isString($scope.flash.message)) {
              $scope.flash.message = $interpolate($scope.flash.message)($scope);
            }

            if ($scope.flash.trust_as === 'html') {
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

            var classes = [$scope.flash.type];

            // Add dismissable class for closable alerts
            if ($scope.flash.close) {
              classes.push('alert-dismissable');
            }

            $scope.flash.classes = classes.join(' ');
          } else {
            $scope.show = false;
          }
        };

        $scope.init();
      }
    };
  });
