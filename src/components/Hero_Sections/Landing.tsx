import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function Landing() {
    return (
        <div className="animate-fadeInUp mx-auto flex max-w-4xl flex-col items-center gap-10 py-10 md:flex-row md:py-20">
            <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/2 space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
                    <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                        Cook Smarter with AI
                    </span>
                </h1>
                <p className="text-lg leading-8 text-gray-600">
                    Transform your available ingredients into delicious, personalized recipes with the power of artificial intelligence. Perfect for any dietary preference or cooking skill level.
                </p>
                <button
                    className="w-fit rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-brand-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    onClick={() => signIn('google')}
                >
                    Start Cooking with AI →
                </button>
            </div>
            <div className="md:w-1/2">
                <Image
                    src="/demo.gif"
                    alt="Smart Recipe Generator demo"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-xl"
                />
            </div>
        </div>
    );
}