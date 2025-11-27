import React from "react";

const TimeInput = ({ valueMinutes = 0, onChange }) => {
  const days = Math.floor(valueMinutes / (60 * 24));
  const hours = Math.floor((valueMinutes % (60 * 24)) / 60);
  const minutes = valueMinutes % 60;

  const handleChange = (unit, val) => {
    let newDays = days;
    let newHours = hours;
    let newMinutes = minutes;

    if (unit === "days") newDays = Number(val) || 0;
    if (unit === "hours") newHours = Number(val) || 0;
    if (unit === "minutes") newMinutes = Number(val) || 0;

    const totalMinutes = newDays * 24 * 60 + newHours * 60 + newMinutes;
    onChange(totalMinutes);
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        className="input input-bordered w-16"
        min={0}
        value={days}
        onChange={(e) => handleChange("days", e.target.value)}
      />
      <span>d</span>

      <input
        type="number"
        className="input input-bordered w-16"
        min={0}
        max={23}
        value={hours}
        onChange={(e) => handleChange("hours", e.target.value)}
      />
      <span>h</span>

      <input
        type="number"
        className="input input-bordered w-16"
        min={0}
        max={59}
        value={minutes}
        onChange={(e) => handleChange("minutes", e.target.value)}
      />
      <span>m</span>
    </div>
  );
};

export default TimeInput;
