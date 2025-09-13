import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

import FAQItem from "../components/FAQItem.jsx";

const ContactsFAQSection = () => {
  const { t } = useTranslation();

  // Contacts
  const phone = t("contacts.phone.value");
  const email = `${t("contacts.email.value1")}@${t("contacts.email.value2")}`;
  const location = t("contacts.location.value");

  // FAQs
  const faqsObj = t("faq.questions", { returnObjects: true });
  const faqs = Object.values(faqsObj);

  return (
    <section id="contacts-faq" className="py-20 bg-base-200 text-base-content">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contacts */}
        <div>
          <h2 className="text-3xl font-bold mb-6">{t("contacts.title")}</h2>
          <ul className="space-y-4 mb-8">
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
