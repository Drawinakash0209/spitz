import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Plus, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Case, Clinic, Payment } from '../lib/supabase';
import { supabase } from '../lib/supabase';

export default function ClinicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cases' | 'payments'>('cases');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClinicData();
    }
  }, [id]);

  const fetchClinicData = async () => {
    try {
      // Fetch clinic
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

      // Fetch cases
      const { data: casesData } = await supabase
        .from('cases')
        .select('*')
        .eq('clinic_id', id)
        .order('case_date', { ascending: false });

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('clinic_id', id)
        .order('payment_date', { ascending: false });

      setClinic(clinicData);
      setCases(casesData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      OPEN: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      READY: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.OPEN;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Clinic not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clinic.name}</h1>
              <div className="mt-2 space-y-1">
                {clinic.contact_person && (
                  <p className="text-sm text-gray-600">Contact: {clinic.contact_person}</p>
                )}
                {clinic.email && (
                  <p className="text-sm text-gray-600">Email: {clinic.email}</p>
                )}
                {clinic.phone && (
                  <p className="text-sm text-gray-600">Phone: {clinic.phone}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
              <p className={`text-3xl font-bold ${
                Number(clinic.current_balance) > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                RM {Number(clinic.current_balance).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{clinic.total_cases}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  RM {Number(clinic.total_paid).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Cases</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cases.filter(c => c.status === 'OPEN').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex gap-3">
          <button
            onClick={() => {
              navigate('/cases/new', { state: { clinicId: clinic.id } });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Case
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <DollarSign size={18} />
            Record Payment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'cases'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cases ({cases.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'payments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Payment History ({payments.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'cases' ? (
              <div className="overflow-x-auto">
                {cases.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No cases yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Case ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Qty</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cases.map((caseItem) => (
                        <tr key={caseItem.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {caseItem.case_id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{caseItem.item}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">
                            {caseItem.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                            RM {Number(caseItem.amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {format(new Date(caseItem.case_date), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(caseItem.status)}`}>
                              {getStatusIcon(caseItem.status)}
                              {caseItem.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No payments yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Amount</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Balance Before</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Balance After</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {format(new Date(payment.payment_date), 'dd/MM/yyyy HH:mm')}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                            RM {Number(payment.amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">
                            RM {Number(payment.balance_before).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            RM {Number(payment.balance_after).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {payment.reference_number || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          clinic={clinic}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchClinicData();
          }}
        />
      )}
    </div>
  );
}

// Payment Modal Component
function PaymentModal({ 
  clinic, 
  onClose, 
  onSuccess 
}: { 
  clinic: Clinic; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const paymentAmount = parseFloat(amount);
      const currentBalance = Number(clinic.current_balance);
      const newBalance = currentBalance - paymentAmount;

      // Insert payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          clinic_id: clinic.id,
          amount: paymentAmount,
          balance_before: currentBalance,
          balance_after: newBalance,
          reference_number: referenceNumber || null,
          notes: notes || null,
        }]);

      if (paymentError) throw paymentError;

      // Update clinic balance and total paid
      const { error: updateError } = await supabase
        .from('clinics')
        .update({
          current_balance: newBalance,
          total_paid: Number(clinic.total_paid) + paymentAmount,
          last_payment_date: new Date().toISOString(),
        })
        .eq('id', clinic.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Record Payment</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold text-blue-600">
            RM {Number(clinic.current_balance).toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Amount (RM) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              max={Number(clinic.current_balance)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Bank transfer reference, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes..."
            />
          </div>

          {amount && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">New Balance</p>
              <p className="text-2xl font-bold text-green-600">
                RM {(Number(clinic.current_balance) - parseFloat(amount || '0')).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}