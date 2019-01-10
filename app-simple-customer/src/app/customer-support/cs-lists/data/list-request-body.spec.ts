import { ListItemResponse } from './list-request-body';

const responseOK: any = {
    id: 43040,
    status: {
        message: 'OK',
        code: 0
    },
    searchResult: null,
    items: [
        {
            id: 0,
            columns: [
                {
                    id: 0,
                    value: '5205880000010074'
                },
                {
                    id: 1,
                    value: '2000-08-03T20:07:28-0000'
                },
                {
                    id: 2,
                    value: '9999-12-31T23:59:59-0000'
                }
            ]
        }
    ],
    updateTime: '2018-08-14 18:28:10',
    updateUser: 'XSUPER1',
    invalidItemsList: []
};

const responseERROR = {
    status: {
        message: 'Unexpected exception!',
        code: 999
    }
  };

describe('ListItemResponse', function () {
  beforeEach(function () {
    // do nothing here
  });

  describe('Method: createResponse ', function () {
    it('should create response object based on JSON response OK', function () {
      const response = ListItemResponse.createResponse(responseOK);
      expect(response).toBeDefined();
      expect(response.status).toBeDefined();
      expect(response.status.code).toEqual(responseOK.status.code);
      expect(response.status.message).toEqual(responseOK.status.message);
    });
  });

  describe('Method: createResponse ', function () {
    it('should create response object based on JSON response ERROR', function () {
      const response = ListItemResponse.createResponse(responseERROR);
      expect(response).toBeDefined();
      expect(response.status.code).toEqual(responseERROR.status.code);
      expect(response.status.message).toEqual(responseERROR.status.message);
    });
  });

});
