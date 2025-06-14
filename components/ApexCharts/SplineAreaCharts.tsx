import React from 'react';
import dynamic from 'next/dynamic';
import toRupiah from 'utils/helpers/number';

// Dynamically import ApexCharts to avoid SSR issue
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartData {
  dates: string[];
  [key: string]: string[] | number[]; // Allow dynamic series names
}

interface ChartState {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    chart: {
      height: number;
      type: string;
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      curve: string;
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
    tooltip: {
      x: {
        format: string;
      };
    };
  };
}

// Example dummy data
const dummyData: ChartData = {
  dates: [
    '2018-09-19T00:00:00.000Z',
    '2018-09-19T01:30:00.000Z',
    '2018-09-19T02:30:00.000Z',
    '2018-09-19T03:30:00.000Z',
    '2018-09-19T04:30:00.000Z',
    '2018-09-19T05:30:00.000Z',
    '2018-09-19T06:30:00.000Z'
  ],
  sales: [31, 40, 28, 51, 42, 109, 100],
  revenue: [11, 32, 45, 32, 34, 52, 41]
};

const SplineAreaCharts: React.FC<{ series?: ChartData; title: string }> = ({
  series,
  title
}) => {
  const chartData = series || dummyData;

  const [state, setState] = React.useState<ChartState>({
    series: Object.entries(chartData)
      .filter(([key]) => key !== 'dates')
      .map(([name, data]) => ({
        name,
        data: data as number[]
      })),
    options: {
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
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
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    }
  });

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      series: Object.entries(chartData)
        .filter(([key]) => key !== 'dates')
        .map(([name, data]) => ({
          name,
          data: data as number[]
        })),
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
        // @ts-ignore
        options={state.options}
        series={state.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default SplineAreaCharts;
