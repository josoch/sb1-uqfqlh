import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, fundType } = req.body;

    if (fundType === 'Family Fund') {
      setFamilyFund(familyFund + parseFloat(amount));
    } else {
      setChildAllowance(childAllowance + parseFloat(amount));
    }

    res.status(201).json({ message: 'Deposit added successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}