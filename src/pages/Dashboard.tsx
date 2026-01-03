import { Building2, FileText, LogOut, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';
import type { Clinic } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setClinics(data || []);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Spitz Dental Lab</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/clinics/new')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-2 border-dashed border-gray-300 hover:border-blue-500 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-500 transition-colors">
                <Building2 className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Add New Clinic</h3>
                <p className="text-sm text-gray-600">Register a new dental clinic</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/cases/new')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-2 border-dashed border-gray-300 hover:border-green-500 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-500 transition-colors">
                <FileText className="w-6 h-6 text-green-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Add New Case</h3>
                <p className="text-sm text-gray-600">Create a new case manually</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/cases/upload')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border-2 border-dashed border-gray-300 hover:border-purple-500 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-500 transition-colors">
                <Plus className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Upload CSV</h3>
                <p className="text-sm text-gray-600">Bulk upload cases</p>
              </div>
            </div>
          </button>
        </div>

        {/* Clinics Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Clinics</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600 mt-2">Loading clinics...</p>
              </div>
            ) : clinics.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No clinics yet</p>
                <p className="text-gray-500 text-sm mb-4">Add your first clinic to get started</p>
                <button
                  onClick={() => navigate('/clinics/new')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Clinic
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Clinic Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Contact Person</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Balance</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Cases</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clinics.map((clinic) => (
                      <tr key={clinic.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{clinic.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{clinic.contact_person || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{clinic.email || '-'}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className={`font-semibold ${
                            Number(clinic.current_balance) > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            RM {Number(clinic.current_balance).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {clinic.total_cases}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => navigate(`/clinics/${clinic.id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}