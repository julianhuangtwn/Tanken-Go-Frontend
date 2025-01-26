// app/community/page.js

export default function Page(){
    return (
      <div style={styles.container}>
        <h1>More Trips</h1>
        <p>Explore more trips for your next trip idea!</p>
      </div>
    );
  };
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
    },
  };
  
  