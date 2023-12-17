import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ProviderProps {
  session: any;
  children: ReactNode;
}

const Provider = ({ session, children }: ProviderProps) => (
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
);

export default Provider;
