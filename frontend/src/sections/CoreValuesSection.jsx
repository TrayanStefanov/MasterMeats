import { useTranslation } from "react-i18next";
import CoreValueCard from "../components/CoreValueCard";


const CoreValuesSection = () => {
  const { t } = useTranslation();
  const values = t("coreValues.values", { returnObjects: true });
  const isDesktop = window.innerWidth >= 1024;

  return (
    <section id="core-values" className="py-20 bg-base-200 text-base-content">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">{t("coreValues.title")}</h2>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.values(values).map((value, idx) => (
          <CoreValueCard key={value.title} value={value} idx={idx} isDesktop={isDesktop} />
        ))}
      </div>
    </section>
  );
};

export default CoreValuesSection;
