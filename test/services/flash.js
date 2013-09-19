describe('Module: ra.flash.services >', function() {
  beforeEach(function() {
    module('ra.flash.services');
  });

  describe('Service: Flash >', function() {
    var Flash;

    beforeEach(inject(function($injector) {
      Flash = $injector.get('Flash');
    }));

    describe('generic attributes >', function() {
      var generic_flash,
          message;

      beforeEach(function() {
        message = 'I am a generic message';
        generic_flash = Flash.generic(message);
      });

      it('should set the message', function() {
        expect(generic_flash.message).toBe(message);
      });

      it('should default close to true', function() {
        expect(generic_flash.close).toBe(true);
      });

      it('should default trust_as to false', function() {
        expect(generic_flash.trust_as).toBe(false);
      });

      it('should default auto_hide to false', function() {
        expect(generic_flash.auto_hide).toBe(false);
      });

      it('should default next_page to false', function() {
        expect(generic_flash.next_page).toBe(false);
      });
    });

    describe('helper methods >', function() {
      it('should set type to success on Flash.success', function() {
        var message = Flash.success('This is a success message');
        expect(message.type).toBe('success');
      });

      it('should set type to danger on Flash.error', function() {
        var message = Flash.error('This is a error message');
        expect(message.type).toBe('danger');
      });
    });

    describe('show/hide >', function() {
      it('should set a flash to active when its show method is called', function() {
        var message = Flash.success('This is a success message');
        message.show();

        expect(Flash.active).toEqual(message);
      });

      it('should set an active flash to null on hide', function() {
        var message = Flash.success('This is a success message');

        message.show();
        expect(Flash.active).toBeDefined();

        message.hide();
        expect(Flash.active).toBeNull();
      });
    });

    it('should call Flash.hide if showOnNextPage is called without an active next page flash', function() {
      var message = Flash.warning('This is a warning message');
      message.show();

      Flash.hide = jasmine.createSpy();
      Flash.showOnNextPage();

      expect(Flash.hide).toHaveBeenCalledWith();
    });

    it('should set next_page to false if the showOnNextPage is called with an active next page flash', function() {
      var message = Flash.danger('This is a dangerous message', { next_page: true });
      message.show();

      Flash.showOnNextPage();

      expect(Flash.active.next_page).toBe(false);
    });
  });
});
