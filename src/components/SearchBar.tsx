// SearchBar Component
import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid';
import useWindowSize from './Hooks/useWindowSize';

interface SearchBarProps {
    searchVal: string
    setSearchVal: (val: string) => void
    handleSearch: () => void
    totalRecipes: number
}

const SearchBar = ({ searchVal, setSearchVal, handleSearch, totalRecipes }: SearchBarProps) => {
    const { width } = useWindowSize(); // Get window width
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-screen-lg flex items-center justify-between p-2 mt-4 rounded-2xl shadow-lg bg-white border-2 border-gray-200 hover:border-brand-300 transition-all">
            <div className="relative w-full flex items-center">
                {/* Magnifying Glass Icon */}
                <MagnifyingGlassIcon className="absolute left-4 h-5 w-5 text-gray-400" />

                {/* Input Field */}
                <input
                    className="w-full pl-12 pr-12 py-3 text-sm text-gray-700 placeholder-gray-500 bg-transparent border-none rounded-2xl focus:outline-none"
                    placeholder={width < 565 ? 'Search recipes...' : 'Search recipes by name, ingredient, or type...'}
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={handleKeyPress}
                />

                {/* Clear Button (X Icon) */}
                {searchVal.trim() && (
                    <div className="absolute right-4 flex items-center space-x-2">
                        <button
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            onClick={() => setSearchVal('')}
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        {
                            totalRecipes > 0 && <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded-full">{totalRecipes}</span>
                        }
                    </div>
                )}
            </div>

            {/* Search Button */}
            <button
                className="ml-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 rounded-xl focus:ring-4 focus:outline-none focus:ring-brand-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
