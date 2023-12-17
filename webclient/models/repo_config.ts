import mongoose from "mongoose";
const repoConfigSchema = new mongoose.Schema({
    name : String,
    repo_name : String,
    issueOpenContent : String,
    issueCloseContent : String,
    pullRequestOpenContent : String,
    pullRequestCloseContent : String,
});

const repoConfig  = mongoose.models.repoInfo || mongoose.model("repoInfo",repoConfigSchema);
export default repoConfig;