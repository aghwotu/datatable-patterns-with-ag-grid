import { Demo } from '../demo.service';

export const employeeDirectoryDemo: Demo = {
  id: 'employee-directory',
  title: 'Employee Directory',
  description:
    'An internal admin-style directory: edit fields inline, select rows, and filter by role/department/status.',
  tags: ['Internal Tools', 'Editable', 'Selection'],
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
};
