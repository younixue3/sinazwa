import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { useQueryClient } from 'react-query';
import { useEffect, useState } from 'react';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useGetDetailCake from 'utils/api/cake_production/use-get-detail-cake';
import { EditCake } from 'components/Pages/produksi/EditCake';
import ProduksiLayout from 'pages/produksi/ProduksiLayout';

export default function KueMasuk() {
  const queryClient = useQueryClient();
  const [cakeId, setCakeId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const GetCake = useGetCake({ isSelect: false });
  const GetDetailCake = useGetDetailCake({ id: cakeId });

  useEffect(() => {
    if (GetCake.data) {
      const filtered = GetCake.data.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, GetCake.data]);

  const schema = yup.object({ stock: yup.number().required() });
  useForm({ resolver: yupResolver(schema) });

  return (
    <ProduksiLayout>
      <div className='mx-2 mt-4'>
        <input
          type="text"
          placeholder="Cari Kue..."
          className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <section className={'grid gap-5 p-3'}>
        {!GetCake.isLoading && filteredData.length > 0 ? (
          <Each
            of={filteredData}
            render={(item: any) => (
              <CardComponent title={item.name}>
                <div className={'grid grid-cols-6 gap-2 p-3'}>
                  <div className={'col-span-6'}>Stock : {item.qty}</div>
                  <div className={'col-span-6'}>Jumlah Box : {item.box}</div>
                  <div className={'col-span-6'}>
                    <ModalComponent
                      text={'Tambah Stock'}
                      title={'Tambah Stock'}
                      color={'btn-success text-xs w-full'}
                      onClick={() => {
                        setCakeId(item.id);
                      }}
                    >
                      <EditCake
                        queryClient={queryClient}
                        GetDetailCake={GetDetailCake}
                      />
                    </ModalComponent>
                  </div>
                </div>
              </CardComponent>
            )}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            Tidak ada data kue
          </div>
        )}
      </section>
    </ProduksiLayout>
  );
}
