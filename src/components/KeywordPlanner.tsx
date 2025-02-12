import React, { useState } from 'react';
import { Search, TrendingUp, Download, Plus, Loader2 } from 'lucide-react';
import { googleAdsService, KeywordIdea } from '../services/googleAds';

export function KeywordPlanner() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordIdea[]>([]);
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    'Cardiologia',
    'Dermatologia',
    'Pediatria',
    'Ortopedia',
    'Ginecologia',
    'Oftalmologia'
  ];

  const locations = [
    { name: 'São Paulo - SP', id: '2017' },
    { name: 'Rio de Janeiro - RJ', id: '2016' },
    { name: 'Belo Horizonte - MG', id: '2014' },
    { name: 'Curitiba - PR', id: '2015' },
    { name: 'Porto Alegre - RS', id: '2013' }
  ];

  const handleSearch = async () => {
    if (!searchTerm || !selectedLocation) {
      setError('Por favor, preencha o termo de busca e a localização');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchQuery = selectedSpecialty 
        ? `${searchTerm} ${selectedSpecialty}`
        : searchTerm;
      
      const location = locations.find(loc => loc.name === selectedLocation)?.id;
      
      if (!location) {
        throw new Error('Localização inválida');
      }

      const results = await googleAdsService.generateKeywordIdeas(
        searchQuery,
        location
      );
      
      setKeywords(results);
    } catch (err) {
      setError('Erro ao buscar palavras-chave. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Palavra-chave', 'Volume Mensal', 'Competição', 'CPC Médio', 'Relevância'],
      ...keywords.map(kw => [
        kw.text,
        kw.avgMonthlySearches,
        kw.competition,
        `R$ ${kw.avgCpc.toFixed(2)}`,
        `${kw.relevanceScore}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'palavras-chave.csv';
    link.click();
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'Baixa':
        return 'text-green-500';
      case 'Média':
        return 'text-yellow-500';
      case 'Alta':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planejador de Palavras-chave</h2>
          <p className="text-gray-600 mt-1">Encontre as melhores palavras-chave para sua especialidade</p>
        </div>
        <button
          onClick={handleExport}
          disabled={keywords.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Palavras-chave
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Digite termos relacionados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione a especialidade</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione a localização</option>
              {locations.map((location) => (
                <option key={location.id} value={location.name}>{location.name}</option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Buscar'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {keywords.length > 0 && (
          <div className="mt-8">
            <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 px-6 py-3">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-2">Palavra-chave</div>
                <div className="text-center">Vol. Mensal</div>
                <div className="text-center">Competição</div>
                <div className="text-center">CPC Médio</div>
                <div className="text-center">Relevância</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {keywords.map((keyword, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2 flex items-center justify-between">
                      <span className="font-medium">{keyword.text}</span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-center flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-gray-400 mr-2" />
                      {keyword.avgMonthlySearches.toLocaleString()}
                    </div>
                    <div className={`text-center ${getCompetitionColor(keyword.competition)}`}>
                      {keyword.competition}
                    </div>
                    <div className="text-center">
                      R$ {keyword.avgCpc.toFixed(2)}
                    </div>
                    <div className="text-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${keyword.relevanceScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{keyword.relevanceScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}