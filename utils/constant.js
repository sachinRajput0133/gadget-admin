import getConfig from 'next/config';


const { publicRuntimeConfig } = getConfig();

const API_RESPONSE_LOGIN = 'LOGIN';
const DEFAULT_NEXT_API_HEADER = { 'Content-Type': 'application/json' };
const API_SUCCESS_RESPONSE = 'SUCCESS';
const NUMBER_OF_DIGITS_IN_OTP = 6;
const DEFAULT_LIMIT = 50;
const EMAIL_DEFAULT_LIMIT = 100;
const DEFAULT_LNG = 'EN';
const DEFAULT_COUNT = 10;
const DEFAULT_SORT = -1;
const PAGE_LIMIT = [10, 20, 30, 40, 50];
const EMAIL_PAGE_LIMIT = [50, 100, 200, 500];
const DEFAULT_CURRENT_PAGE = 0;
const INFINITY_LIMIT = 'Infinity';
const SPACE_REMOVE_REGEX = / /g;
const DOMAIN_REGEX = /^(?!www$)^[a-z][a-z0-9\- ]*(?<!-)$/;
const DEFAULT_FULL_DATE_FORMAT = 'YYYY/MM/DD hh:mm A';
const DEFAULT_DATE_FORMAT = 'MM-DD-YYYY';
const DEFAULT_TIME_FORMAT = 'hh:mm A';
const DATE_AND_TIME_FORMAT = 'MM/DD/YYYY, hh:mm A';
const UNAUTHENTICATED = 'UNAUTHENTICATED';
const ONE_HOUR_IN_MILI_SECONDS = 1000 * 60 * 60;
const INBOX_STATUS = {
  DELETED: 'DELETED',
};
const USER_MESSAGES = {
  USER_NOT_VARIFIED: 'user not verified',
};
const BELIZE_STATUS = {
  SUCCESS: 1,
  FAILED: 0,
};
const BELIZE_STATUS_LETTER = {
  PAYMENT_PENDING: 'payment pending',
  PAYMENT_FAILED: 'payment failed',
};
const RESTAURANT_TYPE = {
  curbsideickup: 'curbsidepickup',
  delivery: 'delivery',
};
const SIDEBAR_TABS = {
  pickUp: 0,
  delivery: 1,
};
const HANDOFF_MODE = {
  TAKE_OUT: 1,
  DELIVERY: 2,
};

const DINING_OPTION = {
  pickUp: 'Pickup',
  Delivery: 'Delivery',
};
const CARD_TYPE = {
  TIME_CARD: 'TIME_CARD',
  SCHEDULE_CARD: 'SCHEDULE_CARD',
  THIRD_OPT: 'THIRD_OPT',
};
const ORDER_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};
const finalOrderStatus = ['completed', 'failed', 'delivered', 'cancelled', 'payment failed'];
const FAILED_STATUS = ['payment failed', 'failed', 'cancelled'];
const DELIVERECT_ORDER_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending',
};
const FIRST_DELIVERY_ORDER_STATUS = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  IN_TRANSIT: 'InTransit',
  AT_DESTINATION: 'AtDestination',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};
