import { colors, fonts } from '../../theme';
import { Sans } from './parts';

export type Item =
  | { type: 'p'; node: React.ReactNode }
  | { type: 'h'; text: string }
  | { type: 'b'; code: string; desc: string; indent?: boolean };

const code = (text: string): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontSize: 13.5,
  color: colors.fg,
});

const b = (codeText: string, desc: string, indent = false): Item => ({
  type: 'b',
  code: codeText,
  desc,
  indent,
});

export const EXPLANATION: Item[] = [
  {
    type: 'p',
    node: (
      <>
        This is a{' '}
        <strong style={{ color: colors.fg }}>React + TypeScript + Vite</strong>{' '}
        project called “acme”. Here&apos;s what each part does:
      </>
    ),
  },
  { type: 'h', text: 'Root Configuration Files:' },
  b('package.json', 'Project dependencies and scripts'),
  b('tsconfig.json', 'TypeScript compiler settings'),
  b('vite.config.ts', 'Vite bundler configuration'),
  b('.env.example', 'Template for environment variables'),
  b('.gitignore', 'Git exclusion rules'),
  { type: 'h', text: 'Source Code (src/):' },
  b('main.tsx', 'Entry point (renders the app)'),
  b('App.tsx', 'Main application component'),
  b('components/', 'Reusable UI components'),
  b('Button.tsx', 'Button component', true),
  b('Dashboard.tsx', 'Dashboard component', true),
  b('lib/', 'Utility functions'),
  b('api.ts', 'API client/calls', true),
  b('format.ts', 'Formatting utilities', true),
  b('styles/globals.css', 'Global CSS'),
  { type: 'h', text: 'Public Assets (public/):' },
  b('favicon.svg', 'Browser tab icon'),
  { type: 'h', text: 'Testing & CI/CD:' },
  b('tests/api.test.ts', 'Unit tests for API utilities'),
  b('.github/workflows/ci.yml', 'GitHub Actions pipeline'),
  { type: 'h', text: 'Documentation:' },
  b('README.md', 'Project overview and instructions'),
  {
    type: 'p',
    node: (
      <>
        <strong style={{ color: colors.fg }}>Summary:</strong> A modern
        front-end project with a clean structure separating components,
        utilities, styles, and tests.
      </>
    ),
  },
];

/** Fixed block height (incl. spacing) used by the deterministic streamer. */
export const explItemHeight = (item: Item): number => {
  if (item.type === 'h') {
    return 40;
  }
  if (item.type === 'p') {
    return 58;
  }
  return 26;
};

/** Renders a single explanation item, top-aligned inside its fixed block. */
export const ExplItem: React.FC<{ item: Item }> = ({ item }) => {
  if (item.type === 'h') {
    return (
      <div style={{ paddingTop: 13 }}>
        <Sans style={{ fontSize: 15, fontWeight: 700, color: colors.fg }}>
          {item.text}
        </Sans>
      </div>
    );
  }
  if (item.type === 'p') {
    return (
      <Sans style={{ fontSize: 14.5, lineHeight: 1.55, color: colors.fgDim }}>
        {item.node}
      </Sans>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 7, paddingLeft: item.indent ? 18 : 0 }}>
      <Sans style={{ fontSize: 14.5, color: colors.muted }}>-</Sans>
      <Sans style={{ fontSize: 14.5, lineHeight: 1.5 }}>
        <span style={code(item.code)}>{item.code}</span>
        <span style={{ color: colors.muted }}>{' — '}</span>
        <span style={{ color: colors.fgDim }}>{item.desc}</span>
      </Sans>
    </div>
  );
};
