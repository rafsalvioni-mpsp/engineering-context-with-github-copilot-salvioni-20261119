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
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-controls={isListVisible ? listboxId : undefined}
        aria-expanded={isListVisible}
        aria-haspopup="listbox"
        autoComplete="off"
        id={inputId}
        name="tags"
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {isListVisible ? (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag) => (
            <li
              aria-selected="false"
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