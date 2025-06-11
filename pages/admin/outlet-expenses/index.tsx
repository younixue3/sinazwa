import React, { useState, useEffect } from 'react';
import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import OutletExpensesTableComponent from 'components/Table/OutletExpensesTableComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import SimpleModalComponent from 'components/Modal/SimpleModalComponent';
import OutletExpenseForm from 'components/Pages/outlet/OutletExpenseForm';
import EditOutletExpenseForm from 'components/Forms/EditOutletExpenseForm';

export default function OutletExpenses() {
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | number | null>(null);

  const handleEdit = (expense: any) => {
    
    setSelectedExpenseId(expense.id);
    setEditModalOpened(true);
    };

  const handleCloseEditModal = () => {
    setEditModalOpened(false);
    setSelectedExpenseId(null);
  };

  const handleAddSuccess = () => {
    setAddModalOpened(false);
  };

  const handleAddModalToggle = () => {
    setAddModalOpened(!addModalOpened);
  };

  useEffect(() => {
  }, [editModalOpened, selectedExpenseId]);

  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-6 gap-3'}>
        <div className={'col-span-6'}>
          <CardComponent>
            <div className={'p-5'}>
              <div className={'grid grid-cols-6 mb-4'}>
                <div className={'col-span-4'}>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Data Pengeluaran Outlet
                  </h2>
                </div>
                <div className={'col-span-2 flex justify-end'}>
                  <ModalComponent
                    text="Tambah Pengeluaran"
                    color="bg-blue-600 hover:bg-blue-700 text-white"
                    title="Tambah Pengeluaran Outlet"
                    opened={addModalOpened}
                    modalToggle={handleAddModalToggle}
                    onClick={handleAddModalToggle}
                  >
                    <OutletExpenseForm onSuccess={handleAddSuccess} />
                  </ModalComponent>
                </div>
              </div>
              <OutletExpensesTableComponent onEdit={handleEdit} />
            </div>
          </CardComponent>
        </div>
      </main>

      {/* Modal Edit Pengeluaran - Menggunakan SimpleModalComponent */}
      <SimpleModalComponent
        title="Edit Pengeluaran Outlet"
        opened={editModalOpened}
        onClose={handleCloseEditModal}
        removeButton={true}
      >
        {selectedExpenseId && (
          <EditOutletExpenseForm
            expenseId={selectedExpenseId}
            onClose={handleCloseEditModal}
          />
        )}
      </SimpleModalComponent>
    </AdminLayout>
  );
}
