import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import AccordionComponent from 'components/Accordion/AccordionComponent';
import { useState } from 'react';
import useGetHistoryBarang from 'utils/api/inventaris/use-get-history-barang';
import useDetailHistoryItem from 'utils/api/inventaris/use-detail-history-item';

export default function Inventaris() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: riwayatBarangs } = useDetailHistoryItem();

  // console.log(riwayatBarangs);

  const totalPages = riwayatBarangs
    ? Math.ceil(riwayatBarangs.length / itemsPerPage)
    : 0;

  const paginatedRiwayatBarangs = riwayatBarangs?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  const getStatusColor = (tipeRiwayat: string) =>
    tipeRiwayat === "2"
      ? 'bg-emerald-100 hover:bg-emerald-200'
      : 'bg-amber-100 hover:bg-amber-200';

  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <h1 className={'text-4xl font-bold text-center'}>
                Selamat Datang di Dashboard
              </h1>
            </div>
          </CardComponent>
        </div>
      </main>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white border border-2 shadow-xl rounded-md mx-4">
            <p className="text-2xl font-semibold text-center my-4">
              Riwayat Inventory
            </p>
            <section className="space-y-4 p-4">
              {riwayatBarangs && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-md border-gray-200 shadow-md">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left text-gray-600">
                            Nama Inventaris
                          </th>
                          <th className="px-4 py-3 text-left text-gray-600">
                            Jumlah
                          </th>
                          <th className="px-4 py-3 text-left text-gray-600">
                            Tipe
                          </th>
                          <th className="px-4 py-3 text-left text-gray-600">
                            Tanggal
                          </th>
                          <th className="px-4 py-3 text-left text-gray-600">
                            Kategori Kue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRiwayatBarangs?.map((item: any) => (
                          <tr
                            key={item.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-gray-800">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-semibold">
                              {item.qty}
                            </td>
                            <td
                              className={`px-4 py-3 text-center font-semibold ${getStatusColor(item.tipe_riwayat)}`}
                            >
                              {item.tipe_riwayat === "2"
                                ? 'Jumlah Keluar'
                                : 'Jumlah Masuk'}
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              {item.created_at}
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              <ul className="list-disc pl-4">
                                {item.category_cake?.map((category: any) => (
                                  <li key={category.id} className="text-sm">
                                    {category.name}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* ✅ Desain Pagination yang Lebih Bagus */}
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center space-x-2">
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        « Prev
                      </button>
                      <span className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-300 rounded-md bg-blue-100">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next »
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
