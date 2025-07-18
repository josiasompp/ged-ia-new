
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const presetColors = [
  "#212153", "#146FE0", "#04BF7B", // FirstDocy
  "#7C3AED", "#A855F7", "#F59E0B", // Purple/Amber
  "#DC2626", "#EF4444", "#059669", // Red/Green
  "#0EA5E9", "#06B6D4", "#8B5CF6", // Blue/Cyan/Violet
  "#F97316", "#84CC16", "#EC4899", // Orange/Lime/Pink
  "#6B7280", "#374151", "#111827"  // Grays
];

export default function ColorPicker({ label, value, onChange, description }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-10 p-0 border-2"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Escolher cor</span>
          </Button>
          
          {isOpen && (
            <div className="absolute top-12 left-0 z-50 bg-white border rounded-lg shadow-lg p-3 w-64">
              <div className="grid grid-cols-6 gap-2 mb-3">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
              
              <div className="border-t pt-3">
                <Label className="text-xs">Cor personalizada:</Label>
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-10 mt-1"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="font-mono"
          />
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Palette className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
