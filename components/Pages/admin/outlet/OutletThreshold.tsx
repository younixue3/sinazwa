import { yupResolver } from '@hookform/resolvers/yup';
import ButtonComponent from 'components/Button/ButtonComponent';
import CardComponent from 'components/Card/CardComponent';
import InputComponent from 'components/Form/InputComponent';
import SimpleModalComponent from 'components/Modal/SimpleModalComponent';
import CreateDeliveriesThreshold from 'components/Pages/admin/outlet/CreateDeliveriesThreshold';
import SwalErrors from 'helper/swal-errors';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useUpdateDeliveriesThreshold from 'utils/api/DeliveryThreshold/use-update-deliveries-threshold';
import useDestroyDeliveriesThreshold from 'utils/api/DeliveryThreshold/use-destroy-deliveries-thershold';
import * as yup from 'yup';

interface CategoryCake {
  id: number;
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

interface OutletThresholdProps {
  data: Destination[];
  onUpdate: () => void;
}

const OutletThreshold: React.FC<OutletThresholdProps> = ({
  data,
  onUpdate
}) => {
  const [selectedDeliveriesThreshold, setSelectedDeliveriesThreshold] =
    useState<CategoryCake | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [threshold, setThreshold] = useState(0);

  // Declare hooks at the top level with null/undefined IDs initially
  const updateDeliveriesThreshold = useUpdateDeliveriesThreshold(
    selectedDeliveriesThreshold?.id
  );
  const destroyDeliveriesThreshold = useDestroyDeliveriesThreshold(
    selectedDeliveriesThreshold?.id
  );

  const initialValue = {
    threshold: selectedDeliveriesThreshold?.threshold ?? 0
  };

  const schema = yup.object({
    threshold: yup
      .number()
      .required('Threshold is required')
      .min(1, 'Threshold must be greater than or equal to 1')
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  const onSubmit = async (formData: any) => {
    if (!selectedDeliveriesThreshold) return;
    
    const payload = {
      threshold: threshold
    };

    // Use the hook instance that was declared at the top level
    updateDeliveriesThreshold.mutate(payload as any, {
      onSuccess: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Item has been updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        onUpdate();
        setOpenModal(false);
        reset();
      },
      onError: (err: any) => {
        const errors = err.response?.data;
        SwalErrors({ errors });
      }
    });
  };

  const handleSelectDeliveriesThreshold = (deliveries: CategoryCake) => {
    setSelectedDeliveriesThreshold(deliveries);
  };

  const handleDeleteDeliveriesThreshold = (cake: CategoryCake) => {
    // Set the selected item first, then perform the delete
    setSelectedDeliveriesThreshold(cake);
    
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete ${cake.category_cake_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Use setTimeout to ensure state update is processed
        setTimeout(() => {
          destroyDeliveriesThreshold.mutate(undefined, {
            onSuccess: () => {
              Swal.fire({
                title: 'Deleted!',
                text: 'Item has been deleted successfully.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              });
              onUpdate();
              setSelectedDeliveriesThreshold(null);
            },
            onError: (err: any) => {
              const errors = err.response?.data;
              SwalErrors({ errors });
            }
          });
        }, 0);
      }
    });
  };

  const calculateProgressPercentage = (
    delivered: number,
    threshold: number
  ) => {
    return Math.min((delivered / threshold) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SimpleModalComponent
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title="Update Threshold"
      >
        {selectedDeliveriesThreshold && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                      {selectedDeliveriesThreshold.category_cake_name}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Threshold Value
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      type="number"
                      placeholder="Enter new threshold"
                      aria-label="Threshold"
                      min="1"
                      defaultValue={selectedDeliveriesThreshold.threshold}
                      onChange={e => {
                        setThreshold(parseInt(e.target.value) || 0);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <ButtonComponent
                  type="button"
                  text="Cancel"
                  color="btn-secondary w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setOpenModal(false)}
                />
                <ButtonComponent
                  type="submit"
                  text={
                    updateDeliveriesThreshold.isLoading
                      ? 'Saving...'
                      : 'Save Changes'
                  }
                  color="btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={updateDeliveriesThreshold.isLoading}
                />
              </div>
            </form>
          </div>
        )}
      </SimpleModalComponent>
      
      <div className="container mx-auto px-4 py-8">
        <CardComponent title="Target Pengantaran Kue Hari Ini">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <CreateDeliveriesThreshold />
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {data.map(destination => (
                <div key={destination.destination_id} className="w-full">
                  <CardComponent>
                    <div className="p-6">
                      {/* Header Section */}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 w-1 h-6 rounded-full mr-3"></span>
                          {destination.destination_name}
                        </h3>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700">
                          <div className="text-center">
                            <div className="p-2 bg-blue-500 rounded-lg mx-auto w-fit mb-2">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                            </div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                              Total Quantity
                            </p>
                            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                              {destination.total_qty}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
                          <div className="text-center">
                            <div className="p-2 bg-green-500 rounded-lg mx-auto w-fit mb-2">
                              <svg
                                className="w-4 h-4 text-white"
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
                            </div>
                            <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">
                              Delivered
                            </p>
                            <p className="text-lg font-bold text-green-900 dark:text-green-100">
                              {destination.total_delivered}/{destination.total_qty}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Category Cakes Section */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="p-1.5 bg-indigo-500 rounded-lg">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            Category Cakes
                          </h4>
                        </div>

                        <div className="space-y-3">
                          {destination.category_cake.map(cake => (
                            <div
                              key={cake.id}
                              className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
                            >
                              {/* Category Name */}
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Category Name
                                </p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                  {cake.category_cake_name}
                                </p>
                              </div>
                              
                              {/* Progress Section */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {cake.total_delivered}/{cake.threshold}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {Math.round(calculateProgressPercentage(cake.total_delivered, cake.threshold))}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{
                                      width: `${calculateProgressPercentage(cake.total_delivered, cake.threshold)}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                  onClick={() => {
                                    handleSelectDeliveriesThreshold(cake);
                                    setThreshold(cake.threshold); // Set initial threshold value
                                    setOpenModal(true);
                                  }}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span>Update</span>
                                </button>
                                <button
                                  type="button"
                                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                                  onClick={() => handleDeleteDeliveriesThreshold(cake)}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardComponent>
                </div>
              ))}
            </div>
          </div>
        </CardComponent>
      </div>
    </div>
  );
};

export default OutletThreshold;
