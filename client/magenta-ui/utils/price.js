export function formatPrice(price) {
    if (!price) {
        return '0.00';
    }

    return (+price).toLocaleString('en-US', { minimumFractionDigits: 2 }).slice(-13);
}
