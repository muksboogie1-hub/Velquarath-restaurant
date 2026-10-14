import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  CheckCircle2,
  MessageSquare,
  Search,
  FileEdit,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const ReservationsManager: React.FC = () => {
  const { reservations, changeReservationStatus, bookReservation } = useContent();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [testBookingLoading, setTestBookingLoading] = useState(false);

  const filtered = reservations.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (
    id: string,
    status: 'pending' | 'confirmed' | 'declined' | 'completed'
  ) => {
    await changeReservationStatus(id, status);
  };

  const handleSaveNotes = async (id: string) => {
    await changeReservationStatus(id, reservations.find((r) => r.id === id)?.status || 'pending', noteText);
    setEditingNotesId(null);
  };

  const handleCreateTestBooking = async () => {
    setTestBookingLoading(true);
    await bookReservation({
      guestName: 'Tinashe Moyo',
      email: 'tinashe.moyo@example.com',
      phone: '+263 77 234 5678',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '19:00',
      partySize: 4,
      seatingArea: 'Covered Patio near Fireplace',
      notes: 'Anniversary dinner. Would love a quiet booth if possible.',
    });
    setTestBookingLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#332E26]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">Table Reservations</h2>
          <p className="text-xs text-[#B8AD96] mt-1">
            Review guest reservation requests, confirm tables, and contact guests directly via WhatsApp.
          </p>
        </div>
        {reservations.length === 0 && (
          <button
            type="button"
            onClick={handleCreateTestBooking}
            disabled={testBookingLoading}
            className="px-3.5 py-2 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#C9A24B] border border-[#332E26] self-start sm:self-auto cursor-pointer"
          >
            {testBookingLoading ? 'Creating...' : '+ Create Sample Test Reservation'}
          </button>
        )}
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#B8AD96] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest name, phone..."
            className="w-full bg-[#1E1B17] border border-[#332E26] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F4ECDA] placeholder-[#736B5E] focus:border-[#C9A24B] focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'all', label: `All (${reservations.length})` },
            {
              id: 'pending',
              label: `Pending (${reservations.filter((r) => r.status === 'pending').length})`,
            },
            {
              id: 'confirmed',
              label: `Confirmed (${reservations.filter((r) => r.status === 'confirmed').length})`,
            },
            {
              id: 'completed',
              label: `Completed (${reservations.filter((r) => r.status === 'completed').length})`,
            },
            {
              id: 'declined',
              label: `Declined (${reservations.filter((r) => r.status === 'declined').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#C9A24B] text-[#141210]'
                  : 'bg-[#1E1B17] text-[#B8AD96] hover:text-[#F4ECDA] border border-[#332E26]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-[#736B5E] mx-auto" />
          <h3 className="font-display text-lg font-bold text-[#F4ECDA]">No reservations yet</h3>
          <p className="text-xs text-[#B8AD96] max-w-md mx-auto leading-relaxed">
            When guests fill out the &quot;Book a Table&quot; form on your website, their requests will appear here in real-time.
          </p>
          <button
            type="button"
            onClick={handleCreateTestBooking}
            disabled={testBookingLoading}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C9A24B] text-[#141210] font-semibold text-xs hover:bg-[#DFB85E] cursor-pointer"
          >
            <span>Generate Test Booking Request</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#1E1B17] border border-[#332E26] rounded-xl p-5 shadow-xl hover:border-[#736B5E] transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#332E26]">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-bold text-[#F4ECDA]">
                      {item.guest_name}
                    </h3>
                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.status === 'confirmed'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                          : item.status === 'declined'
                          ? 'bg-red-950/70 text-red-300 border-red-700/60'
                          : item.status === 'completed'
                          ? 'bg-blue-950/70 text-blue-300 border-blue-700/60'
                          : 'bg-amber-950/70 text-amber-300 border-amber-700/60'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#B8AD96] mt-2">
                    <span className="flex items-center gap-1 text-[#F4ECDA]">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <strong>{item.reservation_date}</strong> at {item.reservation_time}
                    </span>
                    <span className="flex items-center gap-1 text-[#F4ECDA]">
                      <Users className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <strong>{item.party_size} guests</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[#C9A24B]">Area:</span> {item.seating_area}
                    </span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {item.status !== 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'confirmed')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-semibold cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  )}
                  {item.status !== 'completed' && item.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'completed')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 text-xs font-semibold cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Seated / Done</span>
                    </button>
                  )}
                  {item.status !== 'declined' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'declined')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-semibold cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Guest Details & Contact */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[#736B5E] uppercase block mb-1">
                    Contact Details
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#F4ECDA]">
                      <Phone className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <span className="font-mono">{item.phone}</span>
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${item.guest_name}, this is Velquarath Cafe confirming your reservation for ${item.party_size} guests on ${item.reservation_date} at ${item.reservation_time}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                        title="Open WhatsApp chat with guest"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                    {item.email && (
                      <div className="flex items-center gap-2 text-[#B8AD96]">
                        <Mail className="w-3.5 h-3.5 text-[#736B5E]" />
                        <span>{item.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <span className="text-[11px] font-semibold text-[#736B5E] uppercase block mb-1">
                    Guest Notes &amp; Dietary Requests
                  </span>
                  <p className="text-xs text-[#B8AD96] italic bg-[#141210] p-2.5 rounded border border-[#332E26]">
                    {item.special_notes || 'No special requests provided.'}
                  </p>
                </div>

                {/* Admin Internal Notes */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[#736B5E] uppercase">
                      Staff / Table Notes
                    </span>
                    {editingNotesId !== item.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesId(item.id);
                          setNoteText(item.admin_notes || '');
                        }}
                        className="text-[10px] text-[#C9A24B] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <FileEdit className="w-3 h-3" />
                        <span>Edit note</span>
                      </button>
                    )}
                  </div>
                  {editingNotesId === item.id ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="e.g. Table 4 assigned, anniversary celebration"
                        className="w-full bg-[#141210] border border-[#332E26] rounded px-2.5 py-1.5 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesId(null)}
                          className="px-2 py-0.5 text-[10px] rounded bg-[#26221D] text-[#B8AD96] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(item.id)}
                          className="px-2.5 py-0.5 text-[10px] rounded bg-[#C9A24B] text-[#141210] font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#B8AD96] bg-[#141210] p-2.5 rounded border border-[#332E26]">
                      {item.admin_notes || 'No staff notes yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
