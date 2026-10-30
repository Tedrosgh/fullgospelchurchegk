import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Mezmur from "./Mezmur";

jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("../../actions/postsActions", () => ({ getMezmurs: jest.fn(), deleteMezmurAction: jest.fn() }));

const songs = Array.from({ length: 65 }, (_, index) => ({ _id: String(index + 1), title: `Song ${String(index + 1).padStart(2, "0")}`, artist: "Choir" }));

beforeEach(() => {
  useDispatch.mockReturnValue(jest.fn());
  useSelector.mockImplementation((select) => select({ mezmurReducer: { items: songs, loading: false, error: "" } }));
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { callback(); return 1; });
});

afterEach(() => jest.restoreAllMocks());

const setup = () => {
  const history = createMemoryHistory({ initialEntries: ["/mezmur"] });
  render(<ThemeProvider theme={createTheme()}><Router history={history}><Switch>
    <Route path="/mezmur" exact><Mezmur /></Route>
    <Route path="/mezmur/:id"><div>Song lyrics</div></Route>
  </Switch></Router></ThemeProvider>);
  return history;
};

test("shows 30 songs with working pagination above and below the list", () => {
  setup();
  expect(screen.getAllByRole("link", { name: /^View Song/ })).toHaveLength(30);
  expect(screen.queryByText("Song 31")).not.toBeInTheDocument();
  const bottom = screen.getByRole("navigation", { name: "Bottom song pages" });
  fireEvent.click(within(bottom).getByRole("button", { name: "Go to page 3" }));
  expect(screen.getAllByRole("link", { name: /^View Song/ })).toHaveLength(5);
  expect(screen.getByText("Song 61")).toBeInTheDocument();
  const top = screen.getByRole("navigation", { name: "Top song pages" });
  fireEvent.click(within(top).getByRole("button", { name: "Go to previous page" }));
  expect(screen.getByText("Song 31")).toBeInTheDocument();
});

test("returning from a song restores the search, page, and saved scroll position", () => {
  const history = setup();
  fireEvent.change(screen.getByLabelText("Search by title or artist"), { target: { value: "Song" } });
  fireEvent.click(within(screen.getByRole("navigation", { name: "Top song pages" })).getByRole("button", { name: "Go to page 2" }));
  Object.defineProperty(window, "scrollY", { configurable: true, value: 640 });
  fireEvent.click(screen.getByRole("link", { name: "View Song 40" }));
  expect(screen.getByText("Song lyrics")).toBeInTheDocument();
  act(() => history.goBack());
  expect(screen.getByLabelText("Search by title or artist")).toHaveValue("Song");
  expect(screen.getByText("Song 40")).toBeInTheDocument();
  expect(screen.queryByText("Song 01")).not.toBeInTheDocument();
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 640, left: 0, behavior: "auto" });
  fireEvent.change(screen.getByLabelText("Search by title or artist"), { target: { value: "Song 01" } });
  expect(screen.getByText("Song 01")).toBeInTheDocument();
  expect(screen.queryByText("Song 40")).not.toBeInTheDocument();
});
