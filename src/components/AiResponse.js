const AiResponse = ({ response }) => {  
    if (!response.isTripGenerated) {
      return <p className="text-gray-600">{response.message}</p>;
    }
  
   else {
      const { tripName, startDate, endDate, totalCostEstimate, destinations } = response.trip;

      const dateGroupedDest = destinations.reduce((acc, dest) => {
        if (!acc[dest.visit_date]) {
          acc[dest.visit_date] = [];
        }

        acc[dest.visit_date].push(dest)
        return acc;
      }, {})

      const sortedDates = Object.keys(dateGroupedDest).sort();
      
      return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
          {response.message && (
            <div>
              <p>{response.message}</p>  
              <br/>
            </div>
          )}
          <h2 className="text-2xl font-bold">{tripName}</h2>
          <p>
            <strong>Duration:</strong> {startDate} - {endDate}
          </p>
          <p>
            <strong>Estimated Cost:</strong> ${totalCostEstimate}
          </p>
          
          <ul className="list-disc pl-5">
            {sortedDates.map((date, i) => (
              <li key={i}>
                <h3 className="font-bold">{formatDate(date)}</h3>
                <ul>
                  {dateGroupedDest[date].map((dest, j) => (
                    <li key={j} className="list-decimal">
                      <strong>{dest.name}</strong> ({dest.city}) - Category: {dest.category}
                      <p className="text-gray-600">{dest.description}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  
    return <p>The AI tool is not running, please try again later.</p>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",  // Example: "Monday"
      year: "numeric",
      month: "long",    // Example: "February"
      day: "numeric",   // Example: "14"
    });
  };
  
  
  export default AiResponse;