
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight,
  User,
  FileText,
  MapPin,
  MessageSquare,
  BookOpen,
  Award,
  Star,
  Sprout,
  Circle
} from 'lucide-react';

// --- Dados Mockados ---
const sideMenuItems = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'pessoais', label: 'Dados Pessoais', icon: FileText },
  { id: 'endereco', label: 'Endereço', icon: MapPin },
  { id: 'social', label: 'Social', icon: MessageSquare },
  { id: 'documentos', label: 'Documentos', icon: BookOpen, active: true },
  { id: 'formacao', label: 'Formação', icon: Award },
  { id: 'cursos', label: 'Cursos', icon: Star },
  { id: 'habilidades', label: 'Habilidades', icon: Sprout },
  { id: 'cond_especiais', label: 'Cond. Especiais', icon: Circle },
];

const documentCategories = [
  {
    id: 'doc_pessoais',
    name: 'Documentos Pessoais',
    status: 'Pendente',
    completeness: 60,
    statusColor: 'bg-red-100 border-red-200 text-red-800',
    subItems: []
  },
  {
    id: 'termo_recebimento',
    name: 'Termo de Recebimento',
    status: 'Pendente',
    completeness: 60,
    statusColor: 'bg-red-100 border-red-200 text-red-800',
    subItems: []
  },
  {
    id: 'controles_ponto',
    name: 'Controles de Ponto',
    status: 'OK',
    completeness: 100,
    statusColor: 'bg-green-100 border-green-200 text-green-800',
    subItems: []
  },
  {
    id: 'holerites',
    name: 'Holerites',
    status: 'Anexado',
    completeness: 100,
    statusColor: 'bg-blue-100 border-blue-200 text-blue-800',
    subItems: [
      { name: 'Adiantamento de Despesas de Viagens', color: 'bg-yellow-100' },
      { name: 'Autorização de Desconto em Folha', color: 'bg-red-100' },
      { name: 'Holerites', color: 'bg-green-100' },
      { name: 'Movimentação Pessoal - Alteração Cargos', color: 'bg-blue-100' },
    ]
  },
  {
    id: 'recibos_ferias',
    name: 'Avisos e recibos de Férias',
    status: 'Anexado',
    completeness: 60,
    statusColor: 'bg-blue-100 border-blue-200 text-blue-800',
    subItems: [
      { name: 'Avisos de Férias', color: 'bg-yellow-100' },
      { name: 'Comprovante de Pagamento de Férias', color: 'bg-red-100' },
      { name: 'Recibo de Férias', color: 'bg-green-100' },
    ]
  }
];

const SideMenu = ({ items }) => (
  <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-2">
    {items.map(item => (
      <Button
        key={item.id}
        variant={item.active ? 'default' : 'ghost'}
        className={`w-full justify-start gap-3 ${item.active ? 'bg-[#1e40af] text-white' : ''}`}
      >
        <item.icon className="w-5 h-5" />
        {item.label}
      </Button>
    ))}
  </div>
);

const DocumentCategory = ({ category }) => {
  const [isOpen, setIsOpen] = useState(category.subItems.length > 0);

  return (
    <div className="rounded-lg border overflow-hidden">
      <div 
        className={`flex items-center p-3 cursor-pointer ${category.statusColor}`}
        onClick={() => category.subItems.length > 0 && setIsOpen(!isOpen)}
      >
        <div className="flex-1 font-semibold">{category.name}</div>
        <div className="w-32 text-center font-medium">{category.status}</div>
        <div className="w-48 flex items-center gap-2">
          <Progress value={category.completeness} className="h-2" />
          <span className="text-xs font-bold">{category.completeness}%</span>
        </div>
        <div className="w-10 text-right">
          {category.subItems.length > 0 ? (
            isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>
      </div>
      {isOpen && category.subItems.length > 0 && (
        <div className="p-4 bg-white border-t">
          <div className="space-y-2">
            {category.subItems.map((item, index) => (
              <div key={index} className={`p-3 rounded ${item.color}`}>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function EmployeeDocumentPortal() {
  useEffect(() => {
    // Update: Integrated "Módulo RHR" into the document title as per the task description.
    document.title = "FIRSTDOCY GED AI - Portal do Funcionário | Contratação Online | Módulo RHR";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-800">📋 Contratação Online</h1>
        </div>
      </header>
      <div className="flex flex-1">
        <SideMenu items={sideMenuItems} />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <div className="flex items-center gap-6 text-sm text-gray-600 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Checklist com pendências</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Checklist sem pendências</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>Documentos em anexo</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm font-bold text-gray-500 px-3">
                <div className="flex-1">Tipo de Documento</div>
                <div className="w-32 text-center">Status</div>
                <div className="w-48">Completude</div>
                <div className="w-10"></div>
              </div>
              {documentCategories.map(category => (
                <DocumentCategory key={category.id} category={category} />
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
