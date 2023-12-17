const { connectDatabase } = require("./server")
const { issueComment } = require("./functions/issueComment")
const { prComment } = require("./functions/prComment");
const { addLabels } = require("./functions/addLabels");

connectDatabase();

module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    addLabels(context)
    issueComment(context, "open")
    await context.octokit.reactions.createForIssue({
      ...context.repo(),
      issue_number: context.payload.issue.number,
      content: 'rocket',
    });
  });

  app.on("issues.closed", async (context) => {
    issueComment(context, "close")
    await context.octokit.reactions.createForIssue({
      ...context.repo(),
      issue_number: context.payload.issue.number,
      content: '+1',
    });
  });

  app.on("pull_request.opened", async (context) => {
    prComment(context, "open")
  });

  app.on("pull_request.closed", async (context) => {
    prComment(context, "close")
  });

  app.on("issue_comment.created", async (context) => {
    const comment = context.payload.comment.body;
    const issue = context.issue();
    const repo = context.repo();
    const commenter = context.payload.comment.user.login;
    const isBot = context.payload.comment.user.type === "Bot";

    console.log(comment);
    await context.octokit.reactions.createForIssueComment({
      ...repo,
      comment_id: context.payload.comment.id,
      content: "eyes",
    });

    if (!isBot && comment.includes("/assign")) {
      const currentAssignees = await context.octokit.issues.listAssignees({
        ...repo,
        issue_number: issue.issue_number,
      });

      const assignees = currentAssignees.data || [];
      const filteredAssignees = assignees.filter(
        (assignee) => assignee.login !== repo.owner
      );

      if (filteredAssignees.length === 0) {
        await context.octokit.issues.addAssignees({
          ...repo,
          issue_number: issue.issue_number,
          assignees: [commenter],
        });

        const messageContent = `Issue #${issue.issue_number} assigned to @${commenter}`;
        const issueComment = context.issue({
          body: `${messageContent}`,
        });

        await context.octokit.issues.createComment(issueComment);

        await context.octokit.reactions.createForIssueComment({
          ...repo,
          comment_id: context.payload.comment.id,
          content: "heart",
        });
      }
      else {
        await context.octokit.reactions.createForIssueComment({
          ...repo,
          comment_id: context.payload.comment.id,
          content: "confused",
        });
      }
    }
  });

};