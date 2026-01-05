import { ArrowLeft, DollarSign, FileText, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Clinic } from '../lib/supabase';
import { supabase } from '../lib/supabase';


export default function NewCase() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clinic_id: '',
    case_id: '',
    item: '',
    quantity: '1',
    amount: '',
    description: '',
  });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    const { data } = await supabase
      .from('clinics')
      .select('*')
      .eq('is_active', true)
      .order('name');
    setClinics(data || []);
  };

  const generateCaseId = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const random = Math.floor(Math.random() * 90 + 10);
    return `${day}${month}${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const caseId = formData.case_id || generateCaseId();
      const amount = parseFloat(formData.amount);
      const quantity = parseInt(formData.quantity);

      // Insert case
      const { error: caseError } = await supabase
        .from('cases')
        .insert([{
          clinic_id: formData.clinic_id,
          case_id: caseId,
          item: formData.item,
          quantity: quantity,
          amount: amount,
          description: formData.description || null,
          status: 'OPEN',
        }]);

      if (caseError) throw caseError;

      // Update clinic balance and total cases
      const clinic = clinics.find(c => c.id === formData.clinic_id);
      if (clinic) {
        const { error: updateError } = await supabase
          .from('clinics')
          .update({
            current_balance: Number(clinic.current_balance) + amount,
            total_cases: clinic.total_cases + 1,
          })
          .eq('id', formData.clinic_id);

        if (updateError) throw updateError;
      }

      navigate(`/clinics/${formData.clinic_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Case</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Clinic *
              </label>
              <select
                name="clinic_id"
                value={formData.clinic_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a clinic...</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Case ID (Leave empty to auto-generate)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="case_id"
                  value={formData.case_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 09092514"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Leave empty to auto-generate: {generateCaseId()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item/Service *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="item"
                    value={formData.item}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Clasp, Crown, Denture"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount (RM) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description / Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional details about this case..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Creating...' : 'Create Case'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}