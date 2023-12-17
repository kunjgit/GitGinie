// Import necessary modules
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

interface Provider {
  id: string;
  name: string;
}

const Nav: React.FC = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="flex-between  mb-16 mt-12 pt-3">
      {/* Desktop Navigation */}
      <div className="sm:flex hidden ">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/profile">
              <img
                src={session?.user.image || "no profile"}
                width={45}
                height={45}
                className=" rounded-full  shadow-lg shadow-black  bg-black/50"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="black_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      {/* <div className="sm:hidden flex ">
        {session?.user ? (
          <Link href="/profile">
            <img
              src={session?.user?.image || "no profile"}
              width={37}
              height={37}
              className="rounded-full "
              alt="profile"
            />
          </Link>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="black_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div> */}
    </nav>
  );
};

export default Nav;
