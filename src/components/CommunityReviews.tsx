import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ShieldCheck,
  Plus,
  X,
  CheckCircle2,
  Filter,
  Flag,
} from 'lucide-react';
import { CollegeReview, StudentProfile } from '../types';

interface CommunityReviewsProps {
  reviews: CollegeReview[];
  studentProfile: StudentProfile;
  onAddReview: (review: CollegeReview) => void;
}

export const CommunityReviews: React.FC<CommunityReviewsProps> = ({
  reviews,
  studentProfile,
  onAddReview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);

  // Form State
  const [formRating, setFormRating] = useState(5);
  const [formCategory, setFormCategory] = useState<'General' | 'Hostel' | 'Faculty' | 'Placements' | 'Campus'>('General');
  const [formPros, setFormPros] = useState('Friendly faculty, active coding club');
  const [formCons, setFormCons] = useState('75% attendance rule is very strict');
  const [formComment, setFormComment] = useState('');

  const categories = ['All', 'General', 'Hostel', 'Faculty', 'Placements', 'Campus'];

  const filteredReviews = reviews.filter(
    (r) => selectedCategory === 'All' || r.category === selectedCategory
  );

  const handleUpvote = (id: string) => {
    if (upvotedIds.includes(id)) {
      setUpvotedIds(upvotedIds.filter((uid) => uid !== id));
    } else {
      setUpvotedIds([...upvotedIds, id]);
    }
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) return;

    const newRev: CollegeReview = {
      id: `rev-${Date.now()}`,
      authorName: studentProfile.name || 'Anonymous Student',
      authorRole: 'Verified Student (Sem ' + studentProfile.semester + ')',
      isVerifiedStudent: true,
      collegeId: 'clg-apex-01',
      rating: formRating,
      category: formCategory,
      pros: formPros.split(',').map((p) => p.trim()),
      cons: formCons.split(',').map((c) => c.trim()),
      comment: formComment,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };

    onAddReview(newRev);
    setIsWriteModalOpen(false);
    setFormComment('');
  };

  return (
    <div id="community-reviews-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                Authentic Peer Feedback
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight mt-1">
              Student Community & Verified College Reviews
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Read transparent ground realities written by verified current students and alumni with honest pros, cons, and anti-abuse moderation.
            </p>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all shrink-0 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Student Review</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' ? 'All Reviews' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => {
          const isUpvoted = upvotedIds.includes(rev.id);
          const helpfulCount = rev.helpfulCount + (isUpvoted ? 1 : 0);

          return (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                    {rev.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900">{rev.authorName}</h4>
                      {rev.isVerifiedStudent && (
                        <span className="px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified Student
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">{rev.authorRole} • {rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono">
                    {rev.category}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block text-[11px]">👍 Pros:</span>
                  <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[11px]">
                    {rev.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-900 block text-[11px]">👎 Cons / Watchouts:</span>
                  <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[11px]">
                    {rev.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => handleUpvote(rev.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                    isUpvoted
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({helpfulCount})</span>
                </button>

                <button
                  onClick={() => alert('Review flagged for administrative content moderation.')}
                  className="text-slate-400 hover:text-slate-600 text-[11px] flex items-center gap-1"
                >
                  <Flag className="w-3 h-3" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                Share Your College Experience
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Overall Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className={`p-2 rounded-lg border text-base font-bold ${
                        formRating >= star
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="General">General Campus Experience</option>
                  <option value="Hostel">Hostel & Food</option>
                  <option value="Faculty">Teachers & Academics</option>
                  <option value="Placements">Placements & Internships</option>
                  <option value="Campus">Infrastructure & Clubs</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Details & Description</label>
                <textarea
                  required
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Share details about professors, lab facilities, placement drives, hostel wifi..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pros (comma separated)</label>
                <input
                  type="text"
                  value={formPros}
                  onChange={(e) => setFormPros(e.target.value)}
                  placeholder="e.g. Great labs, top placements, fast wifi"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cons / Watchouts (comma separated)</label>
                <input
                  type="text"
                  value={formCons}
                  onChange={(e) => setFormCons(e.target.value)}
                  placeholder="e.g. Strict attendance, 9:30 PM curfew"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
