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
        scope   = element.scope();
      });
    }

    beforeEach(function() {
      compileDirective();
    });

    describe('link >', function() {
      it('should set flash_service to Flash', function() {
        expect(scope.service).toEqual(Flash);
      });

      it('should call scope.$watch on flash_service.active', function() {
        scope.flash = {
          init: jasmine.createSpy()
        };

        scope.service.active = { message: 'test'};
        scope.$digest();

        expect(scope.flash.init).toHaveBeenCalledWith(scope.service.active);
      });
    });

    describe('Controller >', function() {
      it('should define show', function() {
        expect(scope.flash.show).toBeFalsy();
      });

      it('should define data', function() {
        expect(scope.flash.data).toBeDefined();
      });

      it('should define classes', function() {
        expect(scope.flash.classes).toBeDefined();
      });

      describe('init >', function() {
        var data = { message: 'test' },
            spies;

        beforeEach(function() {
          scope.flash.setClasses = jasmine.createSpy();
          scope.flash.delay = jasmine.createSpy();
          scope.flash.init(data);
        });

        it('should set data', function() {
          expect(scope.flash.data.message).toBe(data.message);
        });

        it('should call setClasses', function() {
          expect(scope.flash.setClasses).toHaveBeenCalledWith();
        });

        it('should call delay', function() {
          scope.flash.init({ auto_hide: true });
          expect(scope.flash.delay).toHaveBeenCalledWith();

          scope.flash.init({ auto_hide: 10 });
          expect(scope.flash.delay).toHaveBeenCalledWith();

          scope.flash.init({ auto_hide: '10' });
          expect(scope.flash.delay).toHaveBeenCalledWith();
        });

        it('should set show', function() {
          expect(scope.flash.show).toBeTruthy();
        });
      });

      describe('setClasses >', function() {
        it('should prepend alert- to the flash type if it does not exist', function() {
          scope.flash.data.type = 'success';
          scope.flash.setClasses();

          expect(scope.flash.classes).toContain('alert-success');
        });

        it('should not prepend alert- to the flash type if it already contains it', function() {
          scope.flash.data.type = 'alert-success';
          scope.flash.setClasses();

          expect(scope.flash.classes).toContain('alert-success');
        });

        it('should add alert-dismissable if data.close is true', function() {
          scope.flash.data.close = true;
          scope.flash.setClasses();

          expect(scope.flash.classes).toContain('alert-dismissable');
        });

        it('should join to the classes', function() {
          scope.flash.data.type = 'alert-success';
          scope.flash.data.close = true;
          scope.flash.setClasses();

          expect(scope.flash.classes).toBe('alert-success alert-dismissable');
        });
      });

      describe('delay >', function() {
        var timeout;

        beforeEach(inject(function($timeout) {
          timeout = $timeout;
        }));

        it('should set show to false', function() {
          scope.flash.delay();
          timeout.flush();
          expect(scope.flash.show).toBeFalsy();
        });

        it('should call Flash.hide', function() {
          Flash.hide = jasmine.createSpy();
          scope.flash.delay();
          timeout.flush();
          expect(Flash.hide).toHaveBeenCalledWith();
        });
      });
    });
  });
});
