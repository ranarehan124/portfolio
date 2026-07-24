import { useEffect, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { useSectionObserver } from '@/hooks';
import { LoadingScreen, Navbar, CustomCursor } from '@layout';

function MainLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const { dispatch } = useAppContext();
  const { observe, unobserve } = useSectionObserver();

  useEffect(() => {
    observe(mainRef.current);
    return () => unobserve();
  }, [observe, unobserve]);

  const handleMouseEnterLink = useCallback(() => {
    dispatch({ type: 'SET_CURSOR_VARIANT', payload: 'hover' });
  }, [dispatch]);

  const handleMouseEnterText = useCallback(() => {
    dispatch({ type: 'SET_CURSOR_VARIANT', payload: 'text' });
  }, [dispatch]);

  const handleMouseLeave = useCallback(() => {
    dispatch({ type: 'SET_CURSOR_VARIANT', payload: 'default' });
  }, [dispatch]);

  useEffect(() => {
    const addListeners = () => {
      const links = document.querySelectorAll('a, button, [data-cursor="hover"]');
      const texts = document.querySelectorAll('h1, h2, h3, p, [data-cursor="text"]');

      for (const link of links) {
        link.addEventListener('mouseenter', handleMouseEnterLink);
        link.addEventListener('mouseleave', handleMouseLeave);
      }
      for (const text of texts) {
        text.addEventListener('mouseenter', handleMouseEnterText);
        text.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        for (const link of links) {
          link.removeEventListener('mouseenter', handleMouseEnterLink);
          link.removeEventListener('mouseleave', handleMouseLeave);
        }
        for (const text of texts) {
          text.removeEventListener('mouseenter', handleMouseEnterText);
          text.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    };

    const cleanup = addListeners();

    const observer = new MutationObserver(() => {
      cleanup?.();
      addListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [handleMouseEnterLink, handleMouseEnterText, handleMouseLeave]);

  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <Navbar />
      <main ref={mainRef} className="relative">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;