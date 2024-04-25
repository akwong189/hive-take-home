import { useEffect, useState } from "react"
import "./dropdown.css"

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {list} props.options options to display to be selected
 * @returns
 */
export default function Dropdown(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(["test1"]);
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
                <DropdownContext isOpen={openMenu} selectedOptions={selectedOptions} onClick={onMenuClick}/>
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
                {
                    props.multi ?
                        <li key="selector"> <button onClick={() => props.onCheck(-1, true)}> <em> Select All </em> </button> </li> : <li><em>None</em></li>
                }
                {
                    props.options.map((option, index) => {
                        if (props.multi) {
                            return (<li key={option.id} onClick={() => {
                                props.onCheck(option.id)
                            }}> <input type="checkbox" checked={option.isChecked} readOnly={true}></input> {option.text} </li>)
                        } else {
                            return <li onClick={console.log(`Clicked ${option.id}`)} key={option.id}> {option.text} </li>
                        }
                    })
                }
            </ul>
        </div>
    )
}

/**
 * JSX Component for a dropdown menu
 * @param {object} props
 * @param {boolean} isOpen check if menu status is open
 * @param {array} props.selectedOptions options that were selected
 * @param {function} props.onClick function to be performed on click
 * @returns
 */
function DropdownContext(props) {
    return (
        <div className="drop-context"  onClick={() => {props.onClick()}}>
            <div className="drop-context-selection">
                {Array.isArray(props.selectedOptions) ? props.selectedOptions.slice(0, 2).join(", ") + "..." : props.selectedOptions}
            </div>
            <span className="drop-context-icon">{props.isOpen ? "\u25b2" : "\u25bc"}</span>
        </div>
    )
}

function DropdownItem(props) {

}