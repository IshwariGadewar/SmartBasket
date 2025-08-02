const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

// Platform-specific configurations
const PLATFORM_CONFIGS = {
  Amazon: {
    searchUrl: 'https://www.amazon.in/s?k=',
    selectors: {
      product: '.s-result-item',
      name: 'h2 a span',
      price: '.a-price-whole',
      image: '.s-image',
      rating: '.a-icon-alt',
      reviews: '.a-size-base',
      delivery: '.a-text-bold'
    }
  },
  Blinkit: {
    searchUrl: 'https://blinkit.com/search?q=',
    selectors: {
      product: '.product-card',
      name: '.product-name',
      price: '.product-price',
      image: '.product-image img',
      delivery: '.delivery-info'
    }
  },
  Zepto: {
    searchUrl: 'https://www.zepto.in/search?q=',
    selectors: {
      product: '.product-item',
      name: '.product-title',
      price: '.product-price',
      image: '.product-image img',
      delivery: '.delivery-time'
    }
  },
  Instamart: {
    searchUrl: 'https://www.instamart.in/search?q=',
    selectors: {
      product: '.product-card',
      name: '.product-name',
      price: '.product-price',
      image: '.product-image img',
      delivery: '.delivery-info'
    }
  }
};

async function checkPincodeAvailability(platform, pincode) {
  // Mock pincode availability check
  // In production, this would make API calls to each platform
  const availabilityMap = {
    'Amazon': ['110001', '110002', '110003', '400001', '400002', '400003'],
    'Blinkit': ['110001', '110002', '400001', '400002'],
    'Zepto': ['110001', '110002', '110003', '400001', '400002', '400003'],
    'Instamart': ['110001', '110002', '400001', '400002']
  };
  
  return availabilityMap[platform]?.includes(pincode) || false;
}

async function scrapeAmazon(query, pincode) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const searchUrl = `${PLATFORM_CONFIGS.Amazon.searchUrl}${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    const products = await page.evaluate((selectors) => {
      const items = document.querySelectorAll(selectors.product);
      return Array.from(items).slice(0, 5).map(item => {
        const nameEl = item.querySelector(selectors.name);
        const priceEl = item.querySelector(selectors.price);
        const imageEl = item.querySelector(selectors.image);
        const ratingEl = item.querySelector(selectors.rating);
        const reviewsEl = item.querySelector(selectors.reviews);
        
        return {
          name: nameEl?.textContent?.trim() || 'Product',
          price: parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, '')) || 0,
          imageUrl: imageEl?.src || '',
          rating: parseFloat(ratingEl?.textContent?.match(/\d+\.?\d*/)?.[0]) || 0,
          reviewCount: parseInt(reviewsEl?.textContent?.replace(/[^0-9]/g, '')) || 0,
          url: nameEl?.closest('a')?.href || '',
          deliveryCharges: 0,
          deliveryTime: '1-2 days',
          quantity: '1 unit'
        };
      });
    }, PLATFORM_CONFIGS.Amazon.selectors);
    
    await browser.close();
    return products;
  } catch (error) {
    console.error('Amazon scraping error:', error);
    return [];
  }
}

async function scrapeBlinkit(query, pincode) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const searchUrl = `${PLATFORM_CONFIGS.Blinkit.searchUrl}${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    const products = await page.evaluate((selectors) => {
      const items = document.querySelectorAll(selectors.product);
      return Array.from(items).slice(0, 5).map(item => {
        const nameEl = item.querySelector(selectors.name);
        const priceEl = item.querySelector(selectors.price);
        const imageEl = item.querySelector(selectors.image);
        const deliveryEl = item.querySelector(selectors.delivery);
        
        return {
          name: nameEl?.textContent?.trim() || 'Product',
          price: parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, '')) || 0,
          imageUrl: imageEl?.src || '',
          deliveryCharges: 0,
          deliveryTime: deliveryEl?.textContent?.trim() || '10 minutes',
          quantity: '1 unit',
          rating: 0,
          reviewCount: 0,
          url: window.location.href
        };
      });
    }, PLATFORM_CONFIGS.Blinkit.selectors);
    
    await browser.close();
    return products;
  } catch (error) {
    console.error('Blinkit scraping error:', error);
    return [];
  }
}

