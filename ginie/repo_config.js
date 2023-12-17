const { mongoose } = require("mongoose")

const repoConfigSchema = new mongoose.Schema({
    name: String,
    repo_name: String,
    issueOpenContent: String,
    issueCloseContent: String,
    issueAnnouncementContent: String,
    pullRequestOpenContent: String,
    pullRequestCloseContent: String,
    pullRequestAnnouncementContent: String
});

const repoinfo = mongoose.models.repoinfo || mongoose.model("repoinfo", repoConfigSchema);

module.exports = {
    repoinfo,
};
