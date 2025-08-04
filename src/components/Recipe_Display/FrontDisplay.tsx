import React from 'react'
import Image from "next/image"
import { Button } from '@headlessui/react'
import { HandThumbUpIcon } from '@heroicons/react/24/outline'
import { HandThumbUpIcon as HandThumbUpSolid, ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { call_api } from "../../utils/utils";
import { ExtendedRecipe } from '../../types';


interface FrontDisplayProps {
    recipe: ExtendedRecipe
    showRecipe: (recipe: ExtendedRecipe) => void
    updateRecipeList: (recipe: ExtendedRecipe) => void
}

const getThumbsup = ({ liked, owns }: { liked: boolean, owns: boolean }) => {
    if (owns) {
        return <HandThumbUpSolid className="block h-6 w-6 text-gray-500" />
    }
    if (liked) {
        return <HandThumbUpSolid className="block h-6 w-6 text-brand-500" />
    }
    return <HandThumbUpIcon className="block h-6 w-6 text-brand-500" />
}


const FrontDisplay = React.forwardRef<HTMLDivElement, FrontDisplayProps>(
    ({ recipe, showRecipe, updateRecipeList }, ref) => {

    const handleRecipeLike = async (recipeId: string) => {
        try {
            const result = await call_api({ address: '/api/like-recipe', method: 'put', payload: { recipeId } })
            updateRecipeList(result);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div ref={ref} className="recipe-card max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg mt-4 mb-2 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full animate-fadeInUp overflow-hidden">
            <div className="relative w-full h-64"> {/* Add a container for the image */}
                <Image
                    src={recipe.imgLink}
                    fill
                    alt={recipe.name}
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-2xl transition-transform duration-300 hover:scale-110"
                    priority
                    sizes="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl" />
                <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-800">
                        {recipe.dietaryPreference[0] || 'Recipe'}
                    </div>
                </div>
            </div>
            <div className="p-6 flex-grow">
                <h5 className="mb-3 text-xl font-bold tracking-tight text-gray-900 line-clamp-2">{recipe.name}</h5>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{recipe.additionalInformation.nutritionalInformation}</p>
            </div>
            <div className="px-6 pb-2 flex flex-wrap gap-2">
                {
                    recipe.dietaryPreference.slice(0, 3).map((preference) => (
                        <span key={preference} className="bg-gradient-to-r from-brand-100 to-brand-200 text-brand-800 text-xs font-medium px-3 py-1 rounded-full border border-brand-300">{preference}</span>
                    ))
                }
            </div>
            <div className="p-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <Button
                        className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-center text-white bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl hover:from-brand-700 hover:to-brand-800 focus:ring-4 focus:outline-none focus:ring-brand-300 transition-all transform hover:scale-105 shadow-md"
                        onClick={() => showRecipe(recipe)}
                    >
                        See Recipe
                        <ArrowRightCircleIcon className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        className="py-2 px-3 hover:text-brand-600 hover:scale-110 hover:shadow-md text-center border-2 border-gray-200 rounded-xl h-10 text-sm flex items-center gap-2 transition-all bg-white hover:border-brand-300"
                        onClick={() => handleRecipeLike(recipe._id)}
                        disabled={recipe.owns}
                        data-testid="like_button"
                    >
                        {getThumbsup(recipe)}
                        <span className="font-semibold">{recipe.likedBy.length}</span>
                    </Button>
                </div>
            </div>
        </div>

    )
    }
)
FrontDisplay.displayName = 'FrontDisplay'

export default FrontDisplay


