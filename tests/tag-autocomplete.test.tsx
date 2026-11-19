import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

it("clears the active option and list when the input is cleared", async () => {
  function ControlledAutocomplete() {
    const [value, setValue] = useState("");

    return (
      <TagAutocomplete
        availableTags={["wedding", "wildlife"]}
        label="Tags"
        onChange={setValue}
        value={value}
      />
    );
  }

  const user = userEvent.setup();
  render(<ControlledAutocomplete />);
  const input = screen.getByRole("combobox", { name: "Tags" });

  await user.type(input, "w");
  await user.keyboard("{ArrowDown}");
  expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "wedding" }).id);

  await user.clear(input);
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(input).not.toHaveAttribute("aria-activedescendant");
});

it("selects a matching tag after a comma with a mixed-case query", async () => {
  function ControlledAutocomplete() {
    const [value, setValue] = useState("");

    return (
      <TagAutocomplete
        availableTags={["portrait", "wedding", "wildlife"]}
        label="Tags"
        onChange={setValue}
        value={value}
      />
    );
  }

  const user = userEvent.setup();
  render(<ControlledAutocomplete />);
  const input = screen.getByRole("combobox", { name: "Tags" });

  await user.type(input, "portrait, WI");
  await user.click(screen.getByRole("option", { name: "wildlife" }));

  expect(input).toHaveValue("portrait, wildlife");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

it("closes the suggestions when the query has no matches", async () => {
  function ControlledAutocomplete() {
    const [value, setValue] = useState("");

    return (
      <TagAutocomplete
        availableTags={["portrait", "wedding", "wildlife"]}
        label="Tags"
        onChange={setValue}
        value={value}
      />
    );
  }

  const user = userEvent.setup();
  render(<ControlledAutocomplete />);
  const input = screen.getByRole("combobox", { name: "Tags" });

  await user.type(input, "w");
  expect(screen.getAllByRole("option").length).toBeGreaterThan(0);

  await user.type(input, "zzz");

  expect(input).toHaveValue("wzzz");
  expect(screen.queryByRole("option")).not.toBeInTheDocument();
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});