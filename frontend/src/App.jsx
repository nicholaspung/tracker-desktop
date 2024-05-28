import { AppLayout, HelpPanel } from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import TopNav from './components/top-nav';
import SideNav from './components/side-nav';

const LOCALE = 'en';

export default function App() {
  const [navState, setNavState] = useState(false);
  const [toolState, setToolState] = useState(false);

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <TopNav />
      <AppLayout
        navigationOpen={navState}
        navigation={<SideNav />}
        onNavigationChange={({ detail }) => setNavState(detail.open)}
        toolsOpen={toolState}
        tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        onToolsChange={({ detail }) => setToolState(detail.open)}
        content={<Outlet />}
      />
    </I18nProvider>
  );
}
