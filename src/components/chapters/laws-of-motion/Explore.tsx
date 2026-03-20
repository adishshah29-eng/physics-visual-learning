export default function Explore() {
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-lg font-semibold">Explore: Laws of Motion</h3>

      <p className="text-sm text-slate-400">
        Newton’s Laws of Motion describe the relationship between forces acting
        on a body and the motion produced as a result of those forces.
      </p>

      <ul className="list-disc list-inside text-sm space-y-1">
        <li>Net force determines the acceleration of a body.</li>
        <li>Acceleration is directly proportional to force.</li>
        <li>Acceleration is inversely proportional to mass.</li>
        <li>If net force is zero, velocity remains constant.</li>
      </ul>

      <p className="text-sm text-slate-400">
        Use the playground above to vary forces and mass, and observe how the
        motion of the body changes in real time.
      </p>
    </div>
  );
}
