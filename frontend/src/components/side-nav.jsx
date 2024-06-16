import { SideNavigation } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

export default function SideNav({ activeHref, setActiveHref }) {
  const navigate = useNavigate();

  return (
    <SideNavigation
      activeHref={activeHref}
      header={{
        href: '/applications',
        text: 'Applications',
      }}
      items={[{ type: 'link', text: 'Wealth', href: '/wealth' }]}
      onFollow={(e) => {
        e.preventDefault();
        setActiveHref(e.detail.href);
        navigate(e.detail.href);
      }}
    />
  );
}
