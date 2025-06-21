import Papa from 'papaparse';
import JSZip from 'jszip';
import { transformer } from './data';
import { POCKETBASE_URL } from '../lib/api';
import { TABLE_DISPLAY_TYPES } from '../lib/display';

// Import all field configurations
import { CONFIG_APPLICATIONS } from '../lib/config/applications';
import { 
  CONFIG_HEALTH_WEIGHT_LOGS, 
  CONFIG_MEASUREMENT_TYPE, 
  CONFIG_HEALTH_FILES 
} from '../lib/config/bodyComposition';
import { 
  CONFIG_FINANCES_BALANCE, 
  CONFIG_FINANCES_BALANCE_ACCOUNT_NAME, 
  CONFIG_FINANCES_BALANCE_OWNER, 
  CONFIG_FINANCES_BALANCE_TYPE 
} from '../lib/config/financeBalances';
import { 
  CONFIG_FINANCES_LOG, 
  CONFIG_FINANCES_CATEGORY, 
  CONFIG_FINANCES_TAG, 
  CONFIG_FINANCES_FILES 
} from '../lib/config/financeLogs';
import { 
  CONFIG_INVENTORY_ENTRY, 
  CONFIG_INVENTORY_ITEM, 
  CONFIG_INVENTORY_CATEGORY, 
  CONFIG_INVENTORY_UNIT, 
  CONFIG_INVENTORY_LOCATION 
} from '../lib/config/inventoryManagement';
import { CONFIG_HABITS, CONFIG_DAILIES } from '../lib/config/habits';
import { COLLECTION_NAMES } from '../lib/collections';

// Mapping of collection names to their field configurations
const COLLECTION_CONFIG_MAP = {
  [COLLECTION_NAMES.APPLICATIONS]: CONFIG_APPLICATIONS,
  [COLLECTION_NAMES.HEALTH_WEIGHT_LOGS]: CONFIG_HEALTH_WEIGHT_LOGS,
  [COLLECTION_NAMES.HEALTH_MEASUREMENT_TYPE]: CONFIG_MEASUREMENT_TYPE,
  [COLLECTION_NAMES.HEALTH_FILES]: CONFIG_HEALTH_FILES,
  [COLLECTION_NAMES.FINANCES_BALANCE]: CONFIG_FINANCES_BALANCE,
  [COLLECTION_NAMES.FINANCES_BALANCE_ACCOUNT_NAME]: CONFIG_FINANCES_BALANCE_ACCOUNT_NAME,
  [COLLECTION_NAMES.FINANCES_BALANCE_OWNER]: CONFIG_FINANCES_BALANCE_OWNER,
  [COLLECTION_NAMES.FINANCES_BALANCE_TYPE]: CONFIG_FINANCES_BALANCE_TYPE,
  [COLLECTION_NAMES.FINANCES_LOG]: CONFIG_FINANCES_LOG,
  [COLLECTION_NAMES.FINANCES_CATEGORY]: CONFIG_FINANCES_CATEGORY,
  [COLLECTION_NAMES.FINANCES_TAG]: CONFIG_FINANCES_TAG,
  [COLLECTION_NAMES.FINANCES_FILES]: CONFIG_FINANCES_FILES,
  [COLLECTION_NAMES.INVENTORY_ENTRY]: CONFIG_INVENTORY_ENTRY,
  [COLLECTION_NAMES.INVENTORY_ITEM]: CONFIG_INVENTORY_ITEM,
  [COLLECTION_NAMES.INVENTORY_CATEGORY]: CONFIG_INVENTORY_CATEGORY,
  [COLLECTION_NAMES.INVENTORY_UNIT]: CONFIG_INVENTORY_UNIT,
  [COLLECTION_NAMES.INVENTORY_LOCATION]: CONFIG_INVENTORY_LOCATION,
  [COLLECTION_NAMES.HABITS]: CONFIG_HABITS,
  [COLLECTION_NAMES.DAILIES]: CONFIG_DAILIES,
};

/**
 * Fetch collection data with proper field expansion for related data
 */