const RADUIS = 500000000;
const SUCCESS = 'SUCCESS';
const DEFAULT_CLASS_LEARNER_SEND_MAIL = false;
const MODULES = {
  CLIENT: 'client',
  LEARNER: 'learner',
  USER: 'user',
  PERMISSION: 'permission',
  ROLE: 'role',
  MASTER: 'master',
  COUNTRY: 'country',
  STATE: 'province',
  CITY: 'city',
  ZIPCODE: 'zipCode',
  FILEHISTORY: 'importHistory',
  BATCH_COURSE: 'batch-course',
  BATCH_CERTIFICATE: 'batch-certificate',
  TRANSACTION: 'transaction',
  EMAIL_NOTIFICATION: 'emailNotification',
  ANALYTICS: 'analytics',
  MATERIAL: 'batchMaterial',
  CLASS: 'class',
  BATCH_CLASS: 'batch-class',
  CUSTOM_FIELDS: 'customField',
  BANNER: 'banner',
  NOTIFICATION: 'notification',
  TOPIC: 'topic',
  SUBMISSION: 'submission',
  PRODUCT_ANALYTICS: 'productAnalytics',
};
const COMPONENT_TYPE = {
  ASSESSMENT: 'ASSESSMENT',
  RECOMMENDED_COURSES: 'RECOMMENDED_COURSES',
  SELF_LEARNING_COURSES: 'SELF_LEARNING_COURSES',
  EXPERT_SESSION: 'EXPERT_SESSION',
  SUBMISSIONS: 'SUBMISSIONS',
};
const COMPONENT_TITLE = {
  ASSESSMENT: 'Assessments',
  RECOMMENDED_COURSES: 'Recommended Courses',
  SELF_LEARNING_COURSES: 'Self Learning Courses',
  EXPERT_SESSION: 'Expert Session',
  SUBMISSIONS: 'Submission',
};
const NOTIFICATION_TYPE = {
  GENERAL: 'GENERAL',
  FLOATING: 'FLOATING',
  EMAIL: 'EMAIL',
};
const CRITERIA_TYPE = {
  ALL: 'ALL',
  CLIENT: 'CLIENT',
  LEARNER: 'LEARNER',
};

const CONTRACT_STATUS = {
  PURCHASED: 'Purchased',
  UPDATED: 'Updated',
  EXPIRED: 'Expired',
  NOT_STARTED: 'Not Started',
  ACTIVE: 'Active',
};

const MODULE_ACTIONS = {
  GET: 'get',
  LIST: 'list',
  CREATE: 'create',
  VIEW: 'view',
  UPDATE: 'update',
  DELETE: 'delete',
  SOFTDELETE: 'softDelete',
  SEQUENCE: 'sequence',
  ACTIVE: 'active',
  IMPORT: 'import',
  EXPORT: 'export',
  PARTIALUPDATE: 'partiallyUpdate',
  DEFAULTUPDATE: 'defaultUpdate',
  MULTIPLEUPDATE: 'multipleUpdate',
  BULKBATCHINSERT: 'bulkBatchUpdate',
  BULKINSERT: 'bulkInsert',
  ADDLEARNER: 'addLearner',
  CHANGESTATUS: 'changeStatus',
  ALLLEARNERLIST: 'allLearnerList',
  LEARNERLIST: 'learnerList',
  SEND_MAIL: 'sendMail',
  REMOVE: 'remove',
  LEARNER_CLASS_LIST: 'learnerClassAttendeceList',
  UPDATE_ATTENDANCE: 'updateAttendece',
  GET_CODE: 'getCode',
  GENERATE_CODE: 'generateCode',
  REMOVE_LEARNER: 'removeLearner',
  CLASS_LEARNER_LIST: 'classLearnerList',
  ROLE_COUNT: 'roleCount',
  ASSESSMENT_ANALYTICS: 'assessmentAnalytics',
  STAGE_STEPS: 'stageStepAnalytics',
  EXPORT_ASSESSMENT: 'export-assessment',
  EXPORT_STAGE: 'export-stage',
  UPDATE_LICENSE: 'updateLicense',
  SEND_GENERAL_NOTIFICATION: 'sendGeneralNotification',
  SEND_MAIL_NOTIFICATION: 'sendMailNotification',
  VIEW_CLIENT_DASHBOARD: 'viewClientDashboard',
};

