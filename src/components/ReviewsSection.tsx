import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Star, MessageSquarePlus, CheckCircle2, X, MessageCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { addReview, language, t, settings } = useHotel();
  const [modalOpen, setModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

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

  const openWhatsAppFeedback = () => {
    const text = encodeURIComponent(
      language === 'ky'
        ? 'Саламатсызбы! Мен Bishkek Hotel боюнча өз пикиримди калтырайын дедим эле.'
        : language === 'ru'
        ? 'Здравствуйте! Хочу оставить отзыв о проживании в отеле Bishkek Hotel.'
        : 'Hello! I would like to leave feedback regarding my stay at Bishkek Hotel.'
    );
    window.open(`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section id="reviews" className="py-20 bg-[#0F1115] text-[#E0E0E0] relative border-b border-[#252936]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Section Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest mb-3 border border-[#C5A059]/25 font-sans">
          <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
          <span>{t.reviewsTitle}</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] tracking-tight font-display mb-3">
          {t.reviewsTitle}
        </h2>

        {/* Option B: Clean, honest announcement */}
        <div className="bg-[#14161C] border border-[#252936] rounded-2xl p-8 sm:p-10 shadow-xl max-w-2xl mx-auto mt-6">
          <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 fill-[#C5A059]" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#FAF8F5] font-display mb-2">
            {language === 'ky'
              ? 'Биздин меймандардын пикири жакында жарыяланат'
              : language === 'ru'
              ? 'Отзывы наших гостей будут опубликованы в ближайшее время'
              : 'Guest reviews will be published soon'}
          </h3>

          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed mb-6 font-sans">
            {language === 'ky'
              ? 'Биз конокторубуздун чыныгы ой-пикирлерин баалайбыз. Отелдеги эс алууңуз боюнча пикириңизди калтырыңыз же WhatsApp аркылуу бөлүшүңүз.'
              : language === 'ru'
              ? 'Мы ценим искреннюю обратную связь. Вы можете оставить свой отзыв на сайте или написать нам в WhatsApp.'
              : 'We value honest guest feedback. You are welcome to submit your review on our website or contact us via WhatsApp.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="leave-review-btn"
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl font-bold gold-gradient-btn flex items-center gap-2 shadow text-xs active:scale-95 transition-all text-[#0F1115]"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#0F1115]" />
              <span>{t.leaveReviewBtn}</span>
            </button>

            <button
              id="whatsapp-review-btn"
              type="button"
              onClick={openWhatsAppFeedback}
              className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-2 shadow text-xs active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Write Review Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#14161C] border border-[#252936] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative text-left">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#FAF8F5] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-[#FAF8F5] mb-1 font-display">
                {t.reviewModalTitle}
              </h3>
              <p className="text-xs text-[#9CA3AF] mb-4 font-sans">
                {language === 'ky'
                  ? 'Отел жөнүндө өз оюңуз менен бөлүшүңүз.'
                  : language === 'ru'
                  ? 'Поделитесь впечатлениями о проживании в отеле.'
                  : 'Share your feedback with future guests.'}
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
                          aria-label={`Rate ${star} stars`}
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
                      placeholder={
                        language === 'ky'
                          ? 'Бөлмө тазалыгы, тейлөө ж.б.'
                          : language === 'ru'
                          ? 'Чистота номера, удобство времени заезда...'
                          : 'Cleanliness, comfort, check-in...'
                      }
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
                      className="px-5 py-2 rounded-xl text-xs font-semibold gold-gradient-btn shadow text-[#0F1115]"
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
