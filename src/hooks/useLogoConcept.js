import { useState, useEffect } from 'react';

const STORAGE_KEY = '5ampere-active-logo';
const DEFAULT_CONCEPT = 'concept-1';

/**
 * useLogoConcept — React hook for live switching between 3 logo concepts.
 *
 * Allows the user to compare and choose between:
 *   - 'concept-1': Toroidal Current Transformer (Precision CT Loop)
 *   - 'concept-2': Geometric "5A" Monogram (Architectural Circuit)
 *   - 'concept-3': Sinusoidal Current Shunt (Energy Pulse Vector)
 *
 * Synchronizes across components via CustomEvent and persists in localStorage.
 */
export function useLogoConcept() {
  const [activeConcept, setActiveConceptState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_CONCEPT;
    } catch {
      return DEFAULT_CONCEPT;
    }
  });

  useEffect(() => {
    const handleConceptChange = (e) => {
      if (e.detail && ['concept-1', 'concept-2', 'concept-3'].includes(e.detail)) {
        setActiveConceptState(e.detail);
      }
    };

    window.addEventListener('5ampere-logo-change', handleConceptChange);
    return () => window.removeEventListener('5ampere-logo-change', handleConceptChange);
  }, []);

  const setConcept = (conceptId) => {
    if (['concept-1', 'concept-2', 'concept-3'].includes(conceptId)) {
      try {
        localStorage.setItem(STORAGE_KEY, conceptId);
      } catch {
        // Ignore storage errors in restricted iframe environments
      }
      setActiveConceptState(conceptId);
      window.dispatchEvent(new CustomEvent('5ampere-logo-change', { detail: conceptId }));
    }
  };

  return { activeConcept, setConcept };
}

