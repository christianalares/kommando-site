import { Braces, File, FileCode, FileText, Folder } from 'lucide-react';
import { colors, fonts } from '../../theme';
import { MONO_LH, MONO_SIZE } from './parts';

const permColor = (ch: string): string => {
  switch (ch) {
    case 'd':
      return colors.dir;
    case 'r':
      return colors.yellow;
    case 'w':
      return colors.red;
    case 'x':
      return colors.green;
    default:
      return colors.faint;
  }
};

const Perms: React.FC<{ value: string }> = ({ value }) => (
  <>
    {value.split('').map((ch, i) => (
      <span key={i} style={{ color: permColor(ch) }}>
        {ch}
      </span>
    ))}
  </>
);

type Kind = 'dir' | 'md' | 'json' | 'ts';
const ICONS: Record<Kind, { Comp: typeof File; color: string }> = {
  dir: { Comp: Folder, color: colors.dir },
  md: { Comp: FileText, color: colors.brandSoft },
  json: { Comp: Braces, color: colors.yellow },
  ts: { Comp: FileCode, color: colors.cyan },
};

export type LsEntry = {
  perms: string;
  size: string;
  date: string;
  name: string;
  kind: Kind;
};

// Sorted by size descending, mirroring `ls -lSh` in the screenshots.
export const LS_ENTRIES: LsEntry[] = [
  { perms: '.rw-r--r--', size: '744 B', date: 'Wed Jun 17 12:06:38 2026', name: 'README.md', kind: 'md' },
  { perms: '.rw-r--r--', size: '498 B', date: 'Wed Jun 17 12:06:40 2026', name: 'package.json', kind: 'json' },
  { perms: '.rw-r--r--', size: '320 B', date: 'Wed Jun 17 12:06:42 2026', name: 'tsconfig.json', kind: 'json' },
  { perms: 'drwxr-xr-x', size: '224 B', date: 'Wed Jun 17 12:07:45 2026', name: 'src', kind: 'dir' },
  { perms: '.rw-r--r--', size: '157 B', date: 'Wed Jun 17 12:06:49 2026', name: 'vite.config.ts', kind: 'ts' },
  { perms: 'drwxr-xr-x', size: '96 B', date: 'Wed Jun 17 12:07:13 2026', name: 'tests', kind: 'dir' },
  { perms: 'drwxr-xr-x', size: '96 B', date: 'Wed Jun 17 12:08:06 2026', name: 'public', kind: 'dir' },
];

export const LsRow: React.FC<{ entry: LsEntry }> = ({ entry }) => {
  const isDir = entry.kind === 'dir';
  const { Comp, color } = ICONS[entry.kind];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: fonts.mono,
        fontSize: MONO_SIZE,
        lineHeight: MONO_LH,
        whiteSpace: 'pre',
      }}
    >
      <Perms value={entry.perms} />
      <span style={{ color: colors.yellow }}>{' john'}</span>
      <span style={{ color: colors.faint }}>{' staff'}</span>
      <span style={{ color: colors.green }}>
        {'  ' + entry.size.padStart(5, ' ')}
      </span>
      <span style={{ color: colors.cyan }}>{'  ' + entry.date}</span>
      <span
        style={{
          display: 'inline-flex',
          width: 28,
          justifyContent: 'center',
        }}
      >
        <Comp size={17} color={color} strokeWidth={2} />
      </span>
      <span
        style={{
          color: isDir ? colors.dir : colors.fg,
          fontWeight: isDir ? 700 : 400,
        }}
      >
        {entry.name}
      </span>
    </div>
  );
};
