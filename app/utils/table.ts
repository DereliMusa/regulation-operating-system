/** Column definition consumed by the DataTable component. */
export interface DataTableColumn {
  /** Property key on each row; supports dot paths (e.g. 'device.name'). */
  key: string
  /** Uppercase caption shown in the header. */
  label: string
  align?: 'left' | 'right' | 'center'
  /** Render the default cell value in Geist Mono + primary (IDs, refs). */
  mono?: boolean
  /** Optional fixed-width utility class (e.g. 'w-32'). */
  width?: string
}

/**
 * Read a (possibly nested) cell value from a row by column key.
 * @param row - the row record
 * @param key - property key, dot-separated for nested access
 * @returns the resolved value, or undefined when any segment is missing
 */
export function resolveCellValue(row: object, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc !== null && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, row)
}
