export interface CreateTokenResponse {
  expiresOn: string;
  responseMessage: string;
  accessToken: string;
  refreshToken: string;
  user?: string;
}
export interface Party {
  lastName: string;
  webAddress?: null[] | null;
  displayName: string;
  postalAddresses?: PostalAddressesEntity[] | null;
  phoneNumbers?: PhoneNumbersEntity[] | null;
  firstName: string;
  partyObj: PartyObj;
  emailAddress?: EmailAddressEntity[] | null;
  partyName: string;
  organizationPartyId: string;
  attributes?: AttributesEntity[] | null;
  partyId: string;
}
export interface PostalAddressesEntity {
  countryGeoId: string;
  contactMechPurposeTypeId?: string | null;
  city: string;
  isPrimary: boolean;
  stateProvinceGeoId: string;
  contactMechId: string;
  address1?: string | null;
  postalCode?: string | null;
}
export interface PhoneNumbersEntity {
  countryCode: string;
  contactNumber: string;
  contactMechId: string;
}
export interface PartyObj {
  lastUpdatedStamp: string;
  lastModifiedDate: string;
  createdTxStamp: string;
  displayName: string;
  lastLoggedInAt: string;
  createdStamp: string;
  rating: number;
  lastUpdatedTxStamp: string;
  partyTypeId: string;
  photoUrl: string;
  lastModifiedByUserLogin: string;
  searchText: string;
  createdDate: string;
  locationContactMechId: string;
  statusId: string;
  location: string;
  partyId: string;
  createdByUserLogin: string;
  email: string;
}
export interface EmailAddressEntity {
  contactMechId: string;
  email: string;
}
export interface AttributesEntity {
  lastUpdatedStamp: string;
  createdTxStamp: string;
  createdStamp: string;
  lastUpdatedTxStamp: string;
  attrValue: string;
  partyId: string;
  attrName: string;
}

export interface VerifyResponse {
  accessToken: string;
  refreshToken: string;
}
