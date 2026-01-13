import { Demo } from '../demo.service';

export const analyticsDashboardDemo: Demo = {
  id: 'analytics-dashboard',
  title: 'Analytics Dashboard',
  description:
    'A KPI summary table: today vs yesterday, percent change, and an at-a-glance trend direction.',
  tags: ['KPIs', 'Deltas', 'Trends'],
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
};
