import InputComponent from 'components/Form/InputComponent';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import useStoreComeItem from 'stores/use-store-come-item';

export function InputInventaris() {
  const queryClient = useQueryClient();
  const GetInventory = useGetBarangs({ isSelect: true });
  const StoreComeItem = useStoreComeItem();

  const schema = yup.object({
    code_nota: yup.string().required('Kode Nota harus di isi.'),
    expired_date: yup.string().required('Tanggal Kadaluarsa harus di isi.'),
    delivery_date: yup.string().required('Tanggal Pengiriman harus di isi.'),
    description: yup.string().required('Deskripsi harus di isi.'),
    name_distributor: yup.string().required('Nama Distributor harus di isi.'),
    total: yup
      .number()
      .min(0, 'Total tidak boleh negatif')
      .required('Total harus di isi.'),
    items: yup.array().of(
      yup.object().shape({
        inventory_id: yup.object().required('Inventory harus di pilih.'),
        quantity: yup
          .number()
          .min(1, 'Jumlah minimal 1')
          .required('Jumlah harus di isi.')
      })
    )
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      items: [{ inventory_id: null, quantity: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = form => {
    const payload = {
      ...form,
      items: form.items.map(item => ({
        inventory_id: item.inventory_id.value,
        quantity: Number(item.quantity)
      }))
    };

    StoreComeItem.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetBarangs.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Barang berhasil di tambah.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        reset();
      },
      onError: (err: any) => {
        const errors = err.response.data;
        SwalErrors({ errors });
      }
    });
  };

  return (
    <ModalComponent
      text={'Input Inventaris'}
      title={'Input Inventaris'}
      color={'btn-success text-xs w-full'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-1 gap-3 h-[35rem] overflow-auto'}>
          <InputComponent
            label={'Kode Nota'}
            placeholder={'Masukkan Kode Nota'}
            error={errors.code_nota?.message}
            register={register('code_nota')}
          />
          <InputComponent
            label={'Tanggal Kadaluarsa'}
            type={'date'}
            error={errors.expired_date?.message}
            register={register('expired_date')}
          />
          <InputComponent
            label={'Tanggal Pengiriman'}
            type={'date'}
            error={errors.delivery_date?.message}
            register={register('delivery_date')}
          />
          <InputComponent
            label={'Deskripsi'}
            placeholder={'Masukkan Deskripsi'}
            error={errors.description?.message}
            register={register('description')}
          />
          <InputComponent
            label={'Nama Distributor'}
            placeholder={'Masukkan Nama Distributor'}
            error={errors.name_distributor?.message}
            register={register('name_distributor')}
          />
          <InputComponent
            label={'Total'}
            type={'number'}
            placeholder={'Masukkan Total'}
            error={errors.total?.message}
            register={register('total')}
          />

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <label className={'text-sm'}>Inventory</label>
                <Controller
                  control={control}
                  name={`items.${index}.inventory_id`}
                  render={({ field }) => (
                    <Select
                      className={'text-black'}
                      {...field}
                      options={GetInventory.data || []}
                      onChange={(input: any) => {
                        setValue(`items.${index}.inventory_id`, input);
                        clearErrors(`items.${index}.inventory_id`);
                      }}
                      isDisabled={GetInventory.isLoading}
                    />
                  )}
                />
                <span className="text-red-600 text-sm">
                  {errors.items?.[index]?.inventory_id?.message}
                </span>
              </div>

              <div className="col-span-5">
                <InputComponent
                  label={'Jumlah'}
                  type={'number'}
                  placeholder={'Jumlah'}
                  error={errors.items?.[index]?.quantity?.message}
                  register={register(`items.${index}.quantity`)}
                />
              </div>

              <div className="col-span-1 flex items-end">
                {index > 0 && (
                  <ButtonComponent
                    onClick={() => remove(index)}
                    color="bg-danger btn-sm text-white"
                    text="X"
                  />
                )}
              </div>
            </div>
          ))}

          <div>
            <ButtonComponent
              color="btn-success text-xs w-full"
              onClick={() => append({ inventory_id: null, quantity: 1 })}
              text="Tambah Item"
            />
          </div>

          <ButtonComponent
            text={'Submit'}
            color={'btn-primary text-xs w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}
