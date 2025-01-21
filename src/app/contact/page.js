// app/contact  /page.js

export default function Page(){
    return (
      <div style={styles.container}>
        <h1>Contact Us</h1>
        <p>Reach out to us for more information!</p>
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
  
  