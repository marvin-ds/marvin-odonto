import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'odontocont-template-para-e7np747o',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_08jRWkfnjJp8LfEktRPaTJWEqJQqdBPE',
  authRequired: false,
  auth: { mode: 'managed' },
})
