/** Format tiền tệ VND */
export const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })
        .format(price)
        .replace(/\s*₫$/, " đ"); // Thay "₫" bằng " đ" cho đẹp hơn
};

export const resolveAssetUrl = (url?: string, fallback = '') => {
    if (!url) return fallback;

    const trimmedUrl = url.trim();
    if (/^(https?:|data:|blob:)/i.test(trimmedUrl)) return trimmedUrl;

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/';
    const backendOrigin = apiBaseUrl
        .trim()
        .replace(/\/+$/, '')
        .replace(/\/api$/, '');
    const assetPath = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;

    return `${backendOrigin}${assetPath}`;
};

