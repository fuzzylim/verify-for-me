import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Menu from '@/components/Menu';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Stop, Check ... Reject?',
	description: 'Real organisations won’t put you under pressure to act instantly.',
	openGraph: {
		title: 'Stop, Check ... Reject?',
		description: 'Real organisations won’t put you under pressure to act instantly.',
		url: 'https://verifyfor.me/',
		images: [
			{
				url: 'https://verifyfor.me/shadow_figure.png',
				width: 1024,
				height: 1024,
			},
		],
		locale: 'en_AU',
		type: 'website',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Menu />
				<section>{children}</section>
				<Analytics />
			</body>
		</html>
	);
}
