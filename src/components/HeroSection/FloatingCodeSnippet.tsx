const FloatingCodeSnippet = () => (
  <div className="absolute -top-24 -right-20 transform rotate-12 w-64 bg-gray-900 rounded-2xl p-4 shadow-2xl border border-gray-700 hidden lg:block z-10">
    <div className="text-green-400 text-xs font-mono mb-2 text-start">
      src/components/
    </div>
    <div className="text-gray-300 text-xs font-mono text-start ml-4">
      <div>
        <span className="text-blue-400">import</span> React{" "}
        <span className="text-blue-400">from</span>{" "}
        <span className="text-green-300">'react'</span>
      </div>
      <div>
        <span className="text-purple-400">const</span>{" "}
        <span className="text-yellow-400">Component</span> = () =&gt;{" "}
        <span>{`{`}</span>
      </div>
      <div className="ml-4">
        <span className="text-blue-400">return</span>{" "}
        <span className="text-red-400">&lt;div&gt;</span>Hello
        <span className="text-red-400">&lt;/div&gt;</span>
      </div>
      <div>{`}`}</div>
    </div>
  </div>
);

export default FloatingCodeSnippet;
