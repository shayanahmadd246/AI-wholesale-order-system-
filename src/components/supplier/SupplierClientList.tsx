import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { getClientsApi } from '../../api/clients';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Users, Phone, MapPin, Store, CreditCard } from 'lucide-react';

interface SupplierClientListProps {
  supplierId: string;
}

export const SupplierClientList: React.FC<SupplierClientListProps> = ({ supplierId }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClientsApi('supplier', supplierId);
        setClients(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load supplier client list');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [supplierId]);

  if (loading) return <LoadingSpinner label="Fetching your client buyers..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-700" />
          <span>My Buying Clients</span>
        </h2>
        <p className="text-xs text-slate-500">
          Verified shopkeeper clients purchasing your products through the wholesale portal.
        </p>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title="No Active Clients"
          description="Clients buying your products will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {clients.map(cli => (
            <div
              key={cli.id}
              className="card-minimal p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{cli.shopName}</h3>
                  <p className="text-xs text-slate-500">{cli.name}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 my-3">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span>{cli.phone}</span>
                </p>
                {cli.cnicNumber && (
                  <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 font-bold">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>CNIC: {cli.cnicNumber}</span>
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span className="truncate">{cli.address}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Unpaid Balance:</span>
                <span className="font-mono font-bold text-amber-700">
                  PKR {cli.totalDues.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
