# Dashboard Detail Modals

This directory contains professional, responsive modal components that provide detailed views when users click on the dashboard summary cards.

## Components

### SchoolsDetailModal.jsx
- **List Tab**: Displays all schools with search, sort, and pagination
- **Analytics Tab**: Shows school distribution by state with visual progress bars
- Features: Search by school name/state/district, sort by multiple fields, pagination

### LabsDetailModal.jsx
- **List Tab**: Displays all labs with comprehensive filtering
- **Equipment Tab**: Shows equipment allocation across labs
- **Analytics Tab**: Lab type distribution and capacity analysis
- Features: Search by lab name/type/school, equipment allocation tracking

### EquipmentDetailModal.jsx
- **Available Equipment Tab**: Shows all available equipment with details
- **Allocated Equipment Tab**: Displays allocated equipment by school/lab
- **Analytics Tab**: Equipment type analysis and warranty status
- Features: Warranty tracking, allocation rates, equipment type distribution

### SessionsDetailModal.jsx
- **Sessions List Tab**: All sessions with status filtering (upcoming/completed)
- **Monthly View Tab**: Sessions distribution by month
- **Analytics Tab**: Host performance and school participation analysis
- Features: Date-based filtering, host analytics, session status tracking

## Features

### Common Features Across All Modals
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Search Functionality**: Real-time search across relevant fields
- **Sorting**: Multi-field sorting with ascending/descending options
- **Pagination**: Efficient pagination for large datasets
- **Professional UI**: Modern design with hover effects and animations
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error handling and fallbacks

### Interactive Elements
- **Clickable Cards**: Dashboard cards now have hover effects and click handlers
- **Modal Tabs**: Easy navigation between different views
- **Progress Bars**: Visual representation of data distribution
- **Status Badges**: Color-coded status indicators
- **Responsive Tables**: Mobile-friendly table layouts

## Usage

The modals are automatically integrated into the Home.jsx component. Users can:

1. Click on any dashboard summary card (Total Schools, Total Labs, etc.)
2. View detailed information in a professional modal interface
3. Navigate between different tabs for various data views
4. Search, sort, and paginate through large datasets
5. View analytics and distribution charts

## Styling

All modals use the shared `DetailModal.css` file which provides:
- Consistent styling across all modals
- Responsive breakpoints for mobile devices
- Professional color scheme and typography
- Smooth animations and transitions
- Accessibility-compliant design

## Data Integration

Each modal fetches data using existing API functions from the ApiHandler directory:
- Real-time data loading
- Proper error handling
- Loading states during data fetch
- Efficient data processing and filtering