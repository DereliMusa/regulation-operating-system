/**
 * Keep only defined (non-`undefined`) fields of a patch object, so a PATCH
 * updates exactly what the client sent and leaves everything else untouched.
 * `null` is preserved (an explicit "clear this field").
 */
export function definedFields<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}
