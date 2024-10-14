import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/db';
import Fund from '@/models/Fund';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const funds = await Fund.find();
      res.status(200).json(funds);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch funds' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, balance } = req.body;
      
      const newFund = new Fund({
        name,
        balance,
      });
      await newFund.save();

      res.status(201).json(newFund);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create fund' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}