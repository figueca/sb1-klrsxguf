import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export function PricingCard({ title, price, features, isPopular }: PricingCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${isPopular ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold">R${price}</span>
            <span className="text-gray-500 ml-2">/ mês</span>
          </div>
        </div>
        {isPopular && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500">Grátis por 7 dias!</p>
      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
        Começar agora
      </button>
    </div>
  );
}