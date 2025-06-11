import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import useUpdateOutletExpense from 'utils/api/outlet/use-update-outlet-expense';
import useGetOutletExpenseById from 'utils/api/outlet/use-get-outlet-expense-by-id';
import Swal from 'sweetalert2';

interface EditOutletExpenseFormProps {
  expenseId: string | number;
  onClose: () => void;
}

const schema = yup.object({
  name_inventory: yup.string().required('Nama item harus diisi'),
  qty: yup.number().positive('Jumlah harus lebih dari 0').required('Jumlah harus diisi'),
  price: yup.number().positive('Harga harus lebih dari 0').required('Harga harus diisi'),
  description: yup.string(),
  destination_id: yup.string().required('Outlet harus dipilih')
});

export default function EditOutletExpenseForm({ expenseId, onClose }: EditOutletExpenseFormProps) {
  const { data: outlets } = useGetOutlet({});
  const { data: expenseData, isLoading: isLoadingExpense } = useGetOutletExpenseById(expenseId);
  const updateExpense = useUpdateOutletExpense();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (expenseData) {
      reset({
        name_inventory: expenseData.name_inventory,
        qty: expenseData.qty,
        price: expenseData.price,
        description: expenseData.description,
        destination_id: expenseData.destination_id.toString()
      });
    }
  }, [expenseData, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateExpense.mutateAsync({
        id: expenseId,
        payload: {
          ...data,
          qty: Number(data.qty),
          price: Number(data.price),
          destination_id: Number(data.destination_id)
        }
      });

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data pengeluaran berhasil diperbarui.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      onClose();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal memperbarui data pengeluaran.',
        icon: 'error'
      });
    }
  };

  if (isLoadingExpense) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Item *
        </label>
        <input
          type="text"
          {...register('name_inventory')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan nama item"
        />
        {errors.name_inventory && (
          <p className="text-red-500 text-sm mt-1">{errors.name_inventory.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah *
          </label>
          <input
            type="number"
            {...register('qty')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          {errors.qty && (
            <p className="text-red-500 text-sm mt-1">{errors.qty.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga *
          </label>
          <input
            type="number"
            {...register('price')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Outlet *
        </label>
        <select
          {...register('destination_id')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih Outlet</option>
          {outlets?.map((outlet) => (
            <option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </option>
          ))}
        </select>
        {errors.destination_id && (
          <p className="text-red-500 text-sm mt-1">{errors.destination_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan deskripsi (opsional)"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="w-full">
        <button
          type="submit"
          disabled={updateExpense.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {updateExpense.isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 ml-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}