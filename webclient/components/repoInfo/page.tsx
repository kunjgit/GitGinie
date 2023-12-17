// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// MarkdownPreview component for rendering Markdown content
type MarkdownPreviewProps = {
  content: string;
};

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

// Define types for repoInfo and showPreview states
type RepoInfoState = {
  repo_name: string;
  issueOpenContent: string;
  issueCloseContent: string;
  pullRequestOpenContent: string;
  pullRequestCloseContent: string;
};

type ShowPreviewState = {
  issueOpenContent?: boolean;
  issueCloseContent?: boolean;
  pullRequestOpenContent?: boolean;
  pullRequestCloseContent?: boolean;
};

// RepoInfo component
const RepoInfo = () => {
  const { data: session } = useSession();
  const [repoInfo, setRepoInfo] = useState<RepoInfoState>({
    repo_name: "",
    issueOpenContent: "",
    issueCloseContent: "",
    pullRequestOpenContent: "",
    pullRequestCloseContent: "",
  });

  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState<ShowPreviewState>({});

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

  useEffect(() => {
    const fetchRepoInfo = async () => {
      try {
        const response = await axios.get(
          `/api/repo_config/${repoInfo.repo_name}`
        );
        console.log("Fetching details of repo : ", response);
        const info = response.data;
        if (response)
          setRepoInfo((prevFormData) => ({
            ...prevFormData,
            issueOpenContent: info.issueOpenContent || "",
            issueCloseContent: info.issueCloseContent || "",
            pullRequestOpenContent: info.pullRequestOpenContent || "",
            pullRequestCloseContent: info.pullRequestCloseContent || "",
          }));
      } catch (error) {
        console.log("Error ");
      }
    };
    if (repoInfo.repo_name) {
      fetchRepoInfo();
    }
  }, [repoInfo.repo_name]);

  const handleMarkdownChange = (field: keyof RepoInfoState, value: string) => {
    setRepoInfo({ ...repoInfo, [field]: value });
  };

  const handleTogglePreview = (field: keyof ShowPreviewState) => {
    setShowPreview((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("in handle submit");
    try {
      console.log(session?.user?.name);
      const response = await axios.post(
        `/api/repo_config/${session?.user?.github_username}`,
        repoInfo
      );

      if (response.status === 200) {
        const updatedInfo = response.data;
        setRepoInfo({
          ...repoInfo,
          repo_name: "",
          issueOpenContent: "",
          issueCloseContent: "",
          pullRequestOpenContent: "",
          pullRequestCloseContent: "",
        });
      }
    } catch (error) {
      console.log("Error is : ", error);
    }
  }

  async function handleEdit(repo_name: string) {
    console.log("You want to edit!");
    console.log(repo_name);
    try {
      const response = await axios.put(
        `/api/repo_config/${repo_name}`,
        repoInfo
      );
    } catch (error) {
      console.log("error found", error);
    }
  }

  async function handleDelete(repo_name: string) {
    console.log("You want to delete");
    console.log(repo_name);
    try {
      const response = await axios.delete(`/api/repo_config/${repo_name}`);
    } catch (error) {
      console.log("error found", error);
    }
  }

  return session?.user ? (
    <>
      <div>
        <i>
          <p>* Guide</p>
          <p>Select the repo</p>
          <p>
            In every field you have to specify the message you want to display
            on respective actions.
          </p>
          <p>You can specify the message in markdown format also.</p>
        </i>
      </div>
      <form className="text-center w-full" onSubmit={handleSubmit}>
        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
          <label
            htmlFor="reponame"
            className="font-semibold leading-none text-gray-300 my-2"
          >
            Select Repo
          </label>
          <select
            name="reponame"
            id="reponame"
            value={repoInfo.repo_name}
            onChange={(e) => {
              setRepoInfo({ ...repoInfo, repo_name: e.target.value });
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
            htmlFor="issueOpenContent"
            className="font-semibold leading-none text-gray-300 my-2"
          >
            Issue Open Content
          </label>
          <input
            type="text"
            name="issueOpenContent"
            value={repoInfo.issueOpenContent}
            onChange={(e) => {
              handleMarkdownChange("issueOpenContent", e.target.value);
            }}
            className="leading-none text-gray-10 p-3 focus:outline-none focus:border-slate-200 mt-2 border-2 border-slate-400 bg-slate-900 rounded-full"
          />
          <button
            onClick={() => handleTogglePreview("issueOpenContent")}
            className="text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
          >
            {showPreview["issueOpenContent"]
              ? "Hide Preview ⬆️"
              : "Show Preview ⬇️"}
          </button>
          {showPreview["issueOpenContent"] && (
            <MarkdownPreview content={repoInfo.issueOpenContent} />
          )}
          <br />
        </div>

        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
          <label
            htmlFor="issueCloseContent"
            className="font-semibold leading-none text-gray-300 my-2"
          >
            Issue Close Content
          </label>
          <input
            type="text"
            name="issueCloseContent"
            value={repoInfo.issueCloseContent}
            onChange={(e) => {
              handleMarkdownChange("issueCloseContent", e.target.value);
            }}
            className="leading-none text-gray-10 p-3 focus:outline-none focus:border-slate-200 mt-2 border-2 border-slate-400 bg-slate-900 rounded-full"
          />
          <button
            onClick={() => handleTogglePreview("issueCloseContent")}
            className="text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
          >
            {showPreview["issueCloseContent"]
              ? "Hide Preview ⬆️"
              : "Show Preview ⬇️"}
          </button>
          {showPreview["issueCloseContent"] && (
            <MarkdownPreview content={repoInfo.issueCloseContent} />
          )}
        </div>

        <br />
        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
          <label
            htmlFor="pullRequestOpenContent"
            className="font-semibold leading-none text-gray-300 my-2"
          >
            Pull Request Open Content
          </label>
          <input
            type="text"
            name="pullRequestOpenContent"
            value={repoInfo.pullRequestOpenContent}
            onChange={(e) => {
              handleMarkdownChange("pullRequestOpenContent", e.target.value);
            }}
            className="leading-none text-gray-10 p-3 focus:outline-none  focus:border-slate-200 mt-2 border-2 border-slate-400 bg-slate-900 rounded-full"
          />
          <button
            onClick={() => handleTogglePreview("pullRequestOpenContent")}
            className="text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
          >
            {showPreview["pullRequestOpenContent"]
              ? "Hide Preview ⬆️"
              : "Show Preview ⬇️"}
          </button>
          {showPreview["pullRequestOpenContent"] && (
            <MarkdownPreview content={repoInfo.pullRequestOpenContent} />
          )}
          <br />
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
          <label
            htmlFor="pullRequestCloseContent"
            className="font-semibold leading-none text-gray-300 my-2"
          >
            Pull Request Close Content
          </label>
          <input
            type="text"
            name="pullRequestCloseContent"
            value={repoInfo.pullRequestCloseContent}
            onChange={(e) => {
              handleMarkdownChange("pullRequestCloseContent", e.target.value);
            }}
            className="leading-none text-gray-10 p-3 focus:outline-none  focus:border-slate-200 mt-2 border-2 border-slate-400 bg-slate-900 rounded-full"
          />
          <button
            onClick={() => handleTogglePreview("pullRequestCloseContent")}
            className="text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
          >
            {showPreview["pullRequestCloseContent"]
              ? "Hide Preview ⬆️"
              : "Show Preview ⬇️"}
          </button>
          {showPreview["pullRequestCloseContent"] && (
            <MarkdownPreview content={repoInfo.pullRequestCloseContent} />
          )}
          <br />
        </div>
        <div className="inline-flex gap-2  w-1/3  mx-auto ">
          <button
            type="submit"
            className="bg-slate-900 border-2 border-slate-400 px-5 py-2 rounded-full hover:border-slate-200 text-white"
          >
            Submit
          </button>
          <button
            className="bg-slate-900 border-2 border-slate-400 px-5 py-2 rounded-full hover:border-slate-200 text-white"
            onClick={() => handleEdit(repoInfo.repo_name)}
          >
            Update
          </button>
          <button
            className="bg-slate-900 border-2 border-slate-400 px-5 py-2 rounded-full hover:border-slate-200 text-white"
            onClick={() => handleDelete(repoInfo.repo_name)}
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

export default RepoInfo;
