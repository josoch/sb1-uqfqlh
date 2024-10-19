"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Mock data (replace with actual API calls in production)
const mockFamilyFund = 5000;
const mockChildAllowance = 100;
const mockExpenses = [
  { id: 1, date: '2023-04-01', category: 'Groceries', details: 'Weekly shopping', amount: 150, user: 'Mother' },
  { id: 2, date: '2023-04-02', category: 'Entertainment', details: 'Movie night', amount: 50, user: 'Father' },
  { id: 3, date: '2023-04-03', category: 'Education', details: 'School supplies', amount: 75, user: 'Child' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [familyFund, setFamilyFund] = useState(mockFamilyFund);
  const [childAllowance, setChildAllowance] = useState(mockChildAllowance);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [newExpense, setNewExpense] = useState({ date: '', category: '', details: '', amount: '' });
  const { toast } = useToast();

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      user: 'Parent', // This should be dynamic based on the logged-in user
    };
    setExpenses([...expenses, expense]);
    setFamilyFund(familyFund - expense.amount);
    setNewExpense({ date: '', category: '', details: '', amount: '' });
    toast({
      title: "Expense added",
      description: `₦{expense.amount} added to ₦{expense.category}`,
    });
  };

  // ...
  
  const [newDeposit, setNewDeposit] = useState({ type: '', amount: '' });
  
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: newDeposit.amount, fundType: newDeposit.type }),
    });
    if (response.ok) {
      // Handle successful deposit submission
      setNewDeposit({ type: '', amount: '' });
    } else {
      // Handle error
      console.error('Failed to add deposit');
    }
  };
  
  // ...
  
  <Card>
    <CardHeader>
      <CardTitle>Family Fund</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">₦{familyFund.toFixed(2)}</p>
      <form onSubmit={handleDepositSubmit}>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" value={newDeposit.type} onChange={(e) => setNewDeposit({ ...newDeposit, type: e.target.value })}>
            <SelectItem value="Family Fund">Family Fund</SelectItem>
            <SelectItem value="Child Allowance">Child Allowance</SelectItem>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={newDeposit.amount}
            onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
            required
          />
        </div>
        <Button type="submit">Add Deposit</Button>
      </form>
    </CardContent>
  </Card>
  
  // ...
  // Calculate expense data for the pie chart
  const expenseData = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Family Finance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
  <CardHeader>
    <CardTitle>Family Fund</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">₦{familyFund.toFixed(2)}</p>
    <form onSubmit={(e) => handleDepositSubmit(e, 'Family Fund')}>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={newDeposit.amount}
          onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
          required
        />
      </div>
      <Button type="submit">Add Deposit</Button>
    </form>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Child Allowance</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">₦{childAllowance.toFixed(2)}</p>
    <form onSubmit={(e) => handleDepositSubmit(e, 'Child Allowance')}>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={newDeposit.amount}
          onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
          required
        />
      </div>
      <Button type="submit">Add Allowance</Button>
    </form>
  </CardContent>
</Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="details">Details</Label>
                <Input
                  id="details"
                  value={newExpense.details}
                  onChange={(e) => setNewExpense({...newExpense, details: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  required
                />
              </div>
            </div>
            <Button type="submit">Add Expense</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {expenses.slice(-5).reverse().map((expense) => (
                <li key={expense.id} className="flex justify-between items-center">
                  <span>{expense.date} - {expense.category}</span>
                  <span className="font-bold">₦{expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}