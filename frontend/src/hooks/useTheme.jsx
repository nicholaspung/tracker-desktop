import {
  Density,
  Mode,
  applyDensity,
  applyMode,
} from '@cloudscape-design/global-styles';
import { useEffect } from 'react';
import useMyStore from '../store/useStore';
import { densityOpts, modeOpts } from '../lib/theme';

export default function useTheme() {
  const { mode, density, toggleDataStore } = useMyStore((state) => ({
    mode: state.mode,
    density: state.density,
    toggleDataStore: state.toggleDataStore,
  }));
  const toggleMode = () => {
    toggleDataStore('mode');
  };
  const toggleDensity = () => {
    toggleDataStore('density');
  };

  useEffect(() => {
    if (mode === modeOpts[Mode.Light]) {
      applyMode(Mode.Light);
    } else {
      applyMode(Mode.Dark);
    }
  }, [mode]);

  useEffect(() => {
    if (density === densityOpts[Density.Compact]) {
      applyDensity(Density.Compact);
    } else {
      applyDensity(Density.Comfortable);
    }
  }, [density]);

  return { toggleMode, toggleDensity, mode, density };
}
