"use client";

export function NearbyLocations() {
  // Mock data for nearby locations
  const recommendations = [
    { name: "Soho West", distance: "0.8 mi", feature: "Rooftop Terrace" },
    { name: "Tribeca", distance: "1.2 mi", feature: "Podcast Studio" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-grey-90">
      <h3 className="font-bold text-grey-10 mb-4">Nearby & Trending</h3>
      <div className="space-y-3">
        {recommendations.map((loc, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-grey-90/50 rounded-xl hover:bg-grey-90 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                📍
              </div>
              <div>
                <p className="font-semibold text-sm text-grey-10">{loc.name}</p>
                <p className="text-xs text-grey-50">
                  {loc.distance} • {loc.feature}
                </p>
              </div>
            </div>
            <button className="text-teal-50 text-xs font-bold px-3 py-1.5 bg-teal-90/20 rounded-lg hover:bg-teal-90/40">
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
