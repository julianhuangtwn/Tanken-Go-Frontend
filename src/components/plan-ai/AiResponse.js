const showdown = require('showdown')
const markdownConverter = new showdown.Converter({  
  tables: true 
});

const AiResponse = ({ response }) => {  
    if (!response.isTripGenerated) {
      // Renders the converted HTML to the page
      return <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: markdownConverter.makeHtml(response.message) }} />;
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
            <div dangerouslySetInnerHTML={{ __html: markdownConverter.makeHtml(response.message) }} />
          )}
          <h2 className="text-2xl font-bold">{tripName}</h2>
          <p className="text-gray-600">
            {startDate.replaceAll('-', '/')} ~ {endDate.replaceAll('-', '/')}
          </p>
          <p>
            <strong>Estimated Cost:</strong> ${totalCostEstimate}
          </p>
          <br/>
          <hr className="border-black"></hr>          
          <br/>
          
          {sortedDates.map((date, i) => 
            <div key={i} className="flex">
              <div className="border-dotted border-r-4 pr-4"><strong>{date.split('-')[1] + '/' + date.split('-')[2]}</strong></div>
              <div className="ml-4">
                {dateGroupedDest[date].map((dest, j) => (
                  <li key={j} className="list-decimal">
                    <strong>{dest.name}</strong> ({dest.city}) - <strong>Category:</strong> {dest.category}
                    <p className="text-gray-600">{dest.description}</p>
                    <br/>
                  </li>
                ))}
                <hr/>
              </div>
            </div>
          )}      
        </div>
      );
    }
  };

  // const formatDate = (dateString) => {
  //   const months = [
  //     "January", "February", "March", "April", "May", "June",
  //     "July", "August", "September", "October", "November", "December"
  //   ];
    
  //   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
  //   const [year, month, day] = dateString.split("-");
  //   const date = new Date(year, month - 1, day); 
  
  //   return `${daysOfWeek[date.getDay()]}, ${months[month - 1]} ${day}, ${year}`;
  // };
  
  
  export default AiResponse;