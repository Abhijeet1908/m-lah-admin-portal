export interface AuthResponse {
  username?: string | null;
  token?: string | null;
  message?: string | null;
  role?: string | null;
  userId?: number | null;
}

export interface LoggedInUserType {
  userName: string;
  userProfile: string;
}

export interface UserDetails {
  userId: number;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
  roleId?: number | null;
  role?: string | null;
  contactNo?: string | null;
}

export interface CreateUserDTO {
  userId?: number;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
  roleId?: number;
  role?: string | null;
  contactNo?: string | null;
  password?: string | null;
}

export interface UpdateLabourStatusDTO {
  labourId: number;
  statusId: number;
  remark?: string | null;
}

export interface LabourType {
  id?: string | number;
  labourId?: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender?: string | null;
  dob?: string | null;
  permanentAddress?: string | null;
  currentAddress?: string | null;
  contactNumber?: string | null;
  photo?: string | null;
  documentFront?: string | null;
  documentBack?: string | null;
  createdAt?: string | null;
  statusId?: number | null;
  remark?: string | null;
}

export interface TouristType {
  id?: string | number;
  customerId?: number;
  parentCustomerId?: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  contactNo?: string | null;
  contactNumber?: string | null;
  customerImages?: string | null;
  photo?: string | null;
  documentFront?: string | null;
  documentBack?: string | null;
  gender?: string | null;
  dob?: string | null;
  permanentAddress?: string | null;
  childCustomers?: ChildCustomerType[];
  members?: MemberType[];
}

export interface ChildCustomerType {
  id?: string | number;
  customerId?: number;
  parentCustomerId?: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  contactNo?: string | null;
  contactNumber?: string | null;
  customerImages?: string | null;
  photo?: string | null;
  documentFront?: string | null;
  documentBack?: string | null;
  gender?: string | null;
  dob?: string | null;
  permanentAddress?: string | null;
  childCustomers?: ChildCustomerType[];
}

export interface MemberType {
  id?: string | number;
  memberId?: number;
  customerId?: number;
  parentCustomerId?: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  contactNo?: string | null;
  contactNumber?: string | null;
  customerImages?: string | null;
  photo?: string | null;
  documentFront?: string | null;
  documentBack?: string | null;
  gender?: string | null;
  dob?: string | null;
  permanentAddress?: string | null;
}


