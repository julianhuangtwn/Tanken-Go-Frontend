// app/privacy/page.js

export default function Page(){
    return (
      <div style={styles.container}>
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us.</p>
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
  
  