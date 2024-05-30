import CollectionPreferences from '@cloudscape-design/components/collection-preferences';

const getSanitizedPreferences = (pref, useVisibleContentPreference) => {
  const preferencesCopy = { ...pref };
  if (useVisibleContentPreference) {
    delete preferencesCopy.contentDisplay;
  } else {
    delete preferencesCopy.visibleContent;
  }
  return preferencesCopy;
};

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 resources' },
  { value: 30, label: '30 resources' },
  { value: 50, label: '50 resources' },
  { value: 100, label: '100 resources' },
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
  contentDisplayPreference,
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
      preferences={getSanitizedPreferences(
        preferences,
        useVisibleContentPreference,
      )}
      onConfirm={({ detail }) => setPreferences(detail)}
      pageSizePreference={{ options: pageSizeOptions }}
      wrapLinesPreference={useWrapLinesPreference ? {} : undefined}
      stripedRowsPreference={useStripedRowsPreference ? {} : undefined}
      contentDensityPreference={useContentDensityPreference ? {} : undefined}
      contentDisplayPreference={
        !useVisibleContentPreference ? contentDisplayPreference : undefined
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
