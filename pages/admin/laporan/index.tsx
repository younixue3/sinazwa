import AdminLayout from 'pages/admin/AdminLayout';
import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetDateReporting from 'utils/api/reporting/use-get-date-reporting';
import { useState } from 'react';
import useGetDailyReporting from 'utils/api/reporting/use-get-daily-reporting';
import { getDailyReporting } from 'utils/api/reporting/reportingApi';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { ReportLaporan } from 'components/Pages/admin/laporan/ReportLaporan';

export default function Laporan() {
  const GetOutlet = useGetOutlet({ isSelect: false });
  var today = new Date();
  const [destinationId, setDestinationId] = useState();
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [selectedOutletId, setSelectedOutletId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  const handleDailyReport = async (outletId, format) => {
    setIsLoading(true);
    try {
      await getDailyReporting({
        date: formatDate(today),
        download: format,
        destination_id: outletId
      });
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsLoading(false);
      setDestinationId(outletId);
      setShowFormatModal(false);
    }
  };

  const openFormatModal = (outletId) => {
    setSelectedOutletId(outletId);
    setShowFormatModal(true);
  };

  return (
    <AdminLayout>
      <main className={'p-4 grid grid-cols-4 gap-3'}>
        {!GetOutlet.isLoading && (
          <Each
            of={GetOutlet.data || []}
            render={(item: any) => (
              <CardComponent title={item.name}>
                <div className="flex gap-3 p-5">
                  <ButtonComponent
                    onClick={() => openFormatModal(item.id)}
                    text="Harian"
                    color="btn-primary w-full"
                  ></ButtonComponent>
                  <ModalComponent
                    text="Laporan"
                    title="Laporan"
                    color={'btn-primary m-0'}
                    onClick={() => setDestinationId(item.id)}
                  >
                    <ReportLaporan
                      DestinationId={destinationId}
                    ></ReportLaporan>
                  </ModalComponent>
                </div>
              </CardComponent>
            )}
          />
        )}
        
        {/* Modal untuk pilihan format download */}
        {showFormatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Pilih Format Download</h3>
              <div className="space-y-3">
                <ButtonComponent
                  onClick={() => handleDailyReport(selectedOutletId, 'pdf')}
                  text={isLoading ? "Loading..." : "Download PDF"}
                  color="btn-primary w-full"
                  disabled={isLoading}
                />
                <ButtonComponent
                  onClick={() => handleDailyReport(selectedOutletId, 'excel')}
                  text={isLoading ? "Loading..." : "Download Excel"}
                  color="btn-success w-full"
                  disabled={isLoading}
                />
                <ButtonComponent
                  onClick={() => setShowFormatModal(false)}
                  text="Batal"
                  color="btn-secondary w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay loading saat proses download */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-lg font-medium">Sedang mengunduh laporan...</p>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
