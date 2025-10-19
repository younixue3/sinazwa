/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import KasirLayout from 'pages/kasir/KasirLayout';
import ButtonComponent from 'components/Button/ButtonComponent';
import InputComponent from 'components/Form/InputComponent';
import useStoreSale from 'utils/api/sale/use-store-sale';
import useGetSale from 'utils/api/sale/use-get-sale';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import { AUTH_ROLE } from 'utils/constants/cookies-keys';
import toRupiah from 'utils/helpers/number';
import { getDailyReporting } from 'utils/api/reporting/reportingApi';

const schema = yup.object({
  recieved_money: yup.string().required('Jumlah Uang harus di isi.'),
  description: yup.string().optional(),
  type_payment: yup.string().required('Tipe pembayaran harus di isi.')
});

export default function KasirPage() {
  const getKasir = useGetSale();
  const getOutlet = useGetOutlet({});
  const [counts, setCounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedOutletId, setSelectedOutletId] = useState(''); // Tambahkan state untuk menyimpan ID outlet

  const storeSale = useStoreSale();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const recievedMoney = useWatch({ control, name: 'recieved_money' });

  useEffect(() => {
    const role = Cookies.get(AUTH_ROLE) || '';
    setUserRole(role);
  }, []);

  const filteredSales =
    getKasir.data?.filter(item => {
      if (userRole !== 'admin') return true;
      return selectedOutlet && item.destination === selectedOutlet;
    }) || [];

  useEffect(() => {
    if (filteredSales?.length > 0) {
      const newCounts = filteredSales.map(item => {
        return {
          id: item.sale_id,
          name: item.cakes?.[0]?.category_name || '-',
          qty: 0,
          total: item.cakes?.[0]?.price || 0,
          maxQty: item.cakes_available,
          category_cake_id: item.cakes?.[0]?.cake_id
        };
      });

      setCounts(newCounts);
    }
  }, [getKasir.data, userRole, selectedOutlet]);

  useEffect(() => {
    const newTotal = counts.reduce(
      (sum, item) => sum + item.qty * item.total,
      0
    );
    setTotal(newTotal);
    const recieved = Number(recievedMoney) || 0;
    setChange(recieved - newTotal);
  }, [counts, recievedMoney]);

  const handleMinus = index => {
    setCounts(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, qty: Math.max(0, item.qty - 1) } : item
      )
    );
  };

  const handlePlus = index => {
    setCounts(prev =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, qty: Math.min(item.maxQty, item.qty + 1) }
          : item
      )
    );
  };

  const handleInputChange = (index, value) => {
    const qty = Math.max(0, Math.min(Number(value), counts[index].maxQty));
    setCounts(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, qty } : item))
    );
  };

  const onSubmit = data => {
    // Validasi untuk admin harus memilih outlet
    if (userRole === 'admin' && !selectedOutletId) {
      Swal.fire(
        'Peringatan',
        'Silakan pilih outlet terlebih dahulu.',
        'warning'
      );
      return;
    }

    if (total === 0) {
      Swal.fire('Peringatan', 'Belum ada produk yang dipilih.', 'warning');
      return;
    }

    if (change < 0) {
      Swal.fire('Peringatan', 'Jumlah uang kurang.', 'warning');
      return;
    }

    // Bangun payload dari counts yang memiliki qty > 0
    const payload = counts
      .filter(item => {
        const valid = item.qty > 0 && item.category_cake_id;
        return valid;
      })
      .map(item => ({
        category_cake_id: item.category_cake_id,
        cake_selling: item.qty,
        description: data.description || '', // Pindahkan description ke dalam setiap item
        type_payment: data.type_payment || 'cash', // Pindahkan description ke dalam setiap item
        ...(userRole === 'admin' &&
          selectedOutletId && { destination_id: selectedOutletId })
      }));
    if (payload.length === 0) {
      Swal.fire(
        'Peringatan',
        'Tidak ada produk yang valid untuk dikirim.',
        'warning'
      );
      return;
    }

    // Struktur final payload dengan metode pembayaran
    const finalPayload = {
      payload,
      ...(userRole === 'admin' &&
        selectedOutletId && { destination_id: selectedOutletId })
    };

    storeSale.mutate(finalPayload as any, {
      onSuccess: () => {
        Swal.fire('Sukses', 'Pembayaran berhasil!', 'success');
        setCounts(counts.map(item => ({ ...item, qty: 0 })));
        setValue('recieved_money', '');
        setValue('description', ''); // Gunakan setValue untuk reset description
        setValue('type_payment', ''); // Reset type_payment
        setChange(0);
      },
      onError: error => {
        Swal.fire('Gagal', 'Terjadi kesalahan saat mengirim data.', 'error');
      }
    });
  };

  // Fungsi untuk download laporan harian
  const handleDownloadDailyReport = () => {
    if (userRole === 'admin' && !selectedOutletId) {
      Swal.fire(
        'Peringatan',
        'Silakan pilih outlet terlebih dahulu untuk download laporan.',
        'warning'
      );
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const params = {
      date: today,
      format: 'pdf',
      ...(userRole === 'admin' &&
        selectedOutletId && { destination_id: selectedOutletId })
    };

    getDailyReporting(params);
  };

  return (
    <KasirLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full">
        {/* Container utama dengan padding yang konsisten */}
        <div className="p-4 h-full">
          {/* Header dengan tombol download laporan */}
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Kasir</h1>
          </div>

          {/* Grid layout responsif - 1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Panel kiri: Pemilihan outlet dan produk - span 2 kolom di desktop */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Panel outlet untuk admin dengan styling yang lebih baik */}
              {userRole === 'admin' && (
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 sticky top-14 z-10">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Pilih Outlet
                  </label>
                  <select
                    className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={selectedOutletId}
                    onChange={e => {
                      const outletId = e.target.value;
                      setSelectedOutletId(outletId);
                      const outletName =
                        getOutlet.data?.find(
                          outlet => outlet.id.toString() === outletId
                        )?.name || '';
                      setSelectedOutlet(outletName);
                    }}
                  >
                    <option value="">-- Pilih Outlet --</option>
                    {getOutlet.data?.map(outlet => (
                      <option key={outlet.id} value={outlet.id.toString()}>
                        {outlet.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pesan untuk admin jika belum memilih outlet */}
              {userRole === 'admin' && !selectedOutlet && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-yellow-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600">
                    Silakan pilih outlet terlebih dahulu untuk melihat produk.
                  </p>
                </div>
              )}

              {/* Daftar produk dengan scroll area */}
              <div
                className={`flex-1 overflow-y-auto pr-1 ${userRole === 'admin' ? 'mt-0' : 'mt-4'}`}
              >
                {filteredSales.length > 0 ? (
                  filteredSales.map((item, index) => (
                    <div
                      key={`${item.sale_id ?? item.cakes?.[0]?.cake_id ?? index}`}
                      className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex flex-col sm:flex-row items-center gap-3 shadow-sm hover:shadow transition-all"
                    >
                      <div className="flex-1 text-center sm:text-left mb-3 sm:mb-0 w-full sm:w-auto">
                        <div className="font-bold text-gray-800">
                          {item.cakes?.[0]?.category_name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Stok: {item.cakes_available}
                        </div>
                        <div className="text-blue-600 font-medium mt-1 sm:hidden">
                          {toRupiah(item.cakes?.[0]?.price || 0)}
                        </div>
                      </div>

                      <div className="hidden sm:block text-blue-600 font-medium">
                        {toRupiah(item.cakes?.[0]?.price || 0)}
                      </div>

                      {/* Kontrol jumlah dengan layout responsif */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => handleMinus(index)}
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <span className="text-lg font-bold">-</span>
                        </button>
                        <input
                          type="number"
                          value={counts[index]?.qty || 0}
                          onChange={e =>
                            handleInputChange(index, e.target.value)
                          }
                          className="w-20 sm:w-28 h-9 sm:h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min={0}
                          max={item.cakes_available}
                        />
                        <button
                          type="button"
                          onClick={() => handlePlus(index)}
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : selectedOutlet ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-500">
                      Tidak ada produk tersedia untuk outlet ini.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Panel kanan: Ringkasan pesanan */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-md h-fit md:sticky md:top-20 z-10">
              <div className="font-bold text-xl mb-4 pb-2 border-b border-gray-200">
                Ringkasan Pesanan
              </div>

              {/* Daftar item yang dipilih */}
              <div className="max-h-[30vh] overflow-y-auto mb-4">
                {counts.filter(item => item.qty > 0).length > 0 ? (
                  counts
                    .filter(item => item.qty > 0)
                    .map((item, idx) => (
                      <div
                        key={`${item.id}-${item.category_cake_id}`}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-500">
                            {item.qty} x {toRupiah(item.total)}
                          </span>
                        </div>
                        <span className="font-medium">
                          {toRupiah(item.qty * item.total)}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Belum ada produk dipilih</p>
                  </div>
                )}
              </div>

              {/* Total dan pembayaran */}
              <div className="mt-4">
                <div className="flex justify-between font-bold text-lg mb-4 pb-2 border-b border-gray-200">
                  <span>Total</span>
                  <span>{toRupiah(total)}</span>
                </div>

                <div className="mb-4">
                  <InputComponent
                    label="Jumlah Uang"
                    type="number"
                    placeholder="Masukkan jumlah uang"
                    error={errors.recieved_money?.message}
                    register={register('recieved_money')}
                  />
                </div>

                <div className="flex justify-between mb-6 font-medium">
                  <span>Kembalian</span>
                  <span
                    className={change < 0 ? 'text-red-600' : 'text-green-600'}
                  >
                    {toRupiah(change)}
                  </span>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Keterangan
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical"
                    placeholder="Masukkan keterangan tambahan (Pia Coklat 2, Pia Kacang 2) jadikan 4 kotak, boleh di kosongkan"
                    {...register('description')}
                  />
                </div>

                {/* Tombol pembayaran dengan 3 metode */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="submit"
                    onClick={() => setValue('type_payment', 'cash')}
                    className="py-3 px-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex flex-col items-center justify-center"
                  >
                    <span className="text-sm sm:text-base">Cash</span>
                  </button>
                  <button
                    type="submit"
                    onClick={() => setValue('type_payment', 'qris')}
                    className="py-3 px-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex flex-col items-center justify-center"
                  >
                    <span className="text-sm sm:text-base">QRIS</span>
                  </button>
                  <button
                    type="submit"
                    onClick={() => setValue('type_payment', 'transfer')}
                    className="py-3 px-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex flex-col items-center justify-center"
                  >
                    <span className="text-sm sm:text-base">Transfer</span>
                  </button>
                </div>
                {/* Field tersembunyi untuk payment_method */}
                <input type="hidden" {...register('type_payment')} />
                <ButtonComponent
                  text="Download Laporan Harian (PDF)"
                  color="bg-blue-600 py-4 px-3 text-white ronded-md mt-7 w-full hover:bg-blue-700"
                  onClick={handleDownloadDailyReport}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </KasirLayout>
  );
}
