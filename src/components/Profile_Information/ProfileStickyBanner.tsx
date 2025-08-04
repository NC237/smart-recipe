import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ProfileStickyBanner = ({ userHasRecipes }: { userHasRecipes: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      // Show banner if the user has no recipes & hasn't dismissed it
      if (!userHasRecipes && !localStorage.getItem('dismissedRecipeBanner')) {
        setIsVisible(true);
      }
    }, [userHasRecipes]);
  
    const dismissBanner = () => {
      setIsVisible(false);
      localStorage.setItem('dismissedRecipeBanner', 'true'); // Remember user dismissed it
    };
  
    if (!isVisible) return null; // Don't render if dismissed
  
    return (
      <div className="sticky top-16 mt-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded-xl shadow-lg flex items-center justify-between border border-yellow-200">
        <div>
          <p className="font-bold text-xl mb-2">👩‍🍳 Ready to Start Cooking?</p>
          <p className="text-yellow-700 mb-3">Create your first AI-generated recipe and share your culinary creativity with the world!</p>
          <button
            className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-3 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all transform hover:scale-105 font-semibold shadow-md"
            onClick={() => router.push('/CreateRecipe')}
          >
            🍽️ Create Your First Recipe
          </button>
        </div>
        <button onClick={dismissBanner} className="ml-6 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-200 rounded-full p-2 transition-all" aria-label='close'>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    );
  };
  

export default ProfileStickyBanner;
