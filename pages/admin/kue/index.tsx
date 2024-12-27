import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import { OutletTableComponent } from 'components/Table/OutletTableComponent';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import { CreateCake } from 'components/Pages/produksi/CreateCake';
import { useQueryClient } from 'react-query';
import { KueTableComponent } from 'components/Table/KueTableComponent';

export default function Kue() {
  const GetCake = useGetCake({ isSelect: false });

  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <div className={'grid grid-cols-6'}>
                <CreateCake />
              </div>
              {!GetCake.isLoading && <KueTableComponent data={GetCake.data} />}
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
