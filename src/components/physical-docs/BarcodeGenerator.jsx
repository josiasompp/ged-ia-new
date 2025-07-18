import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Printer, Barcode, QrCode, Settings } from 'lucide-react';

export default function BarcodeGenerator({ address, clientName }) {
  const [labelSize, setLabelSize] = useState('58x25');
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  if (!address) {
    return null;
  }

  const barcodeData = encodeURIComponent(address);
  const qrCodeData = encodeURIComponent(`${address} | ${clientName || 'Cliente não definido'}`);

  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${barcodeData}&code=Code128&dpi=96`;
  const qrCodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${qrCodeData}&code=QRCode&dpi=96`;

  const labelSizes = {
    // Etiquetas pequenas - só código de barras
    '58x13': { 
      name: '58x13mm - Pequena', 
      width: '58mm', 
      height: '13mm',
      addressFont: '8pt',
      barcodeHeight: '8mm',
      qrSize: '0mm', // Sem QR code
      layout: 'barcode-only'
    },
    '40x13': { 
      name: '40x13mm - Mini', 
      width: '40mm', 
      height: '13mm',
      addressFont: '7pt',
      barcodeHeight: '8mm',
      qrSize: '0mm',
      layout: 'barcode-only'
    },
    '35x8': { 
      name: '35x8mm - Micro', 
      width: '35mm', 
      height: '8mm',
      addressFont: '6pt',
      barcodeHeight: '5mm',
      qrSize: '0mm',
      layout: 'barcode-only'
    },
    
    // Etiquetas médias - código de barras + texto
    '58x20': { 
      name: '58x20mm - Padrão', 
      width: '58mm', 
      height: '20mm',
      addressFont: '9pt',
      barcodeHeight: '12mm',
      qrSize: '0mm',
      layout: 'barcode-text'
    },
    '58x25': { 
      name: '58x25mm - Recomendada', 
      width: '58mm', 
      height: '25mm',
      addressFont: '10pt',
      barcodeHeight: '14mm',
      qrSize: '18mm',
      layout: 'barcode-qr'
    },
    
    // Etiquetas grandes - código de barras + QR code
    '58x30': { 
      name: '58x30mm - Completa', 
      width: '58mm', 
      height: '30mm',
      addressFont: '11pt',
      barcodeHeight: '16mm',
      qrSize: '22mm',
      layout: 'barcode-qr'
    },
    '58x35': { 
      name: '58x35mm - Grande', 
      width: '58mm', 
      height: '35mm',
      addressFont: '12pt',
      barcodeHeight: '18mm',
      qrSize: '26mm',
      layout: 'barcode-qr'
    },
    '58x36': { 
      name: '58x36mm - Extra Grande', 
      width: '58mm', 
      height: '36mm',
      addressFont: '12pt',
      barcodeHeight: '19mm',
      qrSize: '27mm',
      layout: 'barcode-qr'
    }
  };

  const selectedSize = labelSizes[labelSize];

  const generatePrintLayout = () => {
    const { layout } = selectedSize;
    
    if (layout === 'barcode-only') {
      return `
        <div class="label-container-single">
          <div class="address-small">${address}</div>
          <div class="barcode-only-section">
            <img src="${barcodeUrl}" class="barcode-image" alt="Código de Barras" />
          </div>
        </div>
      `;
    }
    
    if (layout === 'barcode-text') {
      return `
        <div class="label-container-text">
          <div class="address-header">${address}</div>
          <div class="barcode-section-center">
            <img src="${barcodeUrl}" class="barcode-image" alt="Código de Barras" />
          </div>
        </div>
      `;
    }
    
    // layout === 'barcode-qr'
    return `
      <div class="label-container-dual">
        <div class="address-header">${address}</div>
        <div class="codes-container">
          <div class="barcode-section">
            <img src="${barcodeUrl}" class="barcode-image" alt="Código de Barras" />
          </div>
          <div class="qrcode-section">
            <img src="${qrCodeUrl}" class="qrcode-image" alt="QR Code" />
          </div>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Etiqueta CDOC - ${address}</title>
          <style>
            @media print {
              @page {
                size: ${selectedSize.width} ${selectedSize.height};
                margin: 1mm;
              }
              body {
                font-family: 'Arial', sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                padding: 0;
              }
              
              /* Layout para etiquetas só com código de barras */
              .label-container-single {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .address-small {
                font-family: 'Courier New', monospace;
                font-weight: bold;
                font-size: ${selectedSize.addressFont};
                text-align: center;
                margin-bottom: 1mm;
              }
              .barcode-only-section {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              /* Layout para etiquetas com código de barras + texto */
              .label-container-text {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .barcode-section-center {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              /* Layout para etiquetas com código de barras + QR */
              .label-container-dual {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
              }
              .codes-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 1;
                gap: 2mm;
              }
              .barcode-section, .qrcode-section {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              /* Elementos comuns */
              .address-header {
                font-family: 'Courier New', monospace;
                font-weight: bold;
                font-size: ${selectedSize.addressFont};
                text-align: center;
                border-bottom: 0.5px solid #333;
                padding-bottom: 0.5mm;
                margin-bottom: 1mm;
              }
              .barcode-image {
                max-width: 100%;
                height: ${selectedSize.barcodeHeight};
                display: block;
              }
              .qrcode-image {
                height: ${selectedSize.qrSize};
                width: ${selectedSize.qrSize};
                display: block;
              }
            }
          </style>
        </head>
        <body>
          ${generatePrintLayout()}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  setTimeout(function() { window.close(); }, 100);
                }
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Card className="mt-6 bg-gray-50 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Barcode className="w-5 h-5" />
            Etiquetas de Identificação
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPrintOptions(!showPrintOptions)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Opções de Impressão */}
        {showPrintOptions && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border">
            <div className="space-y-4">
              <div>
                <Label htmlFor="labelSize" className="text-sm font-medium">
                  Tamanho da Etiqueta
                </Label>
                <Select value={labelSize} onValueChange={setLabelSize}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <optgroup label="Etiquetas Pequenas (só código de barras)">
                      <SelectItem value="35x8">35x8mm - Micro</SelectItem>
                      <SelectItem value="40x13">40x13mm - Mini</SelectItem>
                      <SelectItem value="58x13">58x13mm - Pequena</SelectItem>
                    </optgroup>
                    <optgroup label="Etiquetas Médias (código + texto)">
                      <SelectItem value="58x20">58x20mm - Padrão</SelectItem>
                    </optgroup>
                    <optgroup label="Etiquetas Grandes (código + QR)">
                      <SelectItem value="58x25">58x25mm - Recomendada</SelectItem>
                      <SelectItem value="58x30">58x30mm - Completa</SelectItem>
                      <SelectItem value="58x35">58x35mm - Grande</SelectItem>
                      <SelectItem value="58x36">58x36mm - Extra Grande</SelectItem>
                    </optgroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Tamanho:</strong> {selectedSize.name}</p>
                  <p><strong>Dimensões:</strong> {selectedSize.width} x {selectedSize.height}</p>
                </div>
                <div>
                  <p><strong>Layout:</strong> {
                    selectedSize.layout === 'barcode-only' ? 'Só código de barras' :
                    selectedSize.layout === 'barcode-text' ? 'Código + texto' :
                    'Código + QR Code'
                  }</p>
                  <p><strong>Fonte:</strong> {selectedSize.addressFont}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Preview do Código de Barras */}
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              <Barcode className="w-4 h-4" />
              Código de Barras
            </h4>
            <img 
              src={barcodeUrl} 
              alt={`Código de barras para ${address}`} 
              className="mx-auto h-16"
            />
            <p className="font-mono mt-2 text-sm font-bold">{address}</p>
          </div>
          
          {/* Preview do QR Code */}
          {selectedSize.layout === 'barcode-qr' && (
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Code
              </h4>
              <img 
                src={qrCodeUrl} 
                alt={`QR Code para ${address}`} 
                className="mx-auto h-24 w-24"
              />
              <p className="font-mono mt-2 text-sm">{clientName || 'Aguardando cliente'}</p>
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Instruções:</strong> Selecione o tamanho de acordo com suas etiquetas disponíveis. 
            Etiquetas pequenas mostram apenas o código de barras, médias incluem texto legível, 
            e grandes incluem código de barras + QR code.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}