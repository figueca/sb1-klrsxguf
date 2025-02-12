import React from 'react';
import { LayoutDashboard, KeySquare, BarChart3, Settings, Users, LogOut } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: KeySquare, label: 'Planejador de Palavras', path: '/keywords' },
  { icon: BarChart3, label: 'Campanhas', path: '/campaigns' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold text-blue-600">HealthAds</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button className="flex items-center text-gray-700 hover:text-red-600 w-full px-6 py-3">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}