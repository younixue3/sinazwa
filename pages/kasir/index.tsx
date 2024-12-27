import { useQueryClient } from 'react-query';
import KasirLayout from 'pages/kasir/KasirLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from 'components/Button/ButtonComponent';
import InputComponent from 'components/Form/InputComponent';
import { Each } from 'helper/Each';
import { useState } from 'react';
import toRupiah from 'utils/helpers/number';
import useStoreSale from 'utils/api/sale/use-store-sale';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useForm } from 'react-hook-form';
import useGetSale from 'utils/api/sale/use-get-sale';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  recieved_money: yup.string().required('Jumlah Uang harus di isi.')
});

export default function Inventaris() {
  const queryClient = useQueryClient();
  const [counts, setCounts] = useState([]);
  const StoreSale = useStoreSale();

  const GetSale = useGetSale();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = form => {
    const payload = [];
    counts.map(item => {
      item &&
        payload.push({
          category_cake_id: item.category_cake_id,
          cake_selling: item.qty
        });
    });
    console.log(payload);
    StoreSale.mutate(
      { ...form, payload },
      {
        onSuccess: data => {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Pesanan berhasil di buat.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          queryClient.invalidateQueries(useGetSale.keys());
          reset();
          setCounts([]);
        },
        onError: (err: any) => {
          const errors = err.response.data.data;
          SwalErrors({ errors });
        }
      }
    );
  };

  return (
    <KasirLayout>
      <div className={'h-full grid grid-cols-3'}>
        <div className={'col-span-2 flex flex-col justify-start'}>
          {!GetSale.isLoading && (
            <Each
              of={GetSale.data || []}
              render={(item: any, index: any) => (
                <button
                  className={
                    'border-b-2 m-0 text-left group hover:bg-gray-200 flex gap-7'
                  }
                >
                  <FontAwesomeIcon
                    className={
                      'bg-gray-200 group-hover:bg-white m-auto rounded-lg p-5'
                    }
                    icon={faCookie}
                  />
                  <div className={'w-full py-3'}>
                    <h4 className={'text-lg font-bold'}>
                      {item.cake_production[0].category_cake.name}{' '}
                      <span className="font-normal text-xs">{`${item.cakes_available} pcs`}</span>
                    </h4>
                    <div>
                      Rp.{' '}
                      {toRupiah(item.cake_production[0].category_cake.price)}
                    </div>
                  </div>
                  <div className={'m-auto flex gap-3'}>
                    <ButtonComponent
                      color={'btn-danger text-2xl font-bold'}
                      text={'-'}
                      onClick={() => {
                        const arrayCounts = [...counts];
                        if (arrayCounts[index]?.qty > 0) {
                          arrayCounts[index] = {
                            id: item.id,
                            category_cake_id:
                              item.cake_production[0].category_cake.id,
                            name: item.cake_production[0].category_cake.name,
                            qty: (arrayCounts[index]?.qty || 0) - 1,
                            total:
                              item.cake_production[0].category_cake.price *
                              ((arrayCounts[index]?.qty || 0) - 1)
                          };
                          setCounts(arrayCounts);
                        }
                        if (arrayCounts[index]?.qty == 0) {
                          arrayCounts[index] = undefined;
                          setCounts(arrayCounts);
                        }
                      }}
                    />
                    <div className={'flex w-40 flex-col'}>
                      <div>
                        <input
                          type={'number'}
                          {...register}
                          onChange={(e: any) => {
                            const arrayCounts = [...counts];
                            if (e.target.value == 0) {
                              arrayCounts[index] = undefined;
                              setCounts(arrayCounts);
                            } else {
                              if (
                                item.cakes_available == 0 ||
                                arrayCounts[index]?.qty >= item.cakes_available
                              ) {
                                Swal.fire({
                                  title: 'Gagal!',
                                  text: 'Jumlah kue kelebihan stok',
                                  icon: 'error',
                                  timer: 1500,
                                  showConfirmButton: false
                                });
                              } else {
                                arrayCounts[index] = {
                                  id: item.id,
                                  category_cake_id:
                                    item.cake_production[0].category_cake.id,
                                  name: item.cake_production[0].category_cake
                                    .name,
                                  qty: e.target.value,
                                  total:
                                    item.cake_production[0].category_cake
                                      .price * e.target.value
                                };
                                setCounts(arrayCounts);
                              }
                            }
                          }}
                          value={counts[index]?.qty || 0}
                          className={`border rounded-lg p-3 text-black text-sm w-full`}
                        />
                      </div>
                    </div>
                    <ButtonComponent
                      color={'btn-success text-2xl font-bold'}
                      text={'+'}
                      onClick={() => {
                        const arrayCounts = [...counts];
                        if (
                          item.cakes_available == 0 ||
                          arrayCounts[index]?.qty >= item.cakes_available
                        ) {
                          Swal.fire({
                            title: 'Gagal!',
                            text: 'Jumlah kue kelebihan stok',
                            icon: 'error',
                            timer: 1500,
                            showConfirmButton: false
                          });
                        } else {
                          arrayCounts[index] = {
                            id: item.id,
                            category_cake_id:
                              item.cake_production[0].category_cake.id,
                            name: item.cake_production[0].category_cake.name,
                            qty: (arrayCounts[index]?.qty || 0) + 1,
                            total:
                              item.cake_production[0].category_cake.price *
                              ((arrayCounts[index]?.qty || 0) + 1)
                          };
                          setCounts(arrayCounts);
                        }
                      }}
                    />
                  </div>
                </button>
              )}
            />
          )}
        </div>
        <div className={'border-l-2 relative'}>
          <div className={'flex flex-col justify-start'}>
            <Each
              of={
                counts.filter(item => {
                  return item != undefined;
                }) || []
              }
              render={(item: any) => (
                <div
                  className={'border-b-2 group hover:bg-gray-200 flex gap-3'}
                >
                  <div className={'w-1/6 flex'}>
                    <FontAwesomeIcon
                      className={
                        'bg-gray-200 group-hover:bg-white m-auto rounded-lg p-5'
                      }
                      icon={faCookie}
                    />
                  </div>
                  <div className={'w-4/6 py-3'}>
                    <h4 className={'text-lg font-bold'}>{item?.name}</h4>
                    <div>{item?.qty} Pcs</div>
                  </div>
                  <div className={'w-1/6 m-auto font-bold'}>
                    Rp. {toRupiah(item?.total)}
                  </div>
                </div>
              )}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={'border-b-2 group hover:bg-gray-200'}>
              <div className={'p-3 font-bold'}>
                Total: Rp.{' '}
                {toRupiah(
                  counts
                    .filter(item => {
                      return item != undefined;
                    })
                    .reduce((a, b) => a + b.total, 0)
                )}
              </div>
              <div className={'p-3 font-bold'}>
                Kembalian: Rp.{' '}
                {toRupiah(
                  parseInt(watch('recieved_money')) -
                    counts
                      .filter(item => {
                        return item != undefined;
                      })
                      .reduce((a, b) => a + b.total, 0) || 0
                )}
              </div>
            </div>
            <div className="p-3">
              <InputComponent
                label={'Jumlah Uang'}
                type={'number'}
                placeholder={'Masukkan Jumlah Uang yang diterima'}
                error={errors.recieved_money?.message}
                register={register('recieved_money')}
              />
            </div>
            <ButtonComponent
              color={'btn-success fixed z-50 bottom-24 right-10'}
              text={'Pay'}
            />
          </form>
        </div>
      </div>
    </KasirLayout>
  );
}
