import { trpc } from "@/utils/trpc";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import * as nookies from "nookies";
import { decode } from "jsonwebtoken";
import { JwtPayload } from "src/types/user.types";
import { useRouter } from "next/router";

type AuthContextValue = {
  username?: string;
  orgCode?: string;
  changeOrg: (orgCode: string) => Promise<void>;
  loading: boolean;
  logout: () => Promise<void>;
  // setOrgCode: Dispatch<SetStateAction<string | undefined>>;
};

interface Props extends PropsWithChildren {}

const SESSION_COOKIE = "session";

export const AuthContext = createContext<AuthContextValue>({
  changeOrg: async () => {},
  loading: false,
  logout: async () => {},
  // setOrgCode: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const [orgCode, setOrgCode] = useState("");
  const [username, setUsername] = useState("");

  const changeOrgMutation = trpc.useMutation(["auth.changeOrg"]);

  useEffect(() => {
    const { session } = nookies.parseCookies();

    if (!session) {
      if (router.pathname !== "/login") {
        document.location = "/login";
      }
    } else {
      const user = decode(session) as JwtPayload;
      setUsername(user.username);
      setOrgCode(user.orgCode);
    }
  }, [orgCode, username, router.pathname]);

  const changeOrg = async (orgCode: string) => {
    changeOrgMutation.mutate(orgCode, {
      onSuccess: (data) => {
        nookies.setCookie(null, SESSION_COOKIE, data.accessToken, {
          path: "/",
        });
        window.location.reload();
      },
    });
  };

  const logout = async () => {
    nookies.destroyCookie(null, SESSION_COOKIE);
    document.location = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        orgCode,
        changeOrg,
        loading: changeOrgMutation.isLoading,
        username,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
