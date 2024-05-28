import { Box, Button, Grid, TextContent } from '@cloudscape-design/components';
import { useNavigate, useRouteError } from 'react-router-dom';
import { RT_HOME } from '../lib/routes';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
    <TextContent>
      <br />
      <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
        <div />
        <Box>
          <h1>Oops!</h1>
          <br />
          <p>Sorry, an unexpected error has occured.</p>
          <br />
          <em>Not Found</em>
        </Box>
        <Button onClick={() => navigate(RT_HOME)}>Go back to home</Button>
      </Grid>
    </TextContent>
  );
}
