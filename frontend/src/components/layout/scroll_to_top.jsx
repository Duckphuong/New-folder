import React, { useEffect, useState } from 'react';

const ScrollToTop = () => {
    const [showButton, setShowButton] = useState(false);

    const scrollToTop_fn = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop_fn}
            className={`fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-opacity duration-500
                ${
                    showButton
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }
             `}
        >
            ↑
        </button>
    );
};

export default ScrollToTop;
