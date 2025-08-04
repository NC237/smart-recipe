import { useEffect, useState, useRef, useCallback } from 'react';
import { ClockIcon, FireIcon } from '@heroicons/react/24/solid';
import SearchBar from '../components/SearchBar';
import ViewRecipes from '../components/Recipe_Display/ViewRecipes';
import FloatingActionButtons from '../components/FloatingActionButtons';
import Loading from '../components/Loading';
import PopularTags from '../components/PopularTags';
import { usePagination } from '../components/Hooks/usePagination';

const Home = () => {
    const [searchVal, setSearchVal] = useState('');
    const [sortOption, setSortOption] = useState<'recent' | 'popular'>('popular');
    const [searchTrigger, setSearchTrigger] = useState<true | false>(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastRecipeRef = useRef<HTMLDivElement | null>(null);

    const isSearching = searchVal.trim() !== "";
    const endpoint = isSearching ? "/api/search-recipes" : "/api/get-recipes";

    const {
        data: latestRecipes,
        loading,
        popularTags,
        loadMore,
        handleRecipeListUpdate,
        totalRecipes,
        page,
        totalPages
    } = usePagination({
        endpoint,
        sortOption,
        searchQuery: searchVal.trim(),
        searchTrigger,
        resetSearchTrigger: () => setSearchTrigger(false),
    });
    useEffect(() => {
        if (!latestRecipes.length) return;

        const lastRecipeElement = lastRecipeRef.current;
        if (!lastRecipeElement) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting && !loading && page < totalPages) {
                loadMore();
                if (searchVal.trim() && !searchTrigger) {
                    setSearchTrigger(true);
                }
            }
        }, { threshold: 0.5 });

        observerRef.current.observe(lastRecipeElement);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null; // Ensure observerRef is fully reset
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestRecipes, loading]);

    const handleSearch = useCallback(() => {
        if (!searchVal.trim()) return;

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
            searchTimeout.current = null; // Explicitly reset the timeout reference
        }

        searchTimeout.current = setTimeout(() => {
            setSearchTrigger(true);
        }, 500);
    }, [searchVal]);

    const sortRecipes = (option: 'recent' | 'popular') => {
        if (sortOption === option || isSearching) return;
        setSortOption(option);
        setSearchTrigger(true);
    };

    const handleTagSearch = async (tag: string) => {
        if (searchVal === tag) {
            setSearchVal(""); // Reset search if clicking the same tag
            return;
        }

        setSearchVal(tag);
        setSearchTrigger(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-brand-50">
            <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center space-y-4 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                        Discover Amazing Recipes
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore thousands of AI-generated recipes tailored to your taste and dietary preferences
                    </p>
                </div>

            <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} handleSearch={handleSearch} totalRecipes={totalRecipes} />
            <PopularTags tags={popularTags} onTagToggle={handleTagSearch} searchVal={searchVal} />

            {/* Sorting Buttons */}
            <div className="flex space-x-4 mt-4 mb-4 bg-white rounded-2xl p-2 shadow-md border border-gray-200">
                <button
                    onClick={() => sortRecipes('recent')}
                    className={`disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${sortOption === 'recent' ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                    disabled={Boolean(searchVal.trim())}
                >
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Most Recent
                </button>
                <button
                    onClick={() => sortRecipes('popular')}
                    className={`disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${sortOption === 'popular' ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                    disabled={Boolean(searchVal.trim())}
                >
                    <FireIcon className="h-4 w-4 mr-2" />
                    Most Popular
                </button>
            </div>

            <ViewRecipes
                recipes={latestRecipes}
                handleRecipeListUpdate={handleRecipeListUpdate}
                lastRecipeRef={lastRecipeRef}
            />
            <FloatingActionButtons />

            {/* Show loading indicator when fetching */}
            {loading && (
                <div className="py-8">
                    <Loading />
                </div>
            )}
            </div>
        </div>
    );
};

export default Home;
