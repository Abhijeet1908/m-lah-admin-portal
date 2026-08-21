import { useState, useEffect } from "react";
import { AuthResponse, LabourType, TouristType } from "../common/types";
import {
  apiAuthenticate,
  apiGetAllTourists,
  apiGetLabourByStatus,
  apiUpdateLabourStatus,
  apiSaveLabourRemark,
  UpdateLabourStatusPayload,
  SaveRemarkPayload,
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
    } catch (err) {
      const message =
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
// useGetAllTourists
// ---------------------------------------------------------------------------
interface UseGetAllTouristsReturn {
  tourists: TouristType[];
  loading: boolean;
  error: string;
}

export function useGetAllTourists(): UseGetAllTouristsReturn {
  const [tourists, setTourists] = useState<TouristType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const data = await apiGetAllTourists();
        if (!cancelled) setTourists(data);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch tourist list:", err);
          setError("Failed to load tourist data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  return { tourists, loading, error };
}

// ---------------------------------------------------------------------------
// useGetLabourByStatus
// ---------------------------------------------------------------------------
interface UseGetLabourByStatusReturn {
  labourCards: LabourType[];
  loading: boolean;
  error: string;
}

export function useGetLabourByStatus(
  statusId: string
): UseGetLabourByStatusReturn {
  const [labourCards, setLabourCards] = useState<LabourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const data = await apiGetLabourByStatus(statusId);
        if (!cancelled) setLabourCards(data);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch labour cards:", err);
          setError("Failed to load labour data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => {
      cancelled = true;
    };
  }, [statusId]);

  return { labourCards, loading, error };
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
    } catch (err) {
      console.error("Error updating labour status:", err);
      setError("Failed to update status. Please try again.");
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
    } catch (err) {
      console.error("Save remark failed:", err);
      setError("Failed to save. Try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { saveRemark, isLoading, error };
}
