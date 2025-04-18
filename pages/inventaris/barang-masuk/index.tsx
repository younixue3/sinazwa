import { useEffect, useState } from 'react';
import InventarisLayout from 'pages/inventaris/InventarisLayout';
import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ModalComponent } from 'components/Modal/ModalComponent';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import { InsertBarangMasuk } from 'components/Pages/inventory/barang-masuk/InsertBarangMasuk';
import { useQueryClient } from 'react-query';
import useGetDetailBarang from 'utils/api/inventaris/use-get-detail-barang';

export default function BarangMasuk() {
  const queryClient = useQueryClient();
  const [barangId, setBarangId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const GetBarangs = useGetBarangs({ isSelect: false });
  const GetDetailBarang = useGetDetailBarang({ id: barangId });

  const schema = yup.object({ stock: yup.number().required() });
  useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (GetBarangs.data) {
      const filtered = GetBarangs.data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, GetBarangs.data]);

  return (
    <InventarisLayout>
      <section className="grid gap-5 p-3">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Cari barang..."
            className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!GetBarangs.isLoading && filteredData.length > 0 ? (
          <Each
            of={filteredData}
            render={(item: any) => (
              <CardComponent title={item.name} key={item.id}>
                <div className="grid grid-cols-6 gap-2 p-3">
                  <div className="col-span-6">Stock: {item.qty}</div>
                  {/* <div className="col-span-6">
                    <ModalComponent
                      text="Tambah Stock"
                      title="Tambah Stock"
                      color="btn-success text-xs w-full"
                      onClick={() => setBarangId(item.id)}
                    >
                      <InsertBarangMasuk
                        queryClient={queryClient}
                        GetDetailBarang={GetDetailBarang}
                      />
                    </ModalComponent>
                  </div> */}
                </div>
              </CardComponent>
            )}
          />
        ) : (
          <p className="text-center text-gray-500">Barang tidak ditemukan.</p>
        )}
      </section>
    </InventarisLayout>
  );
}