/**
 * Helper function to control useEffect/useLayoutEffect usage in the app
 */

import { useLayoutEffect, useEffect } from 'react'

/**
 * Yojana is a Server-Side Rendered application.
 * However, useLayoutEffect cannot be used when rendering server-side, even though
 * it is crucial for running any effect hooks that need to be synchronously run.
 *
 * To circumvent this while providing the benefits of useLayoutEffect,
 * use useEffect when rendering server-side, and useLayoutEffect when rendering client-side.
 *
 * Note: this hook should only be used in cases where the initial render can be asynchronous.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
