import React from 'react';
import { useSession } from 'next-auth/react';
const Home: React.FC = () => {
    const { data: session } = useSession();

  return (
    <div className='text-center '>
        <h1 className=" text-6xl font-ginie  text-white">GitGinie</h1>
    
    </div>
  );
};

export default Home;
