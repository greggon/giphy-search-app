import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home(initialData) {
  const [formInputs, setFormInputs] = useState();
  const [searchTerm, setSearchTerm] = useState("cats");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setSearchResults(initialData.catGiphys.data);
  }, [initialData]);

  const handleInputs = (event) => {
    let { name, value } = event.target;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const search = async (event) => {
    event.preventDefault();
    let apiKey = process.env.REACT_APP_GIPHY_API_KEY;
    console.log(apiKey);
    let giphys = await fetch(
      `https://api.giphy.com/v1/gifs/search?q=${formInputs.searchTerm}&api_key=${process.env.REACT_APP_GIPHY_API_KEY}&limit=10`
    );
    giphys = await giphys.json();
    setSearchResults(giphys.data);
    setSearchTerm(formInputs.searchTerm);
  };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <h1>Giphy Search App</h1>

      <form onSubmit={search}>
        <input name="searchTerm" onChange={handleInputs} type="text" required />
        <button>Search</button>
      </form>

      <h1>Search results for: {searchTerm}</h1>

      <div className="giphy-search-results-grid">
        {searchResults.map((each, index) => {
          return (
            <div key="index">
              <h3>{each.title}</h3>
              <img src={each.images.original.url} alt={each.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let catGiphys = await fetch(
    `https://api.giphy.com/v1/gifs/search?q=cats&api_key=${process.env.REACT_APP_GIPHY_API_KEY}&limit=10`
  );
  catGiphys = await catGiphys.json();
  return { props: { catGiphys: catGiphys } };
}
