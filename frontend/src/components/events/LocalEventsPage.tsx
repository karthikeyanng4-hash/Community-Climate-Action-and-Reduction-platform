import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  PlusCircle,
  Trees,
  Trash2,
  Bike,
  Sparkles,
  Share2,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface LocalEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  district: string;
  organizer: string;
  description: string;
  attendeesCount: number;
  maxCapacity: number;
  isRegistered: boolean;
  image: string;
}

interface LocalEventsPageProps {
  isEmbedded?: boolean;
}

export const LocalEventsPage: React.FC<LocalEventsPageProps> = ({ isEmbedded = false }) => {
  const { currentCommunity, setShareModalData } = usePlatform();

  const [events, setEvents] = useState<LocalEvent[]>([
    {
      id: 'evt_1',
      title: 'Singanallur Lake Bund Wetland Cleanup & Shola Planting',
      category: 'Wetland Restoration',
      date: 'Saturday, May 24, 2025',
      time: '06:30 AM - 09:30 AM IST',
      location: 'Singanallur Lake Eastern Bund, Trichy Road, Coimbatore',
      district: 'Coimbatore',
      organizer: 'Coimbatore EcoAlliance & CCMC Environment Wing',
      description: 'Join neighborhood volunteers to clear plastic debris from stormwater inlet channels and plant 150 indigenous broadleaf saplings with protective bamboo tree guards.',
      attendeesCount: 42,
      maxCapacity: 60,
      isRegistered: true,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'evt_2',
      title: 'Peelamedu Safe E-Waste & Lithium Battery Drop-off Drive',
      category: 'E-Waste Recycling',
      date: 'Sunday, May 25, 2025',
      time: '09:00 AM - 02:00 PM IST',
      location: 'PSG Tech Open Ground Parking, Avinashi Rd, Coimbatore',
      district: 'Coimbatore',
      organizer: 'TNPCB Certified Metallurgical Recyclers',
      description: 'Safely recycle end-of-life electronics, mobile phones, laptop batteries, and mercury lamps. Every donor receives a verified green action certificate and a seed ball packet.',
      attendeesCount: 68,
      maxCapacity: 100,
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'evt_3',
      title: 'Race Course Sunday Car-Free Green Mobility Morning',
      category: 'Sustainable Transport',
      date: 'Sunday, June 01, 2025',
      time: '05:30 AM - 08:30 AM IST',
      location: 'Race Course Promenade Loop, Gopalapuram, Coimbatore',
      district: 'Coimbatore',
      organizer: 'Coimbatore Cycling Club & EcoCommunity',
      description: 'Vehicular traffic restricted for 3 hours. Experience pedestrian safety, free bicycle tuning workshops, and citizen air-quality monitor readings with live sensor demonstration.',
      attendeesCount: 115,
      maxCapacity: 200,
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'evt_4',
      title: 'Home Aerobic Composting & Terracotta Bin Masterclass',
      category: 'Waste Diversion',
      date: 'Saturday, June 07, 2025',
      time: '10:00 AM - 12:00 PM IST',
      location: 'Corporation Community Hall, RS Puram, Coimbatore',
      district: 'Coimbatore',
      organizer: 'Zero Waste Coimbatore Initiative',
      description: 'Hands-on training in three-tier terracotta composting, odor prevention, dry carbon leaf ratios, and utilizing rich organic compost for terrace gardens.',
      attendeesCount: 29,
      maxCapacity: 40,
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?w=600&auto=format&fit=crop&q=80',
    },
  ]);

  const handleToggleRegister = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const nextState = !evt.isRegistered;
          return {
            ...evt,
            isRegistered: nextState,
            attendeesCount: nextState ? evt.attendeesCount + 1 : evt.attendeesCount - 1,
          };
        }
        return evt;
      })
    );
  };

  const content = (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Grassroots Mobilization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
            Local Climate Events & Drives
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Participate in vetted on-ground conservation efforts organized by your neighborhood collective in {currentCommunity.district}.
          </p>
        </div>

        <button
          onClick={() =>
            setShareModalData({
              title: 'Community Wetland Restoration Drive',
              metric: 'Singanallur Lake Bund • 150 Native Trees',
              category: 'Volunteer Mobilization',
              date: 'May 24, 2025',
              community: currentCommunity.name,
            })
          }
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Share Upcoming Drives</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-md">
                    {evt.category}
                  </span>
                </div>
                {evt.isRegistered && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Registered
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3 text-xs">
                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white leading-snug">
                  {evt.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{evt.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Organizer: <strong>{evt.organizer}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                <strong>{evt.attendeesCount}</strong> of {evt.maxCapacity} spots filled
              </span>
              <button
                onClick={() => handleToggleRegister(evt.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  evt.isRegistered
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {evt.isRegistered ? 'Cancel Registration' : 'Register for Drive'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </div>
  );
};
