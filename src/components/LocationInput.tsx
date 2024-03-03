import { Input } from "@/components/ui/input";
import { forwardRef, useState, useMemo } from "react";
import citiesList from "@/lib/cities-list";

interface LocationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onLocationSelected: (location: string) => void;
}

export default forwardRef<HTMLInputElement, LocationInputProps>(
  function LocationInput({ onLocationSelected, ...props }, ref) {
    const [locationSearchInput, setLocationSearchInput] = useState("");
    const [hasfocus, setHasFocus] = useState(false);

    const cities = useMemo(() => {
      if (!locationSearchInput.trim()) return [];

      const searchwords = locationSearchInput.split("");

      return citiesList
        .map((city) => `${city.name}, ${city.subcountry}, ${city.country}`)
        .filter(
          (city) =>
            city.toLowerCase().startsWith(searchwords[0].toLowerCase()) &&
            searchwords.every((word) =>
              city.toLowerCase().includes(word.toLowerCase()),
            ),
        )
        .slice(0, 5);
    }, [locationSearchInput]);

    return (
      <div>
        <Input
          placeholder="search for a city"
          type="search"
          value={locationSearchInput}
          onChange={(e) => setLocationSearchInput(e.target.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          {...props}
          ref={ref}
        />
        {locationSearchInput.trim() && hasfocus && (
          <div className="absolute w-full z-20 divide-y bg-background shadow-xl border-x border-b rounded-b-lg">
            {!cities.length && <p className="p-3">no results found</p>}
            {cities.map((city) => (
              <button key={city} className="block w-full text-start"
               onMouseDown={(e) => {
                 e.preventDefault();
                 onLocationSelected(city);
                 setLocationSearchInput("");
               }}>
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
