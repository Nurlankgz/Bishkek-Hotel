import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Star, MessageSquarePlus, CheckCircle2, UserCheck, X } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview, language, t } = useHotel();
  const [modalOpen, setModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !commentText.trim()) return;

    addReview({
      guestName: guestName.trim(),
      guestLocation: guestLocation.trim() || 'Bishkek',
      rating: rating,
      comment: {
        ky: commentText.trim(),
        ru: commentText.trim(),
        en: commentText.trim(),
      },
      stayType: 'Hotel Stay',
    });

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setModalOpen(false);
      setGuestName('');
      setGuestLocation('');
      setCommentText('');
    }, 1500);
  };

  return (
    <section id="reviews" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#252936]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#C5A059]/25 font-sans">
              <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
              <span>{t.reviewsTitle}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] tracking-tight font-display">
              {t.reviewsTitle}
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-1 font-sans">
              {t.reviewsSubtitle}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-semibold gold-gradient-btn flex items-center gap-2 shadow self-start sm:self-auto text-xs active:scale-95 transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{t.leaveReviewBtn}</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#14161C] border border-[#252936] rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-[#C5A059]/30 transition-all"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'text-[#C5A059] fill-[#C5A059]'
                            : 'text-[#252936]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] font-mono">{rev.date}</span>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-[#E0E0E0] leading-relaxed italic font-sans">
                  "{rev.comment[language] || rev.comment.ru || rev.comment.en}"
                </p>
              </div>

              {/* Guest Profile */}
              <div className="pt-4 mt-4 border-t border-[#252936] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#FAF8F5] font-display">{rev.guestName}</h4>
                  <p className="text-[11px] text-[#9CA3AF] font-sans">{rev.guestLocation}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-[#1F222A] text-[#9CA3AF] border border-[#252936] font-medium font-sans">
                  <UserCheck className="w-3 h-3 text-[#C5A059]" />
                  <span>{language === 'ky' ? 'Демо пикир' : language === 'ru' ? 'Демо-отзыв' : 'Sample Review'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Write Review Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#FAF8F5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-[#FAF8F5] mb-1 font-display">
                {t.reviewModalTitle}
              </h3>
              <p className="text-xs text-[#9CA3AF] mb-4 font-sans">
                {language === 'ky' ? 'Отел жөнүндө өз оюңуз менен бөлүшүңүз.' : language === 'ru' ? 'Поделитесь впечатлениями о проживании в отеле.' : 'Share your feedback with future guests.'}
              </p>

              {successNotice ? (
                <div className="bg-[#1F222A] border border-[#C5A059]/40 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#C5A059] mx-auto" />
                  <p className="text-xs font-semibold text-[#FAF8F5]">
                    {t.reviewSuccessMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#E0E0E0] mb-1 font-sans">
                      {t.yourName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Иван / Азамат"
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF8F5] placeholder-[#6B7280] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#E0E0E0] mb-1 font-sans">
                      {t.yourLocation}
                    </label>
                    <input
                      type="text"
                      value={guestLocation}
                      onChange={(e) => setGuestLocation(e.target.value)}
                      placeholder="Бишкек / Алматы / London"
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl px-3.5 py-2.5 text-xs text-[#FAF8F5] placeholder-[#6B7280] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#E0E0E0] mb-1 font-sans">
                      {t.yourRating}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-[#4B5563] hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-[#C5A059] fill-[#C5A059]'
                                : 'text-[#252936]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#E0E0E0] mb-1 font-sans">
                      {t.yourComment} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={language === 'ky' ? 'Бөлмө тазалыгы, тейлөө ж.б.' : language === 'ru' ? 'Чистота номера, удобство времени заезда...' : 'Cleanliness, comfort, check-in...'}
                      className="w-full bg-[#0F1115] border border-[#252936] rounded-xl p-3 text-xs text-[#FAF8F5] placeholder-[#6B7280] focus:outline-none focus:border-[#C5A059] resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-[#9CA3AF] hover:text-[#FAF8F5]"
                    >
                      {t.cancelBtn}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-semibold gold-gradient-btn shadow"
                    >
                      {t.submitReviewBtn}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