export const fetchFieldAwareCollectionData = async (collectionName) => {
  try {
    const config = COLLECTION_CONFIG_MAP[collectionName];
    
    if (!config) {
      // Fallback to basic fetch if no config found
      const response = await fetch(`${POCKETBASE_URL}/api/collections/${collectionName}/records`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${collectionName}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.items || [];
    }

    // Build expand fields from config
    const expandFields = config.columns
      ?.filter(col => col.expandFields)
      ?.map(col => col.expandFields);

    // Construct API URL with expand parameters
    const url = new URL(`${POCKETBASE_URL}/api/collections/${collectionName}/records`);
    if (expandFields && expandFields.length > 0) {
      url.searchParams.set('expand', expandFields.join(','));
    }

    const response = await fetch(url.toString());
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

/**
 * Transform raw data using field configurations
 */
export const transformDataForExport = (rawData, collectionName) => {
  const config = COLLECTION_CONFIG_MAP[collectionName];
  
  if (!config || !config.columns) {
    // Return raw data if no config found
    return rawData;
  }

  // Transform each record using the existing transformer
  return rawData.map(record => transformer(record, config));
};

/**
 * Format field values for human-readable export
 */
export const formatFieldForExport = (value, fieldConfig) => {
  if (value === null || value === undefined) {
    return '';
  }

  switch (fieldConfig.type) {
    case TABLE_DISPLAY_TYPES.DATE:
      return new Date(value).toLocaleDateString();
    
    case TABLE_DISPLAY_TYPES.DOLLAR:
      return `$${Number(value).toFixed(2)}`;
    
    case TABLE_DISPLAY_TYPES.PERCENTAGE:
      return `${Number(value).toFixed(2)}%`;
    
    case TABLE_DISPLAY_TYPES.BOOL:
    case TABLE_DISPLAY_TYPES.CHECKBOX:
      return value ? 'Yes' : 'No';
    
    case TABLE_DISPLAY_TYPES.BADGE:
      // For badges, handle arrays (multiple values)
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);
    
    case TABLE_DISPLAY_TYPES.FILE:
      // For files, just return the file names
      if (Array.isArray(value)) {
        return value.map(file => file.name || file).join(', ');
      }
      return value.name || String(value);
    
    case TABLE_DISPLAY_TYPES.NUMBER:
      return Number(value).toString();
    
    case TABLE_DISPLAY_TYPES.ID:
      return String(value);
    
    case TABLE_DISPLAY_TYPES.TEXT:
    case TABLE_DISPLAY_TYPES.AUTOSUGGEST:
    default:
      return String(value);
  }
};

/**
 * Create human-readable column headers from field configurations
 */
export const createExportHeaders = (config) => {
  if (!config || !config.columns) {
    return [];
  }

  return config.columns.map(column => {
    // Convert field ID to human-readable header
    return column.id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });
};

/**
 * Transform data for CSV export with proper formatting
 */
export const formatDataForCSV = (transformedData, config) => {
  if (!config || !config.columns || !transformedData || transformedData.length === 0) {
    return transformedData;
  }

  return transformedData.map(record => {
    const formattedRecord = {};
    
    config.columns.forEach(column => {
      const value = record[column.id];
      const header = column.id
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      formattedRecord[header] = formatFieldForExport(value, column);
    });

    return formattedRecord;
  });
};

/**
 * Export collection data to CSV with field configuration support
 */
export const exportCollectionToCSV = async (collectionName, filename) => {
  try {
    // Fetch data with proper field expansion
    const rawData = await fetchFieldAwareCollectionData(collectionName);
    
    if (rawData.length === 0) {
      console.warn(`Collection ${collectionName} is empty`);
      // Still create CSV with headers
      const config = COLLECTION_CONFIG_MAP[collectionName];
      const headers = createExportHeaders(config);
      const emptyData = [Object.fromEntries(headers.map(h => [h, '']))];
      const csv = Papa.unparse(emptyData);
      downloadCSV(csv, filename);
      return;
    }

    // Transform data using field configurations
    const transformedData = transformDataForExport(rawData, collectionName);
    
    // Format data for CSV export
    const config = COLLECTION_CONFIG_MAP[collectionName];
    const formattedData = formatDataForCSV(transformedData, config);
    
    // Generate CSV
    const csv = Papa.unparse(formattedData);
    downloadCSV(csv, filename);
    
  } catch (error) {
    console.error(`Error exporting ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Check if a collection has field configuration
 */
export const hasFieldConfig = (collectionName) => {
  return COLLECTION_CONFIG_MAP[collectionName] !== undefined;
};

/**
 * Get field configuration for a collection
 */
export const getFieldConfig = (collectionName) => {
  return COLLECTION_CONFIG_MAP[collectionName];
};

/**
 * Check if a collection has file fields
 */
export const hasFileFields = (collectionName) => {
  const config = COLLECTION_CONFIG_MAP[collectionName];
  if (!config || !config.columns) return false;
  
  return config.columns.some(column => column.type === TABLE_DISPLAY_TYPES.FILE);
};

/**
 * Get file fields from a collection configuration
 */
export const getFileFields = (collectionName) => {
  const config = COLLECTION_CONFIG_MAP[collectionName];
  if (!config || !config.columns) return [];
  
  return config.columns.filter(column => column.type === TABLE_DISPLAY_TYPES.FILE);
};

/**
 * Download file from PocketBase URL
 */
const downloadFileAsBlob = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};

/**
 * Extract file information from record data
 */
const extractFileInfo = (record, fileFields) => {
  const files = [];
  
  fileFields.forEach(field => {
    const fieldValue = record[field.id];
    if (!fieldValue) return;
    
    // Handle both single files and arrays of files
    const fileList = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
    
    fileList.forEach(file => {
      if (typeof file === 'string' && file.trim()) {
        // Construct PocketBase file URL
        const fileUrl = `${POCKETBASE_URL}/api/files/${record.collectionName}/${record.id}/${file}`;
        files.push({
          filename: file,
          url: fileUrl,
          fieldId: field.id
        });
      }
    });
  });
  
  return files;
};

/**
 * Create and download a zip file containing CSV and all files
 */
export const exportCollectionToZip = async (collectionName, filename) => {
  try {
    // Fetch data with proper field expansion
    const rawData = await fetchFieldAwareCollectionData(collectionName);
    const config = COLLECTION_CONFIG_MAP[collectionName];
    const fileFields = getFileFields(collectionName);
    
    if (!fileFields.length) {
      throw new Error('Collection has no file fields - use CSV export instead');
    }
    
    // Create ZIP instance
    const zip = new JSZip();
    
    // Transform data for CSV
    const transformedData = transformDataForExport(rawData, collectionName);
    const formattedData = formatDataForCSV(transformedData, config);
    
    // Add CSV to zip
    const csv = Papa.unparse(formattedData);
    zip.file(`${collectionName}_data.csv`, csv);
    
    // Create files folder in zip
    const filesFolder = zip.folder('files');
    
    // Track file downloads and failures
    const downloadPromises = [];
    const fileMap = new Map(); // Track unique files to avoid duplicates
    
    // Extract all files from all records
    rawData.forEach((record) => {
      const recordFiles = extractFileInfo({ ...record, collectionName }, fileFields);
      
      recordFiles.forEach(fileInfo => {
        // Create unique filename to avoid conflicts
        const uniqueKey = `${fileInfo.fieldId}_${fileInfo.filename}`;
        if (!fileMap.has(uniqueKey)) {
          fileMap.set(uniqueKey, fileInfo);
          
          const downloadPromise = downloadFileAsBlob(fileInfo.url)
            .then(blob => {
              if (blob) {
                // Create subfolder for field type
                const fieldFolder = filesFolder.folder(fileInfo.fieldId);
                fieldFolder.file(fileInfo.filename, blob);
                return { success: true, filename: fileInfo.filename };
              }
              return { success: false, filename: fileInfo.filename, error: 'Failed to download' };
            })
            .catch(error => ({
              success: false,
              filename: fileInfo.filename,
              error: error.message
            }));
          
          downloadPromises.push(downloadPromise);
        }
      });
    });
    
    // Wait for all file downloads to complete
    const downloadResults = await Promise.all(downloadPromises);
    
    // Create a summary of download results
    const successCount = downloadResults.filter(r => r.success).length;
    const failureCount = downloadResults.filter(r => !r.success).length;
    const summary = `Export Summary:
- Collection: ${collectionName}
- Records exported: ${rawData.length}
- Files attempted: ${downloadResults.length}
- Files successfully downloaded: ${successCount}
- Files failed: ${failureCount}

${failureCount > 0 ? 'Failed files:\n' + downloadResults.filter(r => !r.success).map(r => `- ${r.filename}: ${r.error}`).join('\n') : 'All files downloaded successfully!'}

Files are organized in the 'files' folder by field name.
The CSV data is in the root as '${collectionName}_data.csv'.`;
    
    zip.file('README.txt', summary);
    
    // Generate and download zip
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, filename.replace('.csv', '.zip'));
    
    return { success: true, totalFiles: downloadResults.length, successCount, failureCount };
    
  } catch (error) {
    console.error(`Error creating zip export for ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Download blob file
 */
export const downloadBlob = (blob, filename) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};