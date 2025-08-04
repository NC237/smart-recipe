import React, { useState, useEffect } from 'react';
import { Button } from '@headlessui/react';
import {
  PencilIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  CubeIcon,
  FireIcon,
  CakeIcon,
  BoltIcon,
  GlobeAltIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';
import { Ingredient, DietaryPreference, Recipe } from '../../types/index';
import useWindowSize from '../Hooks/useWindowSize';

const preferenceIconMap: Record<
  DietaryPreference,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Vegetarian: SparklesIcon,
  Vegan: CubeIcon,
  'Gluten-Free': FireIcon,
  'Dairy-Free': CakeIcon,
  Keto: BoltIcon,
  Halal: GlobeAltIcon,
  Kosher: HeartIcon,
};

interface ReviewComponentProps {
  ingredients: Ingredient[];
  dietaryPreference: DietaryPreference[];
  onSubmit: () => void;
  onEdit: () => void;
  generatedRecipes: Recipe[];
}

const ReviewComponent = ({
  ingredients,
  dietaryPreference,
  onSubmit,
  onEdit,
  generatedRecipes,
}: ReviewComponentProps) => {
  const { height } = useWindowSize()
  const showButtons = generatedRecipes.length === 0

  return (
    <div
      className="w-full p-6 sm:p-8 bg-white shadow-lg rounded-2xl animate-fadeInUp overflow-y-auto border border-gray-200"
      style={{ maxHeight: height - 160 }}
    >
      <div className="px-1 py-1">
        {/* Enhanced Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
            <span className="text-3xl">👨‍🍳</span>
            {showButtons ? 'Review Your Selections' : 'Submit Your Recipe Choices'}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {showButtons
              ? ingredients.length >= 3 ? 'Make sure everything looks right before we start cooking!' : ''
              : "Here's a recap of your choices. Use the switch on each recipe generated to select the recipes you want to submit."}
          </p>
          {ingredients.length < 3 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 font-medium">
              Please select at least 3 ingredients to proceed with recipe creation.
              </p>
            </div>
          )}
        </div>

        {/* Ingredients Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl border border-brand-200">
          <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-xl">🥘</span>
            {`${ingredients.length} Ingredient${ingredients.length !== 1 ? 's' : ''}`}
          </h3>
          <ul
            className="flex flex-wrap gap-3 w-full sm:max-h-none sm:overflow-y-visible overflow-y-auto"
            style={{ maxHeight: height <= 800 ? '60px' : '150px' }}
          >
            {ingredients.map((ingredient) => (
              <li
                key={ingredient.id}
                className="flex items-center bg-white text-brand-800 text-sm font-semibold px-4 py-2 rounded-full border-2 border-brand-300 shadow-sm"
              >
                <CheckCircleIcon className="w-4 h-4 mr-2 text-brand-600" aria-hidden="true" />
                {ingredient.name}
                {ingredient.quantity && (
                  <span className="ml-2 text-xs text-brand-600 font-normal">
                    ({ingredient.quantity})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Dietary Preferences Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-xl">🥗</span>
            {`${dietaryPreference.length} Dietary Preference${dietaryPreference.length !== 1 ? 's' : ''}`}
          </h3>
          <div
            className="flex flex-wrap gap-3 overflow-y-auto"
            style={{ maxHeight: '70px' }}
          >
            {dietaryPreference.map((preference) => {
              const Icon = preferenceIconMap[preference] || SparklesIcon;
              return (
                <span
                  key={preference}
                  className="flex items-center bg-white text-purple-800 text-sm font-semibold px-4 py-2 rounded-full border-2 border-purple-300 shadow-sm"
                >
                  <Icon className="w-4 h-4 mr-2 text-purple-600" aria-hidden="true" />
                  {preference}
                </span>
              );
            })}
          </div>
        </div>

        {showButtons && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {/* Edit Button */}
            <Button
              onClick={onEdit}
              className={`flex items-center justify-center bg-gray-100 text-gray-700
                px-6 py-3
                rounded-xl font-semibold transition-all duration-300 transform
                hover:bg-gray-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300
                ${generatedRecipes.length ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={Boolean(generatedRecipes.length)}
              aria-label="Edit your selections"
            >
              <PencilIcon
                className="w-4 h-4 mr-2"
                aria-hidden="true"
              />
              <span>Edit Selections</span>
            </Button>

            {/* Create Recipes Button */}
            <Button
              onClick={onSubmit}
              className={`flex items-center justify-center bg-gradient-to-r from-brand-600 to-brand-700 text-white
                px-8 py-3
                rounded-xl font-bold transition-all duration-300 transform
                hover:from-brand-700 hover:to-brand-800 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-md
                ${ingredients.length < 3 || generatedRecipes.length
                ? 'cursor-not-allowed opacity-50'
                : ''
              }`}
              disabled={ingredients.length < 3 || Boolean(generatedRecipes.length)}
              aria-label="Create recipes based on your selections"
            >
              <span>Create Amazing Recipes</span>
              <ChevronRightIcon
                className="w-5 h-5 ml-2"
                aria-hidden="true"
              />
            </Button>
          </div>
        )}


      </div>
    </div>
  );
};

export default ReviewComponent;
