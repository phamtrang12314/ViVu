/** Format tiền tệ VND */
export const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    })
        .format(price)
        .replace(/\s*₫$/, " đ"); // Thay "₫" bằng " đ" cho đẹp hơn
};

