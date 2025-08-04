import React from 'react';
import { Button } from '@headlessui/react';
import { useRouter } from 'next/router';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface LimitReachedProps {
    message?: string;
    onAction?: () => void;
    actionText?: string;
    fullHeight?: boolean;
}

const LimitReached: React.FC<LimitReachedProps> = ({
    message = "You've reached your recipe creation limit.",
    onAction,
    actionText = "Go to Home",
    fullHeight = false,
}) => {
    const router = useRouter();

    const handleAction = () => {
        if (onAction) {
            onAction();
        } else {
            router.push('/');
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center ${fullHeight ? 'min-h-screen' : 'h-full'} bg-gradient-to-br from-gray-50 to-red-50 p-4`}>
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center border border-gray-200">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <ExclamationCircleIcon className="h-10 w-10 text-red-500"/>
                </div>
                {/* Title */}
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Usage Limit Reached</h2>
                {/* Message */}
                <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
                {/* Action Button */}
                <Button
                    onClick={handleAction}
                    className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-8 py-3 rounded-xl hover:from-brand-700 hover:to-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-400 font-semibold transition-all transform hover:scale-105 shadow-md"
                >
                    {actionText}
                </Button>
            </div>
        </div>
    );
};

export default LimitReached;
