import React, { useEffect, useState } from 'react';
import {
  Description, Dialog, DialogPanel,
  DialogTitle, DialogBackdrop,
  Button, Input, Field, Label
} from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import pluralize from 'pluralize';
import clsx from 'clsx';
import { call_api } from '../../utils/utils';
import Loading from '../Loading';
import { IngredientDocumentType } from '../../types/index';

interface NewIngredientDialogProps {
  ingredientList: IngredientDocumentType[],
  updateIngredientList: (newIngredient: IngredientDocumentType) => void
}

function NewIngredientDialog({ ingredientList, updateIngredientList }: NewIngredientDialogProps) {
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility
  const [ingredientName, setIngredientName] = useState(''); // State to manage the ingredient name input
  const [isLoading, setIsLoading] = useState(false); // State to manage the loading state
  const [message, setMessage] = useState(''); // State to manage feedback messages
  const [isDisabled, setIsDisabled] = useState(false); // State to manage the disabled state of the submit button

  useEffect(() => {
    setIngredientName('');
    setMessage('');
  }, [isOpen]); // Reset ingredient name and message when dialog is opened/closed

  // Handle input change for the ingredient name
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredientName(e.target.value);
    setMessage('');
    setIsDisabled(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!ingredientName.trim()) return;
    if (ingredientName.trim().length > 20) {
      setMessage('This ingredient name is too long!');
      setIsDisabled(true);
      return;
    }

    const ingredient = ingredientName.trim().toLowerCase();
    const availableIngredients = ingredientList.map(i => i.name.toLowerCase());
    const pluralizedIngredient = pluralize(ingredient);
    const singularizedIngredient = pluralize.singular(ingredient);
    const isAvailable = availableIngredients.includes(ingredient) ||
      availableIngredients.includes(pluralizedIngredient) ||
      availableIngredients.includes(singularizedIngredient);

    if (isAvailable) {
      setMessage('This ingredient is already available');
      setIsDisabled(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await call_api({ address: '/api/validate-ingredient', method: 'post', payload: { ingredientName } });
      const { message: responseMessage, error } = response;

      if (error) {
        throw new Error(error)
      }

      if (responseMessage === 'Success') {
        const possibleSuggestions = response.suggested.join(', ');
        setMessage(`Successfully added: ${response.newIngredient.name}${possibleSuggestions ? `\nAdditional suggestions: ${possibleSuggestions}` : ''}`);
        updateIngredientList(response.newIngredient);
        setIngredientName('');
      } else if (responseMessage === 'Invalid') {
        const possibleSuggestions = response.suggested.join(', ');
        setMessage(`${ingredientName} is invalid. ${possibleSuggestions ? `Try the following suggestions: ${possibleSuggestions}` : ''}`);
        setIngredientName('');
      } else {
        setMessage(`An error occurred with validation... check back later: ${responseMessage}`);
        setIngredientName('');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to add ingredient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-semibold rounded-xl hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-md transition-all duration-300 transform hover:scale-105">
        <PlusCircleIcon className="block mr-2 h-6 w-6" />
        Add New Ingredient
      </Button>
      <Dialog open={isOpen} onClose={() => { }} className="relative z-modal">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-6 border bg-white p-8 rounded-2xl shadow-2xl">
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">Add New Ingredient</DialogTitle>
              <Description className="text-gray-600">If you can&apos;t find your ingredient in the list, enter its name here. We&apos;ll validate it before adding to the database.</Description>
            </div>
            <Field className="mb-4">
              <Label htmlFor="ingredientName" className="block text-sm font-semibold text-gray-700 mb-2">Ingredient Name</Label>
              <Input
                type="text"
                id="ingredientName"
                name="ingredientName"
                className={clsx(
                  'mt-2 block w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 px-4 text-sm text-black',
                  'focus:outline-none focus:border-brand-500 focus:bg-white transition-all'
                )}
                value={ingredientName}
                onChange={handleInputChange}
                placeholder="e.g., Tomatoes, Basil, Olive Oil"
              />
            </Field>
            {message && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl" style={{ whiteSpace: 'pre-line' }}>
                <span className="text-red-600 font-medium">{message}</span>
              </div>
            )}
            {isLoading ? <Loading /> :
              <div className="flex gap-4 justify-end pt-4">
                <Button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 font-semibold transition-all" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button
                  className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-3 rounded-xl hover:from-brand-700 hover:to-brand-800 font-semibold transition-all data-[disabled]:bg-gray-200 shadow-md"
                  onClick={handleSubmit}
                  disabled={!ingredientName.trim() || isDisabled}
                >
                  Add Ingredient
                </Button>
              </div>}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default NewIngredientDialog;
