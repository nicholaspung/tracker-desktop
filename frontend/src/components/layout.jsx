import ContentLayout from '@cloudscape-design/components/content-layout';

export default function Layout({ contentHeader, children }) {
  return (
    <ContentLayout header={contentHeader && contentHeader}>
      {children}
    </ContentLayout>
  );
}
