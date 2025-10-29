const ClientForm = ({ client, setClient }) => {
  const handleChange = (field, value) => {
    setClient((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="border-t-4 border-accent-content/60 pt-6">
      <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
        Client Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full name"
          value={client.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
          required
        />

        <input
          type="text"
          placeholder="Phone number"
          value={client.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
          required
        />

        <input
          type="email"
          placeholder="Email (optional)"
          value={client.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 md:col-span-2"
        />

        <textarea
          placeholder="Client notes (optional)"
          value={client.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 md:col-span-2"
          rows="3"
        />
      </div>
    </div>
  );
};

export default ClientForm;
