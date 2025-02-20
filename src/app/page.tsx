// app/page.tsx

'use client';

import { useState, useEffect } from 'react';

type SortType = 'DASC' | 'FASC' | 'FDESC';

interface Item {
  date: string;
  filename: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [sortType, setSortType] = useState<SortType>('DASC');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api', {
          headers: {
            sortType: sortType,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setItems(data.parsedData);
        }
      } catch (e: any) {
        setError(e.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sortType]);

  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">File List</h1>
        <Dropdown onSortChange={handleSortChange} />
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white text-black rounded-lg shadow-md p-4">
              <p>
                <strong>Date:</strong> {item.date}
              </p>
              <p>
                <strong>Filename:</strong> {item.filename}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DropdownProps {
  onSortChange: (sortType: SortType) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="false"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          Sort By
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <button
              className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-0"
              onClick={() => {
                onSortChange('DASC');
                setIsOpen(false);
              }}
            >
              Date Ascending
            </button>
            <button
              className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-1"
              onClick={() => {
                onSortChange('FASC');
                setIsOpen(false);
              }}
            >
              Filename Ascending
            </button>
            <button
              className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-2"
              onClick={() => {
                onSortChange('FDESC');
                setIsOpen(false);
              }}
            >
              Filename Descending
            </button>
          </div>
        </div>
      )}
    </div>
  );
};