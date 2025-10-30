import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

import FAQItem from "../components/FAQItem.jsx";

const ContactsFAQSection = () => {
  const { t: tCommon } = useTranslation("common");
  const { t: tFaq } = useTranslation("faq");

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
  const phone = tCommon("contacts.phone.value");
  const email = `${tCommon("contacts.email.value1")}@${tCommon("contacts.email.value2")}`;
  const location = tCommon("contacts.location.value");

  // FAQs
  const faqsObj = tFaq("questions", { returnObjects: true });
  const faqs = Object.values(faqsObj);

  return (
    <section id="contacts" className="text-accent mt-8 lg:my-12">
      <div className="max-w-7xl container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 lg:w-4/5">
        {/* Contacts */}
        <div>
          <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-bold mb-6">
            {tCommon("contacts.title")}
          </h2>
          <ul className="space-y-4 mb-8 text-base lg:text-lg 2xl:text-xl text-primary">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-accent text-lg lg:text-xl 2xl:text-2xl" />
              <span>{phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-accent text-lg lg:text-xl 2xl:text-2xl" />
              <span>{email}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-accent text-lg lg:text-xl 2xl:text-2xl" />
              <span>{location}</span>
            </li>
          </ul>

          <form
            className="space-y-4 text-primary text-base 2xl:text-lg"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={tCommon("form.name")}
              className="input input-bordered w-full border border-primary bg-accent/10 placeholder:text-primary"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={tCommon("form.email")}
              className="input input-bordered w-full border border-primary bg-accent/10 placeholder:text-primary"
              required
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={tCommon("form.subject")}
              className="input input-bordered w-full border border-primary bg-accent/10 placeholder:text-primary"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={tCommon("form.message")}
              className="textarea textarea-bordered w-full border border-primary bg-accent/10 placeholder:text-primary"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="btn btn-accent text-lg lg:text-xl 2xl:text-2xl text-primary-content w-full"
            >
              {tCommon("buttons.send")}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-bold mb-6">
            {tFaq("title")}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const answer = faq.answer
                ? faq.answer.replace(
                    "phone or by email",
                    `${phone} or ${email}`
                  )
                : "";

              return (
                <FAQItem
                  key={idx}
                  question={faq.question}
                  answer={answer}
                  idx={idx}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsFAQSection;
