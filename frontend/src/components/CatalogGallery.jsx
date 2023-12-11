import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import axiosClient from "../client/axios-client";

import "./styles/Catalog.css";
import { useParams } from "react-router-dom";

import useSearch from "../page-groups/useSearch";
import SearchBar from "./SearchBarSuggest";

import "./styles/Catalog.css"; // Add your custom styles

export default function CatalogGallery() {
  const { filteredData, handleFilter } = useSearch();
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    handleFilter(searchWord);
  }, [searchWord, handleFilter]);


    const { id, bannerId } = useParams();
    const [pagination, setPagination] = useState({});
    const [items, setItems] = useState([]); // Add this line to define the 'items' state
    const getItems = (page = 1) => {
        axiosClient.get(`itemsPaginated?page=${page}`).then((response) => {
            console.log(response.data);
            setItems(response.data.data);
            setPagination(response.data);
        }).catch(() => {

        }).finally(()=> {

        });
    };

  const getCategoryItems = (page = 1) => {
    axiosClient
      .get(`/items/search-by-category/${id}?page=${page}`)
      .then((response) => {
        setItems(response.data.data);
        setPagination(response.data);
        applyAOS();
      })
      .catch(() => {
        // Handle error
      });
  };

    const getRelatedBanners = (page = 1) => {
        axiosClient
            .get(`/banners/${bannerId}/related-items?page=${page}`)
            .then((response) => {
                setItems(response.data.data);
                console.log(response.data);
                setPagination(response.data)
            })
            .catch(() => {})
            .finally(() => {
                //
            });
    };

    useEffect(() => {
        if (id) {
            getCategoryItems();
        } else if(bannerId){
            getRelatedBanners();
        } else {
            getItems();
        }
    }, [id]); // Include 'id' as a dependency here

  const onPageChange = (label) => {
    let page;
    switch (label) {
      case "Next &raquo;":
        page = pagination.current_page + 1;
        break;
      case "&laquo; Previous":
        page = pagination.current_page - 1;
        break;
      default:
        page = parseInt(label);
        break;
    }
    getItems(page);
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const ImageCard = ({ imageSrc, title, description, tags }) => (
    <div className="image-card">
      <img className="image" src={imageSrc} alt={title} />
      <div className="content">
        <div className="title">{title}</div>
        <div className="price">Rp. 12,000</div>
      </div>
      <div className="tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const ImageGallery = () => (
    <div className="image-gallery">
      {filteredData.map((item) => (
        <div className="image-card">
          <ImageCard
            key={item.id}
            imageSrc={`${import.meta.env.VITE_API_BASE_URL}/storage/${
              item.images[0].item_image
            }`}
            title={item.item_name}
            tags={item.categories
              .filter((category) => category.id !== 1)
              .slice(0, 3)
              .map((category) => category.category_name)}
          />
        </div>
      ))}
    </div>
  );

  const handleResultItemClick = (itemName) => {
    setSearchWord(itemName);
  };

  return (
    <div className="catalog-container">
      <div className="searchbar">
        <SearchBar
          placeholder="Search"
          value={searchWord}
          onInputChange={(value) => setSearchWord(value)}
        />
        {filteredData.length !== 0 && searchWord !== "" && (
          <div className="data-result">
          {filteredData.slice(0, 15).map((value, index) => {
              return (
                <div
                  className="result-item"
                  key={index}
                  onClick={() => handleResultItemClick(value.item_name)}
                >
                  <div className="result-item-content">
                    <span>{value.item_name}</span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="gallery-container">
        <ImageGallery />
      </div>

      <div className="pagination-container">
        {pagination.links && (
          <ul className="pagination-list">
            {pagination.links.map((link, index) => (
              <li
                key={index}
                className={`page-item ${link.active ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(link.label)}
                  disabled={link.url === null}
                  style={{
                    opacity: link.url === null ? 0.5 : 1,
                  }}
                >
                  {link.label === "&laquo; Previous"
                    ? "Previous"
                    : link.label === "Next &raquo;"
                    ? "Next"
                    : link.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
