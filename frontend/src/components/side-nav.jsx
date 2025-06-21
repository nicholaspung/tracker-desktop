import { SideNavigation } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import {
  RT_APPLICATIONS,
  RT_EXPORT,
  RT_HEALTH,
  RT_INVENTORY_MANAGEMENT,
  RT_TASKS,
  RT_WEALTH,
} from '../lib/routes';

export default function SideNav({ activeHref, setActiveHref }) {
  const navigate = useNavigate();

  return (
    <SideNavigation
      activeHref={activeHref}
      header={{
        href: RT_APPLICATIONS,
        text: 'Applications',
      }}
      items={[
        { type: 'link', text: 'Wealth', href: RT_WEALTH },
        { type: 'link', text: 'Health', href: RT_HEALTH },
        { type: 'link', text: 'Tasks', href: RT_TASKS },
        {
          type: 'link',
          text: 'Inventory management',
          href: RT_INVENTORY_MANAGEMENT,
        },
        { type: 'link', text: 'Export Data', href: RT_EXPORT },
      ]}
      onFollow={(e) => {
        e.preventDefault();
        setActiveHref(e.detail.href);
        navigate(e.detail.href);
      }}
    />
  );
}
