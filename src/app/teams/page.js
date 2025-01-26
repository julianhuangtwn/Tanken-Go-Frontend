// app/teams/page.js
export default function Page(){
    return (
      <div style={styles.container}>
        <h1>Teams</h1>
        <p>Join our team and start planning your next trip</p>
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
  
  