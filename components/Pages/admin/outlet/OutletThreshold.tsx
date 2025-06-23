import CardComponent from 'components/Card/CardComponent';
import React from 'react';

interface CategoryCake {
  category_cake_name: string;
  threshold: number;
  total_delivered: number;
}

interface Destination {
  destination_id: number;
  destination_name: string;
  total_qty: string;
  total_delivered: number;
  category_cake: CategoryCake[];
}

const OutletThreshold: React.FC<{ data: Destination[] }> = ({ data }) => {
  return (
    <CardComponent title="Stok Kue Terkirim Hari Ini">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {data.map((destination, key) => (
          <CardComponent key={key}>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <span className="bg-blue-500 w-2 h-6 rounded mr-3"></span>
                {destination.destination_name}
              </h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-semibold flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      Total Quantity
                    </span>
                    <span className="text-blue-900 font-bold text-lg">
                      {destination.total_qty}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-semibold flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Total Delivered
                    </span>
                    <span className="text-green-900 font-bold text-lg">
                      {destination.total_delivered}/{destination.total_qty}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-bold text-lg text-gray-700 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-indigo-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Category Cakes
                  </h4>

                  <div className="space-y-4">
                    {destination.category_cake.map((cake, key) => (
                      <div
                        key={key}
                        className="bg-white p-5 rounded-xl border-l-4 border-indigo-500 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Category Name
                            </p>
                            <p className="font-semibold text-gray-800 text-lg">
                              {cake.category_cake_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Threshold Progress
                            </p>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-800 text-lg">
                                {cake.total_delivered}/{cake.threshold}
                              </span>
                              <div className="ml-3 flex-grow bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-indigo-500 h-2 rounded-full"
                                  style={{
                                    width: `${(cake.total_delivered / cake.threshold) * 100}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardComponent>
        ))}
      </div>
    </CardComponent>
  );
};

export default OutletThreshold;
