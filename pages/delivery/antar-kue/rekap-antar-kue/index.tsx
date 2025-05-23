import DeliveryLayout from 'pages/delivery/DeliveryLayout';
import { useEffect, useState } from 'react';
import useGetRekapDelivery from 'utils/api/delivery/use-get-rekap-delivery';
import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import ButtonComponent from 'components/Button/ButtonComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faFilter } from '@fortawesome/free-solid-svg-icons';

const RekapAntarKuePage = () => {
  const getRekapAntarKue = useGetRekapDelivery();
  const [selectedDestination, setSelectedDestination] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Mendapatkan daftar unik destination_name dan category_cake_name
  const uniqueDestinations = getRekapAntarKue.data
    ? Array.from(new Set(getRekapAntarKue.data.map(item => item.destination_name)))
    : [];
  const uniqueCategories = getRekapAntarKue.data
    ? Array.from(new Set(getRekapAntarKue.data.map(item => item.category_cake_name)))
    : [];

  useEffect(() => {
    // console.log('Data Rekap Antar Kue:', getRekapAntarKue.data);
  }, [getRekapAntarKue.data]);

  // Filter data berdasarkan destination dan category
  const filteredData = getRekapAntarKue.data
    ? getRekapAntarKue.data.filter(item => {
        const matchDestination = selectedDestination
          ? item.destination_name === selectedDestination
          : true;
        const matchCategory = categoryFilter
          ? item.category_cake_name.toLowerCase().includes(categoryFilter.toLowerCase())
          : true;
        return matchDestination && matchCategory;
      })
    : [];

  return (
    <>
      <DeliveryLayout>
        <div className="p-3">
          {/* Filter Section */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-600" />
              <h2 className="text-sm font-semibold">Filter Data</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Destination Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Destinasi
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  <option value="">Semua Destinasi</option>
                  {uniqueDestinations.map((dest, index) => (
                    <option key={index} value={String(dest)}>
                      {String(dest)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Kategori Kue
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {uniqueCategories.map((cat, index) => (
                    <option key={index} value={String(cat)}>
                      {String(cat)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {getRekapAntarKue.isLoading ? (
            <div className="text-center py-8">
              <p>Loading data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid gap-4 grid-cols-1">
              <Each
                of={filteredData}
                render={item => (
                  <CardComponent title={item.destination_name}>
                    <div className="p-3">
                      <div className="flex relative gap-2">
                        <FontAwesomeIcon
                          className="text-xl m-auto mt-0 bg-gray-200 rounded p-3"
                          icon={faTruck}
                        />
                        <div className="w-full flex flex-col gap-2">
                          <ButtonComponent
                            text={`${item.category_cake_name}`}
                            color="btn-primary text-xs ml-0"
                          />
                          <p>{` Total box : ${item.total_box}`}</p>
                        </div>
                      </div>
                    </div>
                  </CardComponent>
                )}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Tidak ada data rekap antar kue</p>
            </div>
          )}
        </div>
      </DeliveryLayout>
    </>
  );
};

export default RekapAntarKuePage;
