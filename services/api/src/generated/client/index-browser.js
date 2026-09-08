
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('@prisma/client/runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  googleId: 'googleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  revokedAt: 'revokedAt'
};

exports.Prisma.ProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  headline: 'headline',
  location: 'location',
  bio: 'bio',
  languages: 'languages',
  avatar: 'avatar',
  bannerColor: 'bannerColor',
  bannerTextColor: 'bannerTextColor',
  badgeText: 'badgeText',
  badgeBgColor: 'badgeBgColor',
  badgeTextColor: 'badgeTextColor',
  badgeIcon: 'badgeIcon',
  originCountryId: 'originCountryId',
  originState: 'originState',
  originDistrict: 'originDistrict',
  originCity: 'originCity',
  originVillage: 'originVillage',
  currentCountryId: 'currentCountryId',
  currentState: 'currentState',
  currentCity: 'currentCity',
  currentStatus: 'currentStatus',
  interests: 'interests',
  skills: 'skills',
  passions: 'passions',
  aspirations: 'aspirations',
  challenges: 'challenges',
  onboardingStep: 'onboardingStep',
  onboardingDone: 'onboardingDone',
  phone: 'phone',
  phoneVerified: 'phoneVerified',
  dob: 'dob',
  aadhaarMasked: 'aadhaarMasked',
  aadhaarVerified: 'aadhaarVerified',
  identityStatus: 'identityStatus',
  expertStatus: 'expertStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExpertProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  headline: 'headline',
  bio: 'bio',
  expertTags: 'expertTags',
  badgeText: 'badgeText',
  badgeBgColor: 'badgeBgColor',
  badgeTextColor: 'badgeTextColor',
  badgeIcon: 'badgeIcon',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EducationScalarFieldEnum = {
  id: 'id',
  profileId: 'profileId',
  school: 'school',
  degree: 'degree',
  degreeLevel: 'degreeLevel',
  fieldOfStudy: 'fieldOfStudy',
  startDate: 'startDate',
  endDate: 'endDate',
  current: 'current',
  verified: 'verified',
  officialEmail: 'officialEmail',
  emailVerified: 'emailVerified',
  documentUrl: 'documentUrl',
  verificationStatus: 'verificationStatus'
};

exports.Prisma.ExperienceScalarFieldEnum = {
  id: 'id',
  profileId: 'profileId',
  company: 'company',
  title: 'title',
  location: 'location',
  startDate: 'startDate',
  endDate: 'endDate',
  current: 'current',
  description: 'description',
  verified: 'verified',
  officialEmail: 'officialEmail',
  emailVerified: 'emailVerified',
  documentUrl: 'documentUrl',
  verificationStatus: 'verificationStatus'
};

