import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import schedules from "../data/schedules";
import type { Game, TeamName } from "../types/schedule";

const today = new Date();
const year = today.getFullYear();

/**
 * Converts the schedule date/time into a Date object.
 */
const parseDateTime = (dateStr: string, timeStr: string): Date => {
  if (
    dateStr.toUpperCase() === "POSTPONED" ||
    timeStr.toUpperCase() === "POSTPONED"
  ) {
    return new Date(9999, 0, 1);
  }

  const [month, day] = dateStr.split("/").map(Number);

  let [hourStr, minuteStr] = timeStr.split(":");

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Assume PM if AM isn't specified
  if (!timeStr.toLowerCase().includes("am") && hour < 12) {
    hour += 12;
  }

  return new Date(year, month - 1, day, hour, minute);
};

const isHomeGame = (location: string): boolean =>
  location.includes("Dwire Field") || location.includes("Mason Elementary");

const getMapLink = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);

  const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);

  return isAppleDevice
    ? `https://maps.apple.com/?q=${encodedLocation}`
    : `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

const getNextGame = (team: TeamName): Game | null => {
  const games = schedules[team];

  const upcomingGames = games.filter(
    (game) => parseDateTime(game.date, game.time) >= today
  );

  return upcomingGames.length > 0 ? upcomingGames[0] : null;
};

const NextGameCard = ({
  team,
  label,
}: {
  team: TeamName;
  label: string;
}): ReactElement => {
  const nextGame = getNextGame(team);

  return (
    <Link
      to={`/${team}`}
      className={`next-game-card next-game-card-${team}`}
    >
      <h3 className="text-lg font-semibold mb-2">Next Game - {label}</h3>

      {nextGame ? (
        <div className="flex items-center gap-4">
          <img
            src={nextGame.logo}
            alt={nextGame.opponent}
            className="next-game-logo"
          />

          <div>
            <p>
              <strong>{nextGame.game}</strong> - {nextGame.date} at{" "}
              <strong>{nextGame.time}</strong>
            </p>

            <p>vs {nextGame.opponent}</p>

            <p>
              <strong>Location: </strong>

              <a
                href={getMapLink(nextGame.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="location-link"
                onClick={(e) => e.stopPropagation()}
              >
                {nextGame.location}
              </a>
            </p>

            <p
              className={
                isHomeGame(nextGame.location) ? "home-game" : "away-game"
              }
            >
              {isHomeGame(nextGame.location) ? "Home" : "Away"}
            </p>
          </div>
        </div>
      ) : (
        <p>No upcoming games scheduled.</p>
      )}
    </Link>
  );
};

export default function Home(): ReactElement {
  return (
    <div className="home">
      <div className="home-hero">
        <img
          src="https://cdn1.sportngin.com/attachments/logo_graphic/ff67-141939651/Mason_Football_Logo_medium.png"
          alt="Mason Middle School Football Logo"
          className="home-logo"
        />

        <h1>Mason Middle School Football</h1>
        <p>8th Grade Green &amp; White</p>
      </div>

      <div className="home-next-games">
        <NextGameCard team="green" label="Green" />
        <NextGameCard team="white" label="White" />
      </div>

      <div className="home-cards">
        <Link to="/green" className="home-card home-card-green">
          <h2>8th Grade Green</h2>
          <p>Schedule, scores &amp; game film</p>
        </Link>

        <Link to="/white" className="home-card home-card-white">
          <h2>8th Grade White</h2>
          <p>Schedule, scores &amp; game film</p>
        </Link>

        <Link to="/roster" className="home-card home-card-grey">
          <h2>Roster</h2>
          <p>Full team roster</p>
        </Link>
      </div>
    </div>
  );
}
