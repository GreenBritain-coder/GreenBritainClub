# GreenBritain.Club - Premium Cannabis Community

A modern, SEO-optimized website for GreenBritain.Club, targeting cannabis-related search terms across major UK cities with Telegram integration.

## 🌟 Features

### SEO Optimization
- **City-specific pages** for all major UK cities (London, Manchester, Birmingham, etc.)
- **Targeted keywords** for cannabis delivery, weed, and Telegram-related searches
- **Dynamic metadata** generation for each city page
- **Sitemap.xml** and **robots.txt** for search engine optimization
- **Open Graph** and **Twitter Card** meta tags for social sharing

### Design & UX
- **Modern, responsive design** with cannabis-themed green color scheme
- **Mobile-first approach** with Tailwind CSS
- **Smooth animations** and hover effects
- **Professional branding** with GreenBritain.Club identity

### Telegram Integration
- **Direct links** to @GBShopXBot Telegram bot
- **Dedicated Telegram page** with detailed information
- **Community features** highlighting exclusive deals and promotions
- **Step-by-step instructions** for joining the community

### City Targeting
- **20 major UK cities** covered with individual pages
- **Local SEO optimization** for each city
- **Cross-linking** between city pages
- **Geographic targeting** for better local search results

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (already installed)
- npm (comes with Node.js)

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd C:\Users\Scotty\greenbritain-club
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
greenbritain-club/
├── src/
│   └── app/
│       ├── page.tsx              # Homepage
│       ├── layout.tsx            # Root layout with SEO metadata
│       ├── telegram/
│       │   └── page.tsx          # Dedicated Telegram page
│       ├── [city]/
│       │   └── page.tsx          # Dynamic city pages
│       ├── sitemap.ts            # SEO sitemap
│       ├── robots.ts             # SEO robots.txt
│       └── globals.css           # Global styles
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🎯 SEO Strategy

### Target Keywords
- **Primary:** cannabis UK, weed delivery, cannabis delivery
- **City-specific:** cannabis London, weed Manchester, cannabis Birmingham, etc.
- **Telegram:** GBShopXBot, Telegram cannabis, cannabis Telegram group
- **Long-tail:** premium cannabis delivery UK, discreet weed delivery

### City Pages Generated
- London, Manchester, Birmingham, Leeds, Liverpool
- Sheffield, Bristol, Glasgow, Edinburgh, Cardiff
- Newcastle, Nottingham, Leicester, Coventry, Bradford
- Stoke-on-Trent, Wolverhampton, Plymouth, Southampton, Reading

### Technical SEO
- **Meta tags** optimized for each page
- **Structured data** for better search results
- **Fast loading** with Next.js optimization
- **Mobile-friendly** responsive design
- **Clean URLs** with proper routing

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file for production:
```env
NEXT_PUBLIC_SITE_URL=https://greenbritain.club
NEXT_PUBLIC_TELEGRAM_BOT=@GBShopXBot
```

### Deployment Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **DigitalOcean App Platform**

## 📱 Telegram Integration

### Bot Features
- **@GBShopXBot** - Main bot for ordering and support
- **Product catalog** browsing
- **Secure ordering** system
- **Real-time support** chat
- **Deal notifications** and promotions

### Community Benefits
- Daily deals and promotions
- New product alerts
- 24/7 customer support
- Exclusive member offers
- Community updates and news

## 🎨 Customization

### Colors
The website uses a green cannabis theme:
- Primary: `#16a34a` (green-600)
- Secondary: `#15803d` (green-700)
- Background: `#14532d` (green-900)
- Accent: `#4ade80` (green-400)

### Content Updates
- Update city lists in `src/app/page.tsx` and `src/app/[city]/page.tsx`
- Modify Telegram bot username in all components
- Update meta descriptions and keywords as needed

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Cities
1. Add city name to the `ukCities` array in `src/app/page.tsx`
2. Update the `nearbyCities` array in `src/app/[city]/page.tsx`
3. The dynamic routing will automatically create the new city page

## 📊 Analytics & Monitoring

### Recommended Tools
- **Google Analytics 4** - Track website traffic
- **Google Search Console** - Monitor search performance
- **Telegram Bot Analytics** - Track bot usage
- **PageSpeed Insights** - Monitor performance

## 🔒 Security & Privacy

### Best Practices
- **HTTPS only** in production
- **No sensitive data** stored on the website
- **Telegram integration** for secure communications
- **Age verification** notices (18+ only)
- **UK residents only** targeting

## 📞 Support

For technical support or questions about the website:
- **Email:** [Your support email]
- **Telegram:** @GBShopXBot
- **Documentation:** This README file

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**GreenBritain.Club** - Premium Cannabis Community
*Age 18+ Only • UK Residents • Discreet & Secure Service*
