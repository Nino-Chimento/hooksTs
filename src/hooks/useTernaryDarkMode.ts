import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// See: https://usehooks-ts.com/react-hook/use-local-storage
// See: https://usehooks-ts.com/react-hook/use-media-query
import { useLocalStorage, useMediaQuery, useUpdateEffect } from '..';
// See: https://usehooks-ts.com/react-hook/use-media-query

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

type TernaryDarkMode = 'system' | 'dark' | 'light';
interface UseTernaryDarkModeOutput {
  isDarkMode: boolean;
  ternaryDarkMode: TernaryDarkMode;
  setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
}

export function useTernaryDarkMode(): UseTernaryDarkModeOutput {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const [ternaryDarkMode, setTernaryDarkMode] = useLocalStorage<
    TernaryDarkMode
  >('ternaryDarkMode', 'system');
  const [isDarkMode, setDarkMode] = useState<boolean>(isDarkOS);

  // Update darkMode if os prefers changes
  useUpdateEffect(() => {
    if (ternaryDarkMode === 'system') {
      setDarkMode(isDarkOS);
    }
  }, [isDarkOS]);

  useEffect(() => {
    switch (ternaryDarkMode) {
      case 'light':
        setDarkMode(false);
        break;
      case 'system':
        setDarkMode(isDarkOS);
        break;
      case 'dark':
        setDarkMode(true);
        break;
    }
  }, [ternaryDarkMode, isDarkOS]);

  function toggleTernaryDarkMode() {
    const toggleDict: Record<TernaryDarkMode, TernaryDarkMode> = {
      light: 'system',
      system: 'dark',
      dark: 'light',
    };
    setTernaryDarkMode(prevMode => toggleDict[prevMode]);
  }

  return {
    isDarkMode,
    ternaryDarkMode,
    setTernaryDarkMode,
    toggleTernaryDarkMode,
  };
}
