import { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Multiselect,
  Alert,
  Box,
  ProgressBar,
} from '@cloudscape-design/components';
import Papa from 'papaparse';
import { COLLECTION_NAMES } from '../lib/collections';
import { POCKETBASE_URL } from '../lib/api';

const COLLECTION_OPTIONS = Object.entries(COLLECTION_NAMES).map(([key, value]) => ({
  label: key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
  value,
}));

export default function ExportPage() {
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [alert, setAlert] = useState(null);

  const fetchCollectionData = async (collectionName) => {
    try {
      const response = await fetch(`${POCKETBASE_URL}/api/collections/${collectionName}/records`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${collectionName}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      throw error;
    }
  };

  const exportToCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    if (selectedCollections.length === 0) {
      setAlert({
        type: 'error',
        content: 'Please select at least one collection to export.',
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setAlert(null);

    try {
      for (let i = 0; i < selectedCollections.length; i++) {
        const collection = selectedCollections[i];
        setExportStatus(`Exporting ${collection.label}...`);
        
        const data = await fetchCollectionData(collection.value);
        
        if (data.length === 0) {
          console.warn(`Collection ${collection.value} is empty`);
        }
        
        const filename = `${collection.value}_export_${new Date().toISOString().split('T')[0]}.csv`;
        exportToCSV(data, filename);
        
        setExportProgress(((i + 1) / selectedCollections.length) * 100);
      }

      setAlert({
        type: 'success',
        content: `Successfully exported ${selectedCollections.length} collection(s) as CSV files.`,
      });
      setExportStatus('Export completed');
    } catch (error) {
      console.error('Export failed:', error);
      setAlert({
        type: 'error',
        content: `Export failed: ${error.message}`,
      });
      setExportStatus('Export failed');
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportProgress(0);
        setExportStatus('');
      }, 3000);
    }
  };

  const handleExportAll = async () => {
    setSelectedCollections(COLLECTION_OPTIONS);
    // Wait for state update, then trigger export
    setTimeout(() => {
      handleExport();
    }, 100);
  };

  return (
    <Container
      header={
        <Header
          variant="h1"
          description="Export your data collections as CSV files for backup or analysis"
        >
          Export Data
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {alert && (
          <Alert
            statusIconAriaLabel={alert.type}
            type={alert.type}
            onDismiss={() => setAlert(null)}
          >
            {alert.content}
          </Alert>
        )}

        <Box>
          <SpaceBetween direction="vertical" size="m">
            <Header variant="h3">Select Collections to Export</Header>
            <Multiselect
              selectedOptions={selectedCollections}
              onChange={({ detail }) => setSelectedCollections(detail.selectedOptions)}
              options={COLLECTION_OPTIONS}
              placeholder="Choose collections to export..."
              empty="No collections available"
              disabled={isExporting}
            />
          </SpaceBetween>
        </Box>

        <SpaceBetween direction="horizontal" size="s">
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
            disabled={selectedCollections.length === 0}
          >
            Export Selected
          </Button>
          <Button
            onClick={handleExportAll}
            loading={isExporting}
          >
            Export All Collections
          </Button>
        </SpaceBetween>

        {isExporting && (
          <Box>
            <SpaceBetween direction="vertical" size="s">
              <ProgressBar
                value={exportProgress}
                description={exportStatus}
                label="Export Progress"
              />
            </SpaceBetween>
          </Box>
        )}

        <Alert type="info">
          <SpaceBetween direction="vertical" size="xs">
            <div><strong>Export Information:</strong></div>
            <div>• Each collection will be exported as a separate CSV file</div>
            <div>• Files will be downloaded to your default downloads folder</div>
            <div>• File names include the collection name and current date</div>
            <div>• Empty collections will still generate CSV files (with headers only)</div>
          </SpaceBetween>
        </Alert>
      </SpaceBetween>
    </Container>
  );
}