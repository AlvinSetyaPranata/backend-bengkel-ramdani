export const clampString = (uuid: string, start = 6, end = 4) => {
    if (uuid.length <= start + end) return uuid;
    return `${uuid.slice(0, start)}...${uuid.slice(-end)}`;
  };


  export const formatCurrency = (amount: string, locale = "id-ID", currency = "IDR") => {

    const true_ammount = parseInt(amount)

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(true_ammount);
  };
  