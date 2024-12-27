import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import { OutletTableComponent } from 'components/Table/OutletTableComponent';
import { CreateDelivery } from 'components/Pages/delivery/CreateDelivery';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import { DeliveryTableComponent } from 'components/Table/DeliveryTableComponent';
import useGetJob from 'utils/api/job/use-get-job';
import { JobTableComponent } from 'components/Table/JobTableComponent';
import { CreateJob } from 'components/Pages/job/CreateJob';

export default function Job() {
  const GetJob = useGetJob({ isSelect: false });
  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <div className={'grid grid-cols-6'}>
                <CreateJob />
              </div>
              {!GetJob.isLoading && <JobTableComponent data={GetJob.data} />}
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
