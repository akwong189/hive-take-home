import { useEffect, useState } from "react"
import "./dropdown.css"
import useOutsideClick from "./hooks";
import { onCheckMultiple, onCheckSingle } from "./selector";

const MAX_CHARS = 25;
const MAX_TITLE_CHARS = 30;

/**
 * @typedef {Object} SelectOption
 * @property {int} id id of option
 * @property {string} text option text
 * @property {boolean} isChecked if item is selected
 */

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {array<string>} props.options options to display to be selected
 * @param {string} props.desc Optional: description for the dropdown memu
 * @param {boolean} props.multiple Optional: enables selecting multiple options
 * @returns
 */
export default function Dropdown(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [listOptions, setListOptions] = useState([]);
    const [selectorState, setSelectorState] = useState(false);


    /** Set option selection
    * @param {int} itemId id of the item being clicked
    * @returns
    */
    const onCheck = (itemId) => {
        let result;
        if (props.multiple) {
            // multiple selection action
            result = onCheckMultiple(itemId, selectedOptions, listOptions);
        } else {
            // single selection action
            result = onCheckSingle(itemId, selectedOptions, listOptions);
        }

        // update data retrieved from helper functions
        setListOptions(result.listOptions);
        setSelectedOptions(result.selectedOptions);
        if (result.selectorState !== undefined)
            setSelectorState(result.selectorState);
    }

    const onMenuClick = () => {
        setOpenMenu(!openMenu);
    }

    // When user clicks outside of component, close menu
    const outsideMenuClick = () => {
        if (openMenu) setOpenMenu(!openMenu);
    }
    const ref = useOutsideClick(outsideMenuClick);

    useEffect(() => {
        // populate options as an object
        let options = props.options.map((option, index) => {
            return { text: option, id: index, isChecked: false }
        })

        if (!props.multiple) {
            // single selection will always start as none
            setSelectorState(true);
        }

        setListOptions(options);
    }, [props.options, props.multiple])

    return (
        <div style={{ ...props?.style, maxWidth: "300px" }}>
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
 * @param {array<SelectOption>} props.options options to be displayed
 * @param {function} props.onCheck function to be performed when object is clicked
 * @param {boolean} props.selectorHighlight determines whether the selector button at the top of list is highlighted
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
                    onClick={() => props.onCheck(-1)}
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
 * @param {array<int>} props.selectedOptions options that were selected
 * @param {array<SelectOption>} props.listOptions options that can be selected from
 * @param {function} props.onClick callback function to what happens on clicking component
 * @param {string} props.desc Optional: description of the dropdown menu
 * @returns
 */
function DropdownContext(props) {
    let strs = []
    let curr_length = 0
    let title = "";
    let desc = props.desc;

    // function to generate the title, with the max length of MAX_TITLE_CHARS characters
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

    // make sure the given desc fits into component
    if (desc.length > MAX_TITLE_CHARS) {
        desc = desc.slice(0, MAX_TITLE_CHARS) + "...";
    }

    return (
        <div className="drop-context" onClick={() => { props.onClick() }}>
            <div className="drop-context-selection">
                {props.selectedOptions.length > 0 ? title : <p className="drop-context-desc">{desc}</p>}
            </div>
            <span className="drop-context-icon">{props.isOpen ? "\u25b2" : "\u25bc"}</span>
        </div>
    )
}

/**
 * JSX Component for a dropdown list item
 * @param {object} props
 * @param {string} props.text option to be displayed as list item
 * @param {boolean} props.multi determines if multiple choice or single choice, if multiple a checkbox is drawn
 * @param {boolean} props.isChecked check if option is selected from dropdown
 * @param {function} props.onClick callback function for action when item is clicked
 * @returns
 */
function DropdownItem(props) {
    let selected = props.isChecked ? "drop-menu-item selected" : "drop-menu-item"

    // shrink text if string length is too long to display
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
 * @param {boolean} props.multi multiple choice or single choice, determines what selection option is displayed
 * @param {boolean} props.higlighted determines if item selector is highlighted when None (single) or Select All (multiple) is selected
 * @param {function} props.onClick callback function for action when selector is click
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