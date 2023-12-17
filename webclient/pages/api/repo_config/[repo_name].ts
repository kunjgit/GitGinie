import type { NextApiRequest, NextApiResponse } from 'next';
import repoConfig from '@models/repo_config';
import  dbConnect  from '@utils/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
  } = req;

  const username = req.url?.split("/repo_config/")[1];


  console.log('username: ', username);

  await dbConnect();

  switch (method) {
    case 'GET' : 
    try {
      const username = req.url?.split("/repo_config/")[1];

      const findRepo = await repoConfig.findOne({ repo_name: username });
      if (!findRepo) {
        console.log("Couldn't find repo")
        return res.status(404).json({ message: 'Repo not found' });
      }
      return res.status(200).json(findRepo);
    } catch (error) {
      console.error('Error updating repo info:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
      
    case 'POST':
      try {
        const reqBody = await req.body;
        const {
          repo_name,
          issueOpenContent,
          issueCloseContent,
          pullRequestOpenContent,
          pullRequestCloseContent,
        } = reqBody;
        console.log(reqBody);
        const findRepo = await repoConfig.findOne({ repo_name: repo_name });

        if (findRepo) {
          return res.status(400).json({ error: 'Repo already exists, edit if needed' });
        }

        const newRepo = new repoConfig({
          name: username,
          repo_name,
          issueOpenContent,
          issueCloseContent,
          pullRequestOpenContent,
          pullRequestCloseContent,
        });

        const repoEntry = await newRepo.save();

        return res.status(200).json({
          message: 'Repo info saved successfully',
          success: true,
          repoEntry,
        });

      } catch (error) {
        console.error('Error saving repo info:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'PUT':
      try {
        const reqBody = await req.body;
        const {
          issueOpenContent,
          issueCloseContent,
          pullRequestOpenContent,
          pullRequestCloseContent,
        } = reqBody;
        console.log(reqBody);
        const findRepo = await repoConfig.findOne({ repo_name: username });

        if (!findRepo) {
          return res.status(404).json({ message: 'Repo not found' });
        }

        const updatedRepo = await repoConfig.updateOne(
          { repo_name: username },
          {
            $set: {
              issueOpenContent,
              issueCloseContent,
              pullRequestOpenContent,
              pullRequestCloseContent,
            },
          }
        );

        return res.status(200).json({
          message: 'Successfully Updated',
        });

      } catch (error) {
        console.error('Error updating repo info:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'DELETE':
      try {
        const findRepo = await repoConfig.deleteOne({ repo_name: username });

        if (!findRepo) {
          return res.status(404).json({ error: 'Repo not found' });
        }

        return res.status(200).json({ message: 'Repo deleted' });

      } catch (error) {
        console.error('Error deleting repo info:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
