import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import {
  useGetTeamsQuery,
  useSubmitMatchesMutation,
} from "../store/matchSlice";
import { Loader } from "./Loader";
import { MatchesPayload } from "../store/types";

export const Match = () => {
  const { data: teams, error, isLoading } = useGetTeamsQuery();
  const [submitMatches] = useSubmitMatchesMutation();

  if (isLoading) return <Loader />;

  if (!teams) {
    return <div>No teams found</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  const team1 = teams[Math.floor(Math.random() * teams.length)];
  const teamsExceptTeam1 = teams.filter((team) => team.id !== team1.id);
  const team2 =
    teamsExceptTeam1[Math.floor(Math.random() * teamsExceptTeam1.length)];

  const tossWinner = Math.random() > 0.5 ? team1.id : team2.id;
  const tossDecision = Math.random() > 0.5 ? "bat" : "bowl";

  const handleSubmitMatch = (payload: MatchesPayload) => {
    if (!team1 || !team2) return;
    submitMatches(payload).then((res) => console.log(res));

    alert("Match setup successfully");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="85%"
      mx="auto"
      bgcolor={"white"}
      color="black"
    >
      <h1>Setup Match</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          handleSubmitMatch({
            team1Id: team1.id,
            team2Id: team2.id,
            tossWinner: tossWinner,
            tossDecision,
          })
        }
      >
        Start Match
      </Button>
    </Box>
  );
};
