
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, HardDrive } from "lucide-react";

const planColors = {
  starter: "bg-blue-100 text-blue-800",
  professional: "bg-purple-100 text-purple-800", 
  enterprise: "bg-green-100 text-green-800"
};

export default function CompanyOverview({ companies, isLoading }) {
  return (
    <Card className="shadow-sm border-0 bg-white">
      <CardHeader className="border-b border-gray-100 pb-4 bg-gradient-to-r from-gray-50 to-green-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-[#04BF7B] to-[#146FE0] rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-[#212153] to-[#04BF7B] bg-clip-text text-transparent font-bold">
            Visão Geral - Empresas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : companies.length === 0 ? (
            <div className="text-center py-6">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma empresa cadastrada</p>
            </div>
          ) : (
            companies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${company.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Building2 className={`w-5 h-5 ${company.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {company.name}
                    </h4>
                    <Badge variant="secondary" className={`${planColors[company.subscription_plan]} text-xs`}>
                      {company.subscription_plan}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {company.max_users} usuários
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {company.max_storage_gb} GB
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
