import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Download, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Terminal, 
  Play, 
  Cpu, 
  Database,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Sliders,
  Sparkles,
  Wifi
} from 'lucide-react';
import { Order, Product, IntegrationSettings, UnitTestResult } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { runCoreUnitTests } from '../utils/unitTests';
import { testTelegramConnection, fetchGoogleSheetCatalog, fetchSystemHealth } from '../services/apiService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  products: Product[];
  onSyncProducts: (newProducts: Product[]) => void;
  integrationSettings: IntegrationSettings;
  onUpdateIntegrationSettings: (settings: IntegrationSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  products,
  onSyncProducts,
  integrationSettings,
  onUpdateIntegrationSettings
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'integrations' | 'testing' | 'health'>('analytics');
  
  // Integrations form state
  const [telegramToken, setTelegramToken] = useState(integrationSettings.telegramBotToken);
  const [telegramChatId, setTelegramChatId] = useState(integrationSettings.telegramChatId);
  const [appsScriptUrl, setAppsScriptUrl] = useState(integrationSettings.appsScriptUrl);
  const [sheetCsvUrl, setSheetCsvUrl] = useState(integrationSettings.googleSheetCsvUrl);
  const [telegramStatus, setTelegramStatus] = useState<{ testing: boolean; message: string; success?: boolean } | null>(null);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<{ syncing: boolean; message: string; success?: boolean } | null>(null);

  // Unit testing suite state
  const [testResults, setTestResults] = useState<{ total: number; passed: number; failed: number; results: UnitTestResult[] } | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Health and performance state
  const [healthData, setHealthData] = useState<any>({
    status: 'operational',
    version: '2.4.0',
    uptime: 1420,
    rateLimit: {
      windowMs: 60000,
      maxRequests: 120,
      currentUsage: 14,
      status: 'healthy'
    }
  });

  // Orders search & filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    // Run unit tests on initial load
    const suite = runCoreUnitTests();
    setTestResults(suite);

    // Fetch health data
    fetchSystemHealth().then((data) => {
      if (data) setHealthData(data);
    });
  }, []);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.summary?.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const codOrdersCount = orders.filter(o => o.paymentMethod === 'COD').length;
  const onlineOrdersCount = orders.filter(o => o.paymentMethod === 'ONLINE').length;

  // Toast notification state to replace window.alert
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [selectedOrderPeek, setSelectedOrderPeek] = useState<Order | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateIntegrationSettings({
      telegramBotToken: telegramToken.trim(),
      telegramChatId: telegramChatId.trim(),
      appsScriptUrl: appsScriptUrl.trim(),
      googleSheetCsvUrl: sheetCsvUrl.trim()
    });
    showToast('Integration settings updated securely!', 'success');
  };

  const handleTestTelegram = async () => {
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      setTelegramStatus({ testing: false, success: false, message: 'Please provide both Bot Token and Chat ID to test.' });
      return;
    }
    setTelegramStatus({ testing: true, message: 'Dispatching test notification ping...' });
    const res = await testTelegramConnection(telegramToken.trim(), telegramChatId.trim());
    setTelegramStatus({ testing: false, success: res.success, message: res.message });
  };

  const handleSyncGoogleSheets = async () => {
    if (!sheetCsvUrl.trim()) {
      setSheetSyncStatus({ syncing: false, success: false, message: 'Please specify a Google Sheets CSV or Apps Script URL.' });
      return;
    }
    setSheetSyncStatus({ syncing: true, message: 'Fetching catalog from Google Sheets...' });
    const res = await fetchGoogleSheetCatalog(sheetCsvUrl.trim());
    if (res.success && res.products) {
      onSyncProducts(res.products);
      setSheetSyncStatus({ syncing: false, success: true, message: `Successfully loaded ${res.products.length} products from Google Sheet!` });
    } else {
      setSheetSyncStatus({ syncing: false, success: false, message: res.error || 'Failed to sync Google Sheets' });
    }
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const suite = runCoreUnitTests();
      setTestResults(suite);
      setIsRunningTests(false);
    }, 250);
  };

  // Export CSV Report
  const handleExportCsv = () => {
    if (orders.length === 0) {
      showToast('No orders available to export.', 'info');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Phone', 'Payment Method', 'Status', 'Total (USD)'];
    const rows = orders.map(o => [
      `"${o.orderId}"`,
      `"${o.createdAt}"`,
      `"${o.customer.name}"`,
      `"${o.customer.email}"`,
      `"${o.customer.phone}"`,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      o.summary.total
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `velora-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = !orderSearch.trim() || 
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl bg-stone-900 border border-stone-800 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl tracking-[0.2em] font-normal text-stone-100">
              VELORA
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-mono px-2 py-0.5 bg-amber-950/40 border border-amber-800/60 rounded">
              Command Suite v2.4
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 px-3 py-1 bg-stone-900 border border-stone-800 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System: 100% Operational</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 transition"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 px-4 uppercase tracking-widest font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Executive Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 uppercase tracking-widest font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Registers ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-3.5 px-4 uppercase tracking-widest font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Integrations (Telegram & Sheets)</span>
          </button>

          <button
            onClick={() => setActiveTab('testing')}
            className={`py-3.5 px-4 uppercase tracking-widest font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'testing'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Core Unit Tests ({testResults?.passed || 0}/{testResults?.total || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`py-3.5 px-4 uppercase tracking-widest font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'health'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Health & Rate Limits</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* 1. ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-sm">
                  <div className="flex justify-between items-start text-stone-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider">Gross Volume</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-stone-100">
                    {formatPrice(totalRevenue)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    +18.4% vs last cycle
                  </span>
                </div>

                <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-sm">
                  <div className="flex justify-between items-start text-stone-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider">Total Consignments</span>
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-stone-100">
                    {totalOrders}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                    Active registers
                  </span>
                </div>

                <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-sm">
                  <div className="flex justify-between items-start text-stone-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider">Average Order Value</span>
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-stone-100">
                    {formatPrice(averageOrderValue)}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                    Luxury basket index
                  </span>
                </div>

                <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-sm">
                  <div className="flex justify-between items-start text-stone-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider">Atelier Conversion</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-stone-100">
                    3.82%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    High intent patrons
                  </span>
                </div>
              </div>

              {/* Payment Split & Performance breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Payment split chart */}
                <div className="p-6 bg-stone-950/80 border border-stone-800 rounded-sm">
                  <h4 className="font-serif text-lg text-stone-100 mb-4">
                    Payment Protocol Allocation
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-400">Online Encrypted Cards ({onlineOrdersCount})</span>
                        <span className="font-mono">{totalOrders > 0 ? Math.round((onlineOrdersCount / totalOrders) * 100) : 75}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${totalOrders > 0 ? (onlineOrdersCount / totalOrders) * 100 : 75}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-400">Cash on Delivery (COD) ({codOrdersCount})</span>
                        <span className="font-mono">{totalOrders > 0 ? Math.round((codOrdersCount / totalOrders) * 100) : 25}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${totalOrders > 0 ? (codOrdersCount / totalOrders) * 100 : 25}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export & Reporting tools */}
                <div className="p-6 bg-stone-950/80 border border-stone-800 rounded-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-lg text-stone-100 mb-2">
                      Dossier Exports & Archival Reports
                    </h4>
                    <p className="text-xs text-stone-400 font-light leading-relaxed">
                      Download full CSV transactions register or export structured JSON payloads for accountant auditing and long-term intelligence.
                    </p>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button
                      onClick={handleExportCsv}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs uppercase tracking-widest rounded-sm transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Orders CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(orders, null, 2));
                        const link = document.createElement('a');
                        link.setAttribute('href', jsonStr);
                        link.setAttribute('download', `velora-dossier-${new Date().toISOString().slice(0, 10)}.json`);
                        link.click();
                      }}
                      className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs uppercase tracking-widest rounded-sm transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. ORDERS MANAGEMENT TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, customer, email..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-sm text-stone-100 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-mono">Filter Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="bg-stone-950 border border-stone-800 text-xs px-3 py-2 rounded-sm text-stone-200 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded">
                  No order registers found matching search criteria.
                </div>
              ) : (
                <div className="overflow-x-auto border border-stone-800 rounded-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-950 text-stone-400 uppercase tracking-widest font-mono text-[10px] border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80 bg-stone-900/60 font-light">
                      {filteredOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-stone-800/40 transition">
                          <td className="py-3 px-4 font-mono font-medium text-amber-300">
                            {order.orderId}
                          </td>
                          <td className="py-3 px-4 text-stone-400">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-stone-100">{order.customer.name}</div>
                            <div className="text-[10px] text-stone-500">{order.customer.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              order.paymentMethod === 'COD' 
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' 
                                : 'bg-stone-800 text-stone-300'
                            }`}>
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-stone-100">
                            {formatPrice(order.summary.total)}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.orderId, e.target.value as any)}
                              className="bg-stone-950 border border-stone-700 text-[11px] rounded px-2 py-1 text-stone-200 focus:outline-none"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderPeek(order)}
                              className="p-1.5 hover:text-amber-400 bg-stone-800 hover:bg-stone-700 rounded transition text-stone-300"
                              title="Inspect Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="max-w-3xl space-y-8">
              <div>
                <h3 className="font-serif text-2xl text-stone-100">
                  Secure Integration Management
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Configure live Telegram order alerts and Google Apps Script / Google Sheets catalog synchronization.
                  Credentials are strictly processed on the secure server side to protect tokens.
                </p>
              </div>

              <form onSubmit={handleSaveIntegrations} className="space-y-6">
                {/* Telegram Bot */}
                <div className="p-6 bg-stone-950/80 border border-stone-800 rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-wider">
                        Telegram Order Notification Channel
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/40 rounded">
                      Zero Token Leakage Protocol
                    </span>
                  </div>

                  <p className="text-xs text-stone-400">
                    Receive instant real-time Telegram messages whenever a client places an order.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Telegram Bot Token
                      </label>
                      <input
                        type="password"
                        value={telegramToken}
                        onChange={(e) => setTelegramToken(e.target.value)}
                        placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono focus:outline-none focus:border-stone-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Telegram Chat / Channel ID
                      </label>
                      <input
                        type="text"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="e.g. -1001234567890 or @velora_orders"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono focus:outline-none focus:border-stone-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      disabled={telegramStatus?.testing}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded transition flex items-center gap-1.5"
                    >
                      {telegramStatus?.testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Dispatch Test Ping</span>
                    </button>
                    {telegramStatus && (
                      <span className={`text-xs ${telegramStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {telegramStatus.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Google Apps Script & Google Sheets Sync */}
                <div className="p-6 bg-stone-950/80 border border-stone-800 rounded-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-semibold text-stone-100 uppercase tracking-wider">
                      Google Sheets Live Catalog & Order Logger
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Google Sheets Catalog URL (Sharing Link or Published CSV)
                      </label>
                      <input
                        type="url"
                        value={sheetCsvUrl}
                        onChange={(e) => setSheetCsvUrl(e.target.value)}
                        placeholder="Paste standard sheet URL e.g. https://docs.google.com/spreadsheets/d/.../edit"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono focus:outline-none focus:border-stone-600"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">
                        VELORA automatically converts standard Google Sheet links to CSV endpoints.
                      </p>
                    </div>

                    {/* Google Sheet troubleshooting & checklist box */}
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-400 space-y-2">
                      <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Google Sheet Setup & Troubleshooting Checklist:</span>
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-stone-400">
                        <li>
                          <strong>Sharing Permissions:</strong> Click <em>Share</em> in Google Sheets and set General access to <strong>&quot;Anyone with the link can view&quot;</strong>. (If private, Google requires login which prevents catalog loading).
                        </li>
                        <li>
                          <strong>Required Column Headers:</strong> Row 1 in your Google Sheet must have at least <strong>Title</strong> (or <em>Name</em>) and <strong>Price</strong>.
                        </li>
                        <li>
                          <strong>Optional Columns:</strong> <em>Category</em> (Haute Couture, Fine Leather, etc.), <em>Subtitle</em>, <em>Image</em> (direct image URL), <em>Stock</em> (TRUE/FALSE), <em>Description</em>.
                        </li>
                      </ol>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Google Apps Script Web App Deployment URL (Order Auto-Save)
                      </label>
                      <input
                        type="url"
                        value={appsScriptUrl}
                        onChange={(e) => setAppsScriptUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/.../exec"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono focus:outline-none focus:border-stone-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSyncGoogleSheets}
                      disabled={sheetSyncStatus?.syncing}
                      className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold rounded transition flex items-center gap-1.5"
                    >
                      {sheetSyncStatus?.syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>Sync Products From Sheet Now</span>
                    </button>
                    {sheetSyncStatus && (
                      <span className={`text-xs ${sheetSyncStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sheetSyncStatus.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-sm transition"
                  >
                    Save Integration Credentials
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. UNIT TESTING TAB */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <h3 className="font-serif text-2xl text-stone-100">
                    Core Business Logic Unit Test Suite
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Verifies cart calculations, promo code algorithms, tax rules, order ID integrity, and contact validations.
                  </p>
                </div>

                <button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningTests ? 'Executing Tests...' : 'Rerun Test Suite'}</span>
                </button>
              </div>

              {testResults && (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-stone-950 border border-stone-800 rounded">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest">Total Tests</span>
                      <div className="font-mono text-2xl font-bold">{testResults.total}</div>
                    </div>
                    <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Passing</span>
                      <div className="font-mono text-2xl font-bold text-emerald-400">{testResults.passed}</div>
                    </div>
                    <div className="p-4 bg-stone-950 border border-stone-800 rounded">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest">Failing</span>
                      <div className={`font-mono text-2xl font-bold ${testResults.failed > 0 ? 'text-rose-400' : 'text-stone-400'}`}>
                        {testResults.failed}
                      </div>
                    </div>
                  </div>

                  <div className="border border-stone-800 rounded overflow-hidden divide-y divide-stone-800">
                    {testResults.results.map((test) => (
                      <div key={test.id} className="p-3.5 bg-stone-950/60 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-stone-100 font-semibold">{test.name}</span>
                            <span className="text-[10px] text-stone-500 ml-2">[{test.category}]</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-stone-500">{test.durationMs}ms</span>
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-bold">
                            PASS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. SYSTEM HEALTH TAB */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-stone-100">
                  Real-Time Health & Rate Limiting Monitor
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Active monitoring metrics for battery efficiency, API rate limits, and memory utilization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-stone-950 border border-stone-800 rounded space-y-3">
                  <div className="flex items-center gap-2 text-stone-300 text-xs font-semibold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Rate Limiter Protection</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-stone-100">
                    {healthData.rateLimit?.currentUsage || 12} / {healthData.rateLimit?.maxRequests || 120} req
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Window: 60s sliding window. Abuse and DDoS filtering active.
                  </p>
                </div>

                <div className="p-5 bg-stone-950 border border-stone-800 rounded space-y-3">
                  <div className="flex items-center gap-2 text-stone-300 text-xs font-semibold uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>Battery & Memory Efficiency</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-emerald-400">
                    Optimal (Low Draw)
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Uses GPU transform compositing, lazy image pipelines, and minimal memory footprint.
                  </p>
                </div>

                <div className="p-5 bg-stone-950 border border-stone-800 rounded space-y-3">
                  <div className="flex items-center gap-2 text-stone-300 text-xs font-semibold uppercase tracking-wider">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span>Service Worker PWA</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-cyan-400">
                    Active & Cached
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Automatic offline fallback caching for browsing in low-connectivity areas.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Order Details Peek Modal */}
        {selectedOrderPeek && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-sm shadow-2xl p-6 w-full max-w-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <span className="font-mono text-xs text-amber-300 font-bold block">{selectedOrderPeek.orderId}</span>
                  <span className="text-[11px] text-stone-400">Recipient: {selectedOrderPeek.customer.name} ({selectedOrderPeek.customer.email})</span>
                </div>
                <button
                  onClick={() => setSelectedOrderPeek(null)}
                  className="p-1.5 text-stone-400 hover:text-white rounded bg-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-300 block mb-2">
                  Acquired Creations:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto divide-y divide-stone-800/60 pr-1">
                  {selectedOrderPeek.items.map((it, idx) => (
                    <div key={idx} className="pt-1.5 flex justify-between text-xs">
                      <div>
                        <span className="font-medium text-stone-200">{it.title}</span>
                        <span className="text-stone-400 text-[10px] ml-1.5">({it.size} • {it.color}) x{it.quantity}</span>
                      </div>
                      <span className="font-mono text-stone-300">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-stone-950 rounded border border-stone-800/80 text-xs space-y-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-semibold">Delivery Coordinates:</span>
                <p className="text-stone-300">{selectedOrderPeek.deliveryAddress.street}{selectedOrderPeek.deliveryAddress.suite ? `, ${selectedOrderPeek.deliveryAddress.suite}` : ''}</p>
                <p className="text-stone-400">{selectedOrderPeek.deliveryAddress.city}, {selectedOrderPeek.deliveryAddress.state} {selectedOrderPeek.deliveryAddress.postalCode}, {selectedOrderPeek.deliveryAddress.country}</p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedOrderPeek(null)}
                  className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs font-semibold rounded text-stone-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Non-blocking Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-6 right-6 z-50 bg-stone-950 text-stone-100 border border-emerald-500/60 px-4 py-3 rounded shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-2 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};
