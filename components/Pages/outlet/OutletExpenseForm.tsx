import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faCalendarAlt,
  faFileText,
  faPlus,
  faMinus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import useStoreOutletExpenses from 'utils/api/outlet/use-store-outlet-expenses';
import useGetDestination from 'utils/api/destination/use-get-destination';
import InputComponent from 'components/Form/InputComponent';
import Select from 'react-select';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { AUTH_ROLE } from 'utils/constants/cookies-keys';
import Cookies from 'js-cookie';

interface OutletExpenseFormProps {
  onSuccess?: () => void;
}

const OutletExpenseForm: React.FC<OutletExpenseFormProps> = ({ onSuccess }) => {
  const storeOutletExpenses = useStoreOutletExpenses();
  const destinationData = useGetDestination({ isSelect: true });
  const [userRole, setUserRole] = useState('');
  const [displayPrices, setDisplayPrices] = useState<string[]>(['']);

  // Get user role from cookies
  useEffect(() => {
    const role = Cookies.get(AUTH_ROLE);
    if (role) {
      setUserRole(role);
    }
  }, []);

  // Dynamic schema based on user role
  const expenseSchema = yup.object({
    ...(userRole === 'admin' && {
      destination_id: yup.object().required('Outlet harus dipilih')
    }),
    expenses: yup.array().of(
      yup.object({
        name_inventory: yup.string().required('Nama barang harus diisi'),
        description: yup.string().optional(),
        qty: yup
          .number()
          .required('Jumlah pengeluaran harus diisi')
          .min(1, 'Jumlah harus lebih dari 0'),
        price: yup.string().required('Nominal harus diisi')
      })
    ).min(1, 'Minimal harus ada satu item pengeluaran')
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(expenseSchema),
    defaultValues: {
      expenses: [{
        name_inventory: '',
        description: '',
        qty: 0,
        price: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expenses'
  });

  const onSubmit = async (data: any) => {
    const basePayload = {
      ...(userRole === 'admin' && data.destination_id && {
        destination_id: data.destination_id.value
      })
    };
  
    // Show loading state - store the result to close it later
    const loadingSwal = Swal.fire({
      title: 'Menyimpan...',
      text: `Menyimpan ${data.expenses.length} item pengeluaran`,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      // Process each expense item sequentially
      const results = [];
      
      for (let i = 0; i < data.expenses.length; i++) {
        const expense = data.expenses[i];
        const payload = {
          ...basePayload,
          name_inventory: expense.name_inventory,
          description: expense.description || '',
          qty: parseInt(expense.qty),
          price: parseFloat(expense.price.replace(/[^\d]/g, ''))
        };
  
        try {
          await new Promise((resolve, reject) => {
            storeOutletExpenses.mutate(payload as any, {
              onSuccess: () => resolve(true),
              onError: (err: any) => reject(err)
            });
          });
          results.push({ status: 'success', index: i });
        } catch (error) {
          results.push({ status: 'error', index: i, error });
        }
      }
  
      // Close loading dialog
      Swal.close();
  
      const successful = results.filter(r => r.status === 'success').length;
      const failed = results.filter(r => r.status === 'error').length;
  
      if (successful > 0) {
        await Swal.fire({
          title: 'Berhasil!',
          text: `${successful} pengeluaran berhasil ditambahkan${failed > 0 ? `, ${failed} gagal` : ''}.`,
          icon: successful === data.expenses.length ? 'success' : 'warning',
          confirmButtonText: 'Ok'
        });
        
        if (successful === data.expenses.length) {
          reset();
          setDisplayPrices(['']);
          if (onSuccess) onSuccess();
        }
      } else {
        const firstError = results.find(r => r.status === 'error');
        SwalErrors({ errors: firstError?.error?.response?.data });
      }
    } catch (error) {
      // Close loading dialog in case of error
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat menyimpan data',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const newDisplayPrices = [...displayPrices];
    newDisplayPrices[index] = formatCurrency(value);
    setDisplayPrices(newDisplayPrices);
    // Set the actual numeric value for form
    e.target.value = value;
  };

  const addExpenseItem = () => {
    append({
      name_inventory: '',
      description: '',
      qty: 0,
      price: ''
    });
    setDisplayPrices([...displayPrices, '']);
  };

  const removeExpenseItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      const newDisplayPrices = displayPrices.filter((_, i) => i !== index);
      setDisplayPrices(newDisplayPrices);
    }
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Outlet Selection - Only for Admin */}
        {userRole === 'admin' && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Pilih Outlet
            </label>
            <Select
              name="destination_id"
              placeholder="Pilih outlet..."
              options={destinationData.data || []}
              instanceId="destination_id"
              onChange={(input) => {
                setValue('destination_id', input);
                clearErrors('destination_id');
              }}
              className={`react-select-container ${
                (errors as any).destination_id ? 'border-red-600' : ''
              }`}
              classNamePrefix="react-select"
            />
            {(errors as any).destination_id && (
              <p className="text-red-500 text-xs flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {(errors as any).destination_id?.message}
              </p>
            )}
          </div>
        )}

        {/* Dynamic Expense Items */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4 relative">
              {/* Remove button - only show if more than 1 item */}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExpenseItem(index)}
                  className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Inventory */}
                <InputComponent
                  label={`Nama Barang ${index + 1}`}
                  type="text"
                  placeholder="Masukkan nama barang"
                  error={(errors.expenses as any)?.[index]?.name_inventory?.message}
                  register={register(`expenses.${index}.name_inventory`)}
                />

                {/* Description */}
                <InputComponent
                  label="Deskripsi (Opsional)"
                  type="text"
                  placeholder="Masukkan deskripsi"
                  error={(errors.expenses as any)?.[index]?.description?.message}
                  register={register(`expenses.${index}.description`)}
                />

                {/* Quantity */}
                <InputComponent
                  label="Jumlah"
                  type="number"
                  placeholder="Masukkan jumlah"
                  error={(errors.expenses as any)?.[index]?.qty?.message}
                  register={register(`expenses.${index}.qty`)}
                />

                {/* Price dengan format currency */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <FontAwesomeIcon
                      icon={faMoneyBillWave}
                      className="mr-2 text-gray-500"
                    />
                    Harga
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm font-medium">Rp</span>
                    </div>
                    <input
                      type="text"
                      {...register(`expenses.${index}.price`)}
                      onChange={(e) => handlePriceChange(e, index)}
                      value={displayPrices[index] || ''}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        (errors.expenses as any)?.[index]?.price ? 'border-red-600' : 'border-gray-200'
                      }`}
                      placeholder="200,000"
                    />
                  </div>
                  {(errors.expenses as any)?.[index]?.price && (
                    <p className="text-red-500 text-xs flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {(errors.expenses as any)?.[index]?.price?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="">
            <h3 className="text-lg font-semibold text-gray-800">Item Pengeluaran</h3>
            <button
              type="button"
              onClick={addExpenseItem}
              className=" space-x-2 w-full py-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="text-sm" />
              <span className="text-sm">Tambah Item</span>
            </button>
          </div>
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={storeOutletExpenses.isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          >
            {storeOutletExpenses.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} />
                <span>Simpan Semua Pengeluaran ({fields.length} item)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OutletExpenseForm;
