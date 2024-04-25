import { useEffect, useState } from "react"
import "./dropdown.css"

export default function Dropdown(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [listOptions, setListOptions] = useState([]);

    const onCheck = (itemId, all = false) => {
        let updatedMap = listOptions.map((option) => {
            if (all) {
            } else {
                if (option.id == itemId) {
                    option.isChecked = !option.isChecked;
                }
            }
            return option;
        })
        setListOptions([...updatedMap])
    }

    useEffect(() => {
        let options = props.options.map((option, index) => {
            return { text: option, id: index, isChecked: false }
        })

        setListOptions(options);
    }, { props })

    return (
        <div style={props?.style}>
            <div className="drop-menu">
                <div className="drop-context">
                    <button onClick={() => setOpenMenu(!openMenu)}>Open Menu</button>
                </div>
                {
                    openMenu ? <DropdownMenu multi={true} options={listOptions} onCheck={onCheck} /> : null
                }
            </div>
        </div>
    )
}

function DropdownMenu(props) {
    return (
        <div>
            <ul className="drop-down">
                {
                    props.multi ?
                        <li key="selector"> <button onClick={() => props.onCheck(-1, true)}> <em> Select All </em> </button> </li> : <li><em>None</em></li>
                }
                {
                    props.options.map((option, index) => {
                        if (props.multi) {
                            return (<li key={option.id} onClick={() => {
                                props.onCheck(option.id)
                            }}> <input type="checkbox" checked={option.isChecked}></input> {option.text} </li>)
                        } else {
                            return <li onClick={console.log(`Clicked ${option.id}`)} key={option.id}> {option.text} </li>
                        }
                    })
                }
            </ul>
        </div>
    )
}

function DropdownItem(props) {

}