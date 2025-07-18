
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentBreadcrumb({ items, onItemClick }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 bg-white p-3 rounded-lg shadow-sm border">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onItemClick(index)}
            className={`flex items-center gap-2 ${index === items.length - 1 ? 'text-gray-900 font-semibold' : 'hover:text-blue-600'}`}
            disabled={index === items.length - 1}
          >
            {index === 0 && <Home className="w-4 h-4" />}
            <span>{item.name}</span>
          </Button>
          {index < items.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </React.Fragment>
      ))}
    </nav>
  );
}
