import { deserialize as d } from 'cerialize';

export class UdtHistory {
  @d customerId: string;
  @d tableHistoryId: string;
  @d tableId: string;
  @d userId: string;
  @d changeType: string;
  @d primaryKeyValue: string;
  @d comments: string;
  @d changeDate: string;
  @d updateUser: string;
}
