import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

import FAQItem from "../components/FAQItem.jsx";

const ContactsFAQSection = () => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo, just log data
    console.log("Form submitted:", formData);
    alert("Your inquiry has been sent!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  // Contacts
  const phone = t("contacts.phone.value");
  const email = `${t("contacts.email.value1")}@${t("contacts.email.value2")}`;
  const location = t("contacts.location.value");

  // FAQs
  const faqsObj = t("faq.questions", { returnObjects: true });
  const faqs = Object.values(faqsObj);

  return (
    <section id="contacts" className="text-accent">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:px-20 lg:w-4/5">
        {/* Contacts */}
        <div>
          <h2 className="text-3xl font-bold mb-6">{t("contacts.title")}</h2>
          <ul className="space-y-4 mb-8 text-lg text-primary">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-accent" />
              <span>{phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-accent" />
              <span>{email}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-accent" />
              <span>{location}</span>
            </li>
          </ul>

          <form className="space-y-4 text-primary" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("contacts.form.name")}
              className="input input-bordered w-full border border-primary placeholder:text-primary"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("contacts.form.email")}
              className="input input-bordered w-full border border-primary placeholder:text-primary"
              required
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t("contacts.form.subject")}
              className="input input-bordered w-full border border-primary placeholder:text-primary"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("contacts.form.message")}
              className="textarea textarea-bordered w-full border border-primary placeholder:text-primary"
              rows="4"
              required
            ></textarea>
            <button type="submit" className="btn btn-accent text-primary-content w-full">
              {t("contacts.form.btnSend")}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-3xl font-bold mb-6">{t("faq.title")}</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const answer = faq.answer
                ? faq.answer.replace("phone or by email", `${phone} or ${email}`)
                : "";

              return (
                <FAQItem key={idx} question={faq.question} answer={answer} idx={idx} />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsFAQSection;
