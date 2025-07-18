import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileBox, MapPin, Building2, Package, Search, BarChart3, Info, Lightbulb, Archive, Truck, Calendar } from 'lucide-react';

export default function CdocGuide() {
  return (
    <div className="space-y-6 text-gray-800">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
            <FileBox className="w-6 h-6 text-firstdocy-blue" />
            Guia de Uso: Módulo CDOC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            O CDOC (Controle de Documentos) é um sistema avançado de gestão física de documentos que permite rastrear, localizar e controlar todos os documentos físicos da sua empresa através de um sistema de endereçamento único.
          </p>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Por que usar o CDOC?</AlertTitle>
            <AlertDescription className="text-blue-700">
              Elimine o tempo perdido procurando documentos físicos. Com o CDOC, cada documento tem um endereço único e pode ser localizado em segundos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-firstdocy-primary" />
            Sistema de Endereçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>O CDOC utiliza um sistema hierárquico de endereçamento físico:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Estrutura do Endereço: <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">JA1P2AEE01</code></h4>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>JA1:</strong> Código da Rua (2 letras + 1 número)</li>
              <li><strong>P2:</strong> Prateleira (P + número)</li>
              <li><strong>AEE:</strong> Lado da estante (3 letras)</li>
              <li><strong>01:</strong> Posição específica (2 números)</li>
            </ul>
          </div>
          <Alert className="border-green-200 bg-green-50">
            <Lightbulb className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Dica Importante!</AlertTitle>
            <AlertDescription className="text-green-700">
              Cada endereço é único e pode armazenar múltiplos documentos. O sistema calcula automaticamente a capacidade e ocupação de cada localização.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-firstdocy-green" />
            Operações Essenciais do CDOC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              1. Criando Localizações Físicas
            </h3>
            <p className="mb-3">Antes de arquivar documentos, você precisa configurar as localizações físicas:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Vá para a aba <strong>"Endereçamento"</strong></li>
              <li>Clique em <strong>"Nova Localização"</strong></li>
              <li>Preencha os campos:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li><strong>Rua:</strong> Ex: JA1, BC2, DE3</li>
                  <li><strong>Prateleira:</strong> Ex: P1, P2, P3</li>
                  <li><strong>Lado:</strong> Ex: AEE, ADD, BCC</li>
                  <li><strong>Posição:</strong> Ex: 01, 02, 03</li>
                </ul>
              </li>
              <li>Defina a capacidade (quantos documentos cabem)</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Archive className="w-5 h-5 text-purple-600" />
              2. Registrando Documentos Físicos
            </h3>
            <p className="mb-3">Para registrar um novo documento no sistema:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Na aba <strong>"Documentos"</strong>, clique em <strong>"Novo Documento"</strong></li>
              <li>Preencha as informações essenciais:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li><strong>Cliente:</strong> Nome da empresa proprietária</li>
                  <li><strong>Descrição da Caixa:</strong> Tipo de conteúdo</li>
                  <li><strong>Localização Física:</strong> Selecione o endereço</li>
                  <li><strong>Data de Entrada:</strong> Quando foi arquivado</li>
                </ul>
              </li>
              <li>Configure o controle de destruição:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Marque <strong>"Permanente"</strong> se nunca deve ser destruído</li>
                  <li>Ou defina uma <strong>"Data de Destruição"</strong></li>
                </ul>
              </li>
            </ol>
            
            <Alert className="mt-4 border-amber-200 bg-amber-50">
              <Calendar className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Controle de Destruição</AlertTitle>
              <AlertDescription className="text-amber-700">
                O sistema alertará automaticamente quando documentos estiverem próximos da data de destruição, garantindo conformidade com políticas de retenção.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              3. Localizando Documentos
            </h3>
            <p className="mb-3">Existem várias formas de encontrar um documento:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Busca por Cliente:</strong> Digite o nome da empresa</li>
              <li><strong>Busca por Conteúdo:</strong> Procure pela descrição do conteúdo</li>
              <li><strong>Busca por Endereço:</strong> Digite o código de localização</li>
              <li><strong>Filtros Avançados:</strong> Por status, data de entrada, tipo de documento</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600" />
              4. Controlando Movimentação
            </h3>
            <p className="mb-3">O CDOC permite controlar o ciclo de vida completo dos documentos:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800">Status Disponíveis:</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• <strong>Arquivado:</strong> No local designado</li>
                  <li>• <strong>Emprestado:</strong> Retirado temporariamente</li>
                  <li>• <strong>Em Trânsito:</strong> Sendo movimentado</li>
                  <li>• <strong>Destruído:</strong> Eliminado conforme política</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800">Controles Automáticos:</h4>
                <ul className="text-sm text-green-700 mt-1 space-y-1">
                  <li>• Alertas de vencimento</li>
                  <li>• Controle de capacidade</li>
                  <li>• Auditoria de movimentação</li>
                  <li>• Relatórios de ocupação</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            Utilizando o Mapa de Endereçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>A aba <strong>"Mapa"</strong> oferece uma visualização completa do seu arquivo físico:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Visualização por Cores:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span>Vazio (0%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>0-30% ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>30-70% ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                <span>70-90% ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>90-100% ocupado</span>
              </div>
            </div>
          </div>
          <p>Clique em qualquer posição no mapa para ver os documentos armazenados naquele local específico.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Relatórios e Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>A aba <strong>"Relatórios"</strong> oferece insights valiosos sobre seu arquivo:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Relatórios Disponíveis:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Documentos por mês de entrada</li>
                <li>Status de destruição por categoria</li>
                <li>Ocupação por localização</li>
                <li>Documentos próximos ao vencimento</li>
                <li>Top clientes por volume</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Métricas em Tempo Real:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Total de documentos arquivados</li>
                <li>Localizações ativas</li>
                <li>Clientes únicos</li>
                <li>Documentos expirando em 30 dias</li>
                <li>Capacidade disponível</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Melhores Práticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Faça Sempre:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Registre documentos imediatamente após arquivamento</li>
                <li>Use descrições claras e detalhadas</li>
                <li>Mantenha o sistema de endereçamento consistente</li>
                <li>Configure datas de destruição conforme políticas</li>
                <li>Revise regularmente os alertas de vencimento</li>
                <li>Mantenha as localizações organizadas fisicamente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-800 mb-2">❌ Evite:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Arquivar sem registrar no sistema</li>
                <li>Usar descrições genéricas ou vazias</li>
                <li>Ignorar alertas de capacidade</li>
                <li>Misturar diferentes tipos de documento</li>
                <li>Deixar documentos sem data de destruição</li>
                <li>Movimentar sem atualizar o status</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Suporte e Treinamento</AlertTitle>
        <AlertDescription className="text-blue-700">
          Para dúvidas específicas ou treinamento personalizado, entre em contato com nossa equipe de suporte. 
          O CDOC foi projetado para ser intuitivo, mas nossa equipe está sempre disponível para ajudar na otimização do seu fluxo de trabalho.
        </AlertDescription>
      </Alert>
    </div>
  );
}