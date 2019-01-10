const getPrefix = () => {
  let result = '';
  if (typeof window !== 'undefined') {
    result = window.location.pathname.substring(0, location.pathname.indexOf('/apps/'));
  }
  return result;
};

const prefix = getPrefix();

const base = `${prefix}/api/standin-mgmt/v1`;

export const API_URL = `${base}/customer-support`;
export const NAVIGATE_MSG_KEY = 'navigate';
export const SELECT_TAB_MSG_KEY = 'SELECT_TAB';
