const Explore = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display tracking-wide text-white">
        Kinematics (1D)
      </h2>

      <p className="text-sm text-slate-400 leading-relaxed">
        Kinematics is the branch of mechanics that describes the motion of objects
        without considering the causes of motion.
        <br />
        <br />
        In <b>one-dimensional motion</b>, the object moves along a straight line
        (either forward or backward).
      </p>

      <div className="glass-panel p-4 rounded-lg border-l-4 border-sky-400">
        <p className="text-sm">
          ⚡ Only position, velocity, acceleration, and time are involved.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-display tracking-wide text-white">
          Examples
        </h3>
        <ul className="list-disc pl-5 text-sm text-slate-400">
          <li>Car moving on a straight road</li>
          <li>Train accelerating from a station</li>
          <li>Lift moving up or down</li>
        </ul>
      </div>
    </div>
  );
};

export default Explore;
