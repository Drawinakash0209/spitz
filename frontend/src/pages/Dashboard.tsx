import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Clinic } from '../lib/supabase';
import { supabase } from '../lib/supabase';

import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Spitz Dental Lab</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Clinics</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Balance</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total Cases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{clinic.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{clinic.contact_person || '-'}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        RM {Number(clinic.current_balance).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {clinic.total_cases}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}