// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";


// Define types for labelInfo
type labelInfoState = {
  repo_name: string;
  username: string;
  issueContent: string;
  label: string;
};


// labelInfo component
const labelInformation = () => {
  const { data: session } = useSession();
  const [labelInfo, setlabelInfo] = useState<labelInfoState>({
    repo_name: "",
    username: session?.user?.github_username!,
    issueContent: "",
    label: ""
  });


  const [userRepos, setUserRepos] = useState<string[]>([]);


  useEffect(() => {
    const fetchUserRepos = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${session?.user?.github_username}/repos`
        );
        setUserRepos(response.data.map((repo : any) => repo.name));


      } catch (error) {
        console.log("Error fetching user repos: ", error);
      }
    };

    if (session?.user?.github_username) {
      fetchUserRepos();
    }
  }, [session]);



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("in handle submit - label config");
    try {
      console.log(session?.user?.name);
      const response = await axios.post(
        `/api/label_config/${session?.user?.github_username}`,
        labelInfo
      );

      if (response.status === 200) {
        const updatedInfo = response.data;
        setlabelInfo({
          ...labelInfo,
          repo_name: "",
          username: session?.user?.github_username!,
          issueContent: "",
          label: ""
        });
      }
    } catch (error) {
      console.log("Error is : ", error);
    }
  }

  async function handleEdit(repo_name: string) {
    console.log("You want to edit! - Label config");
    console.log(repo_name);
    try {
      const response = await axios.put(
        `/api/label_config/${labelInfo.repo_name}`,
        labelInfo
      );
    } catch (error) {
      console.log("error found", error);
    }
  }

  async function handleDelete(repo_name: string) {
    console.log("You want to delete - label config");
    console.log(repo_name);
    try {
      const response = await axios.delete(
        `/api/label_config/${repo_name}`,{data : labelInfo}
      );
    } catch (error) {
      console.log("error found", error);
    }
  }

  return session?.user ? (
    <>
      <form className="text-center w-full" onSubmit={handleSubmit}>
        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
        <label htmlFor="reponame" className="font-semibold leading-none text-gray-300">Select Repo</label>
        <select
          name="reponame"
          id="reponame"
          value={labelInfo.repo_name}
          onChange={(e) => {
            setlabelInfo({ ...labelInfo, repo_name: e.target.value });
          }}
          className="text-gray-8 p-3 focus:outline-none focus:border-blue-700 mt-2 border-0 bg-gray-800 rounded"
        >
          <option value="" disabled>
            Select a repository
          </option >
          {userRepos.map((repo, index) => (
            <option key={index} value={repo}>
              {repo}
            </option>
          ))}
        </select>
        <br />
        </div>
          <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-3">
        <label htmlFor="issueContent" className="font-semibold leading-none text-gray-300">Issue Content </label>
        <input
          type="text"
          name="issueContent"
          value={labelInfo.issueContent}
          className="leading-none text-gray-10 p-3 focus:outline-none focus:border-blue-700 mt-2 border-0 bg-gray-800 rounded"
          onChange={(e) => {
            setlabelInfo({ ...labelInfo, issueContent: e.target.value });
          }}
        />
        <br />
          </div>

          <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
        <label htmlFor="label" className="font-semibold leading-none text-gray-300">label</label>
        <input
          type="text"
          name="label"
          value={labelInfo.label}
          className="leading-none text-gray-10 p-3 focus:outline-none focus:border-blue-700 mt-2 border-0 bg-gray-800 rounded"
          onChange={(e) => {
            setlabelInfo({ ...labelInfo, label: e.target.value });
          }}
        />
          </div>
        
        <br />
        
        <div className="inline-flex gap-2  w-1/3  mx-auto ">
        <button
          type="submit"
          className="bg-yellow-500 p-2 rounded-lg text-white"
        >
          Submit
        </button>
        <button
          className="bg-green-500 p-2 rounded-lg text-white"
          onClick={() => handleEdit(labelInfo.repo_name)}
        >
          Update
        </button>
        <button
          className="bg-red-500 p-2 rounded-lg text-white"
          onClick={() => handleDelete(labelInfo.repo_name)}
        >
          Delete
        </button>
        </div>
      </form>

      
        

    </>
  ) : (
    <h1>You are not authenticated.</h1>
  );
};

export default labelInformation;
