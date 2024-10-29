import { useEffect, useRef, useState } from "react";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";
import { FilterType, mappedTag } from "../utility/types";

interface TagFilterProp {
  tagMap: mappedTag;
  onFilterChange: (selectedTags: string[], filterType: FilterType) => void;
}

function TagFilter({ tagMap, onFilterChange }: TagFilterProp) {
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.AND);
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

  const handleFilterTypeChange = (type: FilterType) => {
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
      <div className={`filter-items ${isFilterOpen ? "shown" : "hidden"}`}>
        <div className="filter-type-btn">
          Match filter
          <label htmlFor="and-type">
            <input
              className="filter-all-btn"
              type="radio"
              id="and-type"
              checked={filterType === FilterType.AND}
              onChange={() => handleFilterTypeChange(FilterType.AND)}
            />
            <span>All</span>
          </label>

          <label htmlFor="or-type">
            <input
              className="filter-all-btn"
              type="radio"
              id="or-type"
              checked={filterType === FilterType.OR}
              onChange={() => handleFilterTypeChange(FilterType.OR)}
            />
            <span>Any</span>
          </label>
        </div>

        <button
          className="clear-filter-btn"
          onClick={() => setTagFilters([])}
        >
          <FaFilterCircleXmark />
          <p>clear</p>
        </button>
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
    </div >
  );
}

export default TagFilter;