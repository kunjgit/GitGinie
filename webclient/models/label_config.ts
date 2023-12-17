import mongoose from "mongoose";
const labelConfigSchema = new mongoose.Schema({
    repo_name: String,
    name: String,
    issueContent: String,
    label: String,
});

const labelConfig  = mongoose.models.labelInfo || mongoose.model("labelInfo",labelConfigSchema);
export default labelConfig;