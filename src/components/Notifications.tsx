import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import for navigation
import { BellIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Additional icons
import { CheckIcon } from '@heroicons/react/24/solid';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import useWindowSize from './Hooks/useWindowSize';
import { call_api } from '../utils/utils';
import { NotificationType } from '../types';

interface NotificationProps {
    screen?: string;
}

const Notifications = ({ screen }: NotificationProps) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter(); // Router for navigation
    const { height } = useWindowSize();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const data = await call_api({ address: '/api/get-notifications' });
                setNotifications(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Count unread notifications
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const markAsRead = async (id: string) => {
        try {
            await call_api({ address: `/api/read-notification?id=${id}`, method: 'put' });

            // Update the local state after marking as read
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === id ? { ...notification, read: true } : notification
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    // Get the latest 5 notifications
    const latestNotifications = notifications.slice(0, 5);

    return (
        <Popover className="relative">
            <PopoverButton
                className={`relative rounded-full bg-brand-800 p-1 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-800 ${screen === 'mobile' ? 'ml-auto' : ''
                    }`}
            >
                {/* Bell Icon */}
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />

                {/* Badge for unread notifications */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                        {unreadCount}
                    </span>
                )}
            </PopoverButton>
            <PopoverPanel
                className={`${height <= 750 ? 'absolute right-8 top-0 -mt-32' : 'absolute right-0 mt-2'} w-80 rounded-2xl bg-white shadow-xl ring-1 ring-black/10 z-header border border-gray-200`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {loading && <p className="text-sm text-gray-500">Loading notifications...</p>}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {!loading && !error && latestNotifications.length > 0 && (
                        <ul className="divide-y divide-gray-100 space-y-1">
                            {latestNotifications.map(({ _id, read, message, recipeId }) => (
                                <li
                                    key={_id}
                                    className={`py-4 px-3 flex items-start space-x-3 rounded-xl hover:bg-gray-50 transition-colors ${read ? 'text-gray-500' : 'text-gray-800 font-semibold'
                                        }`}
                                >
                                    {/* Icon for read/unread */}
                                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                                        {read ? (
                                            <CheckIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <ExclamationCircleIcon className="h-5 w-5 text-brand-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm leading-relaxed">{message}</p>
                                        <div className="flex space-x-3 mt-2">
                                            {!read && (
                                                <button
                                                    className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline transition-colors"
                                                    onClick={() => markAsRead(_id)}
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                            <button
                                                className="text-xs text-gray-600 hover:text-gray-800 font-medium hover:underline transition-colors"
                                                onClick={() => router.push(`/RecipeDetail?recipeId=${recipeId}`)}
                                            >
                                                View Recipe
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {notifications.length > 5 && (
                        <button
                            className="mt-6 w-full text-sm text-brand-600 hover:text-brand-700 font-semibold py-2 px-4 rounded-xl hover:bg-brand-50 transition-all"
                            onClick={() => router.push('/NotificationsPage')}
                        >
                            See All Notifications
                        </button>
                    )}
                    {!loading && !error && notifications.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">🔔</div>
                            <p className="text-sm text-gray-500">No notifications yet</p>
                        </div>
                    )}
                </div>
            </PopoverPanel>

        </Popover>
    );
};

export default Notifications;
