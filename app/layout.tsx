import './globals.css'
import '../public/favicon.ico'
export const metadata = {
  description: 'Sri Vaishnav\'s portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>whyshnav?</title>
        <link rel='icon' href='favicon.ico' />
      </head>
      <body>{children}</body>
    </html>
  )
}
