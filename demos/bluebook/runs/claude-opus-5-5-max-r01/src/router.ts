import { useEffect, useState } from 'react';

export type Route = { name: 'feed' } | { name: 'note'; id: string };

// Hash routing keeps the static build working from any sub-path (GitHub Pages previews).
const parse = (hash: string): Route => {
  const m = /^#\/note\/([^/?#]+)/.exec(hash);
  return m ? { name: 'note', id: decodeURIComponent(m[1]) } : { name: 'feed' };
};

let openedFromFeed = false;

export function openNote(id: string) {
  openedFromFeed = true;
  window.location.hash = `#/note/${encodeURIComponent(id)}`;
}

export function backToFeed() {
  if (openedFromFeed) {
    openedFromFeed = false;
    window.history.back();
  } else {
    window.location.hash = '#/';
  }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      const next = parse(window.location.hash);
      if (next.name === 'feed') openedFromFeed = false;
      setRoute(next);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