exports.Prisma.CountryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  iso2: 'iso2',
  iso3: 'iso3',
  phoneCode: 'phoneCode',
  currency: 'currency',
  currencySymbol: 'currencySymbol',
  timezone: 'timezone',
  flagEmoji: 'flagEmoji',
  flagUrl: 'flagUrl',
  continent: 'continent',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IndustryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  icon: 'icon',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  website: 'website',
  logo: 'logo',
  industryId: 'industryId',
  countryId: 'countryId',
  description: 'description',
  verified: 'verified',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobTitleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  category: 'category',
  level: 'level',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SkillScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  category: 'category',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DegreeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  level: 'level',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UniversityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  countryId: 'countryId',
  website: 'website',
  logo: 'logo',
  ranking: 'ranking',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AvailabilityScheduleScalarFieldEnum = {
  id: 'id',
  profileId: 'profileId',
  dayOfWeek: 'dayOfWeek',
  isAvailable: 'isAvailable',
  startTime: 'startTime',
  endTime: 'endTime',
  hasSplitShift: 'hasSplitShift',
  splitStartTime: 'splitStartTime',
  splitEndTime: 'splitEndTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AvailabilitySettingScalarFieldEnum = {
  id: 'id',
  profileId: 'profileId',
  bufferMinutes: 'bufferMinutes',
  noticeHours: 'noticeHours',
  timezone: 'timezone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SessionCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  iconName: 'iconName',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  expertId: 'expertId',
  categoryId: 'categoryId',
  title: 'title',
  description: 'description',
  language: 'language',
  category: 'category',
  videoUrl: 'videoUrl',
  thumbnailUrl: 'thumbnailUrl',
  explanation: 'explanation',
  topics: 'topics',
  timeline: 'timeline',
  targetAudience: 'targetAudience',
  outcomes: 'outcomes',
  bookingQuestions: 'bookingQuestions',
  rules: 'rules',
  durationMinutes: 'durationMinutes',
  priceAmount: 'priceAmount',
  availabilitySchedule: 'availabilitySchedule',
  aiConciseSummary: 'aiConciseSummary',
  aiKeywords: 'aiKeywords',
  aiQualityScore: 'aiQualityScore',
  aiSuggestions: 'aiSuggestions',
  status: 'status',
  rejectionReason: 'rejectionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  bookingNumber: 'bookingNumber',
  sessionId: 'sessionId',
  learnerId: 'learnerId',
  expertId: 'expertId',
  slotDateTime: 'slotDateTime',
  durationMinutes: 'durationMinutes',
  priceAmount: 'priceAmount',
  meetingUrl: 'meetingUrl',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingPrepAnswerScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  questionText: 'questionText',
  answerText: 'answerText',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  razorpayOrderId: 'razorpayOrderId',
  razorpayPaymentId: 'razorpayPaymentId',
  razorpaySignature: 'razorpaySignature',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  paymentMethod: 'paymentMethod',
  failureReason: 'failureReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingCancellationScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  cancelledByUserId: 'cancelledByUserId',
  cancelledRole: 'cancelledRole',
  cancellationReason: 'cancellationReason',
  refundPercentage: 'refundPercentage',
  refundAmount: 'refundAmount',
  refundStatus: 'refundStatus',
  refundRazorpayId: 'refundRazorpayId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingNotificationScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  recipientUserId: 'recipientUserId',
  channel: 'channel',
  eventType: 'eventType',
  status: 'status',
  sentAt: 'sentAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.DegreeLevel = exports.$Enums.DegreeLevel = {
  NONE: 'NONE',
  LKG: 'LKG',
  PRIMARY: 'PRIMARY',
  MIDDLE: 'MIDDLE',
  HIGH_SCHOOL: 'HIGH_SCHOOL',
  SENIOR_SECONDARY: 'SENIOR_SECONDARY',
  DIPLOMA: 'DIPLOMA',
  BACHELORS: 'BACHELORS',
  MASTERS: 'MASTERS',
  DOCTORATE: 'DOCTORATE',
  POST_DOCTORATE: 'POST_DOCTORATE',
  CERTIFICATE: 'CERTIFICATE',
  SELF_TAUGHT: 'SELF_TAUGHT'
};

exports.MasterStatus = exports.$Enums.MasterStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED'
};

exports.JobLevel = exports.$Enums.JobLevel = {
  INTERN: 'INTERN',
  JUNIOR: 'JUNIOR',
  MID: 'MID',
  SENIOR: 'SENIOR',
  LEAD: 'LEAD',
  MANAGER: 'MANAGER',
  DIRECTOR: 'DIRECTOR',
  VP: 'VP',
  C_LEVEL: 'C_LEVEL'
};

exports.SessionStatus = exports.$Enums.SessionStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.BookingStatus = exports.$Enums.BookingStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  RESCHEDULED: 'RESCHEDULED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  CREATED: 'CREATED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.CancelledRole = exports.$Enums.CancelledRole = {
  LEARNER: 'LEARNER',
  EXPERT: 'EXPERT',
  ADMIN: 'ADMIN'
};

exports.RefundStatus = exports.$Enums.RefundStatus = {
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED'
};

exports.NotificationChannel = exports.$Enums.NotificationChannel = {
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  SMS: 'SMS'
};

exports.Prisma.ModelName = {
  User: 'User',
  RefreshToken: 'RefreshToken',
  Profile: 'Profile',
  ExpertProfile: 'ExpertProfile',
  Education: 'Education',
  Experience: 'Experience',
  Country: 'Country',
  Industry: 'Industry',
  Company: 'Company',
  JobTitle: 'JobTitle',
  Skill: 'Skill',
  Degree: 'Degree',
  University: 'University',
  AvailabilitySchedule: 'AvailabilitySchedule',
  AvailabilitySetting: 'AvailabilitySetting',
  SessionCategory: 'SessionCategory',
  Session: 'Session',
  Booking: 'Booking',
  BookingPrepAnswer: 'BookingPrepAnswer',
  Payment: 'Payment',
  BookingCancellation: 'BookingCancellation',
  BookingNotification: 'BookingNotification'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
