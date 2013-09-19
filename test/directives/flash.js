describe('Module: ra.flash.directives >', function() {
  var Flash,
      default_html = '<div flash></div>',
      element,
      root_scope,
      scope;

  beforeEach(function() {
    module('ra.flash.directives');

    inject(function($injector) {
      Flash      = $injector.get('Flash');
      root_scope = $injector.get('$rootScope').$new();
    });
  });


  describe('Directive: flash >', function() {
    function compileDirective(html) {
      inject(function($compile) {
        element = $compile(default_html || html)(root_scope);

        scope = element.scope();
      });
    }

    beforeEach(function() {
      compileDirective();
    });

    it('should set flash_service to Flash', function() {
      expect(scope.flash_service).toEqual(Flash);
    });

    it('should call scope.$watch on flash_service.active', function() {
      scope.$watch = jasmine.createSpy();
      scope.init();

      expect(scope.$watch).toHaveBeenCalledWith('flash_service.active', scope.active);
    });

    it('should call scope.active when the service is set to active', function() {
      scope.active = jasmine.createSpy();
      scope.init();

      Flash.active = { };
      scope.$digest();

      expect(scope.active).toHaveBeenCalled();
    });

    it('should set flash as flash_service.active', function() {
      scope.flash_service.active = { type: 'success', message: 'some message' };
      scope.active();

      expect(scope.flash).toEqual(scope.flash_service.active);
    });

    it('should set show to true if there is a flash', function() {
      scope.flash_service.active = { type: 'success', message: 'some message' };
      scope.active();

      expect(scope.show).toBe(true);
    });

    it('should set show to false if there is no flash', function() {
      scope.active();

      expect(scope.show).toBe(false);
    });

    it('should prepend alert- to the flash type if it does not exist', function() {
      scope.flash_service.active = { type: 'success' };
      scope.active();

      expect(scope.flash.type).toBe('alert-success');
    });

    it('should not prepend alert- to the flash type if it already contains it', function() {
      scope.flash_service.active = { type: 'alert-success' };
      scope.active();

      expect(scope.flash.type).toBe('alert-success');
    });

    it('should set a $timeout to 10 seconds if auto_hide is set', inject(function($timeout) {
      scope.flash_service.active = { type: 'success', auto_hide: true };
      scope.active();

      $timeout.flush(10 * 1000);

      expect(scope.show).toBe(false);
    }));

    it('should set a custom $timeout for auto_hide', inject(function($timeout) {
      scope.flash_service.active = { type: 'success', auto_hide: 5 };
      scope.active();

      $timeout.flush(5 * 1000);

      expect(scope.show).toBe(false);
    }));
  });
});
