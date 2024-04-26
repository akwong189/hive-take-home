const onSelectOptions = (itemId, selectedOptions, add = true) => {
    let updatedSelectedOptions;
    updatedSelectedOptions = add ?
        [...selectedOptions, itemId] : updatedSelectedOptions = selectedOptions.filter((item) => item !== itemId);
    return { selectedOptions: updatedSelectedOptions };
}

const onCheckSelector = (selectedOptions, listOptions) => {
    let updatedListOptions, updatedSelectorState, updatedSelectedOptions;
    if (selectedOptions.length >= listOptions.length) {
        updatedListOptions = listOptions.map((option) => {
            option.isChecked = false;
            return option
        })
        updatedSelectedOptions = [];
        updatedSelectorState = false;
    } else {
        updatedListOptions = listOptions.map((option) => {
            option.isChecked = true;
            return option
        })
        updatedSelectedOptions = [...Array(listOptions.length).keys()];
        updatedSelectorState = true;
    }
    return { listOptions: updatedListOptions, selectorState: updatedSelectorState, selectedOptions: updatedSelectedOptions };
}

const onCheckItem = (itemId, listOptions, selectedOptions) => {
    let option = listOptions[itemId];
    option.isChecked = !option.isChecked;
    selectedOptions = onSelectOptions(itemId, selectedOptions, option.isChecked);
    return { listOptions: listOptions, selectedOptions: selectedOptions.selectedOptions }
}

const onCheckMultiple = (itemId, selectedOptions, listOptions) => {
    if (itemId === -1) {
        return onCheckSelector(selectedOptions, listOptions);
    }
    return onCheckItem(itemId, listOptions, selectedOptions);
}

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