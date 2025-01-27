import { useState } from 'react';
import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import { CreateInventory } from 'components/Pages/inventory/CreateInventory';
import { InventarisTableComponent } from 'components/Table/InventarisTableComponent';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import { InputInventaris } from 'components/Pages/inventory/InputInventaris';
import { ComeItemsTableComponent } from 'components/Table/ComeItemsTableComponent';
import useGetNota from 'utils/api/inventaris/use-get-nota';
import AccordionComponent from 'components/Accordion/AccordionComponent';
import useGetHistoryBarang from 'utils/api/inventaris/use-get-history-barang';

export default function Inventaris() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: barangs, isLoading: isLoadingBarangs } = useGetBarangs({
    isSelect: false
  });
  const { data: nota, isLoading: isLoadingNota } = useGetNota();
  const { data: riwayatBarangs } = useGetHistoryBarang();

  const totalPages = riwayatBarangs
    ? Math.ceil(riwayatBarangs.length / itemsPerPage)
    : 0;

  const paginatedRiwayatBarangs = riwayatBarangs?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  const getStatusColor = (tipeRiwayat: number) =>
    tipeRiwayat == 1
      ? 'bg-emerald-100 hover:bg-emerald-200'
      : 'bg-amber-100 hover:bg-amber-200';

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

  return (
    <AdminLayout>
      <main className="p-6">
        <CardComponent>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Manajemen Inventaris
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <CreateInventory />
              <InputInventaris />
            </div>

            <AccordionComponent className="mb-8" title="Riwayat Inventaris">
              <section className="space-y-4 p-4">
                {riwayatBarangs && (
                  <>
                    {paginatedRiwayatBarangs.map(item => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <h3 className="font-medium text-gray-800">
                            {item.inventory.name}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-4">
                          <div
                            className={`p-3 rounded-lg ${getStatusColor(item.tipe_riwayat)}`}
                          >
                            <span className="text-sm text-gray-600 block mb-1">
                              {item.tipe_riwayat == 1
                                ? 'Jumlah Keluar'
                                : 'Jumlah Masuk'}
                            </span>
                            <span className="text-2xl font-semibold text-gray-900">
                              {item.qty_item}
                            </span>
                          </div>
                          <div
                            className={`p-3 rounded-lg ${getStatusColor(item.tipe_riwayat)}`}
                          >
                            <span className="text-sm text-gray-600 block mb-1">
                              Tanggal
                            </span>
                            <span className="text-lg font-medium text-gray-900">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <div className="inline-flex rounded-md shadow-sm">
                        <button
                          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-l-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                        >
                          «
                        </button>
                        <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border-l border-r border-blue-700">
                          {currentPage} / {totalPages}
                        </button>
                        <button
                          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                        >
                          »
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            </AccordionComponent>

            {!isLoadingBarangs && (
              <CardComponent>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Daftar Inventaris
                  </h2>
                  <InventarisTableComponent data={barangs} />
                </div>
              </CardComponent>
            )}

            {!isLoadingNota && (
              <CardComponent>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Daftar Nota Barang Masuk
                  </h2>
                  <ComeItemsTableComponent data={nota} />
                </div>
              </CardComponent>
            )}
          </div>
        </CardComponent>
      </main>
    </AdminLayout>
  );
}
