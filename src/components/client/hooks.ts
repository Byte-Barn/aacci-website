'use client';

import { useSyncExternalStore } from 'react';

const noSubscribe = () => () => {};

/** True when animations are allowed (html.motion is set before first paint). False during server rendering. */
export const useMotion = () =>
  useSyncExternalStore(noSubscribe, () => document.documentElement.classList.contains('motion'), () => false);

/** The page's query string on the client, '' while rendering on the server, so markup hydrates cleanly. */
export const useLocationSearch = () => useSyncExternalStore(noSubscribe, () => window.location.search, () => '');

let introDecision: boolean | null = null;
/** Whether the home intro should play: once per browser session, and only with motion allowed. */
export const useIntro = () =>
  useSyncExternalStore(
    noSubscribe,
    () => {
      if (introDecision === null) {
        const motion = document.documentElement.classList.contains('motion');
        introDecision = motion && !sessionStorage.getItem('aacci-intro');
        if (introDecision) sessionStorage.setItem('aacci-intro', '1');
      }
      return introDecision;
    },
    () => false,
  );
