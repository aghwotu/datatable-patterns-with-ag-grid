import { Demo } from '../demo.service';

export const basicGridDemo: Demo = {
  id: 'basic-grid',
  title: 'Basic Data Grid',
  description:
    'A simple baseline table (sort/filter/pagination) to compare against the more advanced scenarios.',
  tags: ['Baseline', 'Sorting', 'Pagination'],
  previewGradient: 'from-cyan-500 via-blue-600 to-purple-700',
  rowData: [
    { id: 1, name: 'Tesla Model S', make: 'Tesla', price: 79999, year: 2024 },
    { id: 2, name: 'BMW i4', make: 'BMW', price: 56999, year: 2024 },
    { id: 3, name: 'Mercedes EQS', make: 'Mercedes', price: 104999, year: 2024 },
    { id: 4, name: 'Audi e-tron GT', make: 'Audi', price: 106999, year: 2023 },
    { id: 5, name: 'Porsche Taycan', make: 'Porsche', price: 86999, year: 2024 },
    { id: 6, name: 'Ford Mustang Mach-E', make: 'Ford', price: 45999, year: 2024 },
    { id: 7, name: 'Rivian R1T', make: 'Rivian', price: 73999, year: 2024 },
    { id: 8, name: 'Lucid Air', make: 'Lucid', price: 87999, year: 2024 },
  ],
  columnDefs: [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Vehicle', filter: true, sortable: true },
    { field: 'make', headerName: 'Manufacturer', filter: true, sortable: true },
    {
      field: 'price',
      headerName: 'Price',
      sortable: true,
      valueFormatter: (params: any) => '$' + params.value.toLocaleString(),
    },
    { field: 'year', headerName: 'Year', sortable: true },
  ],
};
