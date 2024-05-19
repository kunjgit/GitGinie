import React from "react";
import { useSession } from "next-auth/react";
import { BentoGinie } from '@components/home/bento';
import { ContainerScroll } from "@components/ui/container-scroll-animation";
const Home: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="text-center ">
      <h3 className="text-swipe-up text-3xl font-ginie text-center font-bold text-zinc-900 dark:text-white md:text-5xl lg:text-6xl my-4">
        Welcome to GitGinie!
      </h3>

      <div className=" w-full flex flex-col px-0 mx-0">
        <img className="h-96 my-10 mx-auto" height={350} width={350} src="./heroes.svg" alt="" />
        <h3 className="text-swipe-up text-3xl font-ginie text-center font-bold text-zinc-900 dark:text-white md:text-5xl lg:text-6xl my-6">
        Why GitGinie?
      </h3>
      <ContainerScroll titleComponent={""}><BentoGinie></BentoGinie></ContainerScroll>
      </div>
    </div>
  );
};

export default Home;
