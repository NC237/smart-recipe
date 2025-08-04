import React, { useState, useEffect } from 'react';
import { Checkbox } from '@headlessui/react';
import {
  CheckIcon,
  SparklesIcon,
  CubeIcon,
  FireIcon,
  CakeIcon,
  BoltIcon,
  GlobeAltIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';
import { DietaryPreference, Recipe } from '../../types/index';

const dietaryOptions: DietaryPreference[] = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Halal',
  'Kosher'
];

const iconMap: Record<DietaryPreference, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Vegetarian: SparklesIcon,
  Vegan: CubeIcon,
  'Gluten-Free': FireIcon,
  'Dairy-Free': CakeIcon,
  Keto: BoltIcon,
  Halal: GlobeAltIcon,
  Kosher: HeartIcon,
};

const tooltipMap: Record<DietaryPreference, string> = {
  Vegetarian: 'No meat or fish',
  Vegan: 'No animal products',
  'Gluten-Free': 'No wheat, barley or rye',
  'Dairy-Free': 'No milk or dairy products',
  Keto: 'Low-carb, high-fat',
  Halal: 'Halal-certified ingredients',
  Kosher: 'Prepared according to Jewish dietary laws',
};

interface DietaryPreferencesProps {
  preferences: DietaryPreference[];
  updatePreferences: (preferences: DietaryPreference[]) => void;
  generatedRecipes: Recipe[];
}

export default function DietaryPreferences({
  preferences,
  updatePreferences,
  generatedRecipes,
}: DietaryPreferencesProps) {
  const [noPreference, setNoPreference] = useState(false)

  useEffect(() => {
    if (!preferences.length) {
      setNoPreference(true)
    }
  }, [preferences.length])

  const handlePreferenceChange = (checked: boolean, option: DietaryPreference) => {
    const updatedPreferences = preferences.includes(option) ? preferences.filter((p) => p !== option) : [...preferences, option]
    updatePreferences(updatedPreferences)
  };

  const handleNoPreference = () => {
    setNoPreference(!noPreference)
    updatePreferences([])
  }

  return (
    <div
      className="w-full p-6 sm:p-8 bg-white shadow-lg rounded-2xl animate-fadeInUp border border-gray-200"
    >
      {/* Enhanced Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-2xl">🥗</span>
        Dietary Preferences
      </h2>
      <p className="text-base text-gray-600 mb-6">
        Choose as many preferences as you like—your recipes will match them!
      </p>

      {/* "No Preference" Option */}
      <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <Checkbox
          checked={noPreference}
          onChange={handleNoPreference}
          className={`h-6 w-6 rounded-lg border-2 border-gray-300 flex items-center justify-center transition-all ${noPreference ? 'bg-brand-600 border-brand-600' : 'bg-white hover:border-brand-400'
            } focus:outline-none focus:ring-2 focus:ring-brand-500`}
          disabled={Boolean(generatedRecipes.length)}
          aria-label="No Dietary Preference"
        >
          {noPreference && <CheckIcon className="h-4 w-4 text-white" />}
        </Checkbox>
        <span className="ml-4 text-gray-700 font-medium">No Dietary Preference</span>
      </div>

      <div className="mb-6 border-t border-gray-200"></div>

      {/* Dietary Options with Wrapped Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dietaryOptions.map((option) => {
          const Icon = iconMap[option];
          const selected = preferences.includes(option);
          return (
            <div
              key={option}
              title={tooltipMap[option]}
              className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer transform hover:scale-105 ${selected ? 'bg-gradient-to-r from-brand-50 to-brand-100 border-brand-500 shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'} ${noPreference || generatedRecipes.length ? 'opacity-50 cursor-not-allowed transform-none' : 'hover:shadow-lg'}`}
              onClick={() => {
                if (noPreference || generatedRecipes.length) return;
                handlePreferenceChange(!selected, option);
              }}
            >
              <Checkbox
                checked={selected}
                onChange={(e) => handlePreferenceChange(e, option)}
                className={`shrink-0 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${selected ? 'bg-brand-600 border-brand-600' : 'bg-white border-gray-300 hover:border-brand-400'} focus:outline-none focus:ring-2 focus:ring-brand-500`}
                disabled={noPreference || Boolean(generatedRecipes.length)}
                aria-label={option}
              >
                {selected && <CheckIcon className="h-4 w-4 text-white" />}
              </Checkbox>
              <Icon className={`shrink-0 w-5 h-5 ml-4 transition-colors ${selected ? 'text-brand-600' : 'text-gray-500'}`} aria-hidden="true" />
              <span title={tooltipMap[option]} className="ml-3 text-gray-700 font-medium">{option}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
