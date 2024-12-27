import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { useQueryClient } from 'react-query';
import { useState } from 'react';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useGetDetailCake from 'utils/api/cake_production/use-get-detail-cake';
import { EditCake } from 'components/Pages/produksi/EditCake';
import ProduksiLayout from 'pages/produksi/ProduksiLayout';

export default function KueKeluar() {
  const queryClient = useQueryClient();
  const [cakeId, setCakeId] = useState();

  const GetCake = useGetCake({ isSelect: false });
  const GetDetailCake = useGetDetailCake({ id: cakeId });

  const schema = yup.object({ stock: yup.number().required() });
  const {} = useForm({ resolver: yupResolver(schema) });

  return (
    <ProduksiLayout>
      <section className={'grid gap-5 p-3'}>
        {!GetCake.isLoading && (
          <Each
            of={GetCake.data}
            render={(item: any) => (
              <CardComponent title={item.name}>
                <div className={'grid grid-cols-6 gap-2 p-3'}>
                  <div className={'col-span-6'}>Stock : {item.qty}</div>
                  <div className={'col-span-6'}>
                    <ModalComponent
                      text={'Kurangi Stock'}
                      title={'Kurangi Stock'}
                      color={'btn-danger text-xs w-full'}
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
        )}
      </section>
    </ProduksiLayout>
  );
}
