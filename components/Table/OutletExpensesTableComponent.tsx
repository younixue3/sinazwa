import React from 'react';
import useGetOutletExpenses from 'utils/api/outlet/use-get-oulet-expense';
import useDeleteOutletExpense from 'utils/api/outlet/use-delete-outlet-expense';
import Swal from 'sweetalert2';

interface OutletExpensesTableComponentProps {
  onEdit?: (expense: any) => void;
}

export default function OutletExpensesTableComponent({
  onEdit
}: OutletExpensesTableComponentProps) {
  const { data: expenses, isLoading, isError } = useGetOutletExpenses();
  const deleteExpense = useDeleteOutletExpense();

  const handleDelete = async (id: number, itemName: string) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: `Apakah Anda yakin ingin menghapus pengeluaran "${itemName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteExpense.mutateAsync(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data pengeluaran berhasil dihapus.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menghapus data pengeluaran.',
          icon: 'error'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Terjadi kesalahan saat memuat data</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada data pengeluaran</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Nama Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Jumlah
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Harga
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Total
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Deskripsi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Outlet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense, index) => (
            <tr key={expense.id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {expense.no}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {expense.name_inventory}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {expense.qty}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(expense.price)}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(expense.price * expense.qty)}
              </td> */}
              <td className="px-6 py-4 text-sm text-gray-900 border-b">
                <div className="max-w-xs truncate" title={expense.description}>
                  {expense.description || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {expense.destination_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                {new Date(expense.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b">
                <div className="flex space-x-2">
                  {/* Tombol Edit */}
                  <button
                    onClick={() => {
                      onEdit(expense);
                    }}
                    className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(expense.id, expense.name_inventory)
                    }
                    disabled={deleteExpense.isLoading}
                    className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleteExpense.isLoading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
