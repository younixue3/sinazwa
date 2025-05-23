import { useQueryClient } from 'react-query';
import OutletLayout from 'pages/outlet/OutletLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie, faHistory, faCalendar, faMoneyBill, faTags, faClock, faStore } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from 'components/Button/ButtonComponent';
import { Each } from 'helper/Each';
import { useState, useEffect } from 'react';
import useGetSale from 'utils/api/sale/use-get-sale';
import TabComponent from 'components/Layout/TabComponent';
import CardComponent from 'components/Card/CardComponent';
import useGetHistoryCakeSale from 'utils/api/outlet/use-get-history-sale-cake';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import Cookies from 'js-cookie';
import { AUTH_ROLE } from 'utils/constants/cookies-keys';

export default function Outlet() {
  const { data: sales, isLoading } = useGetSale();
  const { data: saleHistories, isLoading: isLoadingHistory } = useGetHistoryCakeSale();
  const { data: outlets } = useGetOutlet({});
  const [userRole, setUserRole] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedOutletId, setSelectedOutletId] = useState('');
  
  // Ambil role dari cookies
  useEffect(() => {
    const role = Cookies.get(AUTH_ROLE) || '';
    setUserRole(role);
  }, []);
  
  // Filter sales berdasarkan outlet yang dipilih (untuk admin)
  const filteredSales = sales?.filter(item => {
    if (userRole !== 'admin') return true;
    return selectedOutlet && item.destination === selectedOutlet;
  }) || [];

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString || dateTimeString === '-') return '-';
    
    try {
      const date = new Date(dateTimeString);
      
      // Format tanggal: "20 April 2025"
      const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      // Format waktu: "14:30"
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      // console.error('Error formatting date:', error);
      return dateTimeString;
    }
  };

  return (
    <OutletLayout>
      <TabComponent tab={['Outlet', 'Riwayat Penjualan']}>
        <section className="grid gap-5 p-3">
          {/* Panel pemilihan outlet untuk admin */}
          {userRole === 'admin' && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <label className="block mb-2 font-semibold text-gray-700">Pilih Outlet</label>
              <select
                className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={selectedOutletId}
                onChange={e => {
                  const outletId = e.target.value;
                  setSelectedOutletId(outletId);
                  const outletName = outlets?.find(outlet => outlet.id.toString() === outletId)?.name || '';
                  setSelectedOutlet(outletName);
                }}
              >
                <option value="">-- Pilih Outlet --</option>
                {outlets?.map(outlet => (
                  <option key={outlet.id} value={outlet.id.toString()}>
                    {outlet.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Pesan untuk admin jika belum memilih outlet */}
          {userRole === 'admin' && !selectedOutlet ? (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faStore} className="h-10 w-10 text-yellow-400 mb-3" />
              <p className="text-gray-600">Silakan pilih outlet terlebih dahulu untuk melihat stok kue.</p>
            </div>
          ) : (
            // Tampilkan daftar stok kue jika bukan admin atau admin sudah memilih outlet
            !isLoading && filteredSales?.length > 0 ? (
              <Each
                of={filteredSales}
                render={(sale: any) => (
                  <CardComponent
                    title={sale.cakes?.[0]?.category_name}
                  >
                    <div className="p-3s">
                      <div className="flex relative gap-2">
                        <FontAwesomeIcon
                          className="text-xl m-auto mt-0 bg-gray-200 rounded p-3"
                          icon={faCookie}
                        />
                        <div className="w-full flex flex-col gap-2">
                          <ButtonComponent
                            text={`Stok: ${sale.cakes_available} pcs`}
                            color="btn-primary text-xs ml-0"
                          />
                          
                          <p></p>
                        </div>
                      </div>
                    </div>
                  </CardComponent>
                )}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                {userRole === 'admin' && selectedOutlet ? 'Tidak ada data stok untuk outlet ini' : 'Tidak ada data stok'}
              </div>
            )
          )}
        </section>
        <section className="grid gap-5 p-3">
          {!isLoadingHistory && saleHistories?.length > 0 ? (
            <Each
              of={saleHistories}
              render={(history: any) => (
                <CardComponent
                  title={`Riwayat Penjualan`}
                >
                  <div className="p-3">
                    <div className="flex relative gap-2">
                      <FontAwesomeIcon
                        className="text-xl m-auto mt-0 bg-gray-200 rounded p-3"
                        icon={faHistory}
                      />
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faTags} className="text-sm" />
                          <span className="font-semibold">Kategori: {history.category_cake}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCookie} className="text-sm" />
                          <span>Jumlah: {history.total_cake} pcs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faMoneyBill} className="text-sm" />
                          <span>Total: Rp {history.total_price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCalendar} className="text-sm" />
                          <span>Tanggal: {formatDateTime(history.time_selling)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardComponent>
              )}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Tidak ada data riwayat penjualan
            </div>
          )}
        </section>
      </TabComponent>
    </OutletLayout>
  );
}
