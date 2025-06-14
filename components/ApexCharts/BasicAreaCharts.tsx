import React from 'react';
import dynamic from 'next/dynamic';
import toRupiah from 'utils/helpers/number';

// Dynamically import ApexCharts to avoid SSR issue
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartData {
  dates: string[];
  totalSelling: number[];
}

interface ChartState {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    chart: {
      type: string;
      height: number;
      zoom: {
        enabled: boolean;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      curve: string;
    };
    title: {
      text: string;
      align: string;
    };
    subtitle: {
      text: string;
      align: string;
    };
    xaxis: {
      type: string;
      categories: string[];
    };
    yaxis: {
      opposite: boolean;
      labels: {
        formatter: (value: number) => string;
      };
    };
    legend: {
      horizontalAlign: string;
    };
  };
}

// Example dummy data
const dummyData: ChartData = {
  totalSelling: [
    8107.85, 8128.0, 8122.9, 8165.5, 8340.7, 8423.7, 8423.5, 8514.3, 8481.85,
    8487.7, 8506.9, 8626.2
  ],
  dates: [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-06',
    '2024-01-07',
    '2024-01-08',
    '2024-01-09',
    '2024-01-10',
    '2024-01-11',
    '2024-01-12'
  ]
};

const BasicAreaCharts: React.FC<{ series?: ChartData; title: string }> = ({
  series,
  title
}) => {
  const chartData = series || dummyData;

  const [state, setState] = React.useState<ChartState>({
    series: [
      {
        name: 'Grafik Penjualan',
        data: chartData.totalSelling
      }
    ],
    //@ts-ignore
    options: {
      chart: {
        type: 'area',
        height: 200,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: title,
        align: 'left'
      },
      xaxis: {
        type: 'datetime',
        categories: chartData.dates
      },
      yaxis: {
        opposite: true,
        labels: {
          formatter: function (value) {
            return 'Rp. ' + toRupiah(value);
          }
        }
      },
      legend: {
        horizontalAlign: 'left'
      }
    }
  });

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      series: [
        {
          name: 'Grafik Penjualan',
          data: chartData.totalSelling
        }
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: chartData.dates
        }
      }
    }));
  }, [chartData]);

  return (
    <div className="w-full h-full">
      <Chart
        //@ts-ignore
        options={{
          ...state.options,
          chart: {
            ...state.options.chart,
            type: 'area'
          }
        }}
        series={state.series}
        type="area"
        height={200}
      />
    </div>
  );
};

export default BasicAreaCharts;
