import { FlexValues } from './../../layout/Layout.types';
export type FixedBarProps = {
  is?: string,
  vertical?: boolean,
  horizontal?: boolean,
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  justify: FlexValues,
  align?: FlexValues,
  visible?: boolean;
  scrollToggle?: boolean;
}

export const FixedBarDefaultProps: FixedBarProps = {
  is: 'header',
  vertical: false,
  horizontal: false,
  align: 'center',
  justify: 'center',
  top: false,
  right: false,
  bottom: false,
  left: false,
  visible: true,
  scrollToggle: false
}