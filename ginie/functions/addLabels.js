const { labelConfig } = require("../label_config");


const addLabels = async (context) => {
    const issue = context.payload.issue;
    const repo = context.repo();
    const repoName = context.payload.repository.name;
    const ownerName = context.payload.repository.owner.login;
    const issueText = issue.body;
    if (issueText) {

        const predefinedLabels = analyzeIssueText(issueText);

        const labelConfigFromDB = await labelConfig.find({ name: ownerName, repo_name: repoName });
        const userDefinedLabels = labelConfigFromDB.map(config => config.label);

        const allLabels = [...predefinedLabels, ...userDefinedLabels];

        if (allLabels.length > 0) {
            await context.octokit.issues.addLabels({
                ...repo,
                issue_number: issue.number,
                labels: allLabels,
            });
        }
    }
}

function analyzeIssueText(issueText) {
    const labels = [];
    const keywords = {
        bug: ["bug", "issue", "error", "problem", "defect", "glitch", "malfunction", "fault", "anomaly", "irregularity", "flaw", "failure"],
        documentation: ["documentation", "docs", "manual", "guide", "reference", "tutorial", "handbook"],
        goodFirstIssue: ["good first issue", "beginner-friendly", "starter issue", "newcomer friendly", "easy", "first timers only"],
        enhancement: ["enhancement", "improvement", "feature", "upgrade", "advancement", "refinement", "development", "progress"],
        question: ["question", "help", "clarification", "inquiry", "query", "doubt", "enquiry", "interrogation"],
        invalid: ["invalid", "not a bug", "won't fix", "unrelated", "inappropriate", "irrelevant", "incorrect", "wrong"],
        duplicate: ["duplicate", "repeated issue", "copy", "clone", "replica", "duplication", "repetition", "redundancy"],
        performance: ["performance", "speed", "efficiency", "effectiveness", "productivity", "optimization", "execution", "operation"],
        security: ["security", "vulnerability", "exploit", "risk", "threat", "hazard", "danger", "insecurity"],
        ui: ["ui", "user interface", "ux", "user experience", "design", "layout", "usability", "look and feel"],
        testing: ["testing", "test case", "validation", "verification", "examination", "inspection", "check", "review"],
        maintenance: ["maintenance", "cleanup", "refactoring", "repair", "overhaul", "service", "upkeep", "conservation"],
        design: ["design", "layout", "template", "pattern", "blueprint", "model", "scheme", "structure"],
        backend: ["backend", "server", "database", "storage", "infrastructure", "system", "framework", "platform"],
        frontend: ["frontend", "client", "interface", "presentation", "display", "view", "appearance", "visualization"],
        api: ["api", "endpoint", "request", "response", "service", "protocol", "interface", "connection"],
        deployment: ["deployment", "release", "publish", "launch", "rollout", "implementation", "installation", "setup"],
        research: ["research", "investigation", "study", "analysis", "examination", "exploration", "inquiry", "scrutiny"],
        discussion: ["discussion", "talk", "conversation", "debate", "dialogue", "discourse", "exchange", "consultation"]
    };
    for (const label in keywords) {
        const labelKeywords = keywords[label];
        if (labelKeywords.some(keyword => issueText.includes(keyword))) {
            labels.push(label);
        }
    }

    return labels;
}

module.exports = {
    addLabels
}