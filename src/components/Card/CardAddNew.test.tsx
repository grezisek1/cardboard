import { render, fireEvent } from "@testing-library/react";
import { CardAddNew } from "./CardAddNew";
import { vi } from "vitest";

const mockAddCard = vi.fn();
const cardAddNewRenderResult = render(<CardAddNew onAddCard={mockAddCard} />);
const cardAddNew = cardAddNewRenderResult.container.children[0];

describe('CardAddNew', () => {
  // Test if clicking on <CardAddNew /> fires onAddCard handler when component is not disabled
  it("fired onAddCard after click", () => {
    fireEvent.click(cardAddNew);
    expect(mockAddCard).toHaveBeenCalledTimes(1);
  });

  // Test if clicking on <CardAddNew /> fires onAddCard handler when component is disabled
  it("not fired onAddCard after click when disabled", () => {
    (cardAddNew as HTMLFormElement).disabled = true;
    expect(cardAddNew).toBeDisabled();
    
    fireEvent.click(cardAddNew);
    expect(mockAddCard).toHaveBeenCalledTimes(1);
  });
});
