import {
  Atom,
  Braces,
  File,
  FileCode,
  FileCog,
  FileText,
  Folder,
  Hash,
  Image as ImageIcon,
} from 'lucide-react';
import { colors, fonts } from '../../theme';
import { BlockCursor } from '../BlockCursor';

export const MONO_SIZE = 21;
export const MONO_LH = 1.52;

export const Mono: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: MONO_SIZE,
      lineHeight: MONO_LH,
      whiteSpace: 'pre',
      ...style,
    }}
  >
    {children}
  </span>
);

/** A shell prompt line: `kommando-demo/aurora ›  <command>`  ... `[main ●]` */
export const PromptLine: React.FC<{
  path?: string;
  command?: React.ReactNode;
  cursor?: boolean;
  branch?: string;
  dirty?: boolean;
  showBranch?: boolean;
}> = ({
  path = '~/dev/acme',
  command,
  cursor = false,
  branch = 'main',
  dirty = true,
  showBranch = true,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', minWidth: 0 }}>
        {path !== '' ? (
          <>
            <Mono style={{ color: colors.promptPath, fontWeight: 500 }}>
              {path}
            </Mono>
            <Mono style={{ color: colors.promptChevron, fontWeight: 700 }}>
              {' \u203a '}
            </Mono>
          </>
        ) : null}
        <Mono style={{ color: colors.fg }}>{command}</Mono>
        {cursor ? <BlockCursor /> : null}
      </div>
      {showBranch ? (
        <Mono style={{ color: colors.branch }}>
          {'['}
          {branch}
          {' '}
          <span style={{ color: dirty ? colors.dirtyDot : colors.cleanDot }}>
            {'\u25cf'}
          </span>
          {']'}
        </Mono>
      ) : null}
    </div>
  );
};

type Kind =
  | 'dir'
  | 'tsx'
  | 'ts'
  | 'json'
  | 'md'
  | 'svg'
  | 'css'
  | 'yaml'
  | 'env'
  | 'file';

const ICONS: Record<Kind, { Comp: typeof File; color: string }> = {
  dir: { Comp: Folder, color: colors.dir },
  tsx: { Comp: Atom, color: colors.cyan },
  ts: { Comp: FileCode, color: colors.cyan },
  json: { Comp: Braces, color: colors.yellow },
  md: { Comp: FileText, color: colors.brandSoft },
  svg: { Comp: ImageIcon, color: colors.purple },
  css: { Comp: Hash, color: colors.brandSoft },
  yaml: { Comp: File, color: colors.green },
  env: { Comp: FileCog, color: colors.yellow },
  file: { Comp: File, color: colors.fgDim },
};

export type TreeLine = { prefix: string; kind: Kind; name: string };

export const TREE: TreeLine[] = [
  { prefix: '', kind: 'dir', name: '.' },
  { prefix: '├── ', kind: 'env', name: '.env.example' },
  { prefix: '├── ', kind: 'dir', name: '.github' },
  { prefix: '│   └── ', kind: 'dir', name: 'workflows' },
  { prefix: '│       └── ', kind: 'yaml', name: 'ci.yml' },
  { prefix: '├── ', kind: 'file', name: '.gitignore' },
  { prefix: '├── ', kind: 'json', name: 'package.json' },
  { prefix: '├── ', kind: 'dir', name: 'public' },
  { prefix: '│   └── ', kind: 'svg', name: 'favicon.svg' },
  { prefix: '├── ', kind: 'md', name: 'README.md' },
  { prefix: '├── ', kind: 'dir', name: 'src' },
  { prefix: '│   ├── ', kind: 'tsx', name: 'App.tsx' },
  { prefix: '│   ├── ', kind: 'dir', name: 'components' },
  { prefix: '│   │   ├── ', kind: 'tsx', name: 'Button.tsx' },
  { prefix: '│   │   └── ', kind: 'tsx', name: 'Dashboard.tsx' },
  { prefix: '│   ├── ', kind: 'dir', name: 'lib' },
  { prefix: '│   │   ├── ', kind: 'ts', name: 'api.ts' },
  { prefix: '│   │   └── ', kind: 'ts', name: 'format.ts' },
  { prefix: '│   ├── ', kind: 'tsx', name: 'main.tsx' },
  { prefix: '│   └── ', kind: 'dir', name: 'styles' },
  { prefix: '│       └── ', kind: 'css', name: 'globals.css' },
  { prefix: '├── ', kind: 'dir', name: 'tests' },
  { prefix: '│   └── ', kind: 'ts', name: 'api.test.ts' },
  { prefix: '├── ', kind: 'json', name: 'tsconfig.json' },
  { prefix: '└── ', kind: 'ts', name: 'vite.config.ts' },
];

export const FileTreeRow: React.FC<{ line: TreeLine }> = ({ line }) => {
  const isRoot = line.name === '.';
  const { Comp, color } = ICONS[line.kind];
  const isDir = line.kind === 'dir' && !isRoot;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Mono style={{ color: colors.treeLine }}>{line.prefix}</Mono>
      {isRoot ? (
        <Mono style={{ color: colors.faint }}>.</Mono>
      ) : (
        <>
          <span
            style={{
              display: 'inline-flex',
              width: 24,
              justifyContent: 'center',
            }}
          >
            <Comp size={17} color={color} strokeWidth={2} />
          </span>
          <Mono
            style={{
              color: isDir ? colors.dir : colors.fg,
              fontWeight: isDir ? 700 : 400,
            }}
          >
            {line.name}
          </Mono>
        </>
      )}
    </div>
  );
};
