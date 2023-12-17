import type { NextApiRequest, NextApiResponse } from 'next';
import labelConfig from '@models/label_config';
import dbConnect from '@utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
  } = req;

  const repoName = req.url?.split("/label_config/")[1];

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        console.log("in put method of label config")
        const reqBody = req.body;
        const { issueContent, label } = reqBody;
        console.log(repoName);
        console.log(issueContent);
        console.log(label);
        // const findLabel = await labelConfig.findOne({
        //   repo_name: repoName,
        //   issueContent : issueContent
        // });
        // console.log(findLabel)
        // if (!findLabel) {
        //   return res.status(404).json({ message: 'Label configuration not found' });
        // }

        const updatedLabel = await labelConfig.findOneAndReplace(
          {
            repo_name: repoName,
            issueContent : issueContent
          },
          {
            $set: {
              label
            },
          }
        );

        return res.status(200).json({
          message: 'Label configuration successfully updated',
        });

      } catch (error) {
        console.error('Error updating label configuration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      try {
        const reqBody = await req.body;
        const { repo_name, issueContent, label } = reqBody;

        const findLabel = await labelConfig.findOne({
          repo_name: repo_name,
          name: repoName,
          issueContent: issueContent,
          label: label,
        });

        if (findLabel) {
          return res.status(400).json({ error: 'Label configuration already exists, edit if needed' });
        }

        const newLabel = new labelConfig({
          name: repoName,
          repo_name: repo_name,
          issueContent: issueContent,
          label: label,
        });

        const labelEntry = await newLabel.save();

        return res.status(200).json({
          message: 'Label configuration saved successfully',
          success: true,
          labelEntry,
        });

      } catch (error) {
        console.error('Error saving label configuration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

 
    case 'DELETE':
      try {
        const { name, issueContent, label } = await req.body;
        console.log(repoName);
        console.log(issueContent);
        console.log(label);
        console.log("Delete method of label config api")
        const findLabel = await labelConfig.findOneAndDelete({
          repo_name: repoName,
          issueContent: issueContent,
          label: label,
        });

        if (!findLabel) {
          return res.status(404).json({ error: 'Label configuration not found' });
        }

        return res.status(200).json({ message: 'Label configuration deleted' });

      } catch (error) {
        console.error('Error deleting label configuration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
