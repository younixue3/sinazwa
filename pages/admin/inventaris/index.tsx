import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import { CreateInventory } from 'components/Pages/inventory/CreateInventory';
import { InventarisTableComponent } from 'components/Table/InventarisTableComponent';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import { InputInventaris } from 'components/Pages/inventory/InputInventaris';
import { ComeItemsTableComponent } from 'components/Table/ComeItemsTableComponent';
import useGetNota from 'utils/api/inventaris/use-get-nota';

export default function Inventaris() {
  const GetBarangs = useGetBarangs({ isSelect: false });
  const GetNota = useGetNota();

  return (
    <AdminLayout>
      <main className="p-4 grid grid-cols-6 gap-3">
        <div className="col-span-6">
          <CardComponent>
            <div className="p-5">
              <h2 className="text-2xl font-bold mb-6">Manajemen Inventaris</h2>

              <div className="grid grid-cols-6 gap-3">
                <CreateInventory />
                <InputInventaris />
              </div>
              <div className="mt-10">
                {!GetBarangs.isLoading && (
                  <CardComponent>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-4">
                        Daftar Inventaris
                      </h3>
                      <InventarisTableComponent data={GetBarangs.data} />
                    </div>
                  </CardComponent>
                )}
              </div>

              <div className="mt-10">
                {!GetNota.isLoading && (
                  <CardComponent>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-4">
                        Daftar Nota Barang Masuk
                      </h3>
                      <ComeItemsTableComponent data={GetNota.data} />
                    </div>
                  </CardComponent>
                )}
              </div>
            </div>
          </CardComponent>
        </div>
      </main>
    </AdminLayout>
  );
}
