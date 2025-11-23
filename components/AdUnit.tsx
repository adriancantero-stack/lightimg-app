import React, { useEffect } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    layoutKey?: string;
    style?: React.CSSProperties;
    className?: string;
    label?: string;
    client?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({
    slot,
    format = 'auto',
    layoutKey,
    style,
    className = '',
    label = 'Advertisement',
    client = import.meta.env.VITE_ADSENSE_CLIENT_ID
}) => {
    useEffect(() => {
        // Lazy load AdSense script
        if (client && !document.querySelector('script[src*="adsbygoogle.js"]')) {
            const script = document.createElement('script');
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        }

        try {
            // @ts-ignore
            const adsbygoogle = window.adsbygoogle || [];
            // @ts-ignore
            adsbygoogle.push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, [client]);

    // Development placeholder or if client ID is missing
    if (import.meta.env.DEV || !client) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 w-full ${className}`} style={{ minHeight: '120px', ...style }}>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{label}</span>
                <div className="text-xs text-gray-500 font-medium">Google AdSense Placeholder</div>
                <div className="text-[10px] text-gray-400 mt-1 font-mono">Slot: {slot}</div>
                {!client && <div className="text-[10px] text-red-300 mt-1">Missing VITE_ADSENSE_CLIENT_ID</div>}
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center w-full ${className}`}>
            {label && <span className="text-[10px] text-gray-300 uppercase tracking-widest mb-2 self-center">{label}</span>}
            <div className="w-full overflow-hidden bg-gray-50/30 rounded-xl flex justify-center">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%', ...style }}
                    data-ad-client={client}
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                    {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
                />
            </div>
        </div>
    );
};

export default AdUnit;
