export default function StepBasics({ formData, setFormData }: any) {
  return (
    <div className="space-y-4">
      <input
        placeholder="Project Title"
        className="w-full rounded-lg bg-black/40 border border-white/10 p-3"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <select
        className="w-full rounded-lg bg-black/40 border border-white/10 p-3"
        onChange={(e) =>
          setFormData({ ...formData, productionType: e.target.value })
        }
      >
        <option>Production Type</option>
        <option>Film</option>
        <option>TV</option>
        <option>Commercial</option>
        <option>Voice</option>
        <option>Fashion</option>
      </select>

      <textarea
        placeholder="Short project description"
        className="w-full rounded-lg bg-black/40 border border-white/10 p-3"
        rows={4}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
    </div>
  );
}
