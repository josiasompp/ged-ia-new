
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Clock, 
  Share2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Target
} from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, color, trend, isLoading }) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>
            )}
            {trend && !isLoading && (
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProposalStats({ stats, isLoading }) {
  const conversionRate = stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : 0;
  const viewRate = stats.sent > 0 ? ((stats.viewed / stats.sent) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total de Propostas"
        value={stats.total}
        icon={FileText}
        color="bg-gradient-to-r from-[#212153] to-[#146FE0]"
        isLoading={isLoading}
      />
      <StatsCard
        title="Taxa de Visualização"
        value={`${viewRate}%`}
        icon={Eye}
        color="bg-gradient-to-r from-[#146FE0] to-[#04BF7B]"
        trend={`${stats.viewed} visualizadas`}
        isLoading={isLoading}
      />
      <StatsCard
        title="Taxa de Conversão"
        value={`${conversionRate}%`}
        icon={Target}
        color="bg-gradient-to-r from-[#04BF7B] to-[#146FE0]"
        trend={`${stats.accepted} aceitas`}
        isLoading={isLoading}
      />
      <StatsCard
        title="Pendentes"
        value={stats.sent + stats.viewed}
        icon={Clock}
        color="bg-gradient-to-r from-amber-500 to-orange-500"
        trend="Aguardando resposta"
        isLoading={isLoading}
      />
    </div>
  );
}
