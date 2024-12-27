import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import { OutletTableComponent } from 'components/Table/OutletTableComponent';
import { CreateDelivery } from 'components/Pages/delivery/CreateDelivery';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import { DeliveryTableComponent } from 'components/Table/DeliveryTableComponent';
import { LaporanInventory } from 'components/Pages/admin/dropship/LaporanInventory';
import { useState } from 'react';

export default function Dropship() {
  const GetDelivery = useGetDelivery();
  const [destinationId, setDestinationId] = useState(null);

  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <div className={'grid grid-cols-6 gap-2'}>
                <CreateDelivery />
                <LaporanInventory />
              </div>
              {!GetDelivery.isLoading && (
                <DeliveryTableComponent data={GetDelivery.data} />
              )}
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
