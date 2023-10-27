import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-audio-player';

import './styles.css';

const PodcastList = () => {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [loadingShows, setLoadingShows] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedSeasonTitle, setSelectedSeasonTitle] = useState("");
  const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesView, setIsFavoritesView] = useState(false);
  const [sortBy, setSortBy] = useState("title"); // 'title', 'title-desc', 'date-asc', 'date-desc'
  const [filterText, setFilterText] = useState("");
  const [filteredGenre, setFilteredGenre] = useState(null);
  const [favoriteSortBy, setFavoriteSortBy] = useState("title"); // 'title', 'title-desc', 'date-asc', 'date-desc'

  useEffect(() => {
    axios
      .get("https://podcast-api.netlify.app/shows")
      .then((response) => {
        setShows(response.data);
        setLoadingShows(false);
      })
      .catch((error) => {
        console.error("Error fetching shows:", error);
        setLoadingShows(false);
      });
  }, []);

  const loadShowData = (showId) => {
    setLoadingEpisodes(true);
    axios
      .get(`https://podcast-api.netlify.app/shows/${showId}`)
      .then((response) => {
        setSelectedShow(response.data[0]);
        setLoadingEpisodes(false);
      })
      .catch((error) => {
        console.log("Error fetching show data:", error);
        setLoadingEpisodes(false);
      });
  };

  const playEpisode = (episode) => {
    const audioUrl = episode.file;
    setSelectedEpisode(audioUrl);
  };

  const toggleFavorite = (show) => {
    if (favorites.some((favorite) => favorite.id === show.id)) {
      // If the show is already in favorites, remove it
      setFavorites(favorites.filter((favorite) => favorite.id !== show.id));
    } else {
      // If the show is not in favorites, add it
      setFavorites([...favorites, show]);
    }
  };

  // Function to exit the favorites view
  const exitFavoritesView = () => {
    setIsFavoritesView(false);
  };

  const showFavoritesView = () => {
    setIsFavoritesView(true);
  };

  const showSeasonView = (season, title) => {
    setSelectedSeason(season);
    setSelectedSeasonTitle(title);
    setSelectedSeasonEpisodes(
      selectedShow.seasons.find((s) => s.season === season).episodes
    );
  };

  const handleSort = (sortByValue) => {
    setSortBy(sortByValue);
  };

  const handleFavoriteSort = (favoriteSortByValue) => {
    setFavoriteSortBy(favoriteSortByValue);
  };

  const handleFilterTextChange = (text) => {
    setFilterText(text);
    setFilteredGenre(null);
  };

  const handleFilterGenre = (genreId) => {
    setFilteredGenre(genreId === "" ? null : parseInt(genreId));
    setFilterText("");
  };

  // Function to save last listened show and episode
  const saveLastListened = (showId, episodeId) => {
    const lastListened = { showId, episodeId };
    localStorage.setItem("lastListened", JSON.stringify(lastListened));
  };

  // Function to retrieve last listened show and episode
  const getLastListened = () => {
    const lastListened = localStorage.getItem("lastListened");
    return lastListened ? JSON.parse(lastListened) : null;
  };

  // Helper function to format a date as a readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get the title of a genre based on its ID
  const getGenreTitle = (genreId) => {
    switch (genreId) {
      case 1:
        return "Personal Growth";
      case 2:
        return "True Crime and Investigative Journalism";
      case 3:
        return "History";
      case 4:
        return "Comedy";
      case 5:
        return "Entertainment";
      case 6:
        return "Business";
      case 7:
        return "Fiction";
      case 8:
        return "News";
      case 9:
        return "Kids and Family";
      default:
        return "Unknown Genre";
    }
  };

  const filteredShows = shows
    .filter(
      (show) =>
        show.title.toLowerCase().includes(filterText.toLowerCase()) &&
        (!filteredGenre || show.genres.includes(filteredGenre))
    )
    .sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.updated) - new Date(b.updated);
      }
      if (sortBy === "date-desc") {
        return new Date(b.updated) - new Date(a.updated);
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  const filteredFavorites = favorites.sort((a, b) => {
    if (favoriteSortBy === "date-asc") {
      return a.addedAt - b.addedAt;
    }
    if (favoriteSortBy === "date-desc") {
      return b.addedAt - a.addedAt;
    }
    if (favoriteSortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (favoriteSortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <div className="container">
      <h1 className="title">Netflix Clone</h1>
      {isFavoritesView ? (
        <button onClick={exitFavoritesView} className="exit-favorites-button">
          Return to Shows
        </button>
      ) : (
        <button onClick={showFavoritesView}>View Favorites</button>
      )}
      <div className="podcast-list">
        <div className="filters--">
          <label className="sort-label">Sort By: </label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="title">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-asc">Date Updated (Ascending)</option>
            <option value="date-desc">Date Updated (Descending)</option>
          </select>
          <div>
            <label className="search">Search </label>
            <input
              type="text"
              value={filterText}
              onChange={(e) => handleFilterTextChange(e.target.value)}
              className="search-input"
              placeholder="Search"
            />
          </div>
          <div>
            <label>Filter By Genre: </label>
            <select
              value={filteredGenre || ""}
              onChange={(e) => handleFilterGenre(e.target.value)}
              className="genre-select"
            >
              <option value="">All Genres</option>
              <option value="1">Personal Growth</option>
              <option value="2">True Crime and Investigative Journalism</option>
              <option value="3">History</option>
              <option value="4">Comedy</option>
              <option value="5">Entertainment</option>
              <option value="6">Business</option>
              <option value="7">Fiction</option>
              <option value="8">News</option>
              <option value="9">Kids and Family</option>
            </select>
          </div>
        </div>
        {isFavoritesView ? (
          <div className="favorites-view">
            <h2>Your Favorite Shows</h2>
            <div>
              <label>Sort Favorites By: </label>
              <select
                className="sort-select"
                value={favoriteSortBy}
                onChange={(e) => handleFavoriteSort(e.target.value)}
              >
                <option value="title">Show Title (A-Z)</option>
                <option value="title-desc">Show Title (Z-A)</option>
                <option value="date-asc">Added Date (Ascending)</option>
                <option value="date-desc">Added Date (Descending)</option>
              </select>
            </div>
            <ul className="favorites-list">
              {filteredFavorites.map((favorite, index) => (
                <li key={index} className="favorite-item">
                  <p className="favorite-text">Show: {favorite.title}</p>
                  <button
                    onClick={() => toggleFavorite(favorite)}
                    className="favorite-button"
                  >
                    Remove from Favorites
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            {loadingShows ? (
              <p>Loading shows...</p>
            ) : (
              <ul className="show-list">
                {filteredShows.map((show) => (
                  <li key={show.id} className="podcast-item">
                    <img
                      src={show.image}
                      alt={show.title}
                      width="100"
                      height="100"
                    />
                    <button
                      onClick={() => loadShowData(show.id)}
                      className="show-button"
                    >
                      {show.title} ({show.seasons.length} Seasons)
                    </button>
                    <button
                      onClick={() => toggleFavorite(show)}
                      className="favorite-button"
                    >
                      Favorite
                    </button>
                    <p className="show-genres">
                      Genres:{" "}
                      {show.genres
                        .map((genreId) => getGenreTitle(genreId))
                        .join(", ")}
                    </p>
                    <p className="show-updated">
                      Last Updated: {formatDate(show.updated)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {selectedShow && (
              <div>
                <h2 className="selected-show-title">{selectedShow.title}</h2>
                <p className="selected-show-description">
                  {selectedShow.description}
                </p>
                <ul className="season-list">
                  {selectedShow.seasons.map((season, index) => (
                    <li key={index} className="season-item">
                      <img
                        src={season.image}
                        alt={`Season ${season.season}`}
                        width="100"
                        height="100"
                      />
                      <span className="season-title">
                        Season {season.season}: {season.title}
                      </span>
                      <p className="season-episodes">
                        Episodes: {season.episodes.length}
                      </p>
                      <button
                        onClick={() =>
                          showSeasonView(season.season, season.title)
                        }
                        className="season-button"
                      >
                        View Season
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedSeason && (
              <div>
                <button
                  onClick={() => setSelectedSeason("")}
                  className="back-button"
                >
                  Back to Show
                </button>
                <h2 className="selected-season-title">
                  Season {selectedSeason}: {selectedSeasonTitle}
                </h2>
                <ul className="episode-list">
                  {selectedSeasonEpisodes.map((episode, index) => (
                    <li key={index} className="episode-item">
                      <button
                        onClick={() => playEpisode(episode)}
                        className="play-button"
                      >
                        Play Episode {episode.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {selectedEpisode && (
          <AudioPlayer
            src={selectedEpisode}
            autoPlay
            controls
            className="audio-player"
          />
        )}
      </div>
    </div>
  );
};

export default PodcastList;
