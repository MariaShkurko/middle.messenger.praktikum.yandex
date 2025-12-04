import { resolve as importMetaResolve } from 'import-meta-resolve';

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('node:')) {
    return defaultResolve(specifier, context, defaultResolve);
  }

  if (specifier.startsWith('file://') || specifier.startsWith('/')) {
    return defaultResolve(specifier, context, defaultResolve);
  }

  if (specifier.startsWith('@')) {
    return defaultResolve(specifier, context, defaultResolve);
  }

  if (specifier.includes('node_modules')) {
    return defaultResolve(specifier, context, defaultResolve);
  }

  if (specifier.endsWith('.ts') || specifier.endsWith('.js')) {
    return defaultResolve(specifier, context, defaultResolve);
  }

  try {
    const resolved = await importMetaResolve(specifier, context.parentURL);

    if (resolved.includes('/src/') && !resolved.endsWith('.ts')) {
      const tsPath = resolved + '.ts';
      try {
        await importMetaResolve(tsPath, context.parentURL);
        return { url: tsPath, shortCircuit: true };
      } catch {
        return { url: resolved, shortCircuit: true };
      }
    }

    return { url: resolved, shortCircuit: true };
  } catch (err) {
    console.error('[RESOLVER ERROR]', specifier, '→', err.message);
    return defaultResolve(specifier, context, defaultResolve);
  }
}

export function getFormat() {
  return { format: 'module' };
}
