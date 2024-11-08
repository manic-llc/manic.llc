export type ViewProps = {
  padded?: boolean,
  centered?: boolean,
  column?: boolean,
  row?: boolean;
}

export const DefaultViewProps: ViewProps = {
  padded: true,
  centered: false,
  column: true,
  row: false
}