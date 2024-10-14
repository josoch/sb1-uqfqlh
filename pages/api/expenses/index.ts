import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/db';
import Expense from '@/models/Expense';
import Fund from '@/models/Fund';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const expenses = await Expense.find({ user: session.user.id }).sort({ date: -1 });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  } else if (req.method === 'POST') {
    try {
      const { date, category, details, amount } = req.body;
      
      // Create new expense
      const newExpense = new Expense({
        date,
        category,
        details,
        amount,
        user: session.user.id,
      });
      await newExpense.save();

      // Update Family Fund
      const familyFund = await Fund.findOne({ name: 'Family Fund' });
      if (familyFund) {
        familyFund.balance -= amount;
        await familyFund.save();
      }

      res.status(201).json(newExpense);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create expense' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}