import { useQueryClient } from 'react-query';
import OutletLayout from 'pages/outlet/OutletLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie, faHistory, faCalendar, faMoneyBill, faTags, faClock } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from 'components/Button/ButtonComponent';
import { Each } from 'helper/Each';
import { useState } from 'react';
import useGetSale from 'utils/api/sale/use-get-sale';
import TabComponent from 'components/Layout/TabComponent';
import CardComponent from 'components/Card/CardComponent';
import useGetHistoryCakeSale from 'utils/api/outlet/use-get-history-sale-cake';

export default function Outlet() {
  const { data: sales, isLoading } = useGetSale();
  const {data: saleHistories, isLoading: isLoadingHistory} = useGetHistoryCakeSale();

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
      console.error('Error formatting date:', error);
      return dateTimeString;
    }
  };

  return (
    <OutletLayout>
      <TabComponent tab={['Outlet', 'Riwayat Penjualan']}>
        <section className="grid gap-5 p-3">
          {!isLoading && sales?.length > 0 ? (
            <Each
              of={sales}
              render={(sale: any) => (
                <CardComponent
                  title={sale.cake_production[0].category_cake.name}
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
              Tidak ada data stok
            </div>
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
