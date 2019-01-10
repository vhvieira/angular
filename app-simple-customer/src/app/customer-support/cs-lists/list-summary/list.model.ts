import { deserialize as d } from 'cerialize';
import { Status } from '../data/list-request-body';
import { UdtHistory } from './list-history/list-history.model';

/*export class UdtHistory {
  @d customerId: string;
  @d tableHistoryId: string;
  @d tableId: string;
  @d userId: string;
  @d changeType: string;
  @d primaryKeyValue: string;
  @d comments: string;
  @d changeDate: string;
  @d updateUser: string;
}*/
export class UdtDetail {
  @d status: Status = new Status();
  @d id: number;
  @d tableName: string;
  @d tableDesc: string;
  @d udtTypeId: number;
  @d shared: string;
  @d customerId: number;
  @d mastercardId: number;
  @d itemCount: any;
  @d keyType: any;
  @d updateTime: Date;
  @d updateUser: string;
  @d udtHistory: UdtHistory[];
  @d deploymentStatus: any;
  @d deploymentTime: any;
  @d validValues: any;
  @d userEnteredSwitch: any;
  @d udtColumnDefinition: any;
  @d configVersionNumber: number;
  @d feedTypeCd: any;
}
