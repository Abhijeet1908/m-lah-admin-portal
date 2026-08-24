import { useState, useEffect, useCallback } from "react";
import {
  AuthResponse,
  CreateUserDTO,
  LabourType,
  TouristType,
  UserDetails,
} from "../common/types";
import {
  apiAuthenticate,
  apiCreateUser,
  apiGetAllTourists,
  apiGetAllUserDetails,
  apiGetLabourByStatus,
  apiGetUserDetails,
  apiSaveLabourRemark,
  apiUpdateLabourStatus,
  SaveRemarkPayload,
  UpdateLabourStatusPayload,
} from "./base.api";

// ---------------------------------------------------------------------------
// useAuthenticate
// ---------------------------------------------------------------------------
interface UseAuthenticateReturn {
  login: (username: string, password: string) => Promise<AuthResponse>;
  isLoading: boolean;
  error: string;
}

export function useAuthenticate(): UseAuthenticateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiAuthenticate(username, password);
      return data;
    } catch (err: any) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

// ---------------------------------------------------------------------------
// useGetUserDetails (Current Authenticated User)
// ---------------------------------------------------------------------------
interface UseGetUserDetailsReturn {
  user: UserDetails | null;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

export function useGetUserDetails(): UseGetUserDetailsReturn {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiGetUserDetails();
      setUser(data);
    } catch (err: any) {
      console.warn("Could not fetch user details:", err);
      setError("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}

// ---------------------------------------------------------------------------
// useGetAllUsers (All System User Accounts)
// ---------------------------------------------------------------------------
interface UseGetAllUsersReturn {
  users: UserDetails[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

export function useGetAllUsers(): UseGetAllUsersReturn {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGetAllUserDetails();
      setUsers(data || []);
    } catch (err: any) {
      console.error("Failed to fetch all user details:", err);
      setError("Failed to load user accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

// ---------------------------------------------------------------------------
// useCreateUser
// ---------------------------------------------------------------------------
interface UseCreateUserReturn {
  createUser: (payload: CreateUserDTO) => Promise<any>;
  isLoading: boolean;
  error: string;
}

export function useCreateUser(): UseCreateUserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createUser = async (payload: CreateUserDTO): Promise<any> => {
    setIsLoading(true);
    setError("");
    try {
      const result = await apiCreateUser(payload);
      return result;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create user. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
}

// ---------------------------------------------------------------------------
// useGetAllTourists
// ---------------------------------------------------------------------------
interface UseGetAllTouristsReturn {
  tourists: TouristType[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

export function useGetAllTourists(): UseGetAllTouristsReturn {
  const [tourists, setTourists] = useState<TouristType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTourists = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGetAllTourists();
      setTourists(data || []);
    } catch (err: any) {
      console.error("Failed to fetch tourist list:", err);
      setError("Failed to load tourist data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTourists();
  }, [fetchTourists]);

  return { tourists, loading, error, refetch: fetchTourists };
}

// ---------------------------------------------------------------------------
// useGetLabourByStatus
// ---------------------------------------------------------------------------
interface UseGetLabourByStatusReturn {
  labourCards: LabourType[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

export function useGetLabourByStatus(
  statusId: string | number
): UseGetLabourByStatusReturn {
  const [labourCards, setLabourCards] = useState<LabourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLabour = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGetLabourByStatus(statusId);
      setLabourCards(data || []);
    } catch (err: any) {
      console.error(`Failed to fetch labour cards for status ${statusId}:`, err);
      setError("Failed to load labour data.");
    } finally {
      setLoading(false);
    }
  }, [statusId]);

  useEffect(() => {
    fetchLabour();
  }, [fetchLabour]);

  return { labourCards, loading, error, refetch: fetchLabour };
}

// ---------------------------------------------------------------------------
// useUpdateLabourStatus
// ---------------------------------------------------------------------------
interface UseUpdateLabourStatusReturn {
  updateStatus: (payload: UpdateLabourStatusPayload) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export function useUpdateLabourStatus(): UseUpdateLabourStatusReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateStatus = async (
    payload: UpdateLabourStatusPayload
  ): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      await apiUpdateLabourStatus(payload);
    } catch (err: any) {
      console.error("Error updating labour status:", err);
      const message =
        err?.response?.data?.message ||
        "Failed to update status. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStatus, isLoading, error };
}

// ---------------------------------------------------------------------------
// useSaveLabourRemark
// ---------------------------------------------------------------------------
interface UseSaveLabourRemarkReturn {
  saveRemark: (payload: SaveRemarkPayload) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export function useSaveLabourRemark(): UseSaveLabourRemarkReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const saveRemark = async (payload: SaveRemarkPayload): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      await apiSaveLabourRemark(payload);
    } catch (err: any) {
      console.error("Save remark failed:", err);
      setError("Failed to save remark. Try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { saveRemark, isLoading, error };
}

