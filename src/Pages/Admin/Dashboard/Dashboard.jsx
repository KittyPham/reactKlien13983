import React from "react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { useChartData } from "@/Utils/Hooks/useChart.jsx";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#ffbb28"];

const Dashboard = () => {
  const { data = {}, isLoading } = useChartData();

  const { students = [], genderRatio = [], registrations = [], gradeDistribution = [], lecturerRanks = [] } = data;

  if (isLoading) {
    return <div className="p-6 text-center">Loading chart data...</div>;
  }

  if (Object.keys(data).length === 0) {
    return <div className="p-6 text-center text-red-500">Gagal memuat data chart.</div>;
  }

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Chart 1: Jumlah Mahasiswa per Fakultas (Bar Chart) */}
      <Card className="col-span-1 lg:col-span-2 xl:col-span-1">
        <Heading as="h3" className="mb-4 text-center">
          Mahasiswa per Fakultas
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={students} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="faculty" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Jumlah" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 2: Rasio Gender (Pie Chart) */}
      <Card>
        <Heading as="h3" className="mb-4 text-center">
          Rasio Gender
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={genderRatio} dataKey="count" nameKey="gender" cx="50%" cy="50%" outerRadius={100} label>
              {genderRatio.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 3: Peringkat Dosen (Area Chart) */}
      <Card>
        <Heading as="h3" className="mb-4 text-center">
          Peringkat Dosen
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={lecturerRanks} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorLecturer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="rank" angle={-15} textAnchor="end" height={50} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorLecturer)" name="Jumlah" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 4: Tren Pendaftaran (Line Chart) */}
      <Card className="col-span-1 lg:col-span-2">
        <Heading as="h3" className="mb-4 text-center">
          Tren Pendaftaran per Tahun
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={registrations} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={2} name="Total Pendaftar" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 5: Distribusi Nilai (Radar Chart) */}
      <Card>
        <Heading as="h3" className="mb-4 text-center">
          Distribusi Nilai
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={gradeDistribution}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} />
            <Tooltip />
            <Legend />
            <Radar name="Nilai A" dataKey="A" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
            <Radar name="Nilai B" dataKey="B" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.6} />
            <Radar name="Nilai C" dataKey="C" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;
