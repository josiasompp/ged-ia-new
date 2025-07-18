import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const availableFonts = [
  { value: "Sora", label: "Sora", preview: "Aa" },
  { value: "Inter", label: "Inter", preview: "Aa" },
  { value: "Roboto", label: "Roboto", preview: "Aa" },
  { value: "Open Sans", label: "Open Sans", preview: "Aa" },
  { value: "Montserrat", label: "Montserrat", preview: "Aa" },
  { value: "Poppins", label: "Poppins", preview: "Aa" }
];

export default function FontSelector({ label = "Fonte Principal", value, onChange }) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-xs text-gray-500">
        Escolha a fonte que será usada em todo o sistema
      </p>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma fonte" />
        </SelectTrigger>
        <SelectContent>
          {availableFonts.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <div className="flex items-center gap-3">
                <span 
                  className="text-lg font-medium"
                  style={{ fontFamily: font.value }}
                >
                  {font.preview}
                </span>
                <span>{font.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm" style={{ fontFamily: value }}>
          Esta é uma prévia de como o texto ficará com a fonte {value}.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </div>
  );
}