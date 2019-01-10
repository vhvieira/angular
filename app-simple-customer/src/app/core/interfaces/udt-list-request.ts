import { deserialize as d } from 'cerialize';

export class UDTListRequest {
  @d id: number;
  @d pan: string;
}

export class UDTResponse {
  @d status?: any;
  @d id: number;
  @d tableName: string;
  @d tableDesc: string;
  @d udtTypeId: number;
  @d shared?: any;
  @d customerId: number;
  @d mastercardId: number;
  @d itemCount: string;
  @d keyType: string;
  @d updateTime: Date;
  @d updateUser: string;
  @d udtHistory?: any;
  @d deploymentStatus: string;
  @d deploymentTime: Date;
  @d validValues?: any[];
  @d userEnteredSwitch?: any;
  @d udtColumnDefinition?: any;
  @d configVersionNumber: number;
  @d feedTypeCd: any;
}

export class PANResponse {
  @d id: number;
  @d status: ErrorCode;
  @d searchResult: any;
  @d items: UDTColumn[];
  @d updateTime: Date;
  @d updateUser: string;
  @d invalidItemsList: UDTItem[];
}

export class ErrorCode {
  message: string;
  code: number;
}

export class UDTItem {
  id: number;
  columns: UDTColumn[];
}

export class UDTColumn {
  id: number;
  value: any;
}