const KEYS = {
  RESTAURANT_DETAIL: 'restDetail',
  TEMP_RESTAURANT_DETAIL: 'tempRestDetail',
  DELIVERY_ADDRESS: 'deliveryAddress',
  IS_SAVED_ADD_OPEN: 'isSavedAddOpen',
  TIME: 'time',
  DROPOFF_INSTR: 'dropOffInstr',
  DINING_OPTION: 'diningOption',
  forgetEmail: 'FORGET_EMAIL',
  LAST_TOKEN_FETCH: 'lastTokenFetch',
  deviceToken: 'deviceToken',
  USER: 'USER',
  TOKEN: 'token',
  USER_DATA: 'USER_DATA',
  USER_TYPE: 'USER_TYPE',
  AUTH_TOKEN: 'AUTH_TOKEN',
  EMAIL: 'email',
  PHONE: 'phone',
  TYPE: 'type',
  GOVERMENTID: 'governmentId',
  OTP_KEY: 'OTP_KEY',
  USER_NAME: 'USER_NAME',
  PROFILE_IMAGE_URI: 'PROFILE_IMAGE_URI',
  VIDEO_CALL_ID: 'VIDEO_CALL_ID',
  PHYSICIAN_ON_CALL: 'PHYSICIAN_ON_CALL',
  REGISTER_EMAIL: 'REGISTER_EMAIL',
  REGISTER_KEY: 'REGISTER_KEY',
  FAMILY_KEY: 'FAMILY_KEY',
  FAMILY_CAREGIVER: 'FAMILY_CAREGIVER',
  PARENT_ID: 'PARENT_ID',
  REGISTER_DATA: 'REGISTER_DATA',
  APPOINTMENT_ID: 'APPOINTMENT_ID',
  REGISTER_ID: 'REGISTER_ID',
  SELECTED_CHILD: 'SELECTED_CHILD',
  SELECTED_CONSULTING: 'SELECTED_CONSULTING',
  BOOKING_SELECTED: 'BOOKING_SELECTED_SLOT',
  CARD_DETAILS: 'CARD_DETAILS',
  BOOK_DETAILS: 'BOOK_DATA',
  SPECIALIZATION: 'SPECIALIZATION',
  REFERRAL_CREATE: 'REFERRAL_DATA',
  PROVIDER_TYPE: 'PROVIDER_TYPE',
  REFERRING_PROVIDER: 'REFERRINGPROVIDER',
  CONSULTING_PROVIDER: 'CONSULTINGPROVIDER',
  PHYSICIAN_APPROVAL_STATUS: 'isApproved',
  PHYSICIAN_TRANSACTION_FILTERED_DATA: 'FILTERED_TRANSACTIONS_LIST',
  FORMIK: 'FORMIK_DATA',
  IS_NEW_CHILD: 'IS_NEW_CHILD',
  IS_PHYSICIAN: 'isPhysician',
  PHYSICIAN: 'physician',
  TIMEZONE: 'TIMEZONE',
  DOMAIN_NAME: 'DOMAIN_NAME',
  PATIENT: 'PATIENT',
  PARENT: 'PARENT',
  CLINIC: 'clinic',
  CLINIC_ID: 'CLINIC_ID',
  PRIMARY_DOCTOR: 'PRIMARY_DOCTOR',
  DOCTOR: 'doctor',
  PATIENT_ID: 'PATIENT_ID',
  EDIT_EMERGENCY_CONTACT: 'EDIT_EMERGENCY_CONTACT',
  fcmToken: 'fcmToken',
  QUICK_CONNECT_DOCTOR: 'QUICK_CONNECT_DOCTOR',
  DENIED: 'denied',
  UPCOMING: 'upcoming',
  GRANTED: 'granted',
  PAST: 'past',
  CANCELLED: 'cancelled',
  DOCTOR_FILTER: 'DOCTOR_FILTER',
  SERVICE_DATA: 'SERVICE_DATA',
  DOCTOR_DATA: 'DOCTOR_DATA',
  POOL_ACCOUNT: 'POOL_ACCOUNT',
  WEB: 'WEB',
  CUSTOM_MESSAGE: 'Something went wrong',
  PAYMENT_MODE: 'PAYMENT_OPTIONAL',
  DINE_IN: 'DINE-IN',
  FIVE: 5,
  CREDIT_CARD: 'credit-card',
  GIFT_CARD: 'gift-card',
  PAY_LATER: 'pay-later',
  REFRESHTOKEN: 'refresh-token',
  EXPIRES: 'expires',
  REWARD_APPLIED: 'reward_applied',
  TAX: 'tax',
  TIP: 'tip',
  TOTAL_AMOUNT: 'total_amount',
  PAYMENT_METHOD: 'payment_method',
  USER_ID: 'userId',
  REST_ID: 'restId',
  MENU_ID: 'menuId',
};

