const formatName = (name: string) => {
    const parts = name.split('_');
    const formattedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return formattedParts.join(' ');
}

export { formatName }