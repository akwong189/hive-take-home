import { useEffect, useRef } from "react";

/**
 * JSX hook for handling outside component click
 * @param {function} callback callback function to handle clicking event outside of component
 * @returns {React.MutableRefObject<null>}
 */
export default function useOutsideClick(callback) {
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