import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  DollarSign, 
  Users, 
  Calculator, 
  Receipt,
  Trash2,
  Edit3,
  Share2,
  Download,
  PieChart,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  splitAmong: string[];
  date: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const BudgetSplitterPage: React.FC = () => {
  const { user } = useAuth();
  
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: user?.name || 'You', email: user?.email || '', avatar: user?.avatar },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
    { id: '3', name: 'Mike Chen', email: 'mike@example.com' },
    { id: '4', name: 'Emma Davis', email: 'emma@example.com' }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Hotel accommodation',
      amount: 800,
      category: 'Accommodation',
      paidBy: '1',
      splitAmong: ['1', '2', '3', '4'],
      date: '2024-03-15'
    },
    {
      id: '2',
      title: 'Flight tickets',
      amount: 1200,
      category: 'Transportation',
      paidBy: '2',
      splitAmong: ['1', '2', '3', '4'],
      date: '2024-03-14'
    },
    {
      id: '3',
      title: 'Group dinner',
      amount: 150,
      category: 'Food',
      paidBy: '3',
      splitAmong: ['1', '2', '3', '4'],
      date: '2024-03-16'
    },
    {
      id: '4',
      title: 'Museum tickets',
      amount: 80,
      category: 'Activities',
      paidBy: '1',
      splitAmong: ['1', '2', '3'],
      date: '2024-03-17'
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Food',
    paidBy: '1',
    splitAmong: participants.map(p => p.id)
  });

  const [showAddExpense, setShowAddExpense] = useState(false);

  const categories = [
    { id: 'Accommodation', color: 'bg-blue-500', icon: '🏨' },
    { id: 'Transportation', color: 'bg-green-500', icon: '✈️' },
    { id: 'Food', color: 'bg-orange-500', icon: '🍽️' },
    { id: 'Activities', color: 'bg-purple-500', icon: '🎯' },
    { id: 'Shopping', color: 'bg-pink-500', icon: '🛍️' },
    { id: 'Other', color: 'bg-gray-500', icon: '📝' }
  ];

  const calculateBalances = () => {
    const balances: { [key: string]: number } = {};
    
    // Initialize balances
    participants.forEach(p => {
      balances[p.id] = 0;
    });

    // Calculate what each person paid and owes
    expenses.forEach(expense => {
      const splitAmount = expense.amount / expense.splitAmong.length;
      
      // Person who paid gets credit
      balances[expense.paidBy] += expense.amount;
      
      // Everyone who benefits gets debited
      expense.splitAmong.forEach(personId => {
        balances[personId] -= splitAmount;
      });
    });

    return balances;
  };

  const calculateCategoryTotals = () => {
    const totals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
    });

    return totals;
  };

  const addExpense = () => {
    if (!newExpense.title || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      paidBy: newExpense.paidBy,
      splitAmong: newExpense.splitAmong,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      title: '',
      amount: '',
      category: 'Food',
      paidBy: '1',
      splitAmong: participants.map(p => p.id)
    });
    setShowAddExpense(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const toggleParticipantInSplit = (participantId: string) => {
    const isIncluded = newExpense.splitAmong.includes(participantId);
    if (isIncluded) {
      setNewExpense({
        ...newExpense,
        splitAmong: newExpense.splitAmong.filter(id => id !== participantId)
      });
    } else {
      setNewExpense({
        ...newExpense,
        splitAmong: [...newExpense.splitAmong, participantId]
      });
    }
  };

  const balances = calculateBalances();
  const categoryTotals = calculateCategoryTotals();
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || 'Unknown';
  };

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.id === category)?.color || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.id === category)?.icon || '📝';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to use the budget splitter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Splitter</h1>
            <p className="text-gray-600">Easily split expenses and track group spending</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Expenses</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
                <p className="text-sm text-gray-600">Participants</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${Math.round(totalExpenses / participants.length).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Per Person</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expenses List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Expenses</h2>
                <span className="text-sm text-gray-600">{expenses.length} items</span>
              </div>

              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg ${getCategoryColor(expense.category)} flex items-center justify-center text-white text-lg`}>
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                        <p className="text-sm text-gray-600">
                          Paid by {getParticipantName(expense.paidBy)} • Split among {expense.splitAmong.length} people
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${expense.amount}</p>
                        <p className="text-sm text-gray-600">${(expense.amount / expense.splitAmong.length).toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Expense Form */}
              {showAddExpense && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Expense</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={newExpense.title}
                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                        placeholder="What did you spend on?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.id}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paid by</label>
                      <select
                        value={newExpense.paidBy}
                        onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {participants.map(participant => (
                          <option key={participant.id} value={participant.id}>
                            {participant.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Split among</label>
                    <div className="flex flex-wrap gap-2">
                      {participants.map(participant => (
                        <button
                          key={participant.id}
                          onClick={() => toggleParticipantInSplit(participant.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newExpense.splitAmong.includes(participant.id)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {participant.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddExpense(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addExpense}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all"
                    >
                      Add Expense
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Balance Summary & Categories */}
          <div className="space-y-6">
            {/* Balance Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Balance Summary</h2>
              
              <div className="space-y-4">
                {participants.map(participant => {
                  const balance = balances[participant.id];
                  const isPositive = balance > 0;
                  const isZero = Math.abs(balance) < 0.01;
                  
                  return (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {participant.avatar ? (
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">
                              {participant.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{participant.name}</span>
                      </div>
                      
                      <div className={`text-sm font-semibold ${
                        isZero ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isZero ? 'Settled' : (isPositive ? '+' : '') + `$${Math.abs(balance).toFixed(2)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
              
              <div className="space-y-4">
                {Object.entries(categoryTotals).map(([category, amount]) => {
                  const percentage = (amount / totalExpenses) * 100;
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(category)}</span>
                          <span className="font-medium text-gray-900">{category}</span>
                        </div>
                        <span className="font-semibold text-gray-900">${amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(category)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BudgetSplitterPage;