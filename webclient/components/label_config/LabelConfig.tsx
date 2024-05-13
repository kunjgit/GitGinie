import { Toaster,toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";


type labelInfoState = {
  repo_name: string;
  username: string;
  issueContent: string;
  label: string;
};






const labelInformation = () => {

  const { data: session } = useSession();
  const [labelInfo, setlabelInfo] = useState<labelInfoState>({
    repo_name: "",
    username: session?.user?.github_username!,
    issueContent: "",
    label: "",
  });

  const [userRepos, setUserRepos] = useState<string[]>([]);


  useEffect(() => {

    setTimeout(()=>{
      if(!session?.user)
        {
          toast.error("You are not signed in yet ");
          setTimeout(()=>{},2000);
        }
    },5000);
  }, [session]);
  
  useEffect(() => {
    const fetchUserRepos = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${session?.user?.github_username}/repos`
        );
        setUserRepos(response.data.map((repo: any) => repo.name));
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
        toast.success("Label Configured Successfully");
        const updatedInfo = response.data;
        setlabelInfo({
          ...labelInfo,
          repo_name: "",
          username: session?.user?.github_username!,
          issueContent: "",
          label: "",
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

      toast.success("Label Updated Successfully");
    } catch (error) {
      console.log("error found", error);
    }
  }

  async function handleDelete(repo_name: string) {
    console.log("You want to delete - label config");
    console.log(repo_name);
    try {
      const response = await axios.delete(`/api/label_config/${repo_name}`, {
        data: labelInfo,
      });

      toast.success("Label Deleted Successfully");
    } catch (error) {
      console.log("error found", error);
    }
  }

  return session?.user ? (
    <>
      <div>
       <Toaster/>
       <div className="text-5xl font-ginie text-center">Configure Labels</div>
        <i>
          <p>* Guide</p>
          <p>Select the repo</p>
          <p>In issue content you have to specify the word by which you want to add label</p>
          <p>In label you specify label</p>
        </i>
      </div>
      <form className="text-center w-full" onSubmit={handleSubmit}>
        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
          <label
            htmlFor="reponame"
            className="font-semibold leading-none my-2 text-gray-300"
          >
            Select Repo
          </label>
          <select
            name="reponame"
            id="reponame"
            value={labelInfo.repo_name}
            onChange={(e) => {
              setlabelInfo({ ...labelInfo, repo_name: e.target.value });
            }}
            className="text-gray-8 p-3 focus:outline-none focus:border-slate-200 mt-2 bg-slate-900 border-2 border-slate-400 rounded-full"
          >
            <option value="" disabled>
              Select a repository
            </option>
            {userRepos.map((repo, index) => (
              <option key={index} value={repo}>
                {repo}
              </option>
            ))}
          </select>
          <br />
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-3">
          <label
            htmlFor="issueContent"
            className="font-semibold leading-none my-2 text-gray-300"
          >
            Issue Content{" "}
          </label>
          <input
            type="text"
            name="issueContent"
            value={labelInfo.issueContent}
            className="leading-none text-gray-10 p-3 focus:outline-none  focus:border-slate-200 mt-2 border-2 border-slate-400 bg-slate-900 rounded-full"
            onChange={(e) => {
              setlabelInfo({ ...labelInfo, issueContent: e.target.value });
            }}
          />
          <br />
        </div>

        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
          <label
            htmlFor="label"
            className="font-semibold leading-none my-2 text-gray-300"
          >
            label
          </label>
          <input
            type="text"
            name="label"
            value={labelInfo.label}
            className="leading-none text-gray-10 p-3 focus:outline-none  focus:border-slate-200 mt-2 border-2 border-slate-400 bg-slate-900 rounded-full"
            onChange={(e) => {
              setlabelInfo({ ...labelInfo, label: e.target.value });
            }}
          />
        </div>

        <br />

        <div className="inline-flex gap-2 w-1/3 mx-auto ">
          <button
            type="submit"
            className="bg-slate-900 border-2 border-slate-400 px-5 py-2 rounded-full hover:border-slate-200 text-white"
          >
            Submit
          </button>
          <button
            className="bg-slate-900 border-2 border-slate-400 px-5 py-2 rounded-full hover:border-slate-200 text-white"
            onClick={() => handleEdit(labelInfo.repo_name)}
          >
            Update
          </button>
          <button
            className="bg-slate-900 border-2 border-slate-400 px-5 py-2 rounded-full hover:border-slate-200 text-white"
            onClick={() => handleDelete(labelInfo.repo_name)}
          >
            Delete
          </button>
        </div>
      </form>
    </>
  ) : (
    <>
    <Toaster/>
    {" "}
            <img
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Zzz.png"
              alt="Sleeping"
              width={200}
              height={200}
              className="object-contain mx-auto "
            />
    <h1>You are not authenticated.</h1>
    </>
  );
};

export default labelInformation;
