"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({
  availableTags,
  label,
  value,
  onChange,
}: TagAutocompleteProps) {
  const inputId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const lastCommaIndex = value.lastIndexOf(",");
  const query = value.slice(lastCommaIndex + 1).trim().toLowerCase();
  const selectedTags = lastCommaIndex === -1
    ? []
    : value
      .slice(0, lastCommaIndex)
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  const suggestions = query
    ? availableTags.filter((tag) => {
      const normalizedTag = tag.toLowerCase();
      return normalizedTag.startsWith(query) && !selectedTags.includes(normalizedTag);
    })
    : [];
  const isListVisible = isOpen && suggestions.length > 0;
  const activeIndex = isListVisible && activeTag !== null
    ? suggestions.indexOf(activeTag)
    : -1;

  function selectTag(tag: string) {
    const previousTags = lastCommaIndex === -1
      ? []
      : value
        .slice(0, lastCommaIndex)
        .split(",")
        .map((selectedTag) => selectedTag.trim())
        .filter(Boolean);

    onChange([...previousTags, tag].join(", "));
    setIsOpen(false);
    setActiveTag(null);
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
        aria-controls={isListVisible ? listboxId : undefined}
        aria-expanded={isListVisible}
        aria-haspopup="listbox"
        autoComplete="off"
        id={inputId}
        name="tags"
        onBlur={() => {
          setIsOpen(false);
          setActiveTag(null);
        }}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
          setActiveTag(null);
        }}
        onKeyDown={(event) => {
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length > 0) {
            event.preventDefault();
            const nextIndex = event.key === "ArrowDown"
              ? (activeIndex + 1) % suggestions.length
              : (activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1);
            setIsOpen(true);
            setActiveTag(suggestions[nextIndex]);
          } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            selectTag(suggestions[activeIndex]);
          } else if (event.key === "Escape" || event.key === "Tab") {
            setIsOpen(false);
            setActiveTag(null);
          }
        }}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {isListVisible ? (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag, index) => (
            <li
              aria-selected={index === activeIndex}
              id={`${listboxId}-option-${index}`}
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}