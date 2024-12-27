import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';

export default function Admin() {
  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <h1 className={'text-4xl font-bold text-center'}>
                Selamat Datang di Dashboard
              </h1>
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
