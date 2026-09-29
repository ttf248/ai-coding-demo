import React from 'react';
import { MARKETS } from '../types/stock';

interface Props {
  active: string;
  onChange: (market: string) => void;
}

const MarketTabs: React.FC<Props> = ({ active, onChange }) => {
  const ALL = { code: '', label: '全部' };
  const list = [ALL, ...MARKETS];

  return (
    <div className="market-tabs" role="tablist" aria-label="市场切换">
      {list.map((m) => (
        <button
          key={m.code || 'ALL'}
          type="button"
          role="tab"
          aria-selected={active === m.code}
          className={'market-tab' + (active === m.code ? ' active' : '')}
          onClick={() => onChange(m.code)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
};

export default MarketTabs;