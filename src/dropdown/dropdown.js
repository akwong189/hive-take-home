import { useEffect, useState } from "react"
import "./dropdown.css"
import useOutsideClick from "./hooks";

const MAX_CHARS = 20;

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {array} props.options options to display to be selected
 * @param {string} props.tag Optional: tag for the dropdown memu
 * @param {boolean} props.multiple Optional: enables selecting multiple options
 * @returns
 */
export default function Dropdown(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [listOptions, setListOptions] = useState([]);
    const [optionTitle, setOptionTitle] = useState("");
    const [selectorState, setSelectorState] = useState(false);

    const optionNames = () => {
        let strs = []
        let curr_length = 0

        console.log(selectedOptions);
        for (let i of selectedOptions) {
            let option = listOptions[i].text
            console.log(option, option.length + curr_length + 2)
            if (option.length + curr_length + 2 < MAX_CHARS) {
                curr_length += option.length + 2
                strs.push(option)
            }
        }
        console.log(strs)
        return strs.join(", ")
    }

    const onSelectOptions = (itemId, add = true) => {
        let updatedSelected;
        if (add) {
            updatedSelected = [...selectedOptions, itemId];
        } else {
            updatedSelected = selectedOptions.filter((item) => item !== itemId);
        }
        setSelectedOptions([...updatedSelected]);
    }

    const onCheckSelector = () => {
        let updatedOptions;
        if (selectedOptions.length >= listOptions.length) {
            updatedOptions = listOptions.map((option) => {
                option.isChecked = false;
                return option
            })
            setSelectedOptions([]);
            setSelectorState(false);
        } else {
            updatedOptions = listOptions.map((option) => {
                option.isChecked = true;
                return option
            })
            setSelectedOptions([...Array(listOptions.length).keys()]);
            setSelectorState(true);
        }
        setListOptions([...updatedOptions]);
    }

    const onCheckItem = (itemId) => {
        let option = listOptions[itemId];
        option.isChecked = !option.isChecked;
        onSelectOptions(itemId, option.isChecked);
        setListOptions([...listOptions]);
    }

    const onCheckMultiple = (itemId) => {
        if (itemId === -1) {
            onCheckSelector();
        } else {
            onCheckItem(itemId);
        }
    }

    const onCheckSingle = (itemId) => {
        let newSelectedOption = [];
        let index;

        if (selectedOptions.length > 0) {
            index = selectedOptions[0];
            listOptions[index].isChecked = false;
        }

        if (itemId !== - 1) {
            listOptions[itemId].isChecked = true;
            newSelectedOption.push(itemId);
            setSelectorState(false);
        } else {
            setSelectorState(true);
        }
        setListOptions([...listOptions]);
        setSelectedOptions(newSelectedOption);
    }

    const onCheck = (itemId) => {
        if (props.multiple) {
            onCheckMultiple(itemId);
        } else {
            onCheckSingle(itemId);
        }
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
    }, [props.options])

    return (
        <div style={props?.style}>
            <div className="drop-down" ref={ref} >
                <DropdownContext
                    tag={props.tag}
                    isOpen={openMenu}
                    selectedOptions={selectedOptions}
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
            {optionTitle}
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
 * @param {string} props.tag
 * @param {function} props.onClick function to be performed on click
 * @returns
 */
function DropdownContext(props) {
    return (
        <div className="drop-context" onClick={() => { props.onClick() }}>
            <div className="drop-context-selection">
                {
                    props.selectedOptions.length > 0 ?
                        Array.isArray(props.selectedOptions) ? props.selectedOptions.slice(0, 10).join(", ") + "..." : props.selectedOptions
                        :
                        <p className="drop-context-tag">{props.tag}</p>
                }
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

    return (
        <li className={selected} onClick={() => { props.onClick() }}>
            {props.multi ? <input type="checkbox" checked={props.isChecked} readOnly={true}></input> : null}
            {props.text}
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