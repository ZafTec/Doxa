import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only after the component has mounted on the client. Anything
 * derived from a persisted (localStorage) Zustand store is unknowable
 * during SSR - rendering it on the first client pass too would diverge
 * from the server-rendered HTML and trigger a hydration mismatch. Gate
 * that rendering behind this instead of the store's own state.
 *
 * useSyncExternalStore (not a plain effect + setState) because it has a
 * dedicated server/client snapshot split built in - exactly this case.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
