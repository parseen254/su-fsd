"use client";

import { useEffect, useState } from "react";

import { FileItem } from "@/lib/types";

type SortType = "date-asc" | "filename-asc" | "filename-desc";

export default function Home() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [sortType, setSortType] = useState<SortType>("date-asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (sort: SortType) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/data?sort=${sort}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(sortType);
  }, [sortType]);

  const sortOptions = [
    { type: "date-asc" as const, label: "Date (Ascending)" },
    { type: "filename-asc" as const, label: "Filename (Ascending)" },
    { type: "filename-desc" as const, label: "Filename (Descending)" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Files
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all files with their creation dates.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <div className="flex rounded-md shadow-sm">
                {sortOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSortType(option.type)}
                    className={`
                      px-4 py-2 text-sm font-medium
                      ${
                        sortType === option.type
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }
                      border border-gray-300
                      first:rounded-l-md first:border-r-0
                      last:rounded-r-md last:border-l-0
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Filename
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.filename}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
