/**
 * @typedef {Object} UpdatedDropdownInfo
 * @property {array} selectedOptions updated list of options selected
 * @property {array} listOptions updated list of options (only updated checkbox state)
 * @property {boolean} selectorState updated state of highlighting selector item
 */

/**
 * Selector action when `select all` / `deselect all` is clicked during multiple selection mode
 * @param {int} props.options options to display to be selected
 * @param {array} props.desc Optional: description for the dropdown memu
 * @param {boolean} add Optional: enables selecting multiple options
 * @returns {UpdatedDropdownInfo}
 */
const onSelectOptions = (itemId, selectedOptions, add = true) => {
    let updatedSelectedOptions;
    updatedSelectedOptions = add ?
        [...selectedOptions, itemId] : updatedSelectedOptions = selectedOptions.filter((item) => item !== itemId);
    return { selectedOptions: updatedSelectedOptions };
}

/**
 * Selector action when `select all` / `deselect all` is clicked during multiple selection mode
 * @param {array} props.options options to display to be selected
 * @param {string} props.desc Optional: description for the dropdown memu
 * @param {boolean} props.multiple Optional: enables selecting multiple options
 * @returns {UpdatedDropdownInfo}
 */
const onCheckSelector = (selectedOptions, listOptions) => {
    let updatedListOptions, updatedSelectorState, updatedSelectedOptions;
    if (selectedOptions.length >= listOptions.length) {
        // clear all options (deselect all) when all options are selected
        updatedListOptions = listOptions.map((option) => {
            option.isChecked = false;
            return option
        })
        updatedSelectedOptions = [];
        updatedSelectorState = false;
    } else {
        // select all options (select all) when less than the number of items are selected (0 to length of items-1)
        updatedListOptions = listOptions.map((option) => {
            option.isChecked = true;
            return option
        })
        updatedSelectedOptions = [...Array(listOptions.length).keys()];
        updatedSelectorState = true;
    }
    return { listOptions: updatedListOptions, selectorState: updatedSelectorState, selectedOptions: updatedSelectedOptions };
}

/**
 * Selector action when an item is clicked during multiple selection mode
 * @param {int} itemId id of item to set as selected
 * @param {array} selectedOptions list of selected options
 * @param {array} listOptions list of available options
 * @returns {UpdatedDropdownInfo}
 */
const onCheckItem = (itemId, selectedOptions, listOptions) => {
    let option = listOptions[itemId];
    let updatedSelectorState = false;
    option.isChecked = !option.isChecked;
    if (option.isChecked) {
        // determine if we component should highlight `select all` or transition to `deselect all`
        // only occurs when we manually check all available options
        updatedSelectorState = selectedOptions.length + 1 >= listOptions.length ? true : false;
    }
    let updatedSelectedOptions = onSelectOptions(itemId, selectedOptions, option.isChecked);
    return { listOptions: listOptions, selectedOptions: updatedSelectedOptions.selectedOptions, selectorState: updatedSelectorState }
}

/**
 * Selector action for clicking on a list item during multiple selection mode 
 * @param {int} itemId id of item to set as selected
 * @param {array} selectedOptions list of selected options
 * @param {array} listOptions list of available options
 * @returns {UpdatedDropdownInfo}
 */
const onCheckMultiple = (itemId, selectedOptions, listOptions) => {
    if (itemId === -1) {
        return onCheckSelector(selectedOptions, listOptions);
    }
    return onCheckItem(itemId, selectedOptions, listOptions);
}

/**
 * Selector action for clicking on a list item during single selection mode
 * @param {int} itemId id of item to set as selected
 * @param {array} selectedOptions list of selected options
 * @param {array} listOptions list of available options
 * @returns {UpdatedDropdownInfo}
 */
const onCheckSingle = (itemId, selectedOptions, listOptions) => {
    let newSelectedOptions = [];
    let index, selectorState;

    if (selectedOptions.length > 0) {
        index = selectedOptions[0];
        listOptions[index].isChecked = false;
    }

    if (itemId !== - 1) {
        listOptions[itemId].isChecked = true;
        newSelectedOptions.push(itemId);
        selectorState = false;
    } else {
        selectorState = true;
    }
    return { listOptions: listOptions, selectorState: selectorState, selectedOptions: newSelectedOptions }
}

export { onCheckMultiple, onCheckSingle };