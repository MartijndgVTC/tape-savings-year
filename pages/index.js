import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState({
    rollPrice: 6.95,
    initialCutoff: 30,
    newCutoff: 3,
    rollLength: 990,
    fullDiameter: 25.6,
    coreDiameter: 8.4,
    machines: 9,
    rollsPerMachine: 3.5,
    changeoverTime: 1,
    workDaysPerYear: 250,
  });

  const [results, setResults] = useState(null);

  const calculate = () => {
    const percentUsed = (cutoffMM) => {
      const cutoffCM = cutoffMM / 10;
      const D_cutoff = input.coreDiameter + 2 * cutoffCM;
      const D_core = input.coreDiameter;
      const D_full = input.fullDiameter;

      return (Math.pow(D_full, 2) - Math.pow(D_cutoff, 2)) /
             (Math.pow(D_full, 2) - Math.pow(D_core, 2));
    };

    const usedPctInitial = percentUsed(input.initialCutoff);
    const usedPctNew = percentUsed(input.newCutoff);

    const totalRollsInitial = input.machines * input.rollsPerMachine;
    const rollsPerMachineNew = input.rollsPerMachine * (usedPctInitial / usedPctNew);
    const totalRollsNew = input.machines * rollsPerMachineNew;

    const rollsSavedPerDay = totalRollsInitial - totalRollsNew;
    const downtimeSaved = rollsSavedPerDay * input.changeoverTime;

    const totalRollsSavedPerYear = rollsSavedPerDay * input.workDaysPerYear;
    const totalEuroSavedPerYear = totalRollsSavedPerYear * input.rollPrice;
    const downtimeSavedPerYear = downtimeSaved * input.workDaysPerYear;

    const savingsPerRoll = input.rollPrice * (usedPctNew - usedPctInitial);

    setResults({
      savingsPerRoll: savingsPerRoll.toFixed(2),
      rollsUsedBefore: totalRollsInitial.toFixed(1),
      rollsUsedAfter: totalRollsNew.toFixed(1),
      downtimeSaved: downtimeSaved.toFixed(1),
      yearlyTapeSavings: totalEuroSavedPerYear.toFixed(0),
      yearlyDowntimeSaved: downtimeSavedPerYear.toFixed(0)
    });
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: parseFloat(e.target.value) });
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1>Tape Roll Savings Calculator</h1>
      {[
        { label: "Roll price (€)", name: "rollPrice" },
        { label: "Initial cutoff (mm)", name: "initialCutoff" },
        { label: "New cutoff (mm)", name: "newCutoff" },
        { label: "Roll length (m)", name: "rollLength" },
        { label: "Full roll diameter (cm)", name: "fullDiameter" },
        { label: "Core diameter (cm)", name: "coreDiameter" },
        { label: "Machines in use", name: "machines" },
        { label: "Rolls per machine per day", name: "rollsPerMachine" },
        { label: "Changeover time (min)", name: "changeoverTime" },
        { label: "Work days per year", name: "workDaysPerYear" },
      ].map((field) => (
        <div key={field.name} style={{ marginBottom: 10 }}>
          <label>{field.label}</label>
          <input
            type="number"
            step="any"
            name={field.name}
            value={input[field.name]}
            onChange={handleChange}
            style={{ width: "100%", padding: "5px", marginTop: "5px" }}
          />
        </div>
      ))}
      <button onClick={calculate} style={{ padding: "10px 20px", marginTop: 10 }}>
        Calculate
      </button>

      {results && (
        <div style={{ marginTop: 20 }}>
          <p><strong>💰 Savings per roll:</strong> €{results.savingsPerRoll}</p>
          <p><strong>📦 Rolls used before:</strong> {results.rollsUsedBefore} / day (all machines)</p>
          <p><strong>📉 Rolls used after:</strong> {results.rollsUsedAfter} / day (all machines)</p>
          <p><strong>⏱️ Downtime saved:</strong> {results.downtimeSaved} minutes / day (all machines)</p>
          <p><strong>💶 Estimated yearly tape savings:</strong> €{results.yearlyTapeSavings}</p>
          <p><strong>🕒 Estimated yearly downtime saved:</strong> {results.yearlyDowntimeSaved} minutes</p>
        </div>
      )}
    </div>
  );
}
