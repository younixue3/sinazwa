import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import { OutletTableComponent } from 'components/Table/OutletTableComponent';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import { CreateCake } from 'components/Pages/produksi/CreateCake';
import { useQueryClient } from 'react-query';
import { KueTableComponent } from 'components/Table/KueTableComponent';
import { KasirTableComponent } from 'components/Table/KasirTableComponent';

export default function Kasir() {

  return (
    <AdminLayout>
      <main className={'p-4 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
                <KasirTableComponent/>
              </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
