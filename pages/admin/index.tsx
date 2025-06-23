import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import { useEffect, useState } from 'react';
import useDetailHistoryItem from 'utils/api/inventaris/use-detail-history-item';
import { ReportingInventory } from 'components/Pages/admin/ReportingInventory';
import BasicAreaCharts from 'components/ApexCharts/BasicAreaCharts';
import useGetDashboardSales from 'utils/api/dashboard/use-get-dashboard-sales';
import Select from 'react-select';
import queryClient from 'helper/queryClient';
import SplineAreaCharts from 'components/ApexCharts/SplineAreaCharts';
import useGetDashboardSalesByCategoryCake from 'utils/api/dashboard/use-get-dashboard-sales-by-category-cake';
import useGetDashboardSalesByDestination from 'utils/api/dashboard/use-get-dashboard-sales-by-destination';
import BasicBarCharts from 'components/ApexCharts/BasicBarCharts';

type PeriodType = 'week' | 'month' | 'year';

const periodOptions = [
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' }
];

const selectTheme = (theme: any) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#2563eb',
    primary25: '#dbeafe',
    primary50: '#bfdbfe',
    primary75: '#93c5fd'
  }
});

export default function Inventaris() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Period states
  const [periodDashboardSales, setPeriodDashboardSales] =
    useState<PeriodType>('week');
  const [
    periodDashboardSalesByCategoryCake,
    setPeriodDashboardSalesByCategoryCake
  ] = useState<PeriodType>('week');
  const [
    periodDashboardSalesByDestination,
    setPeriodDashboardSalesByDestination
  ] = useState<PeriodType>('week');

  // Data fetching hooks
  const { data: dashboardSales, refetch } =
    useGetDashboardSales(periodDashboardSales);
  const { data: dashboardSalesByCategoryCake, refetch: refetchByCategoryCake } =
    useGetDashboardSalesByCategoryCake(periodDashboardSalesByCategoryCake);
  const { data: dashboardSalesByDestination, refetch: refetchByDestination } =
    useGetDashboardSalesByDestination(periodDashboardSalesByDestination);
  const { data: riwayatBarangs } = useDetailHistoryItem();

  // Refetch effects
  useEffect(() => {
    refetch();
  }, [periodDashboardSales, refetch]);
  useEffect(() => {
    refetchByCategoryCake();
  }, [periodDashboardSalesByCategoryCake, refetchByCategoryCake]);
  useEffect(() => {
    refetchByDestination();
  }, [periodDashboardSalesByDestination, refetchByDestination]);

  // Pagination calculations
  const totalPages = riwayatBarangs
    ? Math.ceil(riwayatBarangs.length / itemsPerPage)
    : 0;
  const paginatedRiwayatBarangs = riwayatBarangs?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const getStatusColor = (tipeRiwayat: string) =>
    tipeRiwayat === '2'
      ? 'bg-emerald-100 hover:bg-emerald-200'
      : 'bg-amber-100 hover:bg-amber-200';

  const handlePeriodChange = (
    option: any,
    setter: (value: PeriodType) => void,
    queryKey: string,
    currentPeriod: PeriodType
  ) => {
    setter(null as any);
    setter(option?.value as PeriodType);
    queryClient.invalidateQueries({
      queryKey: [queryKey, currentPeriod]
    });
  };

  const renderPeriodSelect = (
    setter: (value: PeriodType) => void,
    queryKey: string,
    currentPeriod: PeriodType
  ) => (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor="period-select"
        className="text-sm font-medium text-gray-700"
      >
        Period
      </label>
      <Select
        id="period-select"
        instanceId="period-select"
        className="text-sm"
        classNamePrefix="select"
        options={periodOptions}
        defaultValue={periodOptions[0]}
        onChange={option =>
          handlePeriodChange(option, setter, queryKey, currentPeriod)
        }
        isSearchable={false}
        theme={selectTheme}
      />
    </div>
  );

  const renderChart = (data: any, ChartComponent: any, title: string) =>
    data ? (
      <div className="rounded-lg border border-gray-200 p-4">
        <ChartComponent series={data} title={title} />
      </div>
    ) : (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );

  return (
    <AdminLayout>
      <main className="p-4 grid grid-cols-6 gap-3">
        <div className="col-span-6">
          <CardComponent>
            <div className="p-5">
              <h1 className="text-4xl font-bold text-center">
                Selamat Datang di Dashboard
              </h1>
            </div>
          </CardComponent>
        </div>

        {/* Sales Charts */}
        <div className="col-span-3">
          <CardComponent>
            <div className="p-5">
              <div className="space-y-6">
                {renderPeriodSelect(
                  setPeriodDashboardSales,
                  'get-dashboard-sales',
                  periodDashboardSales
                )}
                {renderChart(
                  dashboardSales,
                  BasicAreaCharts,
                  `Grafik Penjualan Per Kue ${
                    periodDashboardSales === 'week'
                      ? 'Seminggu Terakhir'
                      : periodDashboardSales === 'month'
                        ? 'Sebulan Terakhir'
                        : 'Setahun Terakhir'
                  }`
                )}
              </div>
            </div>
          </CardComponent>
        </div>

        <div className="col-span-3">
          <CardComponent>
            <div className="p-5">
              <div className="space-y-6">
                {renderPeriodSelect(
                  setPeriodDashboardSalesByDestination,
                  'get-dashboard-sales-by-destination',
                  periodDashboardSalesByDestination
                )}
                {renderChart(
                  dashboardSalesByDestination,
                  BasicBarCharts,
                  'Grafik Penjualan Per Outlet'
                )}
              </div>
            </div>
          </CardComponent>
        </div>

        <div className="col-span-6">
          <CardComponent>
            <div className="p-5">
              <div className="space-y-6">
                {renderPeriodSelect(
                  setPeriodDashboardSalesByCategoryCake,
                  'get-dashboard-sales-by-category-cake',
                  periodDashboardSalesByCategoryCake
                )}
                {renderChart(
                  dashboardSalesByCategoryCake,
                  SplineAreaCharts,
                  `Grafik Penjualan ${
                    periodDashboardSalesByCategoryCake === 'week'
                      ? 'Seminggu Terakhir'
                      : periodDashboardSalesByCategoryCake === 'month'
                        ? 'Sebulan Terakhir'
                        : 'Setahun Terakhir'
                  }`
                )}
              </div>
            </div>
          </CardComponent>
        </div>
      </main>

      {/* Inventory History */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          <div className="bg-white border shadow-xl rounded-md mx-4">
            <p className="text-2xl font-semibold text-center my-4">
              Riwayat Inventory
            </p>
            <div className="ms-4">
              <ReportingInventory />
            </div>
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
                              {item.tipe_riwayat === '2'
                                ? 'Keluar'
                                : 'Masuk'}
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
