import { useEffect, useState } from "react"
import "./dropdown.css"

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {array} props.options options to display to be selected
 * @param {string} props.tag tag for the dropdown memu
 * @returns
 */
export default function Dropdown(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [listOptions, setListOptions] = useState([]);

    const onCheck = (itemId, all = false) => {
        let updatedMap = listOptions.map((option) => {
            if (all) {
            } else {
                if (option.id == itemId) {
                    setSelectedOptions(selectedOptions)
                    option.isChecked = !option.isChecked;
                }
            }
            return option;
        });
        setListOptions([...updatedMap]);
    }

    const onMenuClick = () => {
        setOpenMenu(!openMenu);
        return openMenu
    }

    useEffect(() => {
        let options = props.options.map((option, index) => {
            return { text: option, id: index, isChecked: false }
        })

        setListOptions(options);
    }, { props })

    return (
        <div style={props?.style}>
            <div className="drop-down">
                <DropdownContext tag={props.tag} isOpen={openMenu} selectedOptions={selectedOptions} onClick={onMenuClick} />
                {
                    openMenu ? <DropdownMenu multi={true} options={listOptions} onCheck={onCheck} /> : null
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
 * @returns
 */
function DropdownMenu(props) {
    return (
        <div>
            <ul className="drop-menu">
                <DropdownItemSelector key="selector" multi={props.multi} onClick={() => props.onCheck(-1, true)} />
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
 * JSX Component for a dropdown menu
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
                        Array.isArray(props.selectedOptions) ? props.selectedOptions.slice(0, 2).join(", ") + "..." : props.selectedOptions
                        :
                        <p className="drop-context-tag">{props.tag}</p>
                }
            </div>
            <span className="drop-context-icon">{props.isOpen ? "\u25b2" : "\u25bc"}</span>
        </div>
    )
}

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {string} props.text that were selected
 * @param {boolean} props.multi check if menu status is open
 * @param {boolean} props.isChecked check if menu status is open
 * @param {function} props.onClick function to be performed on click
 * @returns
 */
function DropdownItem(props) {
    return (
        <li className="drop-menu-item" onClick={() => { props.onClick() }}>
            {props.multi ? <input type="checkbox" checked={props.isChecked} readOnly={true}></input> : null}
            {props.text}
        </li>
    )
}

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {boolean} props.multi Optional: enabled component for multiple selection
 * @param {function} props.onClick Optional: callback function for multiple selection
 * @returns
 */
function DropdownItemSelector(props) {
    return (
        <li className="drop-menu-item">
            {
                props.multi ?
                    <button onClick={() => props.onClick()}>
                        <em> Select All </em>
                    </button>
                    :
                    <em>None</em>
            }
        </li>
    )
}