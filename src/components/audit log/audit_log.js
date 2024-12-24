import React from 'react';
import './audit_log.css';


const App = () => {
  return (
    <div className='auditpage'>
        <h1>Audit Log</h1>
        <label for="mail-id">Mail ID</label>
        <input type='text' name='mail-id' id='mail-id' required placeholder='Enter Mail ID'></input>
        <br></br>
        <br></br>
        <label for="actions">Actions</label>
        <input type='text' name='actions' id='actions' required placeholder='Enter Actions'></input>
        <br></br>
        <br></br>
        <label className="from-date" for="from-date">From</label>
        <input type='date' name='from-date' id='from-date' required ></input>
        <label className='to-date' for="to-date">To</label>
        <input className='audit-input' type='date' name='to-date' id='to-date' required ></input>
        <br></br>
        <br></br>
        <button type='button' className='apply-filterbtn'>Apply Filter</button>
        <br></br>
        <table className='audit-table'>
            <tr>
                <th>Mail ID</th>
                <th>User Login</th>
                <th>Actions</th>
            </tr>
            <tr>
                
                <th>sample01@gmail.com</th>
                <th>Company Admin</th>
                <th>Company created on (12/11/2023)</th>
            </tr>
            <tr>
                <th>sample02@gmail.com</th>
                <th>Company Admin</th>
                <th>Company created on (12/11/2023)</th>
            </tr>
            <tr>
                <th>sample03@gmail.com</th>
                <th>Company Admin</th>
                <th>Company created on (12/11/2023)</th>
            </tr>

        </table>


    </div>
  );
};

export default App;