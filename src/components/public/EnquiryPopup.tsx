'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

const EnquiryPopup = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
  });

  const apiBase = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }, []);

  useEffect(() => {
    try {
      const alreadyDismissed = localStorage.getItem('enquiry_popup_dismissed') === '1';
      const alreadySubmitted = localStorage.getItem('enquiry_popup_submitted') === '1';
      if (alreadyDismissed || alreadySubmitted) {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;

    const id = window.setTimeout(() => {
      setOpen(true);
    }, 5000);

    return () => window.clearTimeout(id);
  }, [dismissed, pathname]);

  const close = () => {
    setOpen(false);
    setDismissed(true);
    try {
      localStorage.setItem('enquiry_popup_dismissed', '1');
    } catch {
      // ignore
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback('');

    try {
      const res = await fetch(`${apiBase}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: formData.subject,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit enquiry');
      }

      setFeedback('Submitted!');
      setFormData({ name: '', phone: '', email: '', subject: '' });
      try {
        localStorage.setItem('enquiry_popup_submitted', '1');
      } catch {
        // ignore
      }

      window.setTimeout(() => {
        setOpen(false);
        setDismissed(true);
      }, 800);
    } catch {
      setFeedback('Try again');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || dismissed) return null;

  return (
    <div className="fixed right-4 bottom-24 z-50 w-[150px] h-[200px] bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1.5 bg-indigo-600">
        <p className="text-white text-xs font-semibold">Quick Enquiry</p>
        <button onClick={close} className="text-white text-[10px] font-bold px-1">X</button>
      </div>

      <form onSubmit={handleSubmit} className="p-2 space-y-1.5">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full text-[10px] px-1.5 py-1 border border-gray-300 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Mobile"
          value={formData.phone}
          onChange={handleChange}
          className="w-full text-[10px] px-1.5 py-1 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full text-[10px] px-1.5 py-1 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full text-[10px] px-1.5 py-1 border border-gray-300 rounded"
          required
        />

        <div className="flex items-center justify-between pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-700 hover:bg-green-800 text-white text-[10px] font-semibold px-2 py-1 rounded disabled:bg-gray-400"
          >
            {submitting ? '...' : 'Send'}
          </button>
          {feedback ? <p className="text-[10px] text-gray-600">{feedback}</p> : null}
        </div>
      </form>
    </div>
  );
};

export default EnquiryPopup;
