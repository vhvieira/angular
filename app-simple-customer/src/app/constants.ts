// Set true to use on local env_ng_serve_no_login
export const TEST_HARCODE_LIST = false;
export const TEST_ON_EIB = false;
export const TEST_EIB_IP = '10.157.132.89';
export const TEST_HARDCODE_LIST_CODE = 43040;
export const TEST_HARDCODE_CID = '8120';
export const TEST_HARDCODE_PAN = '5205880000010074';
export const TEST_HARDCODE_GROUP_ID = '3';

const getPrefix = () => {
  let result = '';
  if (typeof window !== 'undefined') {
    result = window.location.pathname.substring(0, location.pathname.indexOf('/apps/'));
  }
  return result;
};

const PREFIX = getPrefix();

const getBaseListMgmt = () => {
  let result = '';
  if (TEST_ON_EIB) {
    result = `https://${TEST_EIB_IP}:25204/ListMgmtWebServices/brms/v2`;
  } else {
    result = `${PREFIX}/api/list-mgmt/v2`;
  }
  return result;
};

// base for list managment
const BASE_LIST_MGMT = getBaseListMgmt();

// list management services
const BASE_TRANS_MGMT = `${PREFIX}/api/transaction-mgmt/v1`;

// OK message from list endpoint
export const LIST_MGMT_RESPONSE_OK = 'OK';

export const API_URL = `${BASE_TRANS_MGMT}/customer-support`,
  RESEARCH_OWNER_URL = `${BASE_TRANS_MGMT}/research-owner`,
  RESEARCH_TRANSACTIONS_URL = `${BASE_TRANS_MGMT}/research-transactions`,
  RESEARCH_TRANSACTIONS_HISTORY_URL = `${BASE_TRANS_MGMT}/history-research-transactions`,
  API_AUDIT_URL = `${BASE_TRANS_MGMT}/cust-support-audit`,
  API_LIST_HIST = `${BASE_LIST_MGMT}/udts/{id}/changes?value={pan}`,
  API_LIST_LISTS = `${BASE_LIST_MGMT}/udts?include-item-counts=false&pan-only=true`,
  API_LIST_PAN = `${BASE_LIST_MGMT}/udts/{listId}/items?value={pan}`,
  NAVIGATE_MSG_KEY = 'navigate',
  SELECT_TAB_MSG_KEY = 'SELECT_TAB',
  LIST_ADD_ITEM_URL = `${BASE_LIST_MGMT}/udts/:tableId/items`,
  LIST_REMOVE_ITEM_URL = `${BASE_LIST_MGMT}/udts/:tableId/items-delete`,
  DEFAULT_DATE_FORMAT = 'DD-MMM-YYYY hh:mm A',
  FULL_DATE_FORMAT = 'DD-MMM-YYYY HH:mm:ss [GMT]Z',
  ADD_PAN_DISPLAY_DATE_FORMAT = 'M/D/YYYY',
  REQUEST_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZZ',
  DEFAULT_END_DATE: Date = new Date('12/31/9999');

  // search type constants
export const SEARCH_TYPE = {
  PAN: '1',
  TRANSACTION_ID: '2'
};

export const TRANSACTION_NAVIGATE_ACTION = {
  code: 'customerSupport.transactions.appNavigate',
  label: 'Transactions',
  tooltip: 'Transaction Research',
  target: 1,
  targetArgs: [
    'apps/customer-support?tab=lists'
  ],
  order: 5,
  labelToken: 'SHELL.TABAPP.LABELS.CUSTOMERSUPPORT.TRANSACTIONS.APPNAVIGATE',
  toolTipToken: 'SHELL.TABAPP.TOOLTIPS.CUSTOMERSUPPORT.TRANSACTIONS.APPNAVIGATE',
  urlProperty: '/apps/customer-support/',
  hashPartsProperty: [
    ''
  ],
  urlAndHashProperty: 'apps/customer-support',
  ctrlKey: false
};

export const AUDIT_ACTION_TYPES = {
  0: 'RESEARCH',
  1: 'ADD_PAN_TO_LIST',
  2: 'RESEARCH_OWNER',
  3: 'REMOVE_PAN_FROM_LIST',
  4: 'RESEARCH_HISTORY'
};

export enum PAN_LIST_STATUS {
  EXPIRED = 'CUSTOMER_SUPPORT.LABELS.EXPIRED',
  FUTURE = 'CUSTOMER_SUPPORT.LABELS.FUTURE',
  ACTIVE = 'CUSTOMER_SUPPORT.LABELS.ACTIVE',
  NOT_IN_LIST = 'CUSTOMER_SUPPORT.LABELS.NOT_IN_LIST'
}
