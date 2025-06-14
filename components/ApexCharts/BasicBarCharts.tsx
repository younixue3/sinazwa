import React from 'react';
import dynamic from 'next/dynamic';
import toRupiah from 'utils/helpers/number';

// Dynamically import ApexCharts to avoid SSR issue
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartData {
  dates: string[];
  [key: string]: string[] | number[]; // Allow dynamic series names
}

interface ChartOptions {
  chart: {
    type: 'bar';
    height: number;
  };
  plotOptions: {
    bar: {
      horizontal: boolean;
      columnWidth: string;
      borderRadius: number;
      borderRadiusApplication: string;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    show: boolean;
    width: number;
    colors: string[];
  };
  xaxis: {
    categories: string[];
  };
  yaxis: {
    title: {
      text: string;
    };
  };
  fill: {
    opacity: number;
  };
  tooltip: {
    y: {
      formatter: (value: number) => string;
    };
  };
}

interface ChartState {
  series: Array<{
    name: string;
    data: number[];
  }>;
  options: ChartOptions;
}

const DEFAULT_DATA: ChartData = {
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
  ],
  'Net Profit': [44, 55, 57, 56, 61, 58, 63, 60, 66],
  Revenue: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  'Free Cash Flow': [35, 41, 36, 26, 45, 48, 52, 53, 41]
};

interface BasicBarChartsProps {
  series?: ChartData;
  title: string;
}

const BasicBarCharts: React.FC<BasicBarChartsProps> = ({ series, title }) => {
  const chartData = series || DEFAULT_DATA;

  const getChartState = React.useCallback(
    (data: ChartData): ChartState => ({
      series: Object.entries(data)
        .filter(([key]) => key !== 'dates')
        .map(([name, values]) => ({
          name,
          data: values as number[]
        })),
      options: {
        chart: {
          type: 'bar',
          height: 200
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: data.dates
        },
        yaxis: {
          title: {
            text: '$ (thousands)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: (val: number) => `Rp. ${toRupiah(val)}`
          }
        }
      }
    }),
    []
  );

  const [state, setState] = React.useState<ChartState>(() =>
    getChartState(chartData)
  );

  React.useEffect(() => {
    setState(getChartState(chartData));
  }, [chartData, getChartState]);

  return (
    <div className="w-full h-full">
      <Chart
        //@ts-ignore
        options={state.options}
        series={state.series}
        type="bar"
        height={250}
      />
    </div>
  );
};

export default BasicBarCharts;
