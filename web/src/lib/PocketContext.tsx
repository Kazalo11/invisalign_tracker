import { jwtDecode } from "jwt-decode";
import PocketBase, { RecordAuthResponse, RecordModel } from "pocketbase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useInterval } from "usehooks-ts";
import { SignUpFormData } from "../pages/SignUpPage";

const BASE_URL = "http://127.0.0.1:8090";
const fiveMinutesInMs = 5 * 60 * 1000;
const twoMinutesInMs = 2 * 60 * 1000;

interface DecodedToken {
  exp: number;
}

interface PocketContextType {
  register: (formData: SignUpFormData) => Promise<RecordModel>;
  login: (
    email: string,
    password: string
  ) => Promise<RecordAuthResponse<RecordModel>>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  user: RecordModel | null;
  token: string | null;
  pb: PocketBase;
}

const PocketContext = createContext<PocketContextType | undefined>(undefined);

interface PocketProviderProps {
  children: ReactNode;
}

export const PocketProvider: React.FC<PocketProviderProps> = ({ children }) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);

  const [token, setToken] = useState<string | null>(pb.authStore.token);
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record);

  useEffect(() => {
    return pb.authStore.onChange((newToken, newModel) => {
      setToken(newToken);
      setUser(newModel);
    });
  }, [pb]);

  const register = useCallback(
    async (formData: SignUpFormData): Promise<RecordModel> => {
      return await pb.collection("users").create(formData);
    },
    [pb]
  );

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<RecordAuthResponse<RecordModel>> => {
      return await pb.collection("users").authWithPassword(email, password);
    },
    [pb]
  );

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, [pb]);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode<DecodedToken>(token as string);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token, pb]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <PocketContext.Provider
      value={{ register, login, logout, refreshSession, user, token, pb }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = (): PocketContextType => {
  const context = useContext(PocketContext);
  if (!context) {
    throw new Error("usePocket must be used within a PocketProvider");
  }
  return context;
};
