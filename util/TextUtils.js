function validateField(inputField) {
    return !(inputField === undefined || inputField === null || inputField === '')
}

module.exports = {validateField};
