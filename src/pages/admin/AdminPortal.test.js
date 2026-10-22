import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AdminPortal from "./AdminPortal";
import { fetchMyPortalAccess } from "../../api/api";

jest.mock("../../api/api", () => ({ fetchMyPortalAccess: jest.fn() }));
jest.mock("../finanz/Finanz", () => () => <div>Finance</div>);
jest.mock("../finanz/UserManagement", () => () => null);
jest.mock("./AnnouncementManagement", () => () => null);
jest.mock("./ProfileManagement", () => () => null);
jest.mock("./HomePageManagement", () => () => null);
jest.mock("../mezmur/Add_new_mezmur", () => () => <div>Song title and lyrics form</div>);
jest.mock("../mezmur/Mezmur", () => {
  const { Link } = require("react-router-dom");
  return ({ canDelete }) => <div><Link to="/admin/mezmur/song-1/edit">Edit song</Link>{canDelete && <button>Delete song</button>}</div>;
});

test("a worship editor can navigate from the song list to the edit form", async () => {
  fetchMyPortalAccess.mockResolvedValue({ data: { isAdmin: false, teams: { worship: "editor" } } });
  render(<MemoryRouter initialEntries={["/admin"]}><AdminPortal /></MemoryRouter>);

  fireEvent.click(await screen.findByText("Edit song"));

  expect(await screen.findByText("Song title and lyrics form")).toBeInTheDocument();
  expect(screen.queryByText("Finance")).not.toBeInTheDocument();
});

test.each([["editor", false], ["manager", true]])("worship %s delete permission matches its role", async (role, canDelete) => {
  fetchMyPortalAccess.mockResolvedValue({ data: { isAdmin: false, teams: { worship: role } } });
  render(<MemoryRouter initialEntries={["/admin"]}><AdminPortal /></MemoryRouter>);
  await screen.findByText("Edit song");
  expect(Boolean(screen.queryByText("Delete song"))).toBe(canDelete);
});
