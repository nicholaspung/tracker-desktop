import { Toggle, TopNavigation } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import { RT_HOME } from '../lib/routes';
import wailsLogo from '../assets/images/logo-universal.png';
import useTheme from '../hooks/useTheme';

export default function TopNav({ setActiveHref }) {
  const navigate = useNavigate();
  const { toggleDensity, toggleMode, mode, density } = useTheme();

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
        onFollow: async (e) => {
          e.preventDefault();
          await setActiveHref('/');
          navigate(RT_HOME);
        },
      }}
      utilities={[
        {
          type: 'button',
          ariaLabel: 'Visual mode',
          text: (
            <Toggle checked={mode} onChange={() => toggleMode()}>
              {mode ? 'Light mode' : 'Dark mode'}
            </Toggle>
          ),
        },
        {
          type: 'button',
          ariaLabel: 'Spacing mode',
          text: (
            <Toggle checked={density} onChange={() => toggleDensity()}>
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
