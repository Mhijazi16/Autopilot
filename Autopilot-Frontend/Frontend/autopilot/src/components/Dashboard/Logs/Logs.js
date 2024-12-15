import './Logs.css';


const Logs = () => {



    return (
        <>
        <h2 className='logs-title'>Logging</h2>
        <div className="logs">
            <div className='logs-header'>
                Terminal
            </div>
            <div className='logs-body'>
                <div className='logs-text'>
                <h1>Logs Section</h1>
                <h2>Example Logs:</h2>
                
                <div>
                  <span style={{ color: 'green' }}><strong>[INFO]</strong>: Operation completed successfully.</span>
                </div>
                
                <div>
                  <span style={{ color: 'red' }}><strong>[ERROR]</strong>: Something went wrong!</span>
                  <p>Error: Failed to connect to the server. Please check the network.</p>
                </div>
                
                <div>
                  <span style={{ color: 'orange' }}><strong>[WARNING]</strong>: Potential issue detected.</span>
                  <p>Warning: Low disk space. Consider freeing up space.</p>
                </div>
                
                <div>
                  <span style={{ color: 'blue' }}><strong>[DEBUG]</strong>: Debugging info.</span>
                  <p>Debug: Fetching data from the database with query parameters.</p>
                </div>


                </div>
            </div>
        </div>
        </>
    );
}



export default Logs;