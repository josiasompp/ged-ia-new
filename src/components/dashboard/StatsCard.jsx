
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

const colorVariants = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600", 
  amber: "from-amber-500 to-amber-600",
  purple: "from-purple-500 to-purple-600",
  red: "from-red-500 to-red-600",
  firstdocy: "from-[#212153] to-[#146FE0]",
  firstdocy_green: "from-[#146FE0] to-[#04BF7B]"
};

export default function StatsCard({ title, value, icon: Icon, trend, color = "firstdocy", isLoading }) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorVariants[color]} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300`} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">{value}</div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorVariants[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {trend && !isLoading && (
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-gray-600 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
