import { useState } from "react";

function FilterData() {
  const [filterCriteria, setFilterCriteria] = useState({
    country: "",
    degree: "",
    gender: "",
    // add more attributes here
  });
  const [filteredData, setFilteredData] = useState([]);

  const data = [
    { name: "John", country: "USA", degree: "PhD", gender: "Male" },
    { name: "Jane", country: "Canada", degree: "Masters", gender: "Female" },
    { name: "Bob", country: "UK", degree: "Bachelors", gender: "Male" },
    { name: "Mary", country: "Australia", degree: "PhD", gender: "Female" },
  ];

  const handleFilter = () => {
    const filtered = data.filter((item) => {
      return Object.keys(filterCriteria).every((key) => {
        const filterValue = filterCriteria[key].toLowerCase();
        const itemValue = item[key].toLowerCase();
        return filterValue === "" || itemValue === filterValue;
      });
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <h2>Filter Data</h2>
      <div>
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          value={filterCriteria.country}
          onChange={(e) =>
            setFilterCriteria({
              ...filterCriteria,
              country: e.target.value,
            })
          }
        />
      </div>
      <div>
        <label htmlFor="degree">Degree:</label>
        <input
          type="text"
          id="degree"
          value={filterCriteria.degree}
          onChange={(e) =>
            setFilterCriteria({
              ...filterCriteria,
              degree: e.target.value,
            })
          }
        />
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <input
          type="text"
          id="gender"
          value={filterCriteria.gender}
          onChange={(e) =>
            setFilterCriteria({
              ...filterCriteria,
              gender: e.target.value,
            })
          }
        />
      </div>
      <button onClick={handleFilter}>Filter</button>
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
