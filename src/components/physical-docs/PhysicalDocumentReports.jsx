import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, FileBox, MapPin, AlertTriangle, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#146FE0', '#04BF7B', '#8884d8', '#ffc658', '#ff8042'];

const safeFormatMonth = (dateString) => {
    if (!dateString) return null;
    try {
        const date = new Date(dateString.replace(/-/g, '/'));
        if (isNaN(date.getTime())) return null;
        return format(date, 'MMM/yy', { locale: ptBR });
    } catch {
        return null;
    }
};

export default function PhysicalDocumentReports({ documents, locations, isLoading }) {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const safeLocations = Array.isArray(locations) ? locations : [];

  const docsByMonth = useMemo(() => {
    if (isLoading) return [];
    const monthlyData = safeDocuments.reduce((acc, doc) => {
      const month = safeFormatMonth(doc.entry_date);
      if (month) {
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(monthlyData)
      .map(([name, count]) => ({ name, documentos: count }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));
  }, [safeDocuments, isLoading]);

  const docsByStatus = useMemo(() => {
    if (isLoading) return [];
    const statusData = safeDocuments.reduce((acc, doc) => {
      if (doc && doc.status) {
        const status = doc.status.charAt(0).toUpperCase() + doc.status.slice(1);
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(statusData).map(([name, value]) => ({ name, value }));
  }, [safeDocuments, isLoading]);

  const docsByLocation = useMemo(() => {
    if (isLoading || safeLocations.length === 0) return [];
    const locationData = safeDocuments.reduce((acc, doc) => {
      if (doc && doc.physical_location_id) {
        const locationName = safeLocations.find(l => l.id === doc.physical_location_id)?.street || 'Desconhecido';
        acc[locationName] = (acc[locationName] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(locationData)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value)
        .slice(0, 5); // top 5
  }, [safeDocuments, safeLocations, isLoading]);

  const renderChart = (title, data, dataKey, icon, type = 'bar') => (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {type === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} fill="#146FE0" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderChart('Documentos por Mês', docsByMonth, 'documentos', <FileText className="w-5 h-5"/>)}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart('Documentos por Status', docsByStatus, 'value', <Package className="w-5 h-5"/>, 'pie')}
        {renderChart('Top 5 Ruas por Documentos', docsByLocation, 'value', <MapPin className="w-5 h-5"/>, 'pie')}
      </div>
    </div>
  );
}