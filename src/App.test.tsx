import React from "react";
import { render, screen } from "@testing-library/react";
//import App from "./App";

test("renders learn react link", () => {
  render(<div>Bazinga</div>);
  //render(<App />);
  const linkElement = screen.getByText(/Bazinga/i);
  expect(linkElement).toBeInTheDocument();
});
