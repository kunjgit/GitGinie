import React from "react";
import { useSession } from "next-auth/react";
import { About } from "@components/About/about";

const Home: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="text-center ">
      <h3 className="text-2xl text-center font-bold text-zinc-900 dark:text-white md:text-3xl lg:text-4xl my-4">
        Git-Ginnie
      </h3>

      <div className=" w-full flex flex-col px-0 mx-0">
        <img className="h-96 my-10" src="./heroes.svg" alt="" />
        <About />
      </div>
    </div>
  );
};

export default Home;
