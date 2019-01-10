export class AuditRequestBody {
  udtTblId: string;
  requestorUserId?: string;
  requestorFirstName?: string;
  requestorLastName?: string;
  comments?: string;
  ticketNumber?: string;
  customerSupportActionType: 'ADD_PAN_TO_LIST' | 'REMOVE_PAN_TO_LIST';
  pan?: string;
  ica?: string;
  custId?: number;
  custName?: string;
}
