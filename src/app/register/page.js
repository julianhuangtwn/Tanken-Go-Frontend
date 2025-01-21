// app/register/page.js

export default function Page(){
    return (
      <div style={styles.container}>
        <h1>Register</h1>
        <p>Join to Tanken-Go and start planning your next trip</p>
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
  
  