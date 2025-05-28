// (protected)/layout.tsx
'use client';

import React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleProvider } from '@ant-design/cssinjs';
import { createCache, extractStyle } from '../../libs/antd-style-cache';
import MainLayout from '../../components/Layout';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cache] = React.useState(() => createCache());

  useServerInsertedHTML(() => {
    const styleText = extractStyle(cache, true);
    return <style id="antd" dangerouslySetInnerHTML={{ __html: styleText }} />;
  });

  return (
    <StyleProvider cache={cache}>
      <MainLayout>{children}</MainLayout>
    </StyleProvider>
  );
}
