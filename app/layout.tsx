import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '政策シミュレーションAI | 実証ミクロ経済学の民主化',
  description: '政策とその社会への影響効果を検証・提示するAIサービス。複雑な経済分析を直感的に理解できる先進的なプラットフォーム。',
  keywords: '政策分析, 経済シミュレーション, ミクロ経済学, 税制改革, 社会保障',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}