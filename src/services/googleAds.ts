// Mock data for development - replace with actual API integration
const mockKeywordData = [
  {
    text: "médico cardiologista",
    avgMonthlySearches: 12000,
    competition: "Alta",
    avgCpc: 4.50,
    relevanceScore: 85
  },
  {
    text: "consulta cardiologista",
    avgMonthlySearches: 8000,
    competition: "Média",
    avgCpc: 3.75,
    relevanceScore: 78
  },
  {
    text: "cardiologista particular",
    avgMonthlySearches: 5000,
    competition: "Baixa",
    avgCpc: 2.80,
    relevanceScore: 92
  }
];

export interface KeywordIdea {
  text: string;
  avgMonthlySearches: number;
  competition: string;
  avgCpc: number;
  relevanceScore: number;
}

class GoogleAdsService {
  async generateKeywordIdeas(
    query: string,
    location: string,
    language: string = 'pt'
  ): Promise<KeywordIdea[]> {
    try {
      // In production, this should make an API call to your backend
      // which will then interact with the Google Ads API
      console.log('Searching for:', { query, location, language });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return mockKeywordData.map(idea => ({
        ...idea,
        text: idea.text.includes(query) ? idea.text : `${query} ${idea.text}`
      }));
    } catch (error) {
      console.error('Erro ao buscar ideias de palavras-chave:', error);
      throw error;
    }
  }
}

export const googleAdsService = new GoogleAdsService();