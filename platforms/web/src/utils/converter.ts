export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatTime(time: string) {
    const totalMinutes = parseInt(time, 10);
  const days = Math.floor(totalMinutes / 1440); // 1440 = 24 * 60
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return `${days} hari ${hours} jam ${minutes} menit`;
}