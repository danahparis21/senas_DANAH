import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneContainerProps {
    children: React.ReactNode;
}

export default function PhoneContainer({ children }: PhoneContainerProps) {
    const [time, setTime] = useState('09:41');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes} ${ampm}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000 * 60);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans selection:bg-blue-300 selection:text-blue-900 leading-normal antialiased">
            <div className="relative w-full max-w-[412px] h-[892px] rounded-[52px] border-[12px] border-slate-900 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden transition-all duration-300 ring-4 ring-slate-800/10">

                {/* Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-between px-4">
                    <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-blue-900 rounded-full opacity-60"></div>
                </div>

                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-3 pb-1 bg-transparent text-slate-800 text-xs font-semibold select-none z-40">
                    <span className="text-[11px] tracking-tight">{time}</span>
                    <div className="flex items-center space-x-1.5">
                        <Signal className="w-3.5 h-3.5 text-slate-800 stroke-[2.5]" />
                        <Wifi className="w-3.5 h-3.5 text-slate-800 stroke-[2.5]" />
                        <div className="flex items-center space-x-0.5">
                            <span className="text-[10px] tracking-tight mr-0.5">100%</span>
                            <Battery className="w-4 h-4 text-slate-800 fill-slate-800 stroke-[2]" />
                        </div>
                    </div>
                </div>

                {/* Active View Area */}
                <div className="flex-1 flex flex-col overflow-y-auto relative h-full">
                    {children}
                </div>

                {/* Home Sweep Indicator */}
                <div className="h-6 bg-white flex justify-center items-center pb-2 z-40 shrink-0 select-none">
                    <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