async function scrapeZepto(query, pincode) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const searchUrl = `${PLATFORM_CONFIGS.Zepto.searchUrl}${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    const products = await page.evaluate((selectors) => {
      const items = document.querySelectorAll(selectors.product);
      return Array.from(items).slice(0, 5).map(item => {
        const nameEl = item.querySelector(selectors.name);
        const priceEl = item.querySelector(selectors.price);
        const imageEl = item.querySelector(selectors.image);
        const deliveryEl = item.querySelector(selectors.delivery);
        
        return {
          name: nameEl?.textContent?.trim() || 'Product',
          price: parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, '')) || 0,
          imageUrl: imageEl?.src || '',
          deliveryCharges: 0,
          deliveryTime: deliveryEl?.textContent?.trim() || '10 minutes',
          quantity: '1 unit',
          rating: 0,
          reviewCount: 0,
          url: window.location.href
        };
      });
    }, PLATFORM_CONFIGS.Zepto.selectors);
    
    await browser.close();
    return products;
  } catch (error) {
    console.error('Zepto scraping error:', error);
    return [];
  }
}

async function scrapeInstamart(query, pincode) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    const searchUrl = `${PLATFORM_CONFIGS.Instamart.searchUrl}${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    const products = await page.evaluate((selectors) => {
      const items = document.querySelectorAll(selectors.product);
      return Array.from(items).slice(0, 5).map(item => {
        const nameEl = item.querySelector(selectors.name);
        const priceEl = item.querySelector(selectors.price);
        const imageEl = item.querySelector(selectors.image);
        const deliveryEl = item.querySelector(selectors.delivery);
        
        return {
          name: nameEl?.textContent?.trim() || 'Product',
          price: parseFloat(priceEl?.textContent?.replace(/[^0-9.]/g, '')) || 0,
          imageUrl: imageEl?.src || '',
          deliveryCharges: 0,
          deliveryTime: deliveryEl?.textContent?.trim() || '10 minutes',
          quantity: '1 unit',
          rating: 0,
          reviewCount: 0,
          url: window.location.href
        };
      });
    }, PLATFORM_CONFIGS.Instamart.selectors);
    
    await browser.close();
    return products;
  } catch (error) {
    console.error('Instamart scraping error:', error);
    return [];
  }
}

async function scrapeProductData(query, platforms, pincode) {
  const results = [];
  const availablePlatforms = [];
  
  // Check which platforms are available for the pincode
  for (const platform of platforms) {
    const isAvailable = await checkPincodeAvailability(platform, pincode);
    if (isAvailable) {
      availablePlatforms.push(platform);
    }
  }
  
  // Scrape data from available platforms
  const scrapingPromises = availablePlatforms.map(async (platform) => {
    try {
      let products = [];
      
      switch (platform) {
        case 'Amazon':
          products = await scrapeAmazon(query, pincode);
          break;
        case 'Blinkit':
          products = await scrapeBlinkit(query, pincode);
          break;
        case 'Zepto':
          products = await scrapeZepto(query, pincode);
          break;
        case 'Instamart':
          products = await scrapeInstamart(query, pincode);
          break;
      }
      
      return products.map(product => ({
        ...product,
        platform,
        searchQuery: query,
        pincode
      }));
    } catch (error) {
      console.error(`Error scraping ${platform}:`, error);
      return [];
    }
  });
  
  const platformResults = await Promise.all(scrapingPromises);
  
  // Flatten results
  platformResults.forEach(products => {
    results.push(...products);
  });
  
  return {
    products: results,
    availablePlatforms,
    unavailablePlatforms: platforms.filter(p => !availablePlatforms.includes(p))
  };
}

module.exports = { 
  scrapeProductData, 
  checkPincodeAvailability,
  scrapeAmazon,
  scrapeBlinkit,
  scrapeZepto,
  scrapeInstamart
};