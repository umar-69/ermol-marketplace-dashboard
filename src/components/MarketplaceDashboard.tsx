import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar
} from 'recharts';

// Interfaces for component props
interface TabButtonProps {
  id: string;
  name: string;
  isActive: boolean;
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

interface DataGapItemProps {
  title: string;
  description: string;
}

const MonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Mock data based on the metrics provided
// This would be replaced with actual data from the Excel file

// GMV Monthly Data (2024-2025)
const gmvMonthlyData = [
  { month: "Apr '24", value: 0 },
  { month: "May '24", value: 0 },
  { month: "Jun '24", value: 642 },
  { month: "Jul '24", value: 2500 },
  { month: "Aug '24", value: 6000 },
  { month: "Sep '24", value: 9000 },
  { month: "Oct '24", value: 16529 },
  { month: "Nov '24", value: 14000 },
  { month: "Dec '24", value: 9531 },
  { month: "Jan '25", value: 18000 },
  { month: "Feb '25", value: 22000 },
  { month: "Mar '25", value: 25000 },
  { month: "Apr '25", value: 28000 },
  { month: "May '25", value: 32000 },
  { month: "Jun '25", value: 36000 },
  { month: "Jul '25", value: 40000 },
];

// Bookings Monthly Data
const bookingsMonthlyData = [
  { month: "Apr '24", value: 0 },
  { month: "May '24", value: 0 },
  { month: "Jun '24", value: 18 },
  { month: "Jul '24", value: 69 },
  { month: "Aug '24", value: 166 },
  { month: "Sep '24", value: 249 },
  { month: "Oct '24", value: 456 },
  { month: "Nov '24", value: 387 },
  { month: "Dec '24", value: 263 },
  { month: "Jan '25", value: 497 },
  { month: "Feb '25", value: 607 },
  { month: "Mar '25", value: 690 },
  { month: "Apr '25", value: 773 },
  { month: "May '25", value: 883 },
  { month: "Jun '25", value: 994 },
  { month: "Jul '25", value: 1104 },
];

// User Growth Data
const userGrowthData = [
  { month: "Apr '24", learners: 1200, instructors: 12 },
  { month: "May '24", learners: 1500, instructors: 20 },
  { month: "Jun '24", learners: 1800, instructors: 35 },
  { month: "Jul '24", learners: 2200, instructors: 50 },
  { month: "Aug '24", learners: 2800, instructors: 70 },
  { month: "Sep '24", learners: 3200, instructors: 85 },
  { month: "Oct '24", learners: 3800, instructors: 110 },
  { month: "Nov '24", learners: 4400, instructors: 135 },
  { month: "Dec '24", learners: 4819, instructors: 158 },
  { month: "Jan '25", learners: 6000, instructors: 250 },
  { month: "Feb '25", learners: 7500, instructors: 350 },
  { month: "Mar '25", learners: 8787, instructors: 480 },
];

// Annual GMV Comparison
const annualGMVData = [
  { name: '2024', value: 66700 },
  { name: '2025 (Projected)', value: 302600 },
];

// Instructor Utilization
const utilizationData = [
  { name: 'Hours Taught', value: 1500 },
  { name: 'Unused Capacity', value: 46500 },
];

// Operational Metrics
const operationalMetricsData = [
  { name: 'Commission per Lesson', value: 1.81 },
  { name: 'Operational Cost per Lesson', value: 6.80 },
];

// Supply/Demand Balance
const supplyDemandData = [
  { name: 'Learners (Active)', value: 1400 },
  { name: 'Instructors (Active)', value: 480 },
];

// CAC & LTV Data
const acquisitionData = [
  { name: 'Learner CAC', value: 0.5 },
  { name: 'Instructor CAC', value: 2.5 },
  { name: 'Learner LTV (Est.)', value: 18 },
];

// Booking Status
const bookingStatusData = [
  { name: 'Completed Lessons', value: 91.7 },
  { name: 'Cancelled Lessons', value: 8.3 },
];

// LTV:CAC Comparison
const ltvCacData = [
  { name: 'Actual (36:1)', value: 36 },
  { name: 'Benchmark (3:1)', value: 3 },
];

// Active vs Inactive Users
const activeUsersData = [
  { name: 'Active Learners (MAU)', value: 1400 },
  { name: 'Inactive Learners', value: 7387 },
];

// Custom color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const RED_COLOR = '#FF6B6B';
const GREEN_COLOR = '#4CAF50';
const YELLOW_COLOR = '#FFC107';

const MarketplaceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'growth', name: 'Growth Metrics' },
    { id: 'economics', name: 'Unit Economics' },
    { id: 'supply-demand', name: 'Supply & Demand' },
    { id: 'engagement', name: 'User Engagement' },
    { id: 'gaps', name: 'Data Gaps' }
  ];

  const TabButton = ({ id, name, isActive }: TabButtonProps) => (
    <button
      className={`px-4 py-2 mr-2 rounded-t ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      onClick={() => setActiveTab(id)}
    >
      {name}
    </button>
  );

  const KPICard = ({ title, value, subtitle, color = 'blue' }: KPICardProps) => (
    <div className={`bg-white p-4 rounded shadow-md border-l-4 border-${color}-500`}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  const ChartContainer = ({ title, children, className = "" }: ChartContainerProps) => (
    <div className={`bg-white p-4 rounded-lg shadow-md mb-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );

  const DataGapItem = ({ title, description }: DataGapItemProps) => (
    <div className="bg-yellow-50 p-4 rounded-lg shadow-sm mb-3 border-l-4 border-yellow-400">
      <div className="font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{description}</div>
    </div>
  );

  const renderOverviewTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard 
          title="2024 GMV" 
          value="£66.7K" 
          subtitle="→ £302.6K in 2025 (Projected)" 
          color="green"
        />
        <KPICard 
          title="Lessons Completed (2024)" 
          value="~1,800" 
          subtitle="~250/month by Dec '24"
          color="blue"
        />
        <KPICard 
          title="Total Learners" 
          value="8,787" 
          subtitle="As of Mar '25"
          color="purple"
        />
        <KPICard 
          title="Instructor Utilization" 
          value="~3%" 
          subtitle="Significant spare capacity"
          color="red"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Monthly GMV Growth (£)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gmvMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `£${value}`} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0088FE" name="GMV (£)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Annual GMV Comparison">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={annualGMVData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `£${value}`} />
              <Bar dataKey="value" fill="#4CAF50" name="GMV (£)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer title="Supply/Demand Balance (Active Users)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={supplyDemandData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {supplyDemandData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Booking Status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={GREEN_COLOR} />
                <Cell fill={RED_COLOR} />
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );

  const renderGrowthTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard 
          title="GMV Growth" 
          value="354%" 
          subtitle="Projected YoY (2024 to 2025)" 
          color="green"
        />
        <KPICard 
          title="Bookings Growth" 
          value="~4.5×" 
          subtitle="1,800 to 8,300 lessons"
          color="blue"
        />
        <KPICard 
          title="User Growth" 
          value="633%" 
          subtitle="Apr '24 to Mar '25 (Learners)"
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Monthly Bookings Growth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingsMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="Lessons" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="User Growth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="learners" stroke="#8884d8" name="Learners" strokeWidth={2} />
              <Line type="monotone" dataKey="instructors" stroke="#82ca9d" name="Instructors" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer title="Active vs Inactive Learners">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeUsersData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={GREEN_COLOR} />
                <Cell fill="#D3D3D3" />
              </Pie>
              <Tooltip formatter={(value) => value} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Learner to Instructor Ratio">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Total Sign-ups', ratio: 30 },
              { name: 'Active Users', ratio: 2.9 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}:1`} />
              <Bar dataKey="ratio" fill="#FFBB28" name="Learners per Instructor" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );

  const renderEconomicsTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard 
          title="Take Rate" 
          value="5%" 
          subtitle="£1.81 per £36.24 lesson" 
          color="green"
        />
        <KPICard 
          title="LTV:CAC Ratio" 
          value="36:1" 
          subtitle="vs. industry benchmark of 3:1"
          color="blue"
        />
        <KPICard 
          title="Payback Period" 
          value="< 1 week" 
          subtitle="for learners"
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Unit Economics Per Lesson">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={operationalMetricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip formatter={(value) => `£${value}`} />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Acquisition Costs & LTV">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={acquisitionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `£${value}`} />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer title="LTV:CAC Comparison">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ltvCacData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Ratio" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Profitability Gap">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="20%" 
              outerRadius="80%" 
              barSize={10} 
              data={[
                { name: 'Revenue per Lesson', value: 1.81, fill: GREEN_COLOR },
                { name: 'Cost per Lesson', value: 6.80, fill: RED_COLOR }
              ]}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                dataKey="value"
              />
              <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip formatter={(value) => `£${value}`} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );

  const renderSupplyDemandTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard 
          title="Active Learners" 
          value="~1,400" 
          subtitle="Monthly Active Users" 
          color="blue"
        />
        <KPICard 
          title="Active Instructors" 
          value="~480" 
          subtitle="Available for bookings"
          color="green"
        />
        <KPICard 
          title="Instructor Onboarding" 
          value="3 min" 
          subtitle="Time to complete sign-up"
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Instructor Utilization">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={utilizationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={GREEN_COLOR} />
                <Cell fill="#D3D3D3" />
              </Pie>
              <Tooltip formatter={(value) => `${value} hours`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Supply/Demand Balance Evolution">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="learners" stroke="#8884d8" name="Learners" strokeWidth={2} />
              <Line type="monotone" dataKey="instructors" stroke="#82ca9d" name="Instructors" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer title="Lessons per Active Learner (Monthly)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Current', value: 1.07 },
              { name: 'Target', value: 4 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Lessons" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Booking Status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={GREEN_COLOR} />
                <Cell fill={RED_COLOR} />
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );

  const renderEngagementTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard 
          title="MAU (Learners)" 
          value="~1,400" 
          subtitle="~15-20% of total users" 
          color="blue"
        />
        <KPICard 
          title="Lessons per Active User" 
          value="~1.07" 
          subtitle="per month"
          color="green"
        />
        <KPICard 
          title="Cancellation Rate" 
          value="8.3%" 
          subtitle="of booked lessons"
          color="red"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Active vs Inactive Learners">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeUsersData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={GREEN_COLOR} />
                <Cell fill="#D3D3D3" />
              </Pie>
              <Tooltip formatter={(value) => value} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Engagement Gap">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
              { subject: 'Instructor Utilization', A: 3, fullMark: 100 },
              { subject: 'Learner Activation Rate', A: 20, fullMark: 100 },
              { subject: 'Lessons per Active User', A: 27, fullMark: 100 },
              { subject: 'Repeat Booking Rate', A: 40, fullMark: 100 },
              { subject: 'Retention (est.)', A: 35, fullMark: 100 },
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Current %" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer title="Monthly Active Users Trend (Est.)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { month: "Jun '24", value: 50 },
              { month: "Jul '24", value: 150 },
              { month: "Aug '24", value: 300 },
              { month: "Sep '24", value: 500 },
              { month: "Oct '24", value: 800 },
              { month: "Nov '24", value: 1100 },
              { month: "Dec '24", value: 1200 },
              { month: "Jan '25", value: 1300 },
              { month: "Feb '25", value: 1350 },
              { month: "Mar '25", value: 1400 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0088FE" name="MAU" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer title="Booking Status Evolution (Est.)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { month: 'Oct', completed: 300, cancelled: 30 },
              { month: 'Nov', completed: 350, cancelled: 37 },
              { month: 'Dec', completed: 240, cancelled: 23 },
              { month: 'Jan', completed: 450, cancelled: 47 },
              { month: 'Feb', completed: 550, cancelled: 57 },
              { month: 'Mar', completed: 630, cancelled: 60 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill={GREEN_COLOR} name="Completed" />
              <Bar dataKey="cancelled" stackId="a" fill={RED_COLOR} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );

  const renderGapsTab = () => (
    <div>
      <div className="bg-yellow-100 p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">Key Data Gaps to Track</h3>
        <p className="text-yellow-700 mb-2">
          These metrics are currently missing but critical for optimizing marketplace performance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DataGapItem 
            title="Match/Fill Rate" 
            description="% of lesson requests fulfilled - track how many requested lessons actually result in bookings"
          />
          
          <DataGapItem 
            title="Time-to-Match" 
            description="Duration from learner request to booking confirmation - measure marketplace efficiency"
          />
          
          <DataGapItem 
            title="Retention & Repeat Rates" 
            description="Track cohort-level retention over time and % of bookings from repeat customers"
          />
          
          <DataGapItem 
            title="DAU/MAU Ratio" 
            description="Daily active users divided by monthly active users - indicates frequency of engagement"
          />
        </div>
        
        <div>
          <DataGapItem 
            title="Conversion Funnel" 
            description="Measure visitor→sign-up→first booking→repeat booking percentages to identify drop-off points"
          />
          
          <DataGapItem 
            title="NPS & Quality Metrics" 
            description="Net Promoter Score to gauge satisfaction; track lesson ratings and support tickets"
          />
          
          <DataGapItem 
            title="Instructor Fill Rate" 
            description="% of each instructor's available slots that actually get booked - measure individual utilization"
          />
          
          <DataGapItem 
            title="Learner Cohort Analysis" 
            description="Track how many lessons each cohort takes over time to better estimate LTV"
          />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Next Steps Recommendation</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            Instrument analytics to capture these metrics and identify opportunities to:
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Optimize marketplace liquidity by improving match rates and time-to-match</li>
            <li>Increase user engagement through better onboarding and activation strategies</li>
            <li>Improve unit economics by reducing operational costs per transaction</li>
            <li>Balance supply and demand more effectively by focusing acquisition efforts</li>
            <li>Reduce cancellation rates through better matching and incentives</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ErmoL Marketplace Data Room</h1>
          <p className="text-gray-600 mb-4">
            Comprehensive visualization of key marketplace metrics and performance indicators
          </p>
          
          <div className="border-b border-gray-200 mb-4">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <TabButton 
                  key={tab.id}
                  id={tab.id}
                  name={tab.name}
                  isActive={activeTab === tab.id}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'growth' && renderGrowthTab()}
            {activeTab === 'economics' && renderEconomicsTab()}
            {activeTab === 'supply-demand' && renderSupplyDemandTab()}
            {activeTab === 'engagement' && renderEngagementTab()}
            {activeTab === 'gaps' && renderGapsTab()}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center mt-4">
          Data as of March 2025 | Based on platform metrics and financial projections
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDashboard; 