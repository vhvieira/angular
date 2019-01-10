import { ListHistoryDetailComponent } from './list-history-summary.component';

describe('AddPanConfirmationModalComponent', function () {
  let component: ListHistoryDetailComponent;

  beforeEach(function () {
    component = new ListHistoryDetailComponent();
  });

  describe('Method: formatComment ', function () {
    it('Coverage for method formatComment', function () {
      const result = component.formatComment(new Date().toDateString());
      expect(result).toBeDefined();
    });
  });

  describe('Method: removeBrackets ', function () {
    it('should remove bracets in string', function () {
      const result = component.removeBrackets('[1,2,3]');
      expect(result).toEqual('1,2,3');
    });
  });

  describe('Method: formatDate ', function () {
    it('formatting date and test result is not null', function () {
      const result = component.formatDate(new Date().toDateString());
      expect(result).toBeDefined();
    });
  });

  describe('Method: trackFn ', function () {
    it('Coverage for method trackFn', function () {
      const result = component.trackFn('1,2,3');
      expect(result).toEqual('1,2,3');
    });
  });
});
