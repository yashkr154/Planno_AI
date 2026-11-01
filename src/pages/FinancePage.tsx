import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  PieChart as PieChartIcon,
  BarChart3,
  FileSpreadsheet,
  Edit3,
  Check
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { useEvent } from '../contexts/EventContext';
import { Expense } from '../types';
import { formatCurrency, exportToCSV } from '../lib/utils';

export const FinancePage: React.FC = () => {
  const { activeEvent, expenses, addExpense, deleteExpense, updateEvent, getEventMetrics } = useEvent();

  const activeEventId = activeEvent ? activeEvent.id : '';
  const metrics = activeEventId ? getEventMetrics(activeEventId) : null;
  const eventExpenses = expenses.filter((e) => e.eventId === activeEventId);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editBudgetModalOpen, setEditBudgetModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(activeEvent?.budget || 1000000);

  // Form State
  const [category, setCategory] = useState('Venue');
  const [description, setDescription] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState(100000);
  const [actualAmount, setActualAmount] = useState(100000);
  const [paidAmount, setPaidAmount] = useState(50000);
  const [vendor, setVendor] = useState('');

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !activeEventId) return;

    addExpense({
      eventId: activeEventId,
      category,
      description,
      estimatedAmount,
      actualAmount,
      paidAmount,
      status: paidAmount >= actualAmount ? 'paid' : paidAmount > 0 ? 'pending' : 'planned',
      vendor: vendor || 'Direct Vendor',
    });

    setAddModalOpen(false);
    setDescription('');
    setVendor('');
  };

  const handleUpdateBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeEvent && newBudget > 0) {
      updateEvent(activeEvent.id, { budget: newBudget });
      setEditBudgetModalOpen(false);
    }
  };

  const handleExportLedgerCSV = () => {
    exportToCSV(`financial_ledger_${activeEvent?.title.replace(/\s+/g, '_')}.csv`, eventExpenses);
  };

  // Prepare Recharts Data
  const categoriesMap: Record<string, number> = {};
  eventExpenses.forEach((exp) => {
    categoriesMap[exp.category] = (categoriesMap[exp.category] || 0) + exp.actualAmount;
  });

  const pieData = Object.keys(categoriesMap).map((cat) => ({
    name: cat,
    value: categoriesMap[cat],
  }));

  const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E24AA', '#00ACC1'];

  const barData = eventExpenses.map((exp) => ({
    name: exp.category.slice(0, 10),
    Estimated: exp.estimatedAmount,
    Actual: exp.actualAmount,
    Paid: exp.paidAmount,
  }));

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Finance & Real-Time Budget Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track expenses, vendor disbursements, outstanding balances, and export financial ledgers for {activeEvent?.title}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setNewBudget(activeEvent?.budget || 1000000);
              setEditBudgetModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-google-blue/10 hover:bg-google-blue/20 text-google-blue dark:bg-google-blue/20 text-xs font-bold flex items-center space-x-2 transition-colors border border-google-blue/30"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Event Budget</span>
          </button>

          <button
            onClick={handleExportLedgerCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-google-green" />
            <span>Export CSV Ledger</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Budget Card with Inline Edit Trigger */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1 relative group">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Event Budget</div>
            <button
              onClick={() => {
                setNewBudget(activeEvent?.budget || 1000000);
                setEditBudgetModalOpen(true);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-google-blue hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Budget"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{formatCurrency(metrics?.totalBudget || 0, activeEvent?.currency)}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Allocated Limit</span>
            <button
              onClick={() => {
                setNewBudget(activeEvent?.budget || 1000000);
                setEditBudgetModalOpen(true);
              }}
              className="text-google-blue font-semibold hover:underline"
            >
              Change
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Actual Incurred</div>
          <div className="text-2xl font-extrabold text-google-blue">
            {formatCurrency(metrics?.actualCost || 0, activeEvent?.currency)}
          </div>
          <div className="text-[11px] text-google-blue font-semibold">
            {metrics?.percentSpent || 0}% of Allocated Budget
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Disbursed to Vendors</div>
          <div className="text-2xl font-extrabold text-google-green">
            {formatCurrency(metrics?.disbursed || 0, activeEvent?.currency)}
          </div>
          <div className="text-[11px] text-slate-500">Confirmed paid payments</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Outstanding Balance Due</div>
          <div className="text-2xl font-extrabold text-google-red">
            {formatCurrency(metrics?.outstanding || 0, activeEvent?.currency)}
          </div>
          <div className="text-[11px] text-slate-500">Pending final settlement</div>
        </div>

      </div>

      {/* Charts Section: Pie Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Pie Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-display font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <PieChartIcon className="w-5 h-5 text-google-blue" />
            <span>Category Distribution</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value, activeEvent?.currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estimated vs Actual Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-brand-charcoal border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-display font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <BarChart3 className="w-5 h-5 text-google-green" />
            <span>Expense Comparison Breakdown</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip formatter={(value: number) => formatCurrency(value, activeEvent?.currency)} />
                <Legend />
                <Bar dataKey="Estimated" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#4285F4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Paid" fill="#34A853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Itemized Expenses Table */}
      <div className="bg-white dark:bg-brand-charcoal rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Itemized Expense Ledger
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            {eventExpenses.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Estimated</th>
                <th className="p-4">Actual Cost</th>
                <th className="p-4">Disbursed</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {eventExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No expense records recorded yet. Click "Record Expense" to populate ledger.
                  </td>
                </tr>
              ) : (
                eventExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{exp.category}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{exp.description}</td>
                    <td className="p-4 text-slate-500">{exp.vendor || 'N/A'}</td>
                    <td className="p-4 text-slate-500">{formatCurrency(exp.estimatedAmount, activeEvent?.currency)}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(exp.actualAmount, activeEvent?.currency)}
                    </td>
                    <td className="p-4 font-bold text-google-green">
                      {formatCurrency(exp.paidAmount, activeEvent?.currency)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          exp.status === 'paid'
                            ? 'bg-google-green/10 text-google-green'
                            : exp.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-google-red hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {editBudgetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Edit Total Event Budget
            </h3>
            <p className="text-xs text-slate-500">
              Update total allocated budget limit for <strong className="text-slate-700 dark:text-slate-200">{activeEvent?.title}</strong>.
            </p>

            <form onSubmit={handleUpdateBudgetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Budget ({activeEvent?.currency || 'INR'} ₹)
                </label>
                <input
                  type="number"
                  required
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  step={10000}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-google-blue focus:outline-none focus:border-google-blue"
                />
              </div>

              {/* Quick Budget Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[500000, 1000000, 1500000, 2500000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNewBudget(amt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-[11px] font-semibold transition-colors"
                  >
                    {formatCurrency(amt, 'INR')}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditBudgetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-google-blue text-white font-bold flex items-center space-x-1 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Budget</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-charcoal max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Record Event Expense
            </h3>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expense Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Venue">Venue</option>
                  <option value="Catering">Catering</option>
                  <option value="Decor">Decor</option>
                  <option value="AV & Sound">AV & Sound</option>
                  <option value="Photography">Photography</option>
                  <option value="Swag & Merchandise">Swag & Merchandise</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Stage lighting & LED screens"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vendor Name
                </label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. ProLight Gujarat"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated (₹)
                  </label>
                  <input
                    type="number"
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Actual (₹)
                  </label>
                  <input
                    type="number"
                    value={actualAmount}
                    onChange={(e) => setActualAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-google-blue text-white font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
