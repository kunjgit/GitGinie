const { repoinfo } = require("../repo_config")

const issueComment = async (context, comment_type) => {
    const user = context.payload.issue.user.login;
    const repoName = context.payload.repository.name;
    const ownerName = context.payload.repository.owner.login;

    console.log(user);
    console.log(repoName);
    console.log(ownerName);

    try {
        const repoConfigFromDB = await repoinfo.findOne({ name: ownerName, repo_name: repoName });

        const defaultIssueOpenMessage = "Thank you for your contribution to this repository! We appreciate your effort in opening issue.\nHappy coding! ";
        const defaultIssueCloseMessage = "Thank you for your contribution to this repository! We appreciate your effort in closing issue.\nHappy coding! ";
        if (repoConfigFromDB) {
            let messageContent;
            if (comment_type === "open") {
                messageContent = repoConfigFromDB.issueOpenContent;
            } else if (comment_type === "close") {
                messageContent = repoConfigFromDB.issueCloseContent;
            } else if (comment_type === "announcement") {
                messageContent = repoConfigFromDB.issueAnnouncementContent;
            }
            const issueComment = context.issue({
                body: `@${user}!\n${messageContent}`,
            });

            await context.octokit.issues.createComment(issueComment);
        } else {
            if (comment_type === "open") {
                const issueComment = context.issue({
                    body: `@${user}!\n${defaultIssueOpenMessage}`,
                });
                await context.octokit.issues.createComment(issueComment);
            } else if (comment_type === "close") {
                const issueComment = context.issue({
                    body: `@${user}!\n${defaultIssueCloseMessage}`,
                });
                await context.octokit.issues.createComment(issueComment);
            }
        }
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
    }
}

module.exports = {
    issueComment,
};
