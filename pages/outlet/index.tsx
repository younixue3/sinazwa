import { useQueryClient } from 'react-query';
import OutletLayout from 'pages/outlet/OutletLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from 'components/Button/ButtonComponent';
import { Each } from 'helper/Each';
import { useState } from 'react';
import useGetSale from 'utils/api/sale/use-get-sale';
import TabComponent from 'components/Layout/TabComponent';
import CardComponent from 'components/Card/CardComponent';

export default function Outlet() {
  const { data: sales, isLoading } = useGetSale();

  return (
    <OutletLayout>
      <TabComponent tab={['Outlet', 'Riwayat Penjualan']}>
        <section className="grid gap-5 p-3">
          {!isLoading && sales?.length > 0 ? (
            <Each
              of={sales}
              render={(sale: any) => (
                <CardComponent
                  title={sale.cake_production[0].category_cake.name}
                >
                  <div className="p-3">
                    <div className="flex relative gap-2">
                      <FontAwesomeIcon
                        className="text-xl m-auto mt-0 bg-gray-200 rounded p-3"
                        icon={faCookie}
                      />
                      <div className="w-full flex flex-col gap-2">
                        <ButtonComponent
                          text={`Stok: ${sale.cakes_available} pcs`}
                          color="btn-primary text-xs ml-0"
                        />
                      </div>
                    </div>
                  </div>
                </CardComponent>
              )}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Tidak ada data stok
            </div>
          )}
        </section>
        <section className="grid gap-5 p-3">
          {/* Sales history section */}
        </section>
      </TabComponent>
    </OutletLayout>
  );
}
