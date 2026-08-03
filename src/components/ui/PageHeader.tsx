import React from 'react';
import { useT } from '../../hooks/use-t';

interface PageHeaderProps {
  titleKey: 'press' | 'voice' | 'cv' | 'contact' | 'faq';
}

export function PageHeader({ titleKey }: PageHeaderProps) {
  const { lang } = useT();

  const titles = {
    press: lang === 'sv' ? 'Portfolio' : 'Portfolio',
    voice: lang === 'sv' ? 'Röst & Dubbning' : 'Voice & Dubbing',
    cv: lang === 'sv' ? 'CV & Meriter' : 'CV & Credits',
    contact: lang === 'sv' ? 'Kontakt' : 'Contact',
    faq: lang === 'sv' ? 'Vanliga frågor' : 'FAQ',
  };

  return (
    <div className="pt-32 md:pt-40 pb-12 px-6 md:px-12 max-w-7xl mx-auto text-center">
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-bone uppercase tracking-[0.2em] mb-6">
        {titles[titleKey]}
      </h1>
      <div className="w-24 h-px bg-ember/50 mx-auto"></div>
    </div>
  );
}
