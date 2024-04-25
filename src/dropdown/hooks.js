import { useEffect, useRef } from "react";

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

    }, [ref]);

    return ref;
}