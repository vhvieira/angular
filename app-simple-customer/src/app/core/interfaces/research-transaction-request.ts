import { deserialize as d } from 'cerialize';

export class ResearchTransactionRequest {
  searchType: string;
  issueReferenceId?: number;
  requestorUserId?: string;
  requestorFirstName?: string;
  requestorLastName?: string;
  comments: string;
  ticketNumber: string;
  pan?: string;
  ica?: string; // memberId
  custId?: number;
  custName?: string; // legalnName
  acctRngId?: string;
  processedTranId?: number;
  customerSupportUserId?: string;
  customerSupportActionType?: string;
  udtTblId?: string;
}
export class ResearchOwnerResponse {
  @d startingAccountRange: string;
  @d endingAccountRange: string;
  @d statusCode: string;
  @d memberId: string;
  @d memberName: string;
  @d legalName: string;
  @d custId: number;
}

export class ResearchTransactionResponse {

  public static prepareNullFields(transaction: ResearchTransactionResponse) {

    Object.keys(transaction).forEach(field => {
      if (transaction[field] === null) {
        transaction[field] = '';
      }
    });
  }

  public static prepareToFixedFields (transaction: ResearchTransactionResponse) {
    const toFixedFields = [
      'de4TransactionAmount',
      'de6BillingAmount',
      'de5SettlementAmount'
    ];

    toFixedFields.forEach(field => {
      if (transaction[field]) {
        transaction[field] = transaction[field].toFixed(2) as any;
      }
    });
  }

  public static prepareIconFields (transaction: ResearchTransactionResponse) {
    if (transaction.alertSwitch === 'Y') {
      transaction.alertSwitch = 'flag';
    }
  }

  public static OnDeserialized(transaction: ResearchTransactionResponse, _: any): void {
    this.prepareNullFields(transaction);
    this.prepareToFixedFields(transaction);
    this.prepareIconFields(transaction);
  }

  @d alertSwitch?: string;
  @d de2PrimaryAccountNumber: string;
  @d processedDateTime: string;
  @d processedTransactionId: string;
  @d de39IssuerResponseCode: string;
  @d emsAdjustedScoreNumber: number;
  @d emsAdjustedScoreReasonCode: string;
  @d de48Se56IssrSectyServTxt: string;
  @d brmsReasonCode3: string;
  @d de4TransactionAmount: number;
  @d de221PosTerminalPanEntryMode: string;
  @d de222PosTerminalPinEntryMode: string;
  @d de18MerchantTypeCode: string;
  @d de431MerchantName: string;
  @d de435MerchantStateCode: string;
  @d de121AuthorizingAgentIdCode: string;
  @d de433MerchantCity: string;
  @d de41CardAcceptorTerminalId: string;
  @d de6113PosCountry: string;
  @d caseNumber: number;
  @d de5SettlementAmount: number;
  @d de6BillingAmount: number;
  @d de20PanCountryCode: string;
  @d de23CardSequenceNumber: string;
  @d de32AcquirerInstitutionId: string;
  @d de33ForwardingInstitutionId: string;
  @d de42CardAcceptorIdCode: string;
  @d de48TransactionCategoryCode: string;
  @d de48Se83AddressVerRespCode: string;
  @d de49TransactionCurrencyCode: string;
  @d de51CardholderCurrencyCode: string;
  @d de6101PosTerminalAttendance: string;
  @d de6104PosCardholderPresence: string;
  @d de6105PosCardPresence: string;
  @d de63Sf2BanknetReferenceNumber: string;
  @d processingNetworkCode: string;
  @d de1213LocalTransactionDateTime: string;
  @d ica?: number; // memberId
  @d custId?: string;
  @d legalName?: string;
  @d acctRngId?: string;
  @d processedTranId?: number;

}

export interface SearchForm {
  userId: string;
  firstName: string;
  lastName: string;
  ticketNumber: string;
  comments: string;
  searchField: string;
  searchType: number; // 1 = pan, 2 = transactionId
}
