import React, { useState, useEffect } from 'react';
import { Sliders, Save, Check } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminContent: React.FC = () => {
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [announcementsText, setAnnouncementsText] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [standardShippingFee, setStandardShippingFee] = useState(99);

  const { showToast } = useToast();

  useEffect(() => {
    api.getHomepageContent().then(res => {
      if (res.success && res.data) {
        setContent(res.data);
        const annList = res.data.announcements?.map((a: any) => a.text).join('\n') || '';
        setAnnouncementsText(annList);

        const hero = res.data.heroBanners?.[0];
        if (hero) {
          setHeroHeadline(hero.headline || '');
          setHeroSubheadline(hero.subheadline || '');
        }

        const settings = res.data.siteSettings;
        if (settings) {
          setFreeShippingThreshold(settings.freeShippingThreshold || 999);
          setStandardShippingFee(settings.standardShippingFee || 99);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleSaveAnnouncements = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updatedAnnouncements = announcementsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, i) => ({ id: `ann-${i + 1}`, text }));

    try {
      await api.updateAdminContent('announcements', updatedAnnouncements);
      showToast('Announcements updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const currentHero = content?.heroBanners?.[0] || {};
    const updated = [
      {
        ...currentHero,
        headline: heroHeadline,
        subheadline: heroSubheadline
      }
    ];

    try {
      await api.updateAdminContent('heroBanners', updated);
      showToast('Hero banner updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const current = content?.siteSettings || {};
    const updated = {
      ...current,
      freeShippingThreshold: parseFloat(String(freeShippingThreshold)),
      standardShippingFee: parseFloat(String(standardShippingFee))
    };

    try {
      await api.updateAdminContent('siteSettings', updated);
      showToast('Shipping settings saved.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Storefront Content & Banner Management"
      subtitle="Update announcement bar broadcasts, campaign headlines, and shipping rules"
    >
      <div className="max-w-4xl space-y-8 text-xs">
        {/* Announcements Bar Management */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
            Top Announcement Bar Messages (1 per line)
          </h3>
          <p className="text-neutral-400">
            These announcements rotate automatically in the ticker bar at the top of the store.
          </p>

          <form onSubmit={handleSaveAnnouncements} className="space-y-3">
            <textarea
              rows={4}
              value={announcementsText}
              onChange={e => setAnnouncementsText(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 p-3 text-white font-mono outline-none focus:border-aura-accent"
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-aura-accent hover:bg-aura-accentHover text-black px-5 py-2 font-bold uppercase tracking-wider transition-colors"
            >
              Update Announcements
            </button>
          </form>
        </div>

        {/* Hero Banner Management */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
            Homepage Hero Headline & Story
          </h3>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block font-bold uppercase text-neutral-400 mb-1">Bold Campaign Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={e => setHeroHeadline(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-400 mb-1">Subheadline Description</label>
              <textarea
                rows={2}
                value={heroSubheadline}
                onChange={e => setHeroSubheadline(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-aura-accent hover:bg-aura-accentHover text-black px-5 py-2 font-bold uppercase tracking-wider transition-colors"
            >
              Update Hero Banner
            </button>
          </form>
        </div>

        {/* Shipping Thresholds */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-2">
            Shipping Fees & Thresholds
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Free Shipping Order Min (₹)</label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={e => setFreeShippingThreshold(parseFloat(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Standard Shipping Charge (₹)</label>
                <input
                  type="number"
                  value={standardShippingFee}
                  onChange={e => setStandardShippingFee(parseFloat(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-aura-accent hover:bg-aura-accentHover text-black px-5 py-2 font-bold uppercase tracking-wider transition-colors"
            >
              Update Shipping Rules
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
