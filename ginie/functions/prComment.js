const { repoinfo } = require("../repo_config");

const prComment = async (context, comment_type) => {
    const { user, base, number } = context.payload.pull_request;

    const prUser = user.login;
    const repoName = base.repo.name;
    const ownerName = base.repo.owner.login;

    try {
        const repoConfigFromDB = await repoinfo.findOne({ name: ownerName, repo_name: repoName });
        const defaultIssueOpenMessage = "Thank you for your contribution to this repository! We appreciate your effort in opening pull request.\nHappy coding! ";
        const defaultIssueCloseMessage = "Thank you for your contribution to this repository! We appreciate your effort in closing pull request.\nHappy coding! ";
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
            if (comment_type === "open") {
                await context.octokit.pulls.createReview({
                    owner: ownerName,
                    repo: repoName,
                    pull_number: number,
                    event: "COMMENT",
                    body: `@${prUser}\n${defaultIssueOpenMessage}`,
                });
            } else if (comment_type === "close") {
                await context.octokit.pulls.createReview({
                    owner: ownerName,
                    repo: repoName,
                    pull_number: number,
                    event: "COMMENT",
                    body: `@${prUser}\n${defaultIssueCloseMessage}`,
                });
            }
        }
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
    }
};

module.exports = {
    prComment,
};
