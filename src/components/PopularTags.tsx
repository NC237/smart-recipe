import { useState, useEffect } from "react";
import useWindowSize from "./Hooks/useWindowSize";

interface Tag {
    _id: string;
    count: number;
}

interface PopularTagsProps {
    tags: Tag[];
    onTagToggle: (activeTag: string) => void;
    searchVal: string;
}

const PopularTags = ({ tags, onTagToggle, searchVal }: PopularTagsProps) => {
    const [activeTag, setActiveTag] = useState<string>('');

    const { width } = useWindowSize();

    useEffect(() => {
        if (!searchVal.trim()) {
            setActiveTag('');
        }
    }, [searchVal]);

    const handleTagClick = (tag: string) => {
        const newActiveTag = activeTag === tag ? '' : tag;
        setActiveTag(newActiveTag);
        onTagToggle(newActiveTag);
    };

    // Adjust tag display count based on screen size
    const sliceAmount = width < 640 ? 8 : width < 1024 ? 10 : 20;

    return (
        <div className='w-full py-4'>
            <div className="flex items-center justify-between mb-4">
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                    <span className="text-2xl">🔥</span>
                    Trending Tags
                </h2>
                <div className="text-sm text-gray-500">
                    {tags.length > 0 && `${tags.length} tags available`}
                </div>
            </div>
            <div className='flex flex-wrap gap-3'>
                {tags.length === 0 ? (
                    <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent"></div>
                        <span className="text-sm">Loading trending tags...</span>
                    </div>
                ) : (
                    tags.slice(0, sliceAmount).map(({ _id, count }) => (
                        <button
                            key={_id}
                            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all transform hover:scale-105 ${activeTag === _id
                                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-brand-100 hover:to-brand-200 hover:text-brand-800 border border-gray-300 hover:border-brand-400'
                                }`}
                            onClick={() => handleTagClick(_id)}
                        >
                            <span className="capitalize">{_id}</span>
                            <span className="ml-1 text-xs opacity-75">({count})</span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default PopularTags;
