import { Toaster, toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
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

type labelInfoState = {
  repo_name: string;
  username: string;
  issueContent: string;
  label: string;
};

const LabelInfoSchema = z.object({
  repo_name: z.string({ required_error: "This field is required." }),
  username: z.string({ required_error: "This field is required." }),
  issueContent: z.string({ required_error: "This field is required." }),
  label: z.string({ required_error: "This field is required." }),
});

const labelInformation = () => {
  const { data: session } = useSession();
  const form = useForm<labelInfoState>({
    resolver: zodResolver(LabelInfoSchema),
  });
  form.setValue("username", session?.user.github_username || "");

  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [repo, setRepo] = useState<string>();
  useEffect(() => {
    setTimeout(() => {
      if (!session?.user) {
        toast.error("You are not signed in yet ");
        setTimeout(() => {}, 2000);
      }
    }, 5000);
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

  async function handleSubmit_y(values: z.infer<typeof LabelInfoSchema>) {
    console.log("in handle submit - label config");
    try {
      console.log(session?.user?.name);
      const response = await axios.post(
        `/api/label_config/${session?.user?.github_username}`,
        values
      );

      if (response.status === 200) {
        toast.success("Label Configured Successfully");
        const updatedInfo = response.data;
        form.setValue("issueContent", "");
        form.setValue("label", "");
      }
    } catch (error) {
      console.log("Error is : ", error);
      form.setValue("issueContent", "");
      form.setValue("label", "");
    }
  }

  async function handleEdit(repo_name: string) {
    console.log("You want to edit! - Label config");
    console.log(repo_name);
    try {
      const response = await axios.put(
        `/api/label_config/${form.getValues("repo_name")}`,
        form.getValues()
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
        data: form.getValues(),
      });

      toast.success("Label Deleted Successfully");
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
              Label Configuration
            </CardTitle>
            <CardDescription>
              <i>
                <p>* Guide</p>
                <p>Select the repo</p>
                <p>
                  In issue content you have to specify the word by which you
                  want to add label
                </p>
                <p>In label you specify label</p>
              </i>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit_y)}
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
                  name="issueContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Issue Content</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Enter the Label that you want to Add
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
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

export default labelInformation;
