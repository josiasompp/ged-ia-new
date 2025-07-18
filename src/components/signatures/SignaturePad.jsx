import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Trash2, FileSignature } from "lucide-react";

// Um componente simples de assinatura por desenho
const SignatureCanvas = ({ signatureRef }) => {
  const canvasRef = useRef(null);
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  const startDrawing = (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const stopDrawing = () => {
    isDrawing = false;
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    signatureRef.current = null;
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    signatureRef.current = canvas.toDataURL('image/png');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="400"
        height="150"
        className="border rounded-md bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={() => { stopDrawing(); saveSignature(); }}
        onMouseOut={stopDrawing}
      />
      <Button variant="outline" size="sm" onClick={clearCanvas} className="mt-2 gap-2">
        <Trash2 className="w-3 h-3"/> Limpar
      </Button>
    </div>
  );
};


export default function SignaturePad({ signature, onClose, onConfirm }) {
  const [inputCpf, setInputCpf] = useState("");
  const [error, setError] = useState("");
  const signatureDataRef = useRef(null);

  const handleConfirm = () => {
    setError("");

    if (!inputCpf) {
      setError("Por favor, informe seu CPF.");
      return;
    }
    
    if (inputCpf.replace(/[.-]/g, '') !== signature.signer_cpf.replace(/[.-]/g, '')) {
      setError("O CPF informado não corresponde ao CPF cadastrado para esta assinatura.");
      return;
    }

    if (!signatureDataRef.current) {
      setError("A assinatura é obrigatória. Por favor, assine no campo acima.");
      return;
    }

    onConfirm(signature.id, signatureDataRef.current);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-blue-600"/>
            Confirmar Assinatura Digital
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Para validar sua identidade, por favor, insira seu CPF e assine no campo abaixo.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF (somente números)</Label>
            <Input
              id="cpf"
              value={inputCpf}
              onChange={(e) => setInputCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>

          <div className="space-y-2">
            <Label>Assine aqui</Label>
            <SignatureCanvas signatureRef={signatureDataRef} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} className="gap-2 bg-gradient-to-r from-[#212153] to-[#146FE0]">
            <Check className="w-4 h-4"/>
            Confirmar e Assinar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}