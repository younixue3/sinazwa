import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import { CreateOutlet } from 'components/Pages/outlet/CreateOutlet';
import { OutletTableComponent } from 'components/Table/OutletTableComponent';
import OutletThreshold from 'components/Pages/admin/outlet/OutletThreshold';
import useGetDeliveryThreshold from 'utils/api/DeliveryThreshold/use-get-deliveries-threshold';
import { useEffect } from 'react';

export default function Outlet() {
  const GetOutlet = useGetOutlet({ isSelect: false });

  const {
    data: deliveriesThresholdData,
    isLoading: isLoadingThreshold,
    refetch: refetchThreshold
  } = useGetDeliveryThreshold();

  // Add effect to refetch threshold data when component mounts
  useEffect(() => {
    refetchThreshold();
  }, [refetchThreshold]);

  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          {!isLoadingThreshold && (
            <OutletThreshold
              data={deliveriesThresholdData}
              onUpdate={() => refetchThreshold()}
            />
          )}
        </div>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <div className={'grid grid-cols-6'}>
                <CreateOutlet />
              </div>
              {!GetOutlet.isLoading && (
                <OutletTableComponent data={GetOutlet.data} />
              )}
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
