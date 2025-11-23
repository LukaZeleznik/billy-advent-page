export interface Ad {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  ownerName: string;
  price: number;
}

export const GRID_WIDTH = 1200;
export const GRID_HEIGHT = 800;
export const ZONES_PER_ROW = 6;
export const ZONE_SIZE = 200; // 1200 / 6 = 200. 800 / 200 = 4 rows. Total 24 zones.

export const useAdStore = () => {
  const ads = useState<Ad[]>('ads', () => []);
  const currentDate = useState<Date>('currentDate', () => new Date());

  // Initialize from API
  const init = async () => {
    try {
      const { data, error } = await useFetch<Ad[]>('/api/ads');
      if (error.value) {
        console.error('Failed to fetch ads', error.value);
        ads.value = [];
      } else if (data.value) {
        ads.value = data.value;
      } else {
        ads.value = [];
      }
    } catch (e) {
      console.error('Failed to fetch ads during init', e);
      ads.value = [];
    }
  };

  const buyAd = async (ad: Omit<Ad, 'id'>) => {
    try {
      const newAd = await $fetch<Ad>('/api/ads', {
        method: 'POST',
        body: ad
      });
      ads.value.push(newAd);
    } catch (e) {
      console.error('Failed to buy ad', e);
      alert('Failed to purchase ad. Please try again.');
    }
  };

  const getZoneForDay = (day: number) => {
    // Day 1-24
    // 0-indexed index = day - 1
    const index = day - 1;
    const row = Math.floor(index / ZONES_PER_ROW);
    const col = index % ZONES_PER_ROW;

    return {
      x: col * ZONE_SIZE,
      y: row * ZONE_SIZE,
      width: ZONE_SIZE,
      height: ZONE_SIZE,
      day
    };
  };

  const isZoneUnlocked = (day: number) => {
    const now = currentDate.value;
    const month = now.getMonth(); // 0-11

    // If before December (Month < 11), everything is locked.
    if (month < 11) {
      return false;
    }

    // If after December (Month > 11, which is impossible for getMonth() unless year changes, 
    // but let's assume we handle year rollover or just stick to Dec logic for now).
    // Actually, if it's Jan 2026, month is 0. So we need to check year too ideally.
    // For this simple advent, let's assume:
    // Nov or earlier -> Locked
    // Dec -> Unlocks daily
    // Jan or later -> Unlocked (if we wanted to keep it open)

    // Simple logic: Only unlock in December based on day.
    if (month === 11) {
      return now.getDate() >= day;
    }

    return false; // Default locked for other months (like Jan next year, unless we want to keep it open)
  };

  const checkCollision = (rect: { x: number, y: number, width: number, height: number }) => {
    return ads.value.some(ad => {
      return (
        rect.x < ad.x + ad.width &&
        rect.x + rect.width > ad.x &&
        rect.y < ad.y + ad.height &&
        rect.y + rect.height > ad.y
      );
    });
  };

  const calculatePrice = (width: number, height: number) => {
    // Target: 50,000 EUR
    // Total Pixels: 1200 * 800 = 960,000
    // Price per pixel: 50,000 / 960,000 = ~0.05208333
    const pricePerPixel = 50000 / (GRID_WIDTH * GRID_HEIGHT);
    const price = width * height * pricePerPixel;
    // Round to 2 decimal places
    return Math.round(price * 100) / 100;
  };

  const setCurrentDate = (date: Date) => {
    currentDate.value = date;
  };

  const clearAds = async () => {
    try {
      await $fetch('/api/ads', { method: 'DELETE' });
      // Force reactivity update
      ads.value = [];
      // Optional: Refetch to be absolutely sure
      // await init(); 
    } catch (e) {
      console.error('Failed to clear ads', e);
    }
  };

  return {
    ads,
    buyAd,
    getZoneForDay,
    isZoneUnlocked,
    checkCollision,
    calculatePrice,
    init,
    currentDate,
    setCurrentDate,
    clearAds
  };
};
