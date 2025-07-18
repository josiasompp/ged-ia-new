import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Document } from "@/api/entities";
import { User } from "@/api/entities";
import { Proposal } from "@/api/entities";
import { Company } from "@/api/entities";
import { Employee } from "@/api/entities";
import { debounce } from "lodash";
import {
  FileText,
  Users,
  Briefcase,
  Building2,
  FileSignature,
  Loader2
} from "lucide-react";
import { createPageUrl } from "@/utils";

const entityConfig = {
  documents: {
    icon: <FileText className="mr-2 h-4 w-4" />,
    name: "Documentos",
    fetch: async (query) => Document.filter({ title: { '$regex': query, '$options': 'i' } }, '-created_date', 5),
    format: (item) => ({ id: item.id, name: item.title, detail: `Versão: ${item.version}`, url: createPageUrl(`Documents?docId=${item.id}`) })
  },
  proposals: {
    icon: <FileSignature className="mr-2 h-4 w-4" />,
    name: "Propostas",
    fetch: async (query) => Proposal.filter({ title: { '$regex': query, '$options': 'i' } }, '-created_date', 5),
    format: (item) => ({ id: item.id, name: item.title, detail: `Cliente: ${item.client_name}`, url: createPageUrl(`Proposals?proposalId=${item.id}`) })
  },
  users: {
    icon: <Users className="mr-2 h-4 w-4" />,
    name: "Usuários",
    fetch: async (query) => User.filter({ '$or': [{ full_name: { '$regex': query, '$options': 'i' } }, { email: { '$regex': query, '$options': 'i' } }] }, '-created_date', 5),
    format: (item) => ({ id: item.id, name: item.full_name, detail: item.email, url: createPageUrl(`UserManagement?userId=${item.id}`) })
  },
  employees: {
    icon: <Briefcase className="mr-2 h-4 w-4" />,
    name: "Funcionários (RHR)",
    fetch: async (query) => Employee.filter({ '$or': [{ full_name: { '$regex': query, '$options': 'i' } }, { email: { '$regex': query, '$options': 'i' } }] }, '-created_date', 5),
    format: (item) => ({ id: item.id, name: item.full_name, detail: item.position, url: createPageUrl(`HumanResources?employeeId=${item.id}`) })
  },
  companies: {
    icon: <Building2 className="mr-2 h-4 w-4" />,
    name: "Empresas",
    fetch: async (query) => Company.filter({ name: { '$regex': query, '$options': 'i' } }, '-created_date', 5),
    format: (item) => ({ id: item.id, name: item.name, detail: `CNPJ: ${item.cnpj}`, url: createPageUrl(`Companies?companyId=${item.id}`) })
  }
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      const searchPromises = Object.entries(entityConfig).map(([key, config]) =>
        config.fetch(searchQuery).then(data => ({
          key,
          name: config.name,
          icon: config.icon,
          items: data.map(config.format)
        }))
      );
      
      const searchResults = await Promise.all(searchPromises);
      setResults(searchResults.filter(group => group.items.length > 0));
      setIsLoading(false);
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleSelect = (url) => {
    navigate(url);
    setOpen(false);
    setQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Buscar em todo o sistema..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{isLoading ? "" : "Nenhum resultado encontrado."}</CommandEmpty>
        {isLoading && (
          <div className="p-4 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {!isLoading && results.map((group) => (
          <CommandGroup key={group.key} heading={group.name}>
            {group.items.map((item) => (
              <CommandItem
                key={item.id}
                value={`${group.name}-${item.name}-${item.detail}`}
                onSelect={() => handleSelect(item.url)}
                className="cursor-pointer"
              >
                {group.icon}
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-500">{item.detail}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}