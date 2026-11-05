import React, { useId, useMemo } from 'react';

// Exact SVG exports from Figma PC端 / 工作台1. These are reviewed local assets,
// never user-provided markup. See the adjacent provenance.json for node IDs.
const vectors = import.meta.glob<string>('../assets/workbench-vectors/*.svg', {
  query: '?raw', import: 'default', eager: true,
});
const vectorAliases: Record<string, string> = { 'custom-data': 'legal', 'custom-service': 'audit' };
const sourceFor = (name: string) => vectors[`../assets/workbench-vectors/${vectorAliases[name] || name}.svg`];
export const hasWorkbenchVector = (name: string) => Boolean(sourceFor(name));

export function WorkbenchVectorIcon({ name, className = '' }: { name: string; className?: string }) {
  const instance = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const source = sourceFor(name);
  const markup = useMemo(() => {
    // Repeated icons in the dashboard and management dialog must not share
    // gradient, mask or clip IDs. Geometry and paint values remain unchanged.
    const prefix = `wb-${instance}-`;
    return (source || '')
      .replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`)
      .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}${id})`)
      .replace(/((?:xlink:)?href=")#([^"]+)"/g, (_, attr, id) => `${attr}#${prefix}${id}"`);
  }, [source, instance]);
  if (!source) return null;
  return <span className={`wb-vector-icon ${className}`} data-vector-icon={name} aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />;
}
