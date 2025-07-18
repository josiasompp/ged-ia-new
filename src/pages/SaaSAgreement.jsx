import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Shield, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SaaSAgreement() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#212153] to-[#146FE0] bg-clip-text text-transparent">
              Modelo de Contrato SaaS
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Termos de Serviço para uso da plataforma FIRSTDOCY GED AI
          </p>
        </div>
        <Button onClick={handlePrint} className="gap-2">
          <Download className="w-4 h-4" />
          Salvar como PDF / Imprimir
        </Button>
      </div>

      <Alert variant="default" className="bg-yellow-50 border-yellow-200">
        <Shield className="h-4 w-4 text-yellow-700" />
        <AlertTitle className="text-yellow-800">Aviso Legal</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Este é um modelo de contrato e deve ser revisado por um profissional jurídico para garantir que atenda a todas as necessidades específicas da sua empresa e esteja em conformidade com as leis locais.
        </AlertDescription>
      </Alert>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">CONTRATO DE LICENCIAMENTO DE SOFTWARE COMO SERVIÇO (SaaS)</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-800">
          <p><strong>CONTRATADA:</strong> FIRSTDOCY TECNOLOGIA LTDA., pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [Seu CNPJ], com sede em [Seu Endereço], doravante denominada simplesmente "FIRSTDOCY".</p>
          <p><strong>CONTRATANTE:</strong> [Nome da Empresa Cliente], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ do Cliente], com sede em [Endereço do Cliente], doravante denominada "CLIENTE".</p>

          <hr />

          <h3>CLÁUSULA 1ª - DO OBJETO</h3>
          <p>1.1. O presente contrato tem por objeto a concessão de uma licença de uso, não exclusiva e intransferível, do software FIRSTDOCY GED AI ("Plataforma"), disponibilizado pela FIRSTDOCY na modalidade Software como Serviço (SaaS).</p>

          <h3>CLÁUSULA 2ª - DO ACESSO E USO</h3>
          <p>2.1. A FIRSTDOCY concederá ao CLIENTE acesso à Plataforma através de login e senha para o número de usuários contratados no plano de serviço.</p>
          <p>2.2. O CLIENTE é o único responsável pela confidencialidade de suas credenciais de acesso e por toda a atividade que ocorrer em sua conta.</p>

          <h3>CLÁUSULA 3ª - DAS OBRIGAÇÕES DA FIRSTDOCY</h3>
          <p>3.1. Manter a Plataforma disponível para acesso do CLIENTE em, no mínimo, 99.5% do tempo por mês (conforme Nível de Serviço na Cláusula 7ª).</p>
          <p>3.2. Prestar suporte técnico para resolver problemas relacionados ao uso da Plataforma.</p>
          <p>3.3. Manter as medidas de segurança da informação, conforme práticas alinhadas à norma ISO 27001, para proteger os dados do CLIENTE.</p>

          <h3>CLÁUSULA 4ª - DAS OBRIGAÇÕES DO CLIENTE</h3>
          <p>4.1. Realizar os pagamentos nas datas de vencimento acordadas.</p>
          <p>4.2. Utilizar a Plataforma de acordo com a lei e os termos deste contrato, não a utilizando para fins ilícitos.</p>
          <p>4.3. Instruir seus usuários sobre o uso correto e seguro da Plataforma.</p>

          <h3>CLÁUSULA 5ª - DA PROPRIEDADE INTELECTUAL</h3>
          <p>5.1. A Plataforma, seu código-fonte, marcas, logotipos e design são de propriedade exclusiva da FIRSTDOCY. Esta licença não concede ao CLIENTE qualquer direito de propriedade sobre o software.</p>
          <p>5.2. Todos os dados, informações, documentos e arquivos inseridos na Plataforma pelo CLIENTE ("Dados do Cliente") são e permanecerão de propriedade exclusiva do CLIENTE.</p>

          <h3>CLÁUSULA 6ª - DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS (LGPD)</h3>
          <p>6.1. Ambas as partes se comprometem a manter em sigilo todas as informações confidenciais obtidas em razão deste contrato.</p>
          <p>6.2. A FIRSTDOCY, no tratamento dos Dados do Cliente, atuará como Operadora de Dados, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), cabendo ao CLIENTE o papel de Controlador.</p>
          <p>6.3. A FIRSTDOCY se compromete a adotar medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas.</p>
          
          <h3>CLÁUSULA 7ª - DO NÍVEL DE SERVIÇO (SLA)</h3>
          <p>7.1. **Disponibilidade:** A FIRSTDOCY garante um Uptime de 99.5% mensal. Excluem-se desta garantia as manutenções programadas (notificadas com 48h de antecedência) e eventos de força maior.</p>
          <p>7.2. **Suporte Técnico:** O suporte para problemas críticos (sistema fora do ar) terá tempo de primeira resposta de até 4 horas úteis. Para demais dúvidas, o tempo de resposta é de até 24 horas úteis.</p>

          <h3>CLÁUSULA 8ª - DO PAGAMENTO</h3>
          <p>8.1. O CLIENTE pagará à FIRSTDOCY o valor correspondente ao plano de serviço contratado, de forma [mensal/anual], através de [boleto bancário/cartão de crédito].</p>

          <h3>CLÁUSULA 9ª - DA VIGÊNCIA E RESCISÃO</h3>
          <p>9.1. Este contrato entra em vigor na data de sua assinatura e terá validade por [12 meses], renovando-se automaticamente por iguais períodos.</p>
          <p>9.2. O contrato poderá ser rescindido por qualquer uma das partes, mediante aviso prévio de 30 dias.</p>
          
          <h3>CLÁUSULA 10ª - DISPOSIÇÕES GERAIS</h3>
          <p>10.1. Este contrato não estabelece qualquer tipo de sociedade, franquia ou relação de trabalho entre as partes.</p>

          <h3>CLÁUSULA 11ª - DO FORO</h3>
          <p>11.1. Fica eleito o foro da comarca de [Sua Cidade/Estado] para dirimir quaisquer controvérsias oriundas do presente contrato.</p>
          
          <div className="mt-12 text-center">
            <p>_________________________________________</p>
            <p><strong>FIRSTDOCY TECNOLOGIA LTDA.</strong></p>
            <br/><br/>
            <p>_________________________________________</p>
            <p><strong>[Nome da Empresa Cliente]</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}