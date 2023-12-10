import React, { useState } from 'react';
import axiosClient from '../client/axios-client';
import './SearchItem.css';

const SearchItem = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (searchQuery) => {
        setError(null);
        setLoading(true);

        if (!searchQuery.trim()) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosClient.get(`/adminSearch?query=${searchQuery}`);
            setSuggestions(response.data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Error fetching search results. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        handleSearch(newQuery);
    };

    return (
        <div className="search-container">
            <input
                type="search"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for items..."
            />
            <button disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>
            {query.trim() && !loading && suggestions.length === 0 && (
                <p>No results found</p>
            )}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.id} className="suggestion-item">
                            <div className="details">
                                <h3>{suggestion.item_name}</h3>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SearchItem;
