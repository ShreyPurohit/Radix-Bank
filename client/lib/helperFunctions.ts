const validateAmount = (value: string) => {
    const numValue = Number(value)
    return !value ? "Amount is required." : numValue <= 0 ? "Amount must be greater than 0." : value.length > 8 ? "Amount cannot be more than 8 digits." : true
}

const formatName = (name: string) => {
    const parts = name.split('_');
    const formattedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return formattedParts.join(' ');
}

export { validateAmount, formatName }