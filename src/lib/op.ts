import { OpenPanel } from '@openpanel/web'

// Single OpenPanel instance for the app. The SDK no-ops during SSR/prerender
// (it guards every browser call on `typeof document`), and on the client it
// auto-tracks page views (History API → TanStack Router), outgoing links, and
// any element tagged with `data-track`.
//
// The client ID is public by design; the OpenPanel secret stays server-only.
export const op = new OpenPanel({
  clientId: import.meta.env.VITE_OPENPANEL_CLIENT_ID as string,
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
})
