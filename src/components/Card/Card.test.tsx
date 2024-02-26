import { render, fireEvent } from "@testing-library/react";
import { Card } from "./Card";
import { vi } from "vitest";

const mockUpdateCard = vi.fn();
const cardRenderResult = render(<Card id={0} content={""} createdAt="" onUpdateCard={mockUpdateCard}/>);
const card = cardRenderResult.container.children[0];

describe("Card editor", () => {
  let formRef: HTMLFormElement | null;

  // Test if clicking on <Card /> enters edit mode
  it("entered edit mode after click", () => {
    fireEvent.click(card);
    formRef = card.querySelector("form");
    expect(formRef).not.toBeFalsy();
  });

  // Test if value on textarea is being set when firing change event in edit mode
  it("fired onUpdateCard after close", () => {
    if (formRef === null) {
      throw new Error("<Card>'s form must exist at this point of user input testing");
    }

    expect(formRef.elements.length).toBeGreaterThan(0);

    const value = "123";
    fireEvent.change(formRef.elements[0], { target: { value } });
    expect((formRef.elements[0] as HTMLFormElement).value).toBe(value);
  });

  // Test if clicking outside edit mode exits edit mode
  it("left edit mode after click outside", () => {
    expect(card.contains(cardRenderResult.baseElement)).toBeFalsy();

    fireEvent.click(cardRenderResult.baseElement);
    formRef = card.querySelector("form");
    expect(formRef).toBeFalsy();
  });

  // Test if onUpdateCard is being fired when exiting edit mode
  it("fired onUpdateCard leaving edit mode", () => {
    expect(mockUpdateCard).toHaveBeenCalledTimes(1);
  });
});

