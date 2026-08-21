import axios from "axios";
import { AuthResponse, LabourType, TouristType } from "../common/types";

// ---------------------------------------------------------------------------
// Shared axios instance — base URL + automatic auth header
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  //   baseURL:
  //     "https://mlha-e9f4fydheqbweudd.centralus-01.azurewebsites.net/api",
  // });
  baseURL:
    "http://localhost:8081/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------
export interface UpdateLabourStatusPayload {
  labourId: string | undefined;
  statusId: number;
  remark: string;
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
    `/Account/Authenticate?username=${username}&password=${password}`
  );
  return response.data;
}

/** GET /Tourist/GetAllCustomerList */
export async function apiGetAllTourists(): Promise<TouristType[]> {
  const response = await apiClient.get<TouristType[]>(
    "/Tourist/GetAllCustomerList"
  );
  return response.data;
}

/** GET /Labour/GetLabourByStatus/:statusId */
export async function apiGetLabourByStatus(
  statusId: string
): Promise<LabourType[]> {
  const response = await apiClient.get<LabourType[]>(
    `/Labour/GetLabourByStatus/${statusId}`
  );
  return response.data;
}

/** POST /Labour/updateLabourStatus */
export async function apiUpdateLabourStatus(
  payload: UpdateLabourStatusPayload
): Promise<void> {
  await apiClient.post("/Labour/updateLabourStatus", payload);
}

/** POST placeholder — save a labour remark (URL to be updated when ready) */
export async function apiSaveLabourRemark(
  payload: SaveRemarkPayload
): Promise<void> {
  await apiClient.post("https://your-api-url.com/endpoint", payload);
}
