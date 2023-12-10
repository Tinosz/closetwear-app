import React, { useState } from 'react';
import axiosClient from '../client/axios-client';
import './SearchItem.css';

const SearchItem = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setError(null);
        setResults([]);
    
        if (!query.trim()) {
            return;
        }
    
        try {
            setLoading(true);
            const response = await axiosClient.get(`/adminSearch?query=${query}`);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Error fetching search results. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="search-container">
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for items..."
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {(results.length > 0 || loading) && (
                <ul className="results-list">
                    {results.map((result) => (
                        <li key={result.id} className="result-item">
                            <div className="thumbnail">
                                <img src={result.thumbnailUrl} alt={`Thumbnail for ${result.item_name}`} />
                            </div>
                            <div className="details">
                                <h3>{result.item_name}</h3>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {results.length === 0 && !loading && query.trim() && (
                <p className="no-results">No results found</p>
            )}
        </div>
    );
};

export default SearchItem;
