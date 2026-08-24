import axios from "axios";
import {
  AuthResponse,
  CreateUserDTO,
  LabourType,
  TouristType,
  UpdateLabourStatusDTO,
  UserDetails,
} from "../common/types";

// ---------------------------------------------------------------------------
// Shared axios instance — base URL + automatic auth header
// ---------------------------------------------------------------------------
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://mlhaapi-f8gnd0a9fpedbxat.centralindia-01.azurewebsites.net/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials if token expired/unauthorized
      const hadToken = Boolean(localStorage.getItem("token"));
      if (hadToken && window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------
export interface UpdateLabourStatusPayload {
  labourId: number | string | undefined;
  statusId: number;
  remark?: string;
}

export interface SaveRemarkPayload {
  value: string;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/** GET /Account/Authenticate — login, returns token + username */
export async function apiAuthenticate(
  username: string,
  password: string
): Promise<AuthResponse> {
  const response = await apiClient.get<AuthResponse>(
    `/Account/Authenticate?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`
  );

  const data = response.data;
  if (!data || !data.token) {
    const errorMsg =
      data?.message || "Invalid username or password. Please try again.";
    throw new Error(errorMsg);
  }

  return data;
}

/** GET /Account/GetUserDetails — current logged in user details */
export async function apiGetUserDetails(): Promise<UserDetails> {
  const response = await apiClient.get<UserDetails>("/Account/GetUserDetails");
  return response.data;
}

/** GET /Account/GetAllUserDetails — list of all system users */
export async function apiGetAllUserDetails(): Promise<UserDetails[]> {
  const response = await apiClient.get<UserDetails[]>("/Account/GetAllUserDetails");
  return response.data || [];
}

/** POST /Account/CreateUser — create a new user/officer/admin */
export async function apiCreateUser(payload: CreateUserDTO): Promise<any> {
  const response = await apiClient.post("/Account/CreateUser", payload);
  return response.data;
}

/** GET /Labour/GetLabourByStatus/{statusId} — fetch labour by status (1, 2, 3) */
export async function apiGetLabourByStatus(
  statusId: string | number
): Promise<LabourType[]> {
  const response = await apiClient.get<LabourType[]>(
    `/Labour/GetLabourByStatus/${statusId}`
  );
  return response.data || [];
}

/** POST /Labour/updateLabourStatus — triage, approve, or reject labour application */
export async function apiUpdateLabourStatus(
  payload: UpdateLabourStatusPayload
): Promise<void> {
  const body: UpdateLabourStatusDTO = {
    labourId: Number(payload.labourId),
    statusId: Number(payload.statusId),
    remark: payload.remark || "",
  };
  await apiClient.post("/Labour/updateLabourStatus", body);
}

/** GET /Tourist/GetAllCustomerList — fetch all registered tourist groups */
export async function apiGetAllTourists(): Promise<TouristType[]> {
  const response = await apiClient.get<any>(
    "/Tourist/GetAllCustomerList"
  );
  const res = response.data;
  if (Array.isArray(res)) {
    return res;
  }
  if (res && Array.isArray(res.data)) {
    return res.data;
  }
  if (res && res.data && typeof res.data === "object") {
    return [res.data];
  }
  if (res && Array.isArray(res.result)) {
    return res.result;
  }
  return [];
}

/** POST placeholder for compatibility */
export async function apiSaveLabourRemark(
  payload: SaveRemarkPayload
): Promise<void> {
  // If no separate endpoint exists, remarks are updated via updateLabourStatus
  console.info("Labour remark submitted:", payload.value);
}

