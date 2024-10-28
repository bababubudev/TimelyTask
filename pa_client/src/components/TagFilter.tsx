import { useEffect, useRef, useState } from "react";
import { FilterType, mappedTag } from "../utility/types";
import { FaFilter } from "react-icons/fa6";

interface TagFilterProp {
  tagMap: mappedTag;
  onFilterChange: (selectedTags: string[], filterType: FilterType) => void;
}

function TagFilter({ tagMap, onFilterChange }: TagFilterProp) {
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("AND");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleTagChange = (tagId: string) => {
    setTagFilters(prev => {
      const isSelected = prev.includes(tagId);
      const updatedTags = isSelected ?
        prev.filter((id) => id !== tagId) :
        [...prev, tagId];

      return updatedTags;
    });
  };

  const handleFilterTypeChange = (type: "AND" | "OR") => {
    setFilterType(type);
  };

  useEffect(() => {
    onFilterChange(tagFilters, filterType);
  }, [tagFilters, filterType, onFilterChange]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className="filter"
      ref={filterRef}
    >
      <button className="filter-btn" onClick={toggleFilter}>
        <FaFilter />
        <span> Filter</span>
        {tagFilters.length > 0 && (
          <span>
            {tagFilters.length}
          </span>
        )}
      </button>
      {
        isFilterOpen && (
          <>
            <div className="filter-items">
              <button
                className="clear-filter-btn"
                onClick={() => setTagFilters([])}
              >
                clear
              </button>
              <div className="filter-type-btn">

                <label htmlFor="and-type">
                  <input
                    className="filter-all-btn"
                    type="radio"
                    id="and-type"
                    checked={filterType === "AND"}
                    onClick={() => handleFilterTypeChange("AND")}
                  />
                  <span>Match All</span>
                </label>

                <label htmlFor="or-type">
                  <input
                    className="filter-all-btn"
                    type="radio"
                    id="or-type"
                    checked={filterType === "OR"}
                    onClick={() => handleFilterTypeChange("OR")}
                  />
                  <span>Match Any</span>
                </label>
              </div>

              <div className="filter-content">
                {Object.entries(tagMap).map(([id, name]) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={tagFilters.includes(id)}
                      onChange={() => handleTagChange(id)}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )
      }
    </div >
  );
}

export default TagFilter;