const MASTER_CODES = {
  university: 'UNIVERSITY',
  timezone: 'TIMEZONE',
  customFieldType: 'CUSTOM_FIELD_TYPE',
  fileType: 'MIME_TYPE',
  industry: 'INDUSTRY',
  notificationType: 'NOTIFICATION_TYPE',
  tag: 'TAG',
  NOTIFICATION_CRITERIA: 'NOTIFICATION_CRITERIA',
  LANGUAGE: 'LANGUAGE',
};
const CONTRACT_DETAILS_CODE = {
  startDate: 'contractDtls.startDt',
  endDate: 'contractDtls.endDt',
  noOfUsers: 'contractDtls.noOfUsr',
  importedLearner: 'contractDtls.importedLearner',
  offBoardLearner: 'contractDtls.offBoardLearner',
};

const LEARNER_IMPORT_TYPE = {
  LEARNER: 1,
  PASSWORD: 2,
  RESULT: 3,
  USER: 4,
};
const LOGIN_STATUS = [
  { value: true, label: 'Logged In' },
  { value: false, label: 'Not Logged In' },
];
const LEARNER_IMPORT_TYPE_LABEL = {
  LEARNER: 'Learner',
  RESULT: 'Result',
  PASSWORD: 'Password',
  USER: 'User',
};

const FROM_IMPORTED_TYPES = [
  { value: 1, label: 'Learner' },
  { value: 2, label: 'User' },
];

const ACTIVE_FILTER_OPTION = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

const USER_STARS_OPTIONS = [
  { value: 0, label: 'Zero' },
  { value: 1, label: 'one' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
  { value: 4, label: 'Four' },
  { value: 5, label: 'Five' },
];
const REQUIRED_FILTER_OPTION = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];
const DYNAMIC_FILTER_CONDITION_OPTIONS_DEFAULT = [
  { value: '$in', label: 'Is' },
  { value: '$ne', label: 'Is not' },
];

const DYNAMIC_FILTER_CONDITION_OPTIONS_FILE = [{ value: '$exists', label: 'Is' }];
const DYNAMIC_FILTER_CHECKBOX_OPTIONS = [
  { value: true, label: 'true' },
  { value: false, label: 'false' },
];
const DYNAMIC_FILTER_FILE_OPTIONS = [
  { value: true, label: 'Uploaded' },
  { value: false, label: 'Not Uploaded' },
];
const DYNAMIC_FILTER_NUMBER_OPTIONS = [
  { value: '$gt', label: 'Greater than  ' },
  { value: '$lt', label: 'Less than' },
  { value: '$gte', label: 'Greater than equals to' },
  { value: '$lte', label: 'Less than equals to ' },
  { value: '$eq', label: 'Equals to ' },
];
const DYNAMIC_FILTER_AND_OR = [
  { value: '$and', label: 'And' },

  { value: '$or', label: 'Or' },
];
export const REST_LOCATION_ID = 'REST_LOCATION_ID';

export const LEARNER_STEP_STATUS = {
  notStarted: 1,
  inProgress: 2,
  completed: 3,
  aborted: 4,
  enrolled: 5,
  notLoggedIn: 6,
};

export const LEARNER_STEP_STATUS_NAME_LIST = {
  1: 'Not Started',
  2: 'In Progress',
  3: 'Completed',
};

export const LEARNER_STEP_STATUS_COLOR_LIST = {
  [LEARNER_STEP_STATUS.notStarted]: 'primary',
  [LEARNER_STEP_STATUS.inProgress]: 'yellow',
  [LEARNER_STEP_STATUS.completed]: 'green',
  [LEARNER_STEP_STATUS.aborted]: 'red',
  [LEARNER_STEP_STATUS.enrolled]: 'primary',
};
export const SUBMISSION_STEP_STATUS_NAME_LIST = {
  1: 'AI - Review',
  2: 'AI - Approved',
  3: 'AI - Rejected',
  4: 'Manual - Review',
  5: 'Manual - Approved',
  6: 'Manual - Rejected',
};
export const SUBMISSION_STEP_STATUS_COLOR_LIST = {
  1: 'yellow',
  2: 'green',
  3: 'red',
  4: 'yellow',
  5: 'green',
  6: 'red',
};
export const PAYMENT_TYPE = {
  CARD: 'Card',
  GIFT__CARD: 'Gift Card',
  GIFT_CARD: 'GIFT_CARD',
  CARD_NOT_PRESENT: 'CARD_NOT_PRESENT',
};

