import { SideNavigation } from '@cloudscape-design/components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SideNav() {
  const navigate = useNavigate();
  const [activeHref, setActiveHref] = useState('/');

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
