import React from 'react';
import { Map, Info, DoorOpen, Restroom } from 'lucide-react';

export default function LegendBar() {
  return (
    <div className="w-full border-t bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-700 text-sm">
        <div className="flex items-center gap-2"><Restroom className="w-4 h-4" /><span>Restrooms</span></div>
        <div className="flex items-center gap-2"><Info className="w-4 h-4" /><span>Info Desk</span></div>
        <div className="flex items-center gap-2"><DoorOpen className="w-4 h-4" /><span>Exits</span></div>
        <div className="flex items-center gap-2"><Map className="w-4 h-4" /><span>Walkways</span></div>
      </div>
    </div>
  );
}
