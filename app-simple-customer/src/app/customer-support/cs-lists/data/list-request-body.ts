import { serialize as s } from 'cerialize';
import * as CONFIG from '../../../constants';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { deserialize as d } from 'cerialize';

export class Column {
  @s id: number;
  @s value: string;

  constructor(id: number, value: string) {
    this.id = id;
    this.value = value;
  }
}
export class ItemsList {
  @s id = 0;
  @s columns: Column[] = [] ;

  constructor(pan: string, startDate: Date, endDate: Date) {
    this.columns[0] = new Column(0, pan);
    this.columns[1] = new Column(1, this.formatRequestDates(startDate));
    this.columns[2] = new Column(2, this.formatRequestDates(endDate));
  }

  private formatRequestDates(date: Date): string {
    return moment(date).utc(false).format(CONFIG.REQUEST_DATE_FORMAT).replace('+', '-');
  }

}
export class ListItemRequest {

  static createRequest(listId: number, pan: string, startDate: Date, endDate: Date): ListItemRequest {
    const newRequest = new ListItemRequest();
    newRequest.id = listId;
    newRequest.items[0] = new ItemsList(pan, startDate, endDate);
    return newRequest;
  }

  id: number;
  items: ItemsList[] = [];

}

export class Status {
  @d message = '';
  @d code = 0;
}

export enum ListResponseCode {
  SUCCESS = 0,
  PARTIAL_ERROR = 1,
  FULL_ERROR = 2,
}

export class ListAggregateResponse {
  code: ListResponseCode = ListResponseCode.SUCCESS;
  items: ListItemResponse[] = [];
}

export class ListItemResponse {
  static createResponse(response: any): ListItemResponse {
    const newResponse = new ListItemResponse();
    newResponse.status.message = response.status.message;
    newResponse.status.code = response.status.code;
    return newResponse;
  }
  @d status: Status = new Status();
  @d items: ItemsList[] = [];
}

export class UdtListResponse {
  public static OnDeserialized(data: UdtListResponse) {
    data.udts.forEach(udtList => {
      Object.assign(udtList, udtList.UserDefinedTableResponse);
    });
  }
  static createResponse(response: any): ListItemResponse {
    const newResponse = new ListItemResponse();
    newResponse.status.message = response.status.message;
    newResponse.status.code = response.status.code;
    return newResponse;
  }
  @d customerId = '';
  @d status: Status = new Status();
  @d udts: UdtList[] = [];
}

export class UdtList {
  isPanInList: CONFIG.PAN_LIST_STATUS;
  startDate?: string;
  endDate?: string;
  @d id: number;
  UserDefinedTableResponse: UdtList;
  @d status = '';
  @d tableName = '';
  @d udtTypeId = '';
  @d shared = '';
  @d customerId = '';
  @d mastercardId = '';
  @d itemCount = '';
  @d keyType = '';
  @d updateTime = new Date().toString();
  @d updateUser = '';
  @d udtHistory = '';
  @d deploymentStatus = '';
  @d deploymentTime = '';
  @d userEnteredSwitch = '';
  @d udtColumnDefinition = '';
  @d configVersionNumber = '';
  @d feedTypeCd = '';
  @d tableDesc = '';
  @d validValues = '';
}
