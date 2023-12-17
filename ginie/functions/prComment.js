const { repoinfo } = require("../repo_config");

const prComment = async (context, comment_type) => {
    const { user, base, number } = context.payload.pull_request;

    const prUser = user.login;
    const repoName = base.repo.name;
    const ownerName = base.repo.owner.login;

    try {
        const repoConfigFromDB = await repoinfo.findOne({ name: ownerName, repo_name: repoName });

        if (repoConfigFromDB) {
            let messageContent;
            if (comment_type === "open") {
                messageContent = repoConfigFromDB.pullRequestOpenContent;
            } else if (comment_type === "close") {
                messageContent = repoConfigFromDB.pullRequestCloseContent;
            }

            await context.octokit.pulls.createReview({
                owner: ownerName,
                repo: repoName,
                pull_number: number,
                event: "COMMENT",
                body: `@${prUser} ${messageContent}`,
            });

        } else {
            console.error("RepoConfig not found in MongoDB.");
        }
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
    }
};

module.exports = {
    prComment,
};