const NAV_DROPDOWN = {
  SETTING: 'Settings',
  Inbox: 'Inbox',
  MY_ORDER: 'My Orders',
  PAYMENT: 'Payments',
  REWARDS: 'Rewards',
  ENTER_CODE: 'Enter Code',
  LOYALTY_CARD: 'Loyalty Card',
  NO_PROMO_CONTENT: 'NO_PROMO_CONTENT',
  PROMO_CONTENT: 'PROMO_CONTENT',
};
const PERCENTAGE_TIPS = ['No tip', 10, 15, 20, 'Custom'];
const DEFAULT_IMAGE = '/images/Default-image.svg';

export const AMPLITUDE_TRACK = {
  SIGN_UP: 'sign_up_completed',
  LOGIN: 'user_login',
  CATEGORY_VIEWED: 'category_viewed',
  RESTAURANT_VIEWED: 'restaurant_viewed',
  MENU_ITEM_VIEWED: 'menu_item_viewed',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  CART_VIEWED: 'cart_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  DELIVERY_ADDRESS_SELECTED: 'delivery_address_selected',
  PAYMENT_METHOD_SELECTED: 'payment_method_selected',
  ORDER_COMPLETED: 'order_completed',
  ORDER_STATUS_UPDATED: 'order_status_updated',
  DELIVERY_RATED: 'delivery_rated',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  PROMOTION_VIEWED: 'promotion_viewed',
};

export const AMPLITUDE_TYPE = {
  EMAIL: 'Email',
};
const SERVER = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod',
};
export {
  DEFAULT_IMAGE,
  API_RESPONSE_LOGIN,
  DEFAULT_NEXT_API_HEADER,
  API_SUCCESS_RESPONSE,
  NUMBER_OF_DIGITS_IN_OTP,
  DEFAULT_LIMIT,
  EMAIL_DEFAULT_LIMIT,
  DEFAULT_SORT,
  PAGE_LIMIT,
  EMAIL_PAGE_LIMIT,
  DEFAULT_CURRENT_PAGE,
  INFINITY_LIMIT,
  SPACE_REMOVE_REGEX,
  DOMAIN_REGEX,
  DEFAULT_FULL_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_CLASS_LEARNER_SEND_MAIL,
  MODULES,
  COMPONENT_TYPE,
  COMPONENT_TITLE,
  NOTIFICATION_TYPE,
  CRITERIA_TYPE,
  CONTRACT_STATUS,
  MODULE_ACTIONS,
  KEYS,
  MASTER_CODES,
  CONTRACT_DETAILS_CODE,
  LEARNER_IMPORT_TYPE,
  LOGIN_STATUS,
  LEARNER_IMPORT_TYPE_LABEL,
  FROM_IMPORTED_TYPES,
  ACTIVE_FILTER_OPTION,
  USER_STARS_OPTIONS,
  REQUIRED_FILTER_OPTION,
  DYNAMIC_FILTER_CONDITION_OPTIONS_DEFAULT,
  DYNAMIC_FILTER_CONDITION_OPTIONS_FILE,
  DYNAMIC_FILTER_CHECKBOX_OPTIONS,
  DYNAMIC_FILTER_FILE_OPTIONS,
  DYNAMIC_FILTER_NUMBER_OPTIONS,
  DYNAMIC_FILTER_AND_OR,
  UNAUTHENTICATED,
  ONE_HOUR_IN_MILI_SECONDS,
  USER_MESSAGES,
  SUCCESS,
  RESTAURANT_TYPE,
  RADUIS,
  SIDEBAR_TABS,
  CARD_TYPE,
  DEFAULT_LNG,
  DEFAULT_COUNT,
  INBOX_STATUS,
  NAV_DROPDOWN,
  DINING_OPTION,
  HANDOFF_MODE,
  PERCENTAGE_TIPS,
  ORDER_STATUS,
  DATE_AND_TIME_FORMAT,
  SERVER,
  finalOrderStatus,
  DELIVERECT_ORDER_STATUS,
  FIRST_DELIVERY_ORDER_STATUS,
  BELIZE_STATUS,
  FAILED_STATUS,
  BELIZE_STATUS_LETTER,
};
