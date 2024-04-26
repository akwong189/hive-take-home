import { useEffect, useState } from "react"
import "./dropdown.css"
import useOutsideClick from "./hooks";
import { onCheckMultiple, onCheckSingle } from "./selector";

const MAX_CHARS = 25;
const MAX_TITLE_CHARS = 30;

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {array} props.options options to display to be selected
 * @param {string} props.desc Optional: desc for the dropdown memu
 * @param {boolean} props.multiple Optional: enables selecting multiple options
 * @returns
 */
export default function Dropdown(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [listOptions, setListOptions] = useState([]);
    const [selectorState, setSelectorState] = useState(false);

    const onCheck = (itemId) => {
        let result;
        if (props.multiple) {
            result = onCheckMultiple(itemId, selectedOptions, listOptions);
        } else {
            result = onCheckSingle(itemId, selectedOptions, listOptions);
        }

        setListOptions(result.listOptions);
        setSelectedOptions(result.selectedOptions);
        if (result.selectorState !== undefined)
            setSelectorState(result.selectorState);
    }

    const onMenuClick = () => {
        setOpenMenu(!openMenu);
    }

    const outsideMenuClick = () => {
        if (openMenu) setOpenMenu(!openMenu);
    }

    const ref = useOutsideClick(outsideMenuClick);

    useEffect(() => {
        let options = props.options.map((option, index) => {
            return { text: option, id: index, isChecked: false }
        })

        if (!props.multiple) {
            setSelectorState(true);
        }

        setListOptions(options);
    }, [props.options, props.multiple])

    return (
        <div style={{...props?.style, maxWidth: "300px"}}>
            <div className="drop-down" ref={ref} >
                <DropdownContext
                    desc={props.desc}
                    isOpen={openMenu}
                    selectedOptions={selectedOptions}
                    listOptions={listOptions}
                    onClick={onMenuClick}
                />
                {
                    openMenu ?
                        <DropdownMenu
                            selectorHighlight={selectorState}
                            multi={props.multiple}
                            options={listOptions}
                            onCheck={onCheck}
                        />
                        :
                        null
                }
            </div>
        </div>
    )
}

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {boolean} props.multi use multiple selection component instead of single selection
 * @param {array} props.options options to be displayed
 * @param {function} props.onCheck function to perform when object is clicked
 * @param {boolean} props.selectorHighlight
 * @returns
 */
function DropdownMenu(props) {
    return (
        <div>
            <ul className="drop-menu">
                <DropdownItemSelector
                    higlighted={props.selectorHighlight}
                    key="selector"
                    multi={props.multi}
                    onClick={() => props.onCheck(-1, true)}
                />
                {
                    props.options.map((option) => {
                        return <DropdownItem
                            key={option.id}
                            text={option.text}
                            multi={props.multi}
                            isChecked={option.isChecked}
                            onClick={() => props.onCheck(option.id)}
                        />
                    })
                }
            </ul>
        </div>
    )
}

/**
 * JSX Component for a dropdown "button" context information
 * @param {object} props
 * @param {boolean} props.isOpen check if menu status is open
 * @param {array} props.selectedOptions options that were selected
 * @param {array} props.listOptions options that can be selected
 * @param {string} props.desc
 * @param {function} props.onClick function to be performed on click
 * @returns
 */
function DropdownContext(props) {
    let strs = []
    let curr_length = 0
    let title = "";

    for (let i of props.selectedOptions) {
        let option = props.listOptions[i].text
        if (option.length + curr_length + 2 < MAX_TITLE_CHARS) {
            curr_length += option.length + 2
            strs.push(option)
        } else {
            strs.push(option.slice(0, MAX_TITLE_CHARS - curr_length) + "...");
            break;
        }
    }
    title = strs.join(", ")

    return (
        <div className="drop-context" onClick={() => { props.onClick() }}>
            <div className="drop-context-selection">
                {props.selectedOptions.length > 0 ? title : <p className="drop-context-desc">{props.desc}</p>}
            </div>
            <span className="drop-context-icon">{props.isOpen ? "\u25b2" : "\u25bc"}</span>
        </div>
    )
}

/**
 * JSX Component for a dropdown list item
 * @param {object} props
 * @param {string} props.text that were selected
 * @param {boolean} props.multi check if menu status is open
 * @param {boolean} props.isChecked check if menu status is open
 * @param {function} props.onClick function to be performed on click
 * @returns
 */
function DropdownItem(props) {
    let selected = props.isChecked ? "drop-menu-item selected" : "drop-menu-item"
    let text = props.text.length > MAX_CHARS ? props.text.slice(0, MAX_CHARS) + "..." : props.text

    return (
        <li className={selected} onClick={() => { props.onClick() }}>
            {props.multi ? <input type="checkbox" checked={props.isChecked} readOnly={true}></input> : null}
            {text}
        </li>
    )
}

/**
 * JSX Component for a dropdown selector (select all/deselect all for multiple and none for single)
 * @param {object} props
 * @param {boolean} props.multi Optional: enabled component for multiple selection
 * @param {boolean} props.higlighted Optional: callback function for multiple selection
 * @param {function} props.onClick Optional: callback function for multiple selection
 * @returns
 */
function DropdownItemSelector(props) {
    let selected = props.higlighted ? "drop-menu-item selected" : "drop-menu-item"
    let selectTitle = props.higlighted ? "Deselect All" : "Select All"

    return (
        <li className={selected} onClick={() => props.onClick()}>
            {
                props.multi ?
                    <input type="checkbox" checked={props.higlighted} readOnly={true}></input>
                    :
                    null
            }
            <em>{props.multi ? selectTitle : "None"}</em>
        </li>
    )
}