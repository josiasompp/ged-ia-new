
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { Proposal } from "@/api/entities";
import { ProposalTemplate } from "@/api/entities";
import { User } from "@/api/entities";

import ProposalList from "../components/proposals/ProposalList";
import ProposalForm from "../components/proposals/ProposalForm";
import ProposalStats from "../components/proposals/ProposalStats";

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadData();
    loadUser();
    document.title = "FIRSTDOCY GED AI - Propostas Comerciais | Sistema Digital";
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [proposalData, templateData] = await Promise.all([
        Proposal.list("-created_date"),
        ProposalTemplate.list("-created_date")
      ]);

      setProposals(proposalData || []);
      setTemplates(templateData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleCreate = () => {
    setSelectedProposal(null);
    setShowForm(true);
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setShowForm(true);
  };

  const handleSave = async (data) => {
    if (selectedProposal) {
      await Proposal.update(selectedProposal.id, data);
    } else {
      await Proposal.create({
        ...data,
        company_id: currentUser?.company_id,
        salesperson_email: currentUser?.email
      });
    }
    setShowForm(false);
    loadData();
  };

  const filteredProposals = proposals.filter(proposal => {
    if (filter === "all") return true;
    return proposal.status === filter;
  });

  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'rascunho').length,
    sent: proposals.filter(p => p.status === 'enviada').length,
    viewed: proposals.filter(p => p.status === 'visualizada').length,
    accepted: proposals.filter(p => p.status === 'aceita').length,
    rejected: proposals.filter(p => p.status === 'recusada').length,
    expired: proposals.filter(p => p.status === 'expirada').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Propostas Comerciais
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Sistema inteligente de propostas digitais do FIRSTDOCY GED AI</p>
        </div>
        <Button
          onClick={handleCreate}
          className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0] hover:from-[#146FE0] hover:to-[#04BF7B] shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nova Proposta
        </Button>
      </div>

      {/* Stats Cards */}
      <ProposalStats stats={stats} isLoading={isLoading} />

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todas", icon: FileText },
              { key: "rascunho", label: "Rascunhos", icon: Clock },
              { key: "enviada", label: "Enviadas", icon: Share2 },
              { key: "visualizada", label: "Visualizadas", icon: Eye },
              { key: "aceita", label: "Aceitas", icon: CheckCircle },
              { key: "recusada", label: "Recusadas", icon: XCircle }
            ].map((filterOption) => {
              const Icon = filterOption.icon;
              return (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterOption.key)}
                  className={`gap-2 ${
                    filter === filterOption.key
                      ? "bg-gradient-to-r from-[#146FE0] to-[#04BF7B]"
                      : "border-[#146FE0] text-[#146FE0] hover:bg-[#146FE0] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filterOption.label}
                  {filterOption.key !== "all" && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {stats[filterOption.key] || 0}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <ProposalList
        proposals={filteredProposals}
        isLoading={isLoading}
        onEdit={handleEdit}
        onRefresh={loadData}
        currentUser={currentUser}
      />

      {/* Form Modal */}
      {showForm && (
        <ProposalForm
          proposal={selectedProposal}
          templates={templates}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
