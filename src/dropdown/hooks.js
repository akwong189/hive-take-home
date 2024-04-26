import { useEffect, useRef } from "react";

const SCROLL_PERCENTAGE = 0.90; // set percentage of scroll length before generating more

/**
 * JSX hook for handling outside component click
 * Based on: https://www.robinwieruch.de/react-hook-detect-click-outside-component/
 * @param {function} callback callback function to handle clicking event outside of component
 * @returns {React.MutableRefObject<null>}
 */
function useOutsideClick(callback) {
    let ref = useRef(null);

    useEffect(() => {
        const handleClickEvent = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        document.addEventListener('click', handleClickEvent);
        return () => {
            document.removeEventListener('click', handleClickEvent);
        }

    }, [ref, callback]);

    return ref;
}

/**
 * JSX hook for handling scolling to be infinite
 * Inspired by: https://blog.logrocket.com/3-ways-implement-infinite-scroll-react/
 * @param {function} callback callback function to handle scrolling event
 * @returns {React.MutableRefObject<null>}
 */
function useInfiniteScroll(callback) {
    let ref = useRef(null);

    useEffect(() => {
        const instance = ref.current;
        const handleScrollEvent = (event) => {
            if (ref && instance.scrollTop >= instance.scrollHeight * SCROLL_PERCENTAGE) {
                callback();
            }
        }

        if (ref && ref.current) {
            instance.addEventListener('scroll', handleScrollEvent, false);
            return () => {
                instance.removeEventListener('scroll', handleScrollEvent, false);
            }
        }

    }, [ref, callback]);

    return ref;
}

export { useOutsideClick, useInfiniteScroll };