"use client";

export function NearbyLocations() {
  const recommendations = [
    { name: "Soho West", distance: "0.8 mi", feature: "Rooftop Terrace" },
    { name: "Tribeca", distance: "1.2 mi", feature: "Podcast Studio" },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-grey-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-teal-900 text-sm uppercase tracking-wide">
          Nearby & Trending
        </h3>
        <span className="text-[10px] text-teal-500 font-semibold cursor-pointer">
          View All
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((loc, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-grey-100/50 rounded-lg hover:bg-grey-100 transition-colors group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm border border-grey-100 group-hover:scale-110 transition-transform">
                📍
              </div>
              <div>
                <p className="font-semibold text-sm text-teal-900 group-hover:text-teal-700">
                  {loc.name}
                </p>
                <p className="text-[10px] text-grey-500">
                  {loc.distance} • {loc.feature}
                </p>
              </div>
            </div>
            <button className="text-teal-900 text-[10px] font-bold px-3 py-1.5 bg-white border border-grey-200 rounded-md shadow-sm hover:shadow active:scale-95 transition-all">
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
