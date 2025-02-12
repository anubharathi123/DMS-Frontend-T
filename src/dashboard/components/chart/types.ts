import type { Props } from 'react-apexcharts';
import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ChartProps = {
  type: Props['type'];
  series: Props['series'];
  options: Props['options'];
  value: Props['value'];
};

export type ChartBaseProps = Props;

export type ChartOptions1 = Props['options'];

export interface ChartOptions {

  chart?: any;

  colors?: string[];

  states?: any;

  fill?: any;

  dataLabels?: any;

  stroke?: any;

  xaxis?: any;

  yaxis?: any;

  markers?: any;

  tooltip?: any;

  legend?: any;

  plotOptions?: any;

  responsive?: any[];

  grid?: any; // Added grid property

}


export type ChartLoadingProps = {
  disabled?: boolean;
  sx?: SxProps<Theme>;
};
