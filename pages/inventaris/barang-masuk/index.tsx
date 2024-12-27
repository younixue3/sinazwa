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
import { useState } from 'react';
import useGetDetailBarang from 'utils/api/inventaris/use-get-detail-barang';

export default function BarangMasuk() {
  const queryClient = useQueryClient();
  const [barangId, setBarangId] = useState();

  const GetBarangs = useGetBarangs({ isSelect: false });
  const GetDetailBarang = useGetDetailBarang({ id: barangId });

  const schema = yup.object({ stock: yup.number().required() });
  const {} = useForm({ resolver: yupResolver(schema) });

  return (
    <InventarisLayout>
      <section className={'grid gap-5 p-3'}>
        {!GetBarangs.isLoading && (
          <Each
            of={GetBarangs.data}
            render={(item: any) => (
              <CardComponent title={item.name}>
                <div className={'grid grid-cols-6 gap-2 p-3'}>
                  <div className={'col-span-6'}>Stock : {item.qty}</div>
                  <div className={'col-span-6'}>
                    <ModalComponent
                      text={'Tambah Stock'}
                      title={'Tambah Stock'}
                      color={'btn-success text-xs w-full'}
                      onClick={() => {
                        setBarangId(item.id);
                      }}
                    >
                      <InsertBarangMasuk
                        queryClient={queryClient}
                        GetDetailBarang={GetDetailBarang}
                      />
                    </ModalComponent>
                  </div>
                </div>
              </CardComponent>
            )}
          />
        )}
      </section>
    </InventarisLayout>
  );
}
