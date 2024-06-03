import { Toggle, TopNavigation } from '@cloudscape-design/components';
import {
  Density,
  Mode,
  applyDensity,
  applyMode,
} from '@cloudscape-design/global-styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RT_HOME } from '../lib/routes';
import wailsLogo from '../assets/images/logo-universal.png';

export default function TopNav() {
  const navigate = useNavigate();
  const modeOpts = {
    [Mode.Light]: true,
    [Mode.Dark]: false,
  };
  const densityOpts = {
    [Density.Compact]: true,
    [Density.Comfortable]: false,
  };

  const [mode, setMode] = useState(modeOpts[Mode.Light]);
  const [density, setDensity] = useState(densityOpts[Density.Compact]);

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

  return (
    <TopNavigation
      identity={{
        href: RT_HOME,
        title: 'Builder',
        logo: {
          // src: '/src/assets/images/logo-universal.png',
          src: wailsLogo,
          alt: 'Builder',
        },
        onFollow: (e) => {
          e.preventDefault();
          navigate(RT_HOME);
        },
      }}
      utilities={[
        {
          type: 'button',
          ariaLabel: 'Visual mode',
          text: (
            <Toggle
              checked={mode}
              onChange={() => setMode((prevState) => !prevState)}
            >
              {mode ? 'Light mode' : 'Dark mode'}
            </Toggle>
          ),
        },
        {
          type: 'button',
          ariaLabel: 'Spacing mode',
          text: (
            <Toggle
              checked={density}
              onChange={() => setDensity((prevState) => !prevState)}
            >
              {density ? 'Comfort mode' : 'Compact mode'}
            </Toggle>
          ),
        },
        {
          type: 'button',
          iconName: 'keyboard',
        },
      ]}
    />
  );
}
