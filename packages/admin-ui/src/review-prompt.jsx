import React, { useState } from 'react';
import { MessageSquareText, Send, Star, X } from 'lucide-react';
import { cn } from './cn.js';
import { createButton } from './button.jsx';
import { createCardComponents } from './card.jsx';
import { createCheckboxComponents } from './checkbox.jsx';
import { resolveTheme } from './theme.js';

const stars = [1, 2, 3, 4, 5];

export function createReviewPrompt(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);
  const Button = createButton(themeName);
  const { Card } = createCardComponents(themeName);
  const { Checkbox } = createCheckboxComponents(themeName);
  const dialogTitleId = `${theme.componentPrefix}-review-title`;

  return function ReviewPrompt({
    apiFetch,
    section = 'dashboard',
    setNotice,
    mascotUrl = '',
    reviewEndpoint = '/review-feedback',
    reviewUrl = '#',
    copy = {},
    consent = {},
    compact = false,
  }) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [consentAccepted, setConsentAccepted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const labels = {
      quickFeedback: 'Quick feedback',
      title: 'How is this module working for you?',
      description: 'If this module helps your store, a short review helps us keep improving it.',
      addReview: 'Add review',
      openReviewPage: 'Open review page',
      close: 'Close',
      dialogTitle: 'Share your feedback',
      dialogDescription: 'Your review will be sent for moderation. It will not be published automatically.',
      rating: 'Rating',
      setRating: 'Set rating',
      ratingHelp: 'Choose a rating from 1 to 5 stars.',
      shortReview: 'Short review',
      placeholder: 'What worked well? What should we improve?',
      consentRequired: 'Required consent',
      cancel: 'Cancel',
      saveFeedback: 'Save feedback',
      saving: 'Saving...',
      thankYou: 'Thank you for your feedback.',
      failed: 'Failed saving your feedback.',
      tryAgain: 'Please try again in a moment.',
      ...copy,
    };
    const consentDetails = {
      codeName: 'productReviewPublication',
      content: 'I agree to send this rating and review to Cool Cat Ideas for moderation and possible publication on the product page. The review will not be published automatically.',
      locale: 'en',
      version: 1,
      ...consent,
    };
    const openDialog = () => {
      setSubmitted(false);
      setOpen(true);
    };
    const closeDialog = () => {
      if (submitting) {
        return;
      }

      setOpen(false);
      setSubmitted(false);
    };
    const submit = () => {
      const request = typeof apiFetch === 'function'
        ? apiFetch
        : () => Promise.reject(new Error('Missing feedback request handler.'));

      setSubmitting(true);

      request(reviewEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          rating,
          comment,
          section,
          alsoOpenReviewPage: false,
          alsoWordPressOrg: false,
          reviewConsent: {
            accepted: consentAccepted,
            codeName: consentDetails.codeName,
            content: consentDetails.content,
            locale: consentDetails.locale,
            version: consentDetails.version,
          },
        }),
      })
        .then(() => {
          setSubmitted(true);
          setRating(0);
          setHoverRating(0);
          setComment('');
          setConsentAccepted(false);

          if (setNotice) {
            setNotice({
              type: 'success',
              message: labels.thankYou,
              details: '',
            });
          }
        })
        .catch(() => {
          if (setNotice) {
            setNotice({
              type: 'error',
              message: labels.failed,
              details: labels.tryAgain,
            });
          }
        })
        .finally(() => setSubmitting(false));
    };

    return (
      <>
        <Card
          data-cci-ui='review-prompt'
          className={cn(
            'tw-relative tw-box-border tw-overflow-hidden tw-bg-white',
            theme.borderBrandBorder
          )}
          style={compact ? undefined : { minHeight: 190 }}
        >
          <div
            className={cn(
              'tw-relative tw-grid tw-p-3',
              compact ? 'tw-gap-4' : 'tw-gap-2'
            )}
            style={compact ? { boxSizing: 'border-box' } : { minHeight: 188, boxSizing: 'border-box' }}
          >
            <div className='tw-grid tw-min-w-0 tw-gap-1'>
              <div
                className={cn(
                  'tw-grid tw-gap-3',
                  compact && mascotUrl && 'tw-grid-cols-[minmax(0,1fr)_7rem] tw-items-center'
                )}
              >
                <div
                  className={cn(
                    'tw-grid tw-min-w-0 tw-gap-1.5',
                    !compact && mascotUrl
                      ? 'sm:tw-pr-[clamp(11rem,28%,19rem)]'
                      : !compact && 'tw-max-w-[34rem]'
                  )}
                >
                  <span className='tw-inline-flex tw-w-max tw-items-center tw-gap-1.5 tw-rounded-full tw-border tw-border-solid tw-border-amber-200 tw-bg-amber-50 tw-px-2.5 tw-py-1.5 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-amber-700'>
                    <MessageSquareText aria-hidden='true' className='tw-h-3.5 tw-w-3.5' />
                    {labels.quickFeedback}
                  </span>
                  <h2
                    className={cn(
                      'tw-m-0 tw-font-semibold tw-leading-tight',
                      compact ? 'tw-text-lg' : 'tw-text-xl',
                      theme.text
                    )}
                  >
                    {labels.title}
                  </h2>
                  <p
                    className={cn(
                      'tw-m-0 tw-max-w-lg tw-text-sm',
                      compact ? 'tw-leading-5' : 'tw-leading-6',
                      theme.textMuted
                    )}
                  >
                    {labels.description}
                  </p>
                </div>

                {compact && mascotUrl ? (
                  <img
                    src={mascotUrl}
                    alt=''
                    aria-hidden='true'
                    className='tw-h-auto tw-w-full tw-self-center'
                  />
                ) : null}
              </div>

              <div className={cn('tw-flex tw-flex-wrap tw-items-center', compact ? 'tw-mt-3 tw-gap-2' : 'tw-gap-3')}>
                <div className='tw-flex tw-items-center tw-gap-1.5' aria-hidden='true'>
                  {stars.map((star) => (
                    <Star
                      key={star}
                      fill='currentColor'
                      className={cn(compact ? 'tw-h-5 tw-w-5' : 'tw-h-7 tw-w-7', 'tw-text-amber-300')}
                    />
                  ))}
                </div>
                <Button size={compact ? 'sm' : undefined} variant='primary' onClick={openDialog}>
                  <Star aria-hidden='true' fill='currentColor' />
                  {labels.addReview}
                </Button>
                <Button size={compact ? 'sm' : undefined} variant='outlineAccent' asChild>
                  <a href={reviewUrl} target='_blank' rel='noreferrer'>
                    {labels.openReviewPage}
                  </a>
                </Button>
              </div>
            </div>

            {!compact && mascotUrl ? (
              <img
                src={mascotUrl}
                alt=''
                aria-hidden='true'
                className='tw-pointer-events-none tw-absolute tw-right-4 tw-hidden tw-h-auto tw-w-[clamp(10rem,26%,18rem)] sm:tw-block'
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            ) : null}
          </div>
        </Card>

        {open && (
          <div className='tw-fixed tw-inset-0 tw-z-[100000] tw-grid tw-place-items-center tw-p-6' role='presentation'>
            <Button
              variant='unstyled'
              type='button'
              className='tw-absolute tw-inset-0 tw-cursor-default tw-border-0 tw-bg-slate-950/45 tw-p-0'
              onClick={closeDialog}
              aria-label={labels.close}
            />
            <div
              data-cci-ui='review-prompt-dialog'
              className={cn(
                'tw-relative tw-grid tw-w-[min(560px,calc(100vw-32px))] tw-gap-4 tw-rounded-md tw-border tw-border-solid tw-bg-white tw-p-5 tw-shadow-2xl',
                theme.borderBrandBorder
              )}
              role='dialog'
              aria-modal='true'
              aria-labelledby={dialogTitleId}
            >
              <Button
                size='iconSm'
                type='button'
                className='tw-absolute tw-right-3 tw-top-3'
                onClick={closeDialog}
                aria-label={labels.close}
                disabled={submitting}
              >
                <X aria-hidden='true' />
              </Button>

              {submitted ? (
                <div className='tw-grid tw-justify-items-center tw-gap-4 tw-px-4 tw-py-8 tw-text-center'>
                  <h2 id={dialogTitleId} className={cn('tw-m-0 tw-text-2xl tw-font-semibold', theme.text)}>
                    {labels.thankYou}
                  </h2>
                  <Button variant='primary' type='button' onClick={closeDialog}>
                    {labels.close}
                  </Button>
                </div>
              ) : (
                <>
                  <div className='tw-grid tw-gap-2 tw-pr-8'>
                <h2 id={dialogTitleId} className={cn('tw-m-0 tw-text-2xl tw-font-semibold', theme.text)}>
                  {labels.dialogTitle}
                </h2>
                <p className={cn('tw-m-0 tw-text-sm tw-leading-6', theme.textMuted)}>
                  {labels.dialogDescription}
                </p>
              </div>

              <div className='tw-grid tw-gap-2'>
                <span className='tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-slate-600'>
                  {labels.rating}
                </span>
                <div className='tw-flex tw-gap-1' onMouseLeave={() => setHoverRating(0)}>
                  {stars.map((star) => (
                    <Button
                      variant='unstyled'
                      key={star}
                      type='button'
                      className={cn(
                        'tw-cursor-pointer tw-rounded-md tw-border tw-border-solid tw-border-transparent tw-bg-transparent tw-p-1 tw-text-amber-300 tw-transition-colors tw-duration-150 hover:tw-border-amber-300 hover:tw-bg-amber-50 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-1 focus-visible:tw-outline-amber-400',
                        star <= (hoverRating || rating) ? 'tw-text-amber-300' : 'tw-text-slate-200',
                        rating === star && 'tw-border-amber-300 tw-bg-amber-50'
                      )}
                      onMouseEnter={() => setHoverRating(star)}
                      onFocus={() => setHoverRating(star)}
                      onBlur={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      aria-label={`${labels.setRating} ${star}`}
                      aria-pressed={rating === star}
                    >
                      <Star fill='currentColor' className='tw-h-8 tw-w-8' />
                    </Button>
                  ))}
                </div>
                <p className={cn('tw-m-0 tw-text-xs tw-leading-5', theme.textMuted)}>
                  {labels.ratingHelp}
                </p>
              </div>

              <label className='tw-grid tw-gap-2'>
                <span className='tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-slate-600'>
                  {labels.shortReview}
                </span>
                <textarea
                  className={cn(
                    'tw-min-h-28 tw-w-full tw-rounded-md tw-border tw-border-solid tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-leading-6 tw-outline-none tw-transition-colors focus:tw-ring-2',
                    theme.border,
                    theme.text,
                    theme.focusBorderBrand,
                    theme.focusRingBrandSoft
                  )}
                  value={comment}
                  maxLength={1200}
                  placeholder={labels.placeholder}
                  onChange={(event) => setComment(event.target.value)}
                />
              </label>

              <label
                className={cn(
                  '!tw-flex tw-cursor-pointer tw-items-start tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-p-3 tw-text-sm tw-leading-5',
                  theme.border,
                  theme.bgSurfaceSoft,
                  theme.text
                )}
              >
                <Checkbox
                  className='!tw-mt-0.5 !tw-self-start'
                  checked={consentAccepted}
                  onCheckedChange={(checked) => setConsentAccepted(Boolean(checked))}
                  aria-required='true'
                />
                <span className='tw-min-w-0 tw-flex-1'>
                  <strong className='tw-block tw-font-semibold'>
                    {labels.consentRequired}
                  </strong>
                  <span className={cn('tw-block tw-text-xs tw-leading-5', theme.textMuted)}>
                    {consentDetails.content}
                  </span>
                </span>
              </label>

                  <div className='tw-flex tw-flex-wrap tw-justify-end tw-gap-2'>
                    <Button type='button' onClick={closeDialog} disabled={submitting}>
                      {labels.cancel}
                    </Button>
                    <Button
                      variant='primary'
                      type='button'
                      onClick={submit}
                      disabled={submitting || rating < 1 || !consentAccepted}
                    >
                      <Send aria-hidden='true' />
                      {submitting ? labels.saving : labels.saveFeedback}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  };
}
