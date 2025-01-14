import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Team } from "./types";

// Define a service using a base URL and expected endpoints
export const matchApi = createApi({
  reducerPath: "formApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
      query: () => `/teams`,
    }),
    submitMatches: builder.mutation({
      query: (match) => ({
        url: "/matches",
        method: "POST",
        body: match,
      }),
    }),
  }),
});

export const { useGetTeamsQuery, useSubmitMatchesMutation } = matchApi;

export interface MatchState {
  team1Id: string;
  team2Id: string;
  tossWinner: string; // team id
  tossDecision: "bat" | "bowl";
}

const initialState: MatchState = {
  team1Id: "",
  team2Id: "",
  tossWinner: "", // team id
  tossDecision: "bat",
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
// export const { prev, next, setForm, clearForm } = matchSlice.actions;

export default matchSlice.reducer;
