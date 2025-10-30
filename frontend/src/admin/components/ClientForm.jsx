import { useTranslation } from "react-i18next";

const ClientForm = ({ client, setClient }) => {
  const { t: tForms } = useTranslation("admin/forms");

  const handleChange = (field, value) => {
    setClient((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="border-t-4 border-accent-content/60 pt-6">
      <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
        {tForms("client.title")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.name")}
          </label>
          <input
            type="text"
            placeholder={tForms("client.namePlaceholder")}
            value={client.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.phone")}
          </label>
          <input
            type="text"
            placeholder={tForms("client.phonePlaceholder")}
            value={client.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.email")}
          </label>
          <input
            type="email"
            placeholder={tForms("client.emailPlaceholder")}
            value={client.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-secondary text-sm mb-1">
            {tForms("client.notesLabel")}
          </label>
          <textarea
            placeholder={tForms("client.notesPlaceholder")}
            value={client.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
