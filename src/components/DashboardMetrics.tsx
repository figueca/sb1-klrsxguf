import React from 'react';
import { TrendingUp, Users, Target, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(change)}% em relação ao mês anterior
        </span>
      </div>
    </div>
  );
}

export function DashboardMetrics() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Acompanhe o desempenho das suas campanhas</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Exportar Relatório
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Cliques Totais"
          value="12.458"
          change={12.5}
          icon={TrendingUp}
        />
        <MetricCard
          title="Novos Pacientes"
          value="284"
          change={8.2}
          icon={Users}
        />
        <MetricCard
          title="Taxa de Conversão"
          value="3.2%"
          change={-2.4}
          icon={Target}
        />
        <MetricCard
          title="Custo por Aquisição"
          value="R$ 42,50"
          change={-5.1}
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Campanhas Ativas</h3>
          <div className="space-y-4">
            {[
              { name: 'Consulta Cardiologia', status: 'Ativo', performance: 'Boa', budget: 'R$ 1.200' },
              { name: 'Checkup Completo', status: 'Ativo', performance: 'Excelente', budget: 'R$ 2.500' },
              { name: 'Consulta Pediatria', status: 'Pausado', performance: 'Regular', budget: 'R$ 800' }
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{campaign.name}</h4>
                  <span className={`text-sm ${
                    campaign.status === 'Ativo' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">{campaign.budget}</p>
                  <span className={`text-sm ${
                    campaign.performance === 'Excelente' ? 'text-green-500' : 
                    campaign.performance === 'Boa' ? 'text-blue-500' : 'text-yellow-500'
                  }`}>
                    {campaign.performance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Palavras-chave de Melhor Desempenho</h3>
          <div className="space-y-4">
            {[
              { keyword: 'cardiologista sp', clicks: 458, cpc: 2.8, conv: 4.2 },
              { keyword: 'consulta médica online', clicks: 385, cpc: 3.2, conv: 3.8 },
              { keyword: 'pediatra 24h', clicks: 312, cpc: 2.5, conv: 3.5 }
            ].map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{keyword.keyword}</h4>
                  <span className="text-sm text-gray-500">{keyword.clicks} cliques</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">R$ {keyword.cpc.toFixed(2)} CPC</p>
                  <span className="text-sm text-blue-500">{keyword.conv}% conv.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}