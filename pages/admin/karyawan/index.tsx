import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import useGetUser from 'utils/api/user/use-get-user';
import { UserTableComponent } from 'components/Table/UserTableComponent';
import { CreateUser } from 'components/Pages/karyawan/CreateUser';

export default function Karyawan() {
  const GetUsers = useGetUser({ isSelect: false });
  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <div className={'grid grid-cols-6'}>
                <CreateUser />
              </div>
              {!GetUsers.isLoading && (
                <UserTableComponent data={GetUsers.data} />
              )}
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
