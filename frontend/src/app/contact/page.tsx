"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // You can add logic to send form data to an API here
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 pt-20">
      <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-md">
        <h1 className="text-4xl font-bold text-[#2F4F83] mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-6">
          Have questions or need assistance? Reach out to us using the form below.
        </p>

        {submitted ? (
          <p className="text-green-600 font-semibold">Thank you! We will get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
            <button
              type="submit"
              className="bg-[#2F4F83] hover:bg-[#2d394d] text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
