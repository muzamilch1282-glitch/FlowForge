export const siteConfig = {
  name: 'FlowForge',
  description: 'Modern SaaS Project Management Dashboard — streamline workflows, manage tasks, and boost team productivity.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og.png',
  links: {
    github: 'https://github.com/flowforge',
    docs: '/docs',
  },
  creator: 'FlowForge Team',
} as const;

export type SiteConfig = typeof siteConfig;
