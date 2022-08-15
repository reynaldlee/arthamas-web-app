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

type OrgContextValue = {
  orgCode?: string;
  changeOrg: (orgCode: string) => Promise<void>;
  loading: boolean;
  // setOrgCode: Dispatch<SetStateAction<string | undefined>>;
};

interface Props extends PropsWithChildren {}

export const OrgContext = createContext<OrgContextValue>({
  changeOrg: async () => {},
  loading: false,
  // setOrgCode: () => {},
});

export const useOrganization = () => {
  return useContext(OrgContext);
};

export const OrgProvider = ({ children }: Props) => {
  const [orgCode, setOrgCode] = useState("");

  const changeOrgMutation = trpc.useMutation(["auth.changeOrg"]);

  useEffect(() => {
    const { session } = nookies.parseCookies();
    const user = decode(session) as JwtPayload;
    setOrgCode(user.orgCode);
  }, [orgCode]);

  const changeOrg = async (orgCode: string) => {
    changeOrgMutation.mutate(orgCode, {
      onSuccess: (data) => {
        nookies.setCookie(null, "session", data.accessToken);
        window.location.reload();
      },
    });
  };

  return (
    <OrgContext.Provider
      value={{
        orgCode,
        changeOrg,
        loading: changeOrgMutation.isLoading,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};
