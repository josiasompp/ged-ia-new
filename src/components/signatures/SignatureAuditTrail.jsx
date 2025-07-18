
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DigitalSignature } from '@/api/entities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Hash, History, Users, QrCode } from 'lucide-react';
import { createPageUrl } from '@/utils';

const HashDisplay = ({ label, value }) => (
  <div className="mb-2">
    <p className="text-xs font-semibold text-gray-500">{label}</p>
    <p className="text-xs font-mono text-gray-700 break-all">{value || 'N/A'}</p>
  </div>
);

export default function SignatureAuditTrail({ workflow }) {
  const [signatures, setSignatures] = React.useState([]);

  React.useEffect(() => {
    const fetchSignatures = async () => {
      if (workflow?.id) {
        const signatureData = await DigitalSignature.filter({ workflow_id: workflow.id });
        setSignatures(signatureData);
      }
    };
    fetchSignatures();
  }, [workflow]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'assinado': return <Badge className="bg-green-100 text-green-800">Assinado</Badge>;
      case 'pendente': return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'recusado': return <Badge className="bg-red-100 text-red-800">Recusado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const verificationUrl = `${window.location.origin}${createPageUrl(`PublicVerification?code=${workflow.verification_code}`)}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Participantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome / Razão Social</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Página / Posição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signatures.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.signer_name}</TableCell>
                  <TableCell>{s.signer_email}</TableCell>
                  <TableCell>{`Pág ${s.signature_position?.page} / X:${s.signature_position?.x} Y:${s.signature_position?.y}`}</TableCell>
                  <TableCell>{getStatusBadge(s.status)}</TableCell>
                  <TableCell>{s.signed_at ? format(new Date(s.signed_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Histórico de Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Histórico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflow.audit_trail?.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Hash className="w-5 h-5" /> Hashes de Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2">HASH do Documento Original</h4>
            <HashDisplay label="SHA-1" value={workflow.original_hash_sha1} />
            <HashDisplay label="SHA-256" value={workflow.original_hash_sha256} />
            <hr className="my-4"/>
            <h4 className="font-semibold mb-2">HASH do Documento Assinado</h4>
            <HashDisplay label="SHA-1" value={workflow.signed_hash_sha1} />
            <HashDisplay label="SHA-256" value={workflow.signed_hash_sha256} />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><QrCode className="w-5 h-5" /> Verificação Pública</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                    <QrCode className="w-32 h-32" /> 
                </div>
                <p className="text-sm mt-4">Escaneie o QR Code para validar este documento a qualquer momento.</p>
                <a href={verificationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 break-all">{verificationUrl}</a>
                <div className="mt-2 text-xs text-gray-600">
                    <p><strong>Login:</strong> {workflow.verification_code}</p>
                    <p><strong>Senha:</strong> firstdocy</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
