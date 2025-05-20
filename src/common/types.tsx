export interface LoggedInUserType {
  userName: string;
  userProfile: string;
}
export interface LabourType {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  permanentAddress: string;
  currentAddress: string;
  contactNumber: string;
  photo: string;
  documentFront: string;
  documentBack: string;
  createdAt: string;
}

export interface TouristType {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  photo: string;
  documentFront: string;
  documentBack: string;
  gender: string;
  dob: string;
  permanentAddress: string;
  members: MemberType[];
}

export interface MemberType {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  photo: string;
  documentFront: string;
  documentBack: string;
  gender: string;
  dob: string;
  permanentAddress: string;
}
