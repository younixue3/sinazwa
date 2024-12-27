import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import { CreateOutlet } from 'components/Pages/outlet/CreateOutlet';
import { OutletTableComponent } from 'components/Table/OutletTableComponent';

export default function Outlet() {
  const GetOutlet = useGetOutlet({ isSelect: false });

  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
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
