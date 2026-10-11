import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  ShieldCheck,
  Star,
  Quote,
  Check
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { useToast } from '../context/ToastContext';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, newRes, trendRes, bestRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ isNewArrival: 'true', limit: 8 }),
          api.getProducts({ isTrending: 'true', limit: 8 }),
          api.getProducts({ isBestSeller: 'true', limit: 8 })
        ]);

        if (catsRes.success) setCategories(catsRes.data || []);
        if (newRes.success) setNewArrivals(newRes.data || []);
        if (trendRes.success) setTrending(trendRes.data || []);
        if (bestRes.success) setBestSellers(bestRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    try {
      const res = await api.subscribeNewsletter(newsletterEmail);
      showToast(res.message || 'Subscribed!', 'success');
      setSubscribed(true);
      setNewsletterEmail('');
    } catch (err: any) {
      showToast(err.message || 'Subscription failed.', 'error');
    }
  };

  const styleAesthetics = [
    {
      title: 'Korean Streetwear',
      subtitle: 'Acid wash graphics, drop shoulders & relaxed silhouettes',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=Korean+Streetwear'
    },
    {
      title: 'Y2K Cyber Revival',
      subtitle: 'Parachute poplin cargos, metallic baby tees & 2000s chrome',
      image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=Y2K+Fashion'
    },
    {
      title: 'Minimalist Atelier',
      subtitle: 'Pleated trousers, raw flax linen & structured monochrome',
      image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=Minimalist+Style'
    },
    {
      title: 'Casual Everyday Wear',
      subtitle: 'Ultra-soft waffle knits, relaxed shorts & elevated basics',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=Casual+Everyday+Wear'
    },
    {
      title: 'College Fits',
      subtitle: 'Varsity fleece, knife-pleated skirts & skate denim',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=College+Fits'
    },
    {
      title: 'Party & Evening',
      subtitle: 'Liquid satin slip dresses, corset crops & structured tailoring',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=Party+Wear'
    },
    {
      title: 'Indie Ethnic Fusion',
      subtitle: 'Chanderi silk block print kurtis & modern festive co-ords',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=Ethnic+and+Traditional+Wear'
    },
    {
      title: 'Studio Athleisure',
      subtitle: '4-way sculpting compression ribbed sets & modular layers',
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
      link: '/shop?style=Athleisure'
    }
  ];

  const customerTestimonials = [
    {
      name: 'Rohan Sharma',
      location: 'Bengaluru, India',
      rating: 5,
      review: 'The quality of the Hongdae Zip Hoodie and Acid Wash Tee is unmatched in India. The weight of the fabric is seriously premium, not like thin mall brands. Arrived in 2 days!',
      item: 'Seoul Overdrive Acid Wash Graphic Tee'
    },
    {
      name: 'Ananya Mehra',
      location: 'Mumbai, India',
      rating: 5,
      review: 'The Parachute Cargo pants fit like a dream! The ankle bungee toggles let you wear them straight or cinched over high-top sneakers. Packaging was gorgeous too.',
      item: 'Cyber Y2K Parachute Cargo Pants'
    },
    {
      name: 'Devansh Kapoor',
      location: 'Delhi, India',
      rating: 5,
      review: 'Ordered the Tailored Pleated Trousers and linen camp shirt for an art gallery opening. Got so many compliments. Aura Seoul is truly on another level.',
      item: 'Atelier Tailored Wide-Leg Pleated Trousers'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* B. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-aura-black text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
            alt="Aura Seoul Autumn Campaign"
            className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.08] scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-black via-aura-black/30 to-black/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12">
          <div className="inline-flex items-center space-x-2 border border-aura-accent/60 bg-black/40 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-[0.25em] text-aura-accent">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn/Winter 2026 Collection ✦ Drop 04</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight uppercase leading-[0.95]">
            YOUR STYLE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-aura-beige to-aura-accent">
              YOUR RULES.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Elevated Korean streetwear, Y2K aesthetics, and tailored silhouettes crafted in heavyweight textiles. Born for individuality, unconfined by convention.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-white hover:bg-aura-accent text-aura-black hover:text-black py-4 px-9 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/new-arrivals"
              className="w-full sm:w-auto border border-white/80 hover:border-aura-accent text-white hover:text-aura-accent bg-black/30 backdrop-blur-md py-4 px-9 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-aura-accent" />
              <span>Explore New Arrivals</span>
            </Link>
          </div>
        </div>
      </section>

      {/* C. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-aura-accent">
              Explore Our Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight uppercase text-aura-black mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold tracking-widest uppercase text-aura-black hover:text-aura-accent flex items-center space-x-1.5 mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 12).map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative flex flex-col overflow-hidden bg-neutral-100 aspect-[3/4] border border-neutral-200/60"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all" />
              <div className="absolute inset-x-2 bottom-3 text-center">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white group-hover:text-aura-accent transition-colors">
                  {cat.name}
                </h3>
                {cat.productCount !== undefined && (
                  <span className="text-[10px] text-neutral-300 font-medium">
                    {cat.productCount} items
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* D. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center space-x-1.5 text-[11px] font-bold tracking-widest uppercase text-aura-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off The Workshop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight uppercase text-aura-black mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-bold tracking-widest uppercase text-aura-black hover:text-aura-accent flex items-center space-x-1.5 mt-2 sm:mt-0"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* E. Trending Products */}
      <section className="bg-neutral-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-300">
            <div>
              <div className="flex items-center space-x-1.5 text-[11px] font-bold tracking-widest uppercase text-aura-accent">
                <Flame className="w-3.5 h-3.5 text-aura-crimson" />
                <span>Most Wanted This Week</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight uppercase text-aura-black mt-1">
                Trending in Seoul
              </h2>
            </div>
            <Link
              to="/trending"
              className="text-xs font-bold tracking-widest uppercase text-aura-black hover:text-aura-accent flex items-center space-x-1.5 mt-2 sm:mt-0"
            >
              <span>Explore Trending</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* F. Shop by Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-aura-accent">
            Coded In Subculture
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight uppercase text-aura-black mt-1">
            Shop by Style Aesthetic
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Whether your mood is cyber Y2K nostalgia, clean Japanese minimalism, or Seoul skate grunge, explore tailored collections for your aesthetic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {styleAesthetics.map((st, i) => (
            <Link
              key={i}
              to={st.link}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-neutral-200"
            >
              <img
                src={st.image}
                alt={st.title}
                className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/95 transition-all" />
              <div className="absolute inset-x-4 bottom-5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-aura-accent block">
                  Aesthetic 0{i + 1}
                </span>
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-white group-hover:text-aura-accent transition-colors">
                  {st.title}
                </h3>
                <p className="text-[11px] text-neutral-300 line-clamp-2 leading-snug">
                  {st.subtitle}
                </p>
                <div className="pt-2 flex items-center space-x-1 text-xs font-bold tracking-wider uppercase text-white group-hover:text-aura-accent transition-colors">
                  <span>Explore Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* G. Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center space-x-1.5 text-[11px] font-bold tracking-widest uppercase text-aura-accent">
              <Award className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight uppercase text-aura-black mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/best-sellers"
            className="text-xs font-bold tracking-widest uppercase text-aura-black hover:text-aura-accent flex items-center space-x-1.5 mt-2 sm:mt-0"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* H. Special Offers & Seasonal Collections Promo Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-aura-black flex items-center border border-neutral-200 group">
            <img
              src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=80"
              alt="Cargo Drop"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 p-6 sm:p-10 text-white space-y-2 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-aura-accent bg-black/60 px-2 py-0.5 border border-aura-accent/40">
                LIMITED RUN
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight">
                Cyber Parachute Cargos
              </h3>
              <p className="text-xs text-neutral-300">
                Adjustable bungee cuffs with water-resistant ripstop nylon. Save 28% this week.
              </p>
              <Link
                to="/category/cargo-pants"
                className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-white hover:text-aura-accent pt-2"
              >
                <span>Shop Cargos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-aura-black flex items-center border border-neutral-200 group">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
              alt="Heavyweight Fleece"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 p-6 sm:p-10 text-white space-y-2 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-aura-accent bg-black/60 px-2 py-0.5 border border-aura-accent/40">
                HEAVYWEIGHT LUXURY
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight">
                420 GSM Terry Hoodies
              </h3>
              <p className="text-xs text-neutral-300">
                Heavyweight double-layer hood with two-way brushed metal hardware.
              </p>
              <Link
                to="/category/hoodies-and-sweatshirts"
                className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-white hover:text-aura-accent pt-2"
              >
                <span>Shop Hoodies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* I. Customer Reviews & Community Testimonials */}
      <section className="bg-neutral-50 py-16 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold tracking-widest uppercase text-aura-accent">
              Verified Shopper Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight uppercase text-aura-black mt-1">
              Customer Testimonials
            </h2>
            <div className="flex items-center justify-center space-x-1 text-aura-accent mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-aura-accent" />
              ))}
              <span className="text-xs font-bold text-aura-black ml-2">4.9 / 5.0 Average Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerTestimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-aura-accent">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-aura-accent" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-neutral-300" />
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                    "{t.review}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <p className="text-xs font-bold text-aura-black">{t.name}</p>
                  <p className="text-[11px] text-neutral-400">{t.location}</p>
                  <p className="text-[10px] text-aura-accent font-semibold mt-1">Purchased: {t.item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* J. Newsletter Subscription */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="p-8 sm:p-12 bg-aura-black text-white border border-neutral-800 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
            VIP ACCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight">
            Get First Access to New Drops
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Subscribe to receive private invitations to limited Seoul street collections and a 10% welcome coupon.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs text-white placeholder-neutral-500 outline-none focus:border-aura-accent"
            />
            <button
              type="submit"
              className="bg-white hover:bg-aura-accent text-aura-black py-3 px-6 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-1"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {subscribed && (
            <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Thank you! Your coupon code is WELCOME10.</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
