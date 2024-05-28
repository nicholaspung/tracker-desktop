import { Button, Container, Header } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/layout';
import { RT_APPLICATIONS } from '../lib/routes';

export default function HomePage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <Layout
      contentHeader={
        <Header
          variant="h1"
          description="Take control of your app by easily enabling and disabling apps. Customize your dashboard with widgets that matter to you."
          actions={
            <Button variant="primary" onClick={() => navigate(RT_APPLICATIONS)}>
              Customize
            </Button>
          }
        >
          Welcome to App Manager
        </Header>
      }
    >
      <Container
        header={
          <Header
            variant="h3"
            actions={
              <Button
                variant="icon"
                iconName={expanded ? 'angle-up' : 'angle-down'}
                onClick={() => setExpanded((prev) => !prev)}
              />
            }
          >
            Here&apos;s your daily metrics for the day
          </Header>
        }
      >
        {expanded && (
          <>
            <p>daily metric 1</p>
            <p>daily metric 2</p>
            <p>daily metric 3</p>
            <p>daily metric 4</p>
          </>
        )}
      </Container>
    </Layout>
  );
}
