import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Toaster, toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type MarkdownPreviewProps = {
  content: string;
};

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

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

const RepoInfoSchema = z.object({
  repo_name: z.string({ required_error: "Repository name is required." }),
  issueOpenContent: z.string({ required_error: "This field is required." }),
  issueCloseContent: z.string({ required_error: "This field is required." }),
  pullRequestOpenContent: z.string({
    required_error: "This field is required.",
  }),
  pullRequestCloseContent: z.string({
    required_error: "This field is required.",
  }),
});

const RepoInfo = () => {
  const { data: session } = useSession();
  // const [repoInfo, setRepoInfo] = useState<RepoInfoState>({
  //   repo_name: "",
  //   issueOpenContent: "",
  //   issueCloseContent: "",
  //   pullRequestOpenContent: "",
  //   pullRequestCloseContent: "",
  // });

  const form = useForm<RepoInfoState>({
    resolver: zodResolver(RepoInfoSchema),
  });

  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState<ShowPreviewState>({});
  const [repo, setRepo] = useState<string>();


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
        const { data, status } = await axios.get(
          `/api/repo_config/${form.getValues("repo_name")}`
        );
        console.log("Fetching details of repo : ", data);
        console.log("Response status: ", status);

        if (status === 200) {
          const info = data;
          console.log("Repo info: ", info);
          form.setValue("issueOpenContent", info.issueOpenContent || "");
          form.setValue("issueCloseContent", info.issueCloseContent || "");
          form.setValue(
            "pullRequestOpenContent",
            info.pullRequestOpenContent || ""
          );
          form.setValue(
            "pullRequestCloseContent",
            info.pullRequestCloseContent || ""
          );
        }
      } catch (error) {
        console.log("Error fetching repo info: ", error);
        form.setValue("repo_name", "");
        form.setValue("issueOpenContent", "");
        form.setValue("issueCloseContent", "");
        form.setValue("pullRequestOpenContent", "");
        form.setValue("pullRequestCloseContent", "");
      }
    };

    if (form.getValues("repo_name")) {
      fetchRepoInfo();
    }
  }, [form.getValues("repo_name")]);

  const handleMarkdownChange = (field: keyof RepoInfoState, value: string) => {
    form.setValue(field, value);
  };

  const handleTogglePreview = (field: keyof ShowPreviewState) => {
    setShowPreview((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  async function handleSubmit_x(values: z.infer<typeof RepoInfoSchema>) {
    console.log("in handle submit");
    try {
      console.log("Values in submit : ", values);
      console.log(session?.user?.name);
      const response = await axios.post(
        `/api/repo_config/${session?.user?.github_username}`,
        values
      );

      if (response.status === 200) {
        const updatedInfo = response.data;
        form.setValue("issueOpenContent", "");
        form.setValue("issueCloseContent", "");
        form.setValue("pullRequestOpenContent", "");
        form.setValue("pullRequestCloseContent", "");

        toast.success("Repo Configured Successfully");
      }
    } catch (error) {
      console.log("Error is : ", error);
    }
  }
  async function repoNameChange(value: string) {
    console.log("The repo name is : ", value);
    setRepo(value);
  }
  async function handleEdit(repo_name: string) {
    console.log("You want to edit!");
    console.log(repo_name);
    try {
      const response = await axios.put(
        `/api/repo_config/${repo_name}`,
        form.getValues()
      );
      toast.success("Repo Updated Successfully");
    } catch (error) {
      console.log("error found", error);
    }
  }

  async function handleDelete(repo_name: string) {
    console.log("You want to delete");
    console.log(repo_name);
    try {
      const response = await axios.delete(`/api/repo_config/${repo_name}`);
      toast.success("Repo Config Deleted Successfully");
      form.setValue("repo_name", "");
      form.setValue("issueOpenContent", "");
      form.setValue("issueCloseContent", "");
      form.setValue("pullRequestOpenContent", "");
      form.setValue("pullRequestCloseContent", "");
    } catch (error) {
      console.log("error found", error);
    }
  }

  return session?.user ? (
    <>
      <div>
        <Toaster />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-5xl text-center font-ginie">
              Repository Configuration
            </CardTitle>
            <CardDescription>
              <i>
                <p>* Guide</p>
                <p>Select the repo</p>
                <p>
                  In every field you have to specify the message you want to
                  display on respective actions.
                </p>
                <p>You can specify the message in markdown format also.</p>
              </i>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit_x)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="repo_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Select Repository
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a repository" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-black dark:text-white text-black">
                          {userRepos.map((repo, index) => (
                            <SelectItem value={repo}>{repo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueOpenContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Issue Open Content
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        <center>
                          <Button
                            onClick={() =>
                              handleTogglePreview("issueOpenContent")
                            }
                            className=" text-black dark:text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
                            type="button"
                          >
                            {showPreview["issueOpenContent"]
                              ? "Hide Preview ⬆️"
                              : "Show Preview ⬇️"}
                          </Button>
                        </center>
                        <center>
                          {showPreview["issueOpenContent"] && (
                            <MarkdownPreview content={field.value} />
                          )}
                        </center>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueCloseContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Issue Close Content
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        <center>
                          <Button
                            onClick={() =>
                              handleTogglePreview("issueCloseContent")
                            }
                            className=" text-black dark:text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
                            type="button"
                          >
                            {showPreview["issueCloseContent"]
                              ? "Hide Preview ⬆️"
                              : "Show Preview ⬇️"}
                          </Button>
                        </center>
                        <center>
                          {showPreview["issueCloseContent"] && (
                            <MarkdownPreview content={field.value} />
                          )}
                        </center>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pullRequestOpenContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Pull Request Open Content
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        <center>
                          <Button
                            onClick={() =>
                              handleTogglePreview("pullRequestOpenContent")
                            }
                            className=" text-black dark:text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
                            type="button"
                          >
                            {showPreview["pullRequestOpenContent"]
                              ? "Hide Preview ⬆️"
                              : "Show Preview ⬇️"}
                          </Button>
                        </center>
                        <center>
                          {showPreview["pullRequestOpenContent"] && (
                            <MarkdownPreview content={field.value} />
                          )}
                        </center>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pullRequestCloseContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Pull Request Close Content
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        <center>
                          <Button
                            onClick={() =>
                              handleTogglePreview("pullRequestCloseContent")
                            }
                            className=" text-black dark:text-slate-200 my-2 focus:underline hover:underline focus:outline-none ml-2"
                            type="button"
                          >
                            {showPreview["pullRequestCloseContent"]
                              ? "Hide Preview ⬆️"
                              : "Show Preview ⬇️"}
                          </Button>
                        </center>
                        <center>
                          {showPreview["pullRequestCloseContent"] && (
                            <MarkdownPreview content={field.value} />
                          )}
                        </center>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="gap-2 w-64 mx-auto flex flex-col items-center ">
                  <Button
                    type="submit"
                    variant={"default"}
                    className="text-white bg-green-700 rounded-3 w-full hover:bg-green-300 hover:text-green-900 font-sec"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {" "}
            <div className="gap-2 w-64 mx-auto flex flex-row items-center ">
              <Button
                className="text-white bg-blue-600 rounded-3 w-full  hover:bg-blue-300 hover:text-blue-900 font-sec"
                onClick={() => handleEdit(form.getValues("repo_name"))}
              >
                Update
              </Button>
              <Button
                variant={"destructive"}
                className="text-white bg-red-600 rounded-3 w-full  hover:bg-red-300 hover:text-red-900 font-sec"
                onClick={() => handleDelete(form.getValues("repo_name"))}
              >
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  ) : (
    <>
      <Toaster />{" "}
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

export default RepoInfo;
