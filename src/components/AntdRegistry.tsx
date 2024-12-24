'use client';

import { StyleProvider } from '@ant-design/cssinjs';
import { ReactNode } from 'react';

export default function AntdRegistry({ children }: { children: ReactNode }) {
    return <StyleProvider hashPriority="high">{children}</StyleProvider>;
} 