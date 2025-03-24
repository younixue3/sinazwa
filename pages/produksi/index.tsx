import TabComponent from 'components/Layout/TabComponent';
// import CardComponent from 'components/Card/CardComponent';
// import { Each } from 'helper/Each';
// import ButtonComponent from 'components/Button/ButtonComponent';
// import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import { useEffect, useState } from 'react';
// import { useQueryClient } from 'react-query';
// import Swal from 'sweetalert2';
// import SwalErrors from 'helper/swal-errors';
// import useGetCake from 'utils/api/cake_production/use-get-cake';
// import useGetDetailCake from 'utils/api/cake_production/use-get-detail-cake';
// import useDeleteCake from 'utils/api/cake_production/use-delete-cake';
// import { CreateCake } from 'components/Pages/produksi/CreateCake';
import ProduksiLayout from 'pages/produksi/ProduksiLayout';
import { AUTH_ID } from 'utils/constants/cookies-keys';
import Cookies from 'js-cookie';
import useGetInstallment from 'utils/api/cicilan/use-get-instalment';
import { CicilanTableComponent } from 'components/Table/CicilanTableComponent';
import { Each } from 'helper/Each';
import CardComponent from 'components/Card/CardComponent';
// import useGetDetailInstallment from 'utils/api/cicilan/use-get-detail-installment';

export default function Produksi() {
  // const queryClient = useQueryClient();
  // const [cakeId, setCakeId] = useState();
  const [id, setId] = useState();
  const GetInstallment = useGetInstallment();
  const activeInstallments = GetInstallment?.data?.filter((item: any) => item.aktif === 1) || [];

  useEffect(() => {
    setId(Cookies.get(AUTH_ID));
  }, [id]);

  return (
    <ProduksiLayout>
      <TabComponent tab={['Produksi', 'Riwayat Produksi']}>
        <section className={'grid gap-5 p-3'}>
          {!activeInstallments.isLoading && (
            <Each
              of={activeInstallments || []}
              render={(item: any) => (
                <CardComponent title={item.user}>
                  <div className={'p-3'}>
                    Sisa Cicilan : {`${item.remaining_installment}`}
                  </div>
                </CardComponent>
              )}
            />
          )}
        </section>
        <section className={'grid gap-5 p-3'}></section>
      </TabComponent>
    </ProduksiLayout>
  );
}
