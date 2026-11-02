import type { Metadata } from 'next';
import './globals.css';
import { SpinnerProvider } from '@/components/Spinner';

export const metadata: Metadata = {
  title: 'TraKKerAppt',
  description: 'Appointment tracking system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/images/fav-doctor.png"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
        <SpinnerProvider>{children}</SpinnerProvider>
      </body>
    </html>
  );
}
