import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Text } from '@/components/atoms/text';
import { TruckStatus } from '../types/truck.type';

interface SearchAndFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filter: TruckStatus | 'all') => void;
}

const TrucksSearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearchChange,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TruckStatus | 'all'>('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilter = (filter: TruckStatus | 'all') => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* <Text variant="h4" color="text-gray-900" fontWeight="semibold">
          My Trucks
        </Text> */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-60 pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-blue-tone-200 focus:border-blue-tone-200 text-sm"
              placeholder="Search truck number..."
            />
          </div>
          
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => handleFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-blue-tone-200 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilter('available')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                activeFilter === 'available'
                  ? 'bg-white text-green-600 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => handleFilter('locked')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                activeFilter === 'locked'
                  ? 'bg-white text-red-600 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Locked
            </button>
            <button
              onClick={() => handleFilter('pending')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                activeFilter === 'pending'
                  ? 'bg-white text-orange-600 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>
      
      {/* Active filters display */}
      <div className="flex items-center gap-2 h-6">
        {(searchTerm || activeFilter !== 'all') && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>
        )}
        
        {searchTerm && (
          <div className="px-2 py-0.5 rounded-md bg-gray-100 text-xs flex items-center gap-1">
            <span>Truck number: {searchTerm}</span>
            <button 
              onClick={() => {
                setSearchTerm('');
                onSearchChange('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        )}
        
        {activeFilter !== 'all' && (
          <div className={`px-2 py-0.5 rounded-md text-xs flex items-center gap-1 ${
            activeFilter === 'available' ? 'bg-green-50 text-green-800' :
            activeFilter === 'locked' ? 'bg-red-50 text-red-800' :
            'bg-orange-50 text-orange-800'
          }`}>
            <span>Status: {activeFilter}</span>
            <button 
              onClick={() => handleFilter('all')}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrucksSearchAndFilter;
