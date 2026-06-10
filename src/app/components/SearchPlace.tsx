import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, ArrowLeft } from "lucide-react";

export function SearchPlace() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.kakao?.maps?.services) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      }
    });
  };

  return (
    <div className="w-[393px] h-[852px] bg-white mx-auto flex flex-col font-sans border-x border-gray-100">
      <div className="pt-12 px-6 pb-4 flex items-center gap-4">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
        <form onSubmit={handleSearch} className="flex-1">
          <div className="w-full h-12 bg-gray-50 rounded-xl px-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              autoFocus
              className="flex-1 bg-transparent outline-none" 
              placeholder="목적지를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {results.map((place, i) => (
          <div 
            key={i} 
            className="py-4 border-b border-gray-50 cursor-pointer"
            onClick={() => navigate("/routes", { state: { destination: place.place_name } })}
          >
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400 w-5 h-5" />
              <div>
                <p className="font-bold">{place.place_name}</p>
                <p className="text-xs text-gray-400">{place.address_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}