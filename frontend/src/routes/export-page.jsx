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
  RadioGroup,
} from '@cloudscape-design/components';
import { COLLECTION_NAMES } from '../lib/collections';
import { 
  exportCollectionToCSV, 
  exportCollectionToZip,
  hasFieldConfig, 
  hasFileFields,
  getFieldConfig 
} from '../utils/fieldAwareExport';

const COLLECTION_OPTIONS = Object.entries(COLLECTION_NAMES).map(([key, value]) => {
  const label = key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  const hasConfig = hasFieldConfig(value);
  const hasFiles = hasFileFields(value);
  
  let displayLabel = label;
  let description = 'Basic raw data export';
  
  if (hasConfig) {
    displayLabel = `${label} ✓`;
    description = 'Uses field configuration for enhanced export';
  }
  
  if (hasFiles) {
    displayLabel = `${displayLabel} 📁`;
    description = `${description} • Contains files - supports ZIP export`;
  }
  
  return {
    label: displayLabel,
    value,
    description,
    hasFiles,
  };
});

export default function ExportPage() {
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [alert, setAlert] = useState(null);
  const [exportFormat, setExportFormat] = useState('auto'); // auto, csv, zip


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
      let successfulExports = 0;
      let zipExports = 0;
      
      for (let i = 0; i < selectedCollections.length; i++) {
        const collection = selectedCollections[i];
        setExportStatus(`Exporting ${collection.label}...`);
        
        const shouldUseZip = exportFormat === 'zip' || 
          (exportFormat === 'auto' && collection.hasFiles);
        
        const baseFilename = `${collection.value}_export_${new Date().toISOString().split('T')[0]}`;
        
        if (shouldUseZip && collection.hasFiles) {
          const result = await exportCollectionToZip(collection.value, `${baseFilename}.csv`);
          if (result.success) {
            successfulExports++;
            zipExports++;
          }
        } else {
          await exportCollectionToCSV(collection.value, `${baseFilename}.csv`);
          successfulExports++;
        }
        
        setExportProgress(((i + 1) / selectedCollections.length) * 100);
      }

      const zipMessage = zipExports > 0 ? ` (${zipExports} as ZIP with files)` : '';
      setAlert({
        type: 'success',
        content: `Successfully exported ${successfulExports} collection(s)${zipMessage}.`,
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

        <Box>
          <SpaceBetween direction="vertical" size="m">
            <Header variant="h3">Export Format</Header>
            <RadioGroup
              value={exportFormat}
              onChange={({ detail }) => setExportFormat(detail.value)}
              items={[
                {
                  value: 'auto',
                  label: 'Auto (ZIP for collections with files, CSV otherwise)',
                  description: 'Automatically chooses the best format for each collection'
                },
                {
                  value: 'csv',
                  label: 'CSV Only',
                  description: 'Export all collections as CSV files (files will be listed by name only)'
                },
                {
                  value: 'zip',
                  label: 'ZIP When Possible',
                  description: 'Create ZIP files for collections with file fields, CSV for others'
                }
              ]}
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
            <div>• Each collection will be exported as a separate file</div>
            <div>• Files will be downloaded to your default downloads folder</div>
            <div>• File names include the collection name and current date</div>
            <div>• Collections marked with ✓ use field configurations for enhanced formatting:</div>
            <div>&nbsp;&nbsp;- Dates formatted as readable text</div>
            <div>&nbsp;&nbsp;- Currency values formatted with $ symbol</div>
            <div>&nbsp;&nbsp;- Related data expanded to show names instead of IDs</div>
            <div>&nbsp;&nbsp;- Human-readable column headers</div>
            <div>• Collections marked with 📁 contain file attachments:</div>
            <div>&nbsp;&nbsp;- ZIP export includes all files organized by field name</div>
            <div>&nbsp;&nbsp;- CSV export only lists file names</div>
            <div>&nbsp;&nbsp;- ZIP includes a README.txt with export summary</div>
            <div>• Collections marked "(basic)" export raw database values</div>
            <div>• Empty collections will still generate files (with headers only)</div>
          </SpaceBetween>
        </Alert>
      </SpaceBetween>
    </Container>
  );
}