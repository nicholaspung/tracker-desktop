import Papa from 'papaparse';
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