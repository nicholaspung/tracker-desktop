import CollectionPreferences from '@cloudscape-design/components/collection-preferences';

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 Apps' },
  { value: 30, label: '30 Apps' },
  { value: 50, label: '50 Apps' },
];

const CONTENT_DISPLAY_OPTIONS = [
  { id: 'id', label: 'Distribution ID', alwaysVisible: true },
  { id: 'state', label: 'State' },
  { id: 'domainName', label: 'Domain name' },
  { id: 'deliveryMethod', label: 'Delivery method' },
  { id: 'sslCertificate', label: 'SSL certificate' },
  { id: 'priceClass', label: 'Price class' },
  { id: 'logging', label: 'Logging' },
  { id: 'origin', label: 'Origin' },
  { id: 'actions', label: 'Actions' },
];

const STICKY_COLUMNS_OPTIONS = {
  firstColumns: {
    title: 'Stick first column(s)',
    description:
      'Keep the first column(s) visible while horizontally scrolling the table content.',
    options: [
      { label: 'None', value: 0 },
      { label: 'First column', value: 1 },
      { label: 'First two columns', value: 2 },
    ],
  },
  lastColumns: {
    title: 'Stick last column',
    description:
      'Keep the last column visible while horizontally scrolling the table content.',
    options: [
      { label: 'None', value: 0 },
      { label: 'Last column', value: 1 },
    ],
  },
};

export default function Preferences({
  preferences,
  setPreferences,
  disabled = false,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  contentDisplayOptions = CONTENT_DISPLAY_OPTIONS,
  stickyColumnsOptions = STICKY_COLUMNS_OPTIONS,
  disableStickyColumns = true,
  visibleContentPreference,
  useVisibleContentPreference = false,
  useWrapLinesPreference = false,
  useStripedRowsPreference = false,
  useContentDensityPreference = false,
}) {
  return (
    <CollectionPreferences
      disabled={disabled}
      preferences={preferences}
      onConfirm={({ detail }) => setPreferences(detail)}
      pageSizePreference={{ options: pageSizeOptions }}
      wrapLinesPreference={useWrapLinesPreference ? {} : undefined}
      stripedRowsPreference={useStripedRowsPreference ? {} : undefined}
      contentDensityPreference={useContentDensityPreference ? {} : undefined}
      contentDisplayPreference={
        !useVisibleContentPreference
          ? { options: contentDisplayOptions }
          : undefined
      }
      stickyColumnsPreference={
        !disableStickyColumns ? stickyColumnsOptions : undefined
      }
      visibleContentPreference={
        useVisibleContentPreference ? visibleContentPreference : undefined
      }
    />
  );
}
