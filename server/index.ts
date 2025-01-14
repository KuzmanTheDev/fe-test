import { createServer, Response } from "miragejs";

// Helper functions for data persistence
const Storage = {
  saveMatch: (matchData) => {
    localStorage.setItem("match_data", JSON.stringify(matchData));
  },

  getMatch: () => {
    return JSON.parse(localStorage.getItem("match_data") || "null");
  },

  clearMatch: () => {
    localStorage.removeItem("match_data");
  },
};

// Pre-configured teams data
const TEAMS = [
  {
    id: "IND",
    name: "India",
    players: [
      { id: "IND1", name: "Rohit Sharma", role: "Batsman" },
      { id: "IND2", name: "Virat Kohli", role: "Batsman" },
      { id: "IND3", name: "Jasprit Bumrah", role: "Bowler" },
      { id: "IND4", name: "Ravindra Jadeja", role: "All-rounder" },
      { id: "IND5", name: "Rishabh Pant", role: "Wicketkeeper" },
      { id: "IND6", name: "KL Rahul", role: "Batsman" },
      { id: "IND7", name: "Mohammed Shami", role: "Bowler" },
      { id: "IND8", name: "Shikhar Dhawan", role: "Batsman" },
      { id: "IND9", name: "Hardik Pandya", role: "All-rounder" },
      { id: "IND10", name: "Yuzvendra Chahal", role: "Bowler" },
      { id: "IND11", name: "Shreyas Iyer", role: "Batsman" },
    ],
  },
  {
    id: "AUS",
    name: "Australia",
    players: [
      { id: "AUS1", name: "David Warner", role: "Batsman" },
      { id: "AUS2", name: "Steve Smith", role: "Batsman" },
      { id: "AUS3", name: "Pat Cummins", role: "Bowler" },
      { id: "AUS4", name: "Glenn Maxwell", role: "All-rounder" },
      { id: "AUS5", name: "Alex Carey", role: "Wicketkeeper" },
      { id: "AUS6", name: "Mitchell Starc", role: "Bowler" },
      { id: "AUS7", name: "Aaron Finch", role: "Batsman" },
      { id: "AUS8", name: "Marcus Stoinis", role: "All-rounder" },
      { id: "AUS9", name: "Adam Zampa", role: "Bowler" },
      { id: "AUS10", name: "Matthew Wade", role: "Wicketkeeper" },
      { id: "AUS11", name: "Josh Hazlewood", role: "Bowler" },
    ],
  },
  {
    id: "ENG",
    name: "England",
    players: [
      { id: "ENG1", name: "Joe Root", role: "Batsman" },
      { id: "ENG2", name: "Ben Stokes", role: "All-rounder" },
      { id: "ENG3", name: "Jofra Archer", role: "Bowler" },
      { id: "ENG4", name: "Jos Buttler", role: "Wicketkeeper" },
      { id: "ENG5", name: "Chris Woakes", role: "All-rounder" },
      { id: "ENG6", name: "Jason Roy", role: "Batsman" },
      { id: "ENG7", name: "Jonny Bairstow", role: "Wicketkeeper" },
      { id: "ENG8", name: "Mark Wood", role: "Bowler" },
      { id: "ENG9", name: "Moeen Ali", role: "All-rounder" },
      { id: "ENG10", name: "Sam Curran", role: "All-rounder" },
      { id: "ENG11", name: "Tom Curran", role: "Bowler" },
    ],
  },
];

export function makeServer() {
  return createServer({
    seeds(server) {
      // Load teams into server.db
      server.db.loadData({
        teams: TEAMS,
      });
    },

    routes() {
      this.namespace = "api";

      // Get all available teams
      this.get("/teams", (schema) => {
        return schema.db.teams;
      });

      // Initialize match with selected teams and toss details
      this.post("/matches", (_, request) => {
        let match;
        try {
          const attrs = JSON.parse(request.requestBody);

          if (!attrs.team1Id || !attrs.team2Id) {
            return new Response(400, {}, { error: "Invalid team selection" });
          }

          match = {
            id: `match_${Date.now()}`,
            team1Id: attrs.team1Id,
            team2Id: attrs.team2Id,
            tossWinner: attrs.tossWinner,
            tossDecision: attrs.tossDecision,
            lastUpdate: Date.now(),
          };
        } catch (e) {
          return new Response(400, {}, { error: "Invalid JSON" });
        }

        Storage.saveMatch(match);
        return match;
      });

      // Get current match state
      this.get("/matches/:id", () => {
        return Storage.getMatch();
      });

      // Key implementation: Update score and handle live updates
      this.put("/matches/:id/score", (schema, request) => {
        const currentMatch = Storage.getMatch();
        const update = JSON.parse(request.requestBody);

        // Example scoring update payload:
        // {
        //   runs: number,
        //   isExtra: boolean,
        //   isWicket: boolean,
        //   // Add any other scoring details
        // }

        if (!currentMatch) {
          return new Response(400, {}, { error: "No active match" });
        }

        // Update match state
        const newState = {
          ...currentMatch,
          // TODO: Update score, wickets, overs based on the scoring input
          lastUpdate: Date.now(),
        };

        Storage.saveMatch(newState);
        return newState;
      });

      // Key implementation: Polling endpoint with optimization
      this.get("/matches/:id/live", (schema, request) => {
        const currentMatch = Storage.getMatch();
        const lastUpdate = parseInt(request.queryParams.lastUpdate || "0");

        // Return 304 if no updates since last poll
        if (currentMatch.lastUpdate <= lastUpdate) {
          return new Response(304, {}, null);
        }

        return currentMatch;
      });
    },
  });
}

// export const makeServer = () => {
//   const server = createServer({
//     routes() {
//       this.namespace = "api";

//       // Endpoint to get the configuration for the form pages
//       this.get("/form-config", () => {
//         const pages = [
//           {
//             title: "Personal Information",
//             fields: [
//               {
//                 name: "fullName",
//                 label: "Full Name",
//                 type: "text",
//                 required: true,
//               },
//               {
//                 name: "gender",
//                 label: "Gender",
//                 options: GENDER_OPTIONS,
//                 required: true,
//               },
//               {
//                 name: "age",
//                 label: "Age",
//                 type: "number",
//                 required: true,
//                 min: 18,
//                 max: 100,
//               },
//             ],
//           },
//           {
//             title: "Professional Information",
//             fields: [
//               {
//                 name: "profession",
//                 label: "Profession",
//                 type: "select",
//                 options: PROFESSION_OPTIONS,
//                 allowCustom: true,
//                 required: true,
//               },
//               {
//                 name: "skills",
//                 options: SKILLS_OPTIONS,
//                 type: "multi-select",
//                 allowCustom: true,
//                 required: false,
//               },
//               {
//                 name: "services",
//                 label: "What services do you need?",
//                 type: "text",
//                 required: false,
//               },
//             ],
//           },
//         ];
//         return {
//           pages,
//           total: pages.length,
//           timeoutMinutes: 30,
//         };
//       });

//       this.post("/submit", (_: unknown, request: { requestBody: string }) => {
//         let attrs: Record<string, unknown>;
//         try {
//           attrs = JSON.parse(request.requestBody);
//         } catch (error) {
//           console.error("Failed to parse JSON:", error);
//           return new Response(400, {}, { message: "Invalid JSON" });
//         }

//         return {
//           success: true,
//           message: "Form submitted successfully",
//           attrs,
//         };
//       });
//     },
//   });
//   return server;
// };
