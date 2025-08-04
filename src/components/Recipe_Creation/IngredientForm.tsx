import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import NewIngredientDialog from './NewIngredientDialog';
import { Ingredient, Recipe, IngredientDocumentType } from '../../types/index';

type ComboIngredient = { id: number; name: string };

const initialComboIngredient: ComboIngredient = { id: 0, name: '' };

const Chip = ({ ingredient, onDelete }: { ingredient: Ingredient; onDelete: (id: string) => void }) => {
    return (
        <div className="flex items-center bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all transform hover:scale-105 hover:shadow-md">
            <span>{`${ingredient.name}${ingredient.quantity ? ` (${ingredient.quantity})` : ''}`}</span>
            <button onClick={() => onDelete(ingredient.id)} className="ml-2 focus:outline-none hover:bg-white/20 rounded-full p-1 transition-colors">
                <XMarkIcon className="w-3 h-3 text-white" />
            </button>
        </div>
    );
};

interface IngredientListProps {
    ingredientList: IngredientDocumentType[];
    ingredientUpdate: (val: string | undefined) => void;
    generatedRecipes: Recipe[];
}

function IngredientList({ ingredientList, ingredientUpdate, generatedRecipes }: IngredientListProps) {
    const [selectedIngredient, setSelectedIngredient] = useState(initialComboIngredient);
    const [query, setQuery] = useState('');

    const filteredIngredients: IngredientDocumentType[] =
        query === ''
            ? ingredientList
            : ingredientList.filter((ingredient) =>
                ingredient.name.toLowerCase().includes(query.toLowerCase())
            );

    const handleSelectedIngredient = (ingredient: ComboIngredient) => {
        setSelectedIngredient(initialComboIngredient);
        ingredientUpdate(ingredient?.name);
    };

    return (
        <div className="relative w-full">
            <Combobox
                value={selectedIngredient}
                onChange={handleSelectedIngredient}
                disabled={Boolean(generatedRecipes.length)}
            >
                <div className="relative w-full">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ComboboxInput
                        className={clsx(
                            'w-full rounded-lg border border-gray-300 bg-white py-3 pr-10 pl-9 text-base text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-300'
                        )}
                        displayValue={(ingredient: ComboIngredient) => ingredient?.name}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Select an existing ingredient"
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </ComboboxButton>
                </div>

                {filteredIngredients.length > 0 && (
                    <ComboboxOptions
                        className="absolute z-overlay mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm transition-all"
                    >
                        {filteredIngredients.map((ingredient) => (
                            <ComboboxOption
                                key={ingredient._id}
                                value={ingredient}
                                className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 transition-colors ${active ? 'text-white bg-brand-600' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ focus, selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {ingredient.name}
                                        </span>
                                        {selected && (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-white' : 'text-brand-600'
                                                    }`}
                                            >
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
            </Combobox>
        </div>
    );
}

interface IngredientFormProps {
    ingredientList: IngredientDocumentType[];
    ingredients: Ingredient[];
    updateIngredients: (ingredients: Ingredient[]) => void;
    generatedRecipes: Recipe[];
}

export default function IngredientForm({
    ingredientList: originalIngredientList,
    ingredients,
    updateIngredients,
    generatedRecipes,
}: IngredientFormProps) {
    const [ingredientList, setIngredientList] = useState(originalIngredientList);
    const [error, setError] = useState<string | null>(null);
    const progressPercent = Math.min(ingredients.length, 10) * 10;

    const handleChange = (val: string | undefined) => {
        if (!val) return;
        const isRepeat = ingredients.some(
            (i) => i.name.toLowerCase() === val.toLowerCase()
        );
        if (isRepeat) {
            setError('This ingredient is already selected.');
            return;
        }
        if(ingredients.length >= 10){
            setError('You can select up to 10 ingredients only.');
            return
        }
        setError(null);
        updateIngredients([
            ...ingredients,
            { name: val, id: uuidv4() },
        ]);
    };

    const deleteIngredient = (id: string) => {
        if (Boolean(generatedRecipes.length)) return;
        updateIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    };

    return (
        <div
            className="w-full p-6 sm:p-8 bg-white shadow-lg rounded-2xl animate-fadeInUp border border-gray-200"
        >
            {/* Enhanced "Add New Ingredient" Button */}
            <div className="flex justify-end w-full">
                <NewIngredientDialog
                    ingredientList={ingredientList}
                    updateIngredientList={(newIngredient) => setIngredientList([...ingredientList, newIngredient])}
                />
            </div>
            <div className="mt-4 w-full">
                <IngredientList
                    ingredientList={ingredientList}
                    ingredientUpdate={(val) => handleChange(val)}
                    generatedRecipes={generatedRecipes}
                />
                <div className="mt-3">
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">Ingredient Selection</p>
                        <p className="text-xs font-semibold text-brand-600">{ingredients.length}/10 selected</p>
                    </div>
                </div>
                {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium">
                        {error}
                        </p>
                    </div>
                )}
            </div>
            {ingredients.length > 0 && (
                <div className="mt-6 w-full">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-xl">🥘</span>
                        Selected Ingredients
                    </h2>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
                        {ingredients.map((ingredient: Ingredient) => (
                            <Chip
                                ingredient={ingredient}
                                key={ingredient.id}
                                onDelete={(id: string) => deleteIngredient(id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
