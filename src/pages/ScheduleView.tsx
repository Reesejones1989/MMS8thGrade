import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import schedules from "../data/schedules";
//import "./ScheduleView.css";

import type {
  Game,
  PlayCard,
  ScheduleViewProps,
} from "../types/schedule";

const ScheduleView = ({ team }: ScheduleViewProps) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showAll, setShowAll] = useState<boolean>(true);
  const [showPlayCards, setShowPlayCards] = useState<boolean>(false);

  const today = new Date();
  const year = today.getFullYear();

  /**
   * Converts the schedule date/time into a Date object.
   */
  const parseDateTime = (
    dateStr: string,
    timeStr: string
  ): Date => {
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

  const hasGameStarted = (game: Game): boolean =>
    parseDateTime(game.date, game.time) <= today;

  const getGameResult = (game: Game): "W" | "L" | "T" | null => {
    if (!game.masonScore || !game.opponentScore) return null;

    const mason = Number(game.masonScore);
    const opponent = Number(game.opponentScore);

    if (Number.isNaN(mason) || Number.isNaN(opponent)) return null;

    if (mason > opponent) return "W";
    if (mason < opponent) return "L";
    return "T";
  };

  const isHomeGame = (location: string): boolean =>
    location.includes("Dwire Field") ||
    location.includes("Mason Elementary");

  const getMapLink = (location: string): string => {
    const encodedLocation = encodeURIComponent(location);

    const isAppleDevice =
      /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);

    return isAppleDevice
      ? `https://maps.apple.com/?q=${encodedLocation}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  const games: Game[] = schedules[team];

  const upcomingGames: Game[] = games.filter(
    (game) => parseDateTime(game.date, game.time) >= today
  );

  const nextGame: Game | null =
    upcomingGames.length > 0 ? upcomingGames[0] : null;

  useEffect(() => {
    if (nextGame) {
      setSelectedGame(nextGame);
    }
  }, [nextGame]);

  const playCards: PlayCard[] =
    selectedGame?.hudl
      ? [
          {
            name: `${selectedGame.opponent} - Full Game Film`,
            videoUrl: selectedGame.hudl,
          },
        ]
      : [];

  const generateICS = (game: Game): string => {
    const start = parseDateTime(game.date, game.time);

    const end = new Date(
      start.getTime() + 2 * 60 * 60 * 1000
    );

    const formatDate = (date: Date): string =>
      date
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${game.opponent} - ${game.game}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
LOCATION:${game.location}
DESCRIPTION:Game against ${game.opponent}
END:VEVENT
END:VCALENDAR`.trim();
  };

  const downloadICS = (game: Game): void => {
    const blob = new Blob([generateICS(game)], {
      type: "text/calendar;charset=utf-8",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${game.opponent.replace(
      /\s+/g,
      "_"
    )}_${game.date}.ics`;

    link.click();
  };

  const getGoogleCalendarURL = (
    game: Game
  ): string => {
    const start = parseDateTime(game.date, game.time);

    const end = new Date(
      start.getTime() + 2 * 60 * 60 * 1000
    );

    const format = (date: Date): string =>
      date
        .toISOString()
        .replace(/[-:]|(\.\d{3})/g, "");

    const dates = `${format(start)}/${format(end)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${game.opponent} - ${game.game}`
    )}&dates=${dates}&details=${encodeURIComponent(
      `Location: ${game.location}`
    )}&location=${encodeURIComponent(game.location)}`;
  };

  return (
    <div className="p-6 schedule-view-container">
      <h2 className="text-xl font-bold mb-4">
        Schedule for 8th Grade{" "}
        {team.charAt(0).toUpperCase() + team.slice(1)}
      </h2>

      <button
        onClick={() =>
          document.body.classList.toggle("dark-mode")
        }
        className="toggle-button"
      >
        Toggle Dark Mode
      </button>

      {nextGame && (
        <div className="next-game-card">
          <h3 className="text-lg font-semibold mb-2">
            Next Game
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={nextGame.logo}
              alt={nextGame.opponent}
              className="next-game-logo"
            />

            <div>
              <p>
                <strong>{nextGame.game}</strong> -{" "}
                {nextGame.date} at{" "}
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
                >
                  {nextGame.location}
                </a>
              </p>

              <p
                className={
                  isHomeGame(nextGame.location)
                    ? "home-game"
                    : "away-game"
                }
              >
                {isHomeGame(nextGame.location)
                  ? "Home"
                  : "Away"}
              </p>
            </div>
          </div>
        </div>
      )}

            {showAll && (
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Date</th>
                <th>Opponent</th>
                <th>Score</th>
                <th>Time</th>
                <th>Location</th>
                <th>Home/Away</th>
                <th>Logo</th>
                <th>Calendar</th>
                <th>Hudl Film</th>
              </tr>
            </thead>

            <tbody>
              {games.map((game, index) => {
                const gameDateTime = parseDateTime(
                  game.date,
                  game.time
                );

                const isPast = gameDateTime < today;

                return (
                  <tr
                    key={index}
                    className={isPast ? "past-game" : ""}
                  >
                    <td data-label="Game">{game.game}</td>

                    <td data-label="Date">{game.date}</td>

                    <td data-label="Opponent">
                      <span className="opponent-value">
                        <img
                          src={game.logo}
                          alt={`${game.opponent} logo`}
                          className="opponent-logo"
                        />
                        {game.opponent}
                      </span>
                    </td>

                    <td data-label="Score" className="score-cell">
                      {hasGameStarted(game) &&
                        game.masonScore &&
                        game.opponentScore && (
                          <>
                            {`${game.masonScore} - ${game.opponentScore}`}{" "}
                            {(() => {
                              const result = getGameResult(game);
                              return result ? (
                                <span
                                  className={`game-result result-${result.toLowerCase()}`}
                                >
                                  {result}
                                </span>
                              ) : null;
                            })()}
                          </>
                        )}
                    </td>

                    <td data-label="Time">{game.time}</td>

                    <td data-label="Location">
                      <a
                        href={getMapLink(game.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="location-link"
                      >
                        {game.location}
                      </a>
                    </td>

                    <td
                      data-label="Home/Away"
                      className={
                        isHomeGame(game.location)
                          ? "home-game"
                          : "away-game"
                      }
                    >
                      {isHomeGame(game.location)
                        ? "Home"
                        : "Away"}
                    </td>

                    <td data-label="Logo" className="logo-cell">
                      <img
                        src={game.logo}
                        alt={`${game.opponent} logo`}
                        className="team-logo"
                      />
                    </td>

                    <td data-label="Calendar">
                      <button
                        className="calendar-btn"
                        onClick={() =>
                          window.open(
                            getGoogleCalendarURL(game),
                            "_blank"
                          )
                        }
                      >
                        Google
                      </button>

                      <button
                        className="calendar-btn"
                        onClick={() => downloadICS(game)}
                      >
                        iCal
                      </button>
                    </td>

                    <td data-label="Hudl Film">
                      {game.hudl && (
                        <button
                          className="hudl-btn"
                          onClick={() =>
                            window.open(
                              game.hudl,
                              "_blank"
                            )
                          }
                        >
                          Watch
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => setShowAll((prev) => !prev)}
        className="toggle-button"
      >
        {showAll
          ? "Hide Full Schedule"
          : "Show Full Schedule"}
      </button>

      <div className="mb-4 flex gap-4 items-center flex-wrap">
        <label htmlFor="gameSelect">
          Select Game:
        </label>

        <select
          id="gameSelect"
          value={selectedGame?.game ?? ""}
          className="p-2 border rounded"
          onChange={(
            e: ChangeEvent<HTMLSelectElement>
          ) => {
            const selected =
              schedules[team].find(
                (game) =>
                  game.game === e.target.value
              );

            setSelectedGame(selected ?? null);
          }}
        >
          <option value="">
            --Choose Game--
          </option>

          {games.map((game, index) => (
            <option
              key={index}
              value={game.game}
            >
              {`${game.game} - ${game.date} vs ${game.opponent}`}
            </option>
          ))}
        </select>
      </div>

            {selectedGame && (
        <div className="mt-6">
          <button
            onClick={() =>
              setShowPlayCards((prev) => !prev)
            }
            className="toggle-button mb-4"
          >
            {showPlayCards
              ? "Hide Hudl Play Cards"
              : "Show Hudl Play Cards"}
          </button>

          {showPlayCards && playCards.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-2">
                Play Cards for: {selectedGame.game} -{" "}
                {selectedGame.date} vs{" "}
                {selectedGame.opponent}
              </h3>

              <div className="playcard-grid">
                {playCards.map((play, index) => (
                  <div
                    key={index}
                    className="playcard"
                    onClick={() =>
                      window.open(
                        play.videoUrl,
                        "_blank"
                      )
                    }
                  >
                    {play.name}
                  </div>
                ))}
              </div>
            </>
          )}

          {showPlayCards &&
            playCards.length === 0 && (
              <p>
                No Hudl film available for this
                game yet.
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
