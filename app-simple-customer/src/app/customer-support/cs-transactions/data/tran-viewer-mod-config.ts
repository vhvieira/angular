export const modConfig = {
  configs: {
    maxNoOfDays: '180',
    maxRecords: '500',
    maxRecordsPerPage: 25,
    maxDisplayedColumns: 16,
    minDisplayedColumns: 1,
    tooltipLocalisationKeyPrefix: 'VALUES',
    sortField: 'processedDateTime',
    sortOrder: -1
  },
  elements: [
    {
      field: 'alertSwitch',
      header: [
        'Alert'
      ],
      sortable: true,
      seq: 0,
      hidden: false,
      toggleable: false,
      filterType: 'none',
      dataType: 'Icon'
    },
    {
      field: 'de2PrimaryAccountNumber',
      header: [
        'DE 2',
        'Primary Account Number'
      ],
      sortable: true,
      seq: 1,
      hidden: false,
      toggleable: true,
      filterType: 'none',
      dataType: 'Number'
    },
    {
      field: 'processedDateTime',
      header: [
        'Processed Date'
      ],
      sortable: true,
      seq: 2,
      hidden: false,
      toggleable: true,
      filterType: 'dateRange',
      filterValidation:
      {
        message: 'Start Date cannot be later than End Date',
      },
      dataType: 'Date'
    },
    {
      field: 'processedTransactionId',
      header: [
        'Transaction ID'
      ],
      sortable: true,
      seq: 3,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'Number',
      sortType: 'StringNumber'
    },
    {
      field: 'de39IssuerResponseCode',
      header: [
        'DE 39',
        'Response Code'
      ],
      sortable: true,
      seq: 4,
      hidden: false,
      toggleable: true,
      enableTooltip: true,
      filterType: 'dropdown',
      dataType: 'String',
      localisationPrefix: 'VALUES.de39IssuerResponseCode'
    },
    {
      field: 'emsAdjustedScoreNumber',
      header: [
        'DE 48.75',
        'Fraud Assessment Score'
      ],
      sortable: true,
      seq: 5,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'Number'
    },
    {
      field: 'emsAdjustedScoreReasonCode',
      header: [
        'DE 48.75.2',
        'Fraud Score Reason'
      ],
      sortable: true,
      seq: 6,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String',
      enableTooltip: true,
      localisationPrefix: 'VALUES.emsAdjustedScoreReasonCode'
    },
    {
      field: 'de48Se56IssrSectyServTxt',
      header: [
        'DE48.56',
        'Security Services for Issuers'
      ],
      sortable: true,
      seq: 7,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'brmsReasonCode3',
      header: [
        'Alert Reason'
      ],
      sortable: true,
      seq: 8,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'de4TransactionAmount',
      header: [
        'DE 4',
        'Transaction Amount'
      ],
      sortable: true,
      seq: 9,
      hidden: false,
      toggleable: true,
      filterType: 'amountRange',
      filterValidation:
      {
        regex: '^[0-9]{0,22}[.]{0,1}[0-9]{0,2}$',
        message: 'Start Amount cannot be greater than End Amount',
      },
      dataType: 'Number'
    },
    {
      field: 'de221PosTerminalPanEntryMode',
      header: [
        'DE 22.1',
        'PAN Entry Mode'
      ],
      sortable: true,
      seq: 10,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de221PosTerminalPanEntryMode'
    },
    {
      field: 'de222PosTerminalPinEntryMode',
      header: [
        'DE 22.2',
        'PIN Entry Mode'
      ],
      sortable: true,
      seq: 11,
      hidden: false,
      toggleable: true,
      filterType: 'none',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de222PosTerminalPinEntryMode'
    },
    {
      field: 'de18MerchantTypeCode',
      header: [
        'DE 18',
        'Merchant Category (Merchant Type)'
      ],
      sortable: true,
      seq: 12,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'de431MerchantName',
      header: [
        'DE 43.1',
        'Merchant Name'
      ],
      sortable: true,
      seq: 13,
      hidden: false,
      toggleable: true,
      filterType: 'text',
      filterValidation: {
        regex: '^[a-zA-Z0-9 \'\._#,\-]{0,50}$',
        message: 'Merchant name accepts only alphabetic characters with length up to 50'
      },
      dataType: 'String'
    },
    {
      field: 'de435MerchantStateCode',
      header: [
        'DE 43.5',
        'Merchant State'
      ],
      sortable: true,
      seq: 14,
      hidden: false,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de435MerchantStateCode'
    },
    {
      field: 'de121AuthorizingAgentIdCode',
      header: [
        'DE 121',
        'Authorizing Agent ID Code'
      ],
      sortable: true,
      seq: 15,
      NEW_COLUMN: true,
      hidden: false,
      toggleable: true,
      filterType: 'none',
      dataType: 'String'
    },
    {
      field: 'de433MerchantCity',
      header: [
        'DE 43.3',
        'Merchant City'
      ],
      sortable: true,
      seq: 16,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'de41CardAcceptorTerminalId',
      header: [
        'DE 41',
        'Card Acceptor Terminal ID'
      ],
      sortable: true,
      seq: 17,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'de6113PosCountry',
      header: [
        'DE 61.13',
        'POS Country'
      ],
      sortable: true,
      seq: 18,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de6113PosCountry'
    },
    {
      field: 'caseNumber',
      header: [
        'Case Number'
      ],
      sortable: true,
      seq: 19,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'Number'
    },
    {
      field: 'de5SettlementAmount',
      header: [
        'DE 5',
        'Settlement Amount [USD]'
      ],
      sortable: true,
      seq: 20,
      hidden: true,
      toggleable: true,
      filterType: 'none',
      dataType: 'Number'
    },
    {
      field: 'de6BillingAmount',
      header: [
        'DE 6',
        'CardHolder Billing Amount'
      ],
      sortable: true,
      seq: 21,
      hidden: true,
      toggleable: true,
      filterType: 'none',
      dataType: 'Number'
    },
    {
      field: 'de20PanCountryCode',
      header: [
        'DE 20',
        'PAN Country'
      ],
      sortable: true,
      seq: 22,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de20PanCountryCode'
    },
    {
      field: 'de23CardSequenceNumber',
      header: [
        'DE 23',
        'Card Sequence Number'
      ],
      sortable: true,
      seq: 23,
      hidden: true,
      toggleable: true,
      filterType: 'none',
      dataType: 'String'
    },
    {
      field: 'de32AcquirerInstitutionId',
      header: [
        'DE 32',
        'Acquiring Institution ID'
      ],
      sortable: true,
      seq: 24,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'de33ForwardingInstitutionId',
      header: [
        'DE 33',
        'Forwarding Institution ID Code'
      ],
      sortable: true,
      seq: 25,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'de42CardAcceptorIdCode',
      header: [
        'DE 42',
        'Card Acceptor ID Code'
      ],
      sortable: true,
      seq: 26,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'Number',
      sortType: 'StringNumber'
    },
    {
      field: 'de48TransactionCategoryCode',
      header: [
        'DE 48',
        'Transaction Category Code'
      ],
      sortable: true,
      seq: 27,
      hidden: true,
      toggleable: true,
      filterType: 'none',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de48TransactionCategoryCode'
    },
    {
      field: 'de48Se83AddressVerRespCode',
      header: [
        'DE 48.83',
        'AVS Response'
      ],
      sortable: true,
      seq: 28,
      hidden: true,
      toggleable: true,
      filterType: 'none',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de48Se83AddressVerRespCode'
    },
    {
      field: 'de49TransactionCurrencyCode',
      header: [
        'DE 49',
        'Transaction Currency Code'
      ],
      sortable: true,
      seq: 29,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de49TransactionCurrencyCode'
    },
    {
      field: 'de51CardholderCurrencyCode',
      header: [
        'DE 51',
        'Card Holder Currency Code'
      ],
      sortable: true,
      seq: 30,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de51CardholderCurrencyCode'
    },
    {
      field: 'de6101PosTerminalAttendance',
      header: [
        'DE 61.01',
        'POS Terminal Attendence'
      ],
      sortable: true,
      seq: 31,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de6101PosTerminalAttendance'
    },
    {
      field: 'de6104PosCardholderPresence',
      header: [
        'DE 61.04',
        'POS CardHolder Presence'
      ],
      sortable: true,
      seq: 32,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de6104PosCardholderPresence'
    },
    {
      field: 'de6105PosCardPresence',
      header: [
        'DE 61.05',
        'POS Card Presence'
      ],
      sortable: true,
      seq: 33,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      enableTooltip: true,
      dataType: 'String',
      localisationPrefix: 'VALUES.de6105PosCardPresence'
    },
    {
      field: 'de63Sf2BanknetReferenceNumber',
      header: [
        'DE 63.2',
        'Banknet Reference Number'
      ],
      sortable: true,
      seq: 34,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'processingNetworkCode',
      header: [
        'Processing Network Code'
      ],
      sortable: true,
      seq: 35,
      hidden: true,
      toggleable: true,
      filterType: 'dropdown',
      dataType: 'String'
    },
    {
      field: 'de1213LocalTransactionDateTime',
      header: [
        'DE 13/DE 12',
        'Local Transaction Date/Time'
      ],
      sortable: true,
      seq: 36,
      hidden: true,
      toggleable: true,
      filterType: 'dateRange',
      filterValidation:
      {
        message: 'Start Date cannot be later than End Date',
      },
      dataType: 'Date'
    }
  ]
};
export default modConfig;
