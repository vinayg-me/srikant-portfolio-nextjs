import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sanity Studio - Srikant Portfolio',
  description: 'Manage Srikant Krishna website content',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
