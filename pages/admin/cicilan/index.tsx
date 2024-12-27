import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import useGetInstallment from 'utils/api/cicilan/use-get-instalment';
import { CicilanTableComponent } from 'components/Table/CicilanTableComponent';
import { CreateInstallment } from 'components/Pages/cicilan/CreateInstallment';

export default function Cicilan() {
  const GetInstallment = useGetInstallment();
  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <div className={'grid grid-cols-6'}>
                <CreateInstallment />
              </div>
              {!GetInstallment.isLoading && (
                <CicilanTableComponent data={GetInstallment.data} />
              )}
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
