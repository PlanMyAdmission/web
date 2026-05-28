'use client';

import dynamic from 'next/dynamic';

const VoiceOrb = dynamic(() => import('./VoiceOrb.jsx'), { ssr: false });

const AIChatbot = () => <VoiceOrb />;

export default AIChatbot;
