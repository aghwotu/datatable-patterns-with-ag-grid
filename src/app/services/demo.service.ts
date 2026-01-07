import { Injectable } from '@angular/core';

export interface Demo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  previewGradient: string;
  rowData: any[];
  columnDefs: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demos: Demo[] = [
    {
      id: 'basic-grid',
      title: 'Basic Data Grid',
      description:
        'A simple grid showcasing fundamental AG-Grid features with sorting, filtering, and pagination.',
      tags: ['Basics', 'Sorting', 'Filtering'],
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
    },
    {
      id: 'employee-directory',
      title: 'Employee Directory',
      description:
        'An advanced employee management grid with editable cells, row selection, and custom cell renderers.',
      tags: ['Editing', 'Selection', 'Custom Cells'],
      previewGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      rowData: [
        {
          id: 1,
          name: 'Sarah Chen',
          role: 'Engineering Lead',
          department: 'Engineering',
          salary: 185000,
          status: 'Active',
        },
        {
          id: 2,
          name: 'Marcus Johnson',
          role: 'Product Manager',
          department: 'Product',
          salary: 165000,
          status: 'Active',
        },
        {
          id: 3,
          name: 'Elena Rodriguez',
          role: 'UX Designer',
          department: 'Design',
          salary: 135000,
          status: 'Active',
        },
        {
          id: 4,
          name: 'James Wilson',
          role: 'DevOps Engineer',
          department: 'Engineering',
          salary: 155000,
          status: 'On Leave',
        },
        {
          id: 5,
          name: 'Aisha Patel',
          role: 'Data Scientist',
          department: 'Analytics',
          salary: 175000,
          status: 'Active',
        },
        {
          id: 6,
          name: 'David Kim',
          role: 'Frontend Developer',
          department: 'Engineering',
          salary: 145000,
          status: 'Active',
        },
      ],
      columnDefs: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', filter: true, sortable: true, editable: true },
        { field: 'role', headerName: 'Role', filter: true, sortable: true },
        { field: 'department', headerName: 'Department', filter: true, sortable: true },
        {
          field: 'salary',
          headerName: 'Salary',
          sortable: true,
          valueFormatter: (params: any) => '$' + params.value.toLocaleString(),
        },
        { field: 'status', headerName: 'Status', filter: true },
      ],
    },
    {
      id: 'analytics-dashboard',
      title: 'Analytics Dashboard',
      description:
        'Real-time analytics data with sparklines, aggregations, and dynamic updates for monitoring metrics.',
      tags: ['Analytics', 'Aggregation', 'Real-time'],
      previewGradient: 'from-orange-500 via-rose-600 to-pink-700',
      rowData: [
        { metric: 'Page Views', today: 45230, yesterday: 42100, change: 7.4, trend: 'up' },
        { metric: 'Unique Visitors', today: 12450, yesterday: 11800, change: 5.5, trend: 'up' },
        { metric: 'Bounce Rate', today: 34.2, yesterday: 36.8, change: -7.1, trend: 'down' },
        { metric: 'Avg. Session', today: 4.5, yesterday: 4.2, change: 7.1, trend: 'up' },
        { metric: 'Conversions', today: 892, yesterday: 756, change: 18.0, trend: 'up' },
        { metric: 'Revenue', today: 28450, yesterday: 24300, change: 17.1, trend: 'up' },
      ],
      columnDefs: [
        { field: 'metric', headerName: 'Metric', filter: true, sortable: true },
        {
          field: 'today',
          headerName: 'Today',
          sortable: true,
          valueFormatter: (params: any) =>
            typeof params.value === 'number' && params.value > 100
              ? params.value.toLocaleString()
              : params.value,
        },
        {
          field: 'yesterday',
          headerName: 'Yesterday',
          sortable: true,
          valueFormatter: (params: any) =>
            typeof params.value === 'number' && params.value > 100
              ? params.value.toLocaleString()
              : params.value,
        },
        {
          field: 'change',
          headerName: 'Change %',
          sortable: true,
          valueFormatter: (params: any) => (params.value > 0 ? '+' : '') + params.value + '%',
        },
        { field: 'trend', headerName: 'Trend', filter: true },
      ],
    },
  ];

  getDemos(): Demo[] {
    return this.demos;
  }

  getDemoById(id: string): Demo | undefined {
    return this.demos.find((demo) => demo.id === id);
  }
}
