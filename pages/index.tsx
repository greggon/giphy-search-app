import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Home(initialData) {
  const [formInputs, setFormInputs] = useState();
  const [searchTerm, setSearchTerm] = useState("cats");
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = process.env.REACT_APP_GIPHY_API_KEY;

  useEffect(() => {
    setSearchResults(initialData.catGiphys.data);
  }, [initialData]);

  const handleInputs = (event) => {
    let { name, value } = event.target;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const search = async (event) => {
    event.preventDefault();
    console.log(apiKey);
    let giphys = await fetch(
      `https://api.giphy.com/v1/gifs/search?q=${formInputs.searchTerm}&api_key=${process.env.REACT_APP_GIPHY_API_KEY}&limit=10`
    );
    giphys = await giphys.json();
    setSearchResults(giphys.data);
    setSearchTerm(formInputs.searchTerm);
  };

  return (
    <>
      <div className="container">
        <Head>
          <title>Giphy Search App</title>
          <meta
            name="description"
            content="Love giphys? We do too. Use our advanced giphy search to find the perfect giphy for any occation"
          ></meta>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/styles.css" />
        </Head>

        {/* <div className="logo-container">
          <Image src="/logo.png" alt="logo" unsized />
        </div> */}

        <h1>Giphy Search App</h1>

        <form onSubmit={search}>
          <input
            name="searchTerm"
            onChange={handleInputs}
            type="text"
            required
          />
          <button>Search</button>
        </form>

        <h1>Search results for: {searchTerm}</h1>

        <Link href="/search/[pid]" as={`/search/${searchTerm}`}>
          {`http://localhost:3000/search/${searchTerm}`}
        </Link>

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
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  let catGiphys = await fetch(
    `https://api.giphy.com/v1/gifs/search?q=cats&api_key=${process.env.REACT_APP_GIPHY_API_KEY}&limit=10`
  );
  catGiphys = await catGiphys.json();
  return { props: { catGiphys: catGiphys } };
}
