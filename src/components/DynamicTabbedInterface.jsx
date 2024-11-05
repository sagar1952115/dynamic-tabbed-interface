import React, { useState, useEffect } from "react";
import { getDay } from "../utils/date";
import Loader from "./Loader";

const tabs = [
  { id: 1, label: "Node", endpoint: "https://dev.to/api/articles?tag=node" },
  { id: 2, label: "React", endpoint: "https://dev.to/api/articles?tag=react" },
  { id: 3, label: "Redux", endpoint: "https://dev.to/api/articles?tag=redux" },
];

function DynamicTabbedInterface() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { endpoint } = tabs.find((tab) => tab.id === activeTab);
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to load content.");

        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);
  const renderContent = () => {
    if (loading)
      return (
        <div className="loader">
          <Loader />
        </div>
      );
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
      <div>
        <ContentList data={content} />
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-center border-b-2 
                        ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-500 font-bold"
                            : "border-transparent text-gray-500"
                        }
                        hover:text-blue-500 transition duration-300`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4  rounded-lg mt-4">{renderContent()}</div>
    </div>
  );
}

export default DynamicTabbedInterface;

const ContentList = ({ data }) => {
  return (
    <div>
      {data.map((curr, i) => {
        return (
          <div
            key={i}
            className="flex items-center gap-8 pb-5 mb-4 border-b border-grey"
          >
            <div className="w-full">
              <div className="flex items-center gap-2 mb-7">
                <img
                  src={curr?.user?.profile_image}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
                <p className="line-clamp-1 ">
                  {curr?.user?.name} @{curr?.user?.username}
                </p>
                <p className="min-w-fit">{getDay(curr?.published_at)}</p>
              </div>
              <h1 className="blog-title">{curr?.title}</h1>
              <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
                {curr?.description}
              </p>

              <div className="flex gap-4 mt-7">
                <span className="px-4 py-1 btn-light">{curr?.tag_list[0]}</span>
                <span className="flex items-center gap-2 ml-3 text-dark-grey">
                  {" "}
                  <i className="text-xl fi fi-rr-heart"></i>{" "}
                  {curr?.positive_reactions_count}
                </span>
              </div>
            </div>
            {curr?.cover_image && (
              <div className="h-28 aspect-square bg-grey">
                <img
                  src={curr?.cover_image}
                  alt=""
                  className="object-cover w-full h-full aspect-square"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
