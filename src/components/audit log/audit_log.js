import React from 'react';
import './audit_log.css';


const App = () => {
  return (
    <div className='auditpage'>
        <h1 className='audit-h1'>Audit Log</h1>
        <label className='audit_mail-id_label' for="mail-id">Mail ID</label>
        <input type='text' className='audit_mail-id_input' name='mail-id' id='mail-id' required placeholder='Enter Mail ID'></input>
        <br></br>
        <br></br>
        <label className='audit_actions-label' for="actions">Actions</label>
        <input type='text' className='audit_actions-input' name='actions' id='actions' required placeholder='Enter Actions'></input>
        <br></br>
        <br></br>
        <label className="audit_from-date_label" for="from-date">From</label>
        <input type='date' className='audit_from-date_input' name='from-date' id='from-date' required ></input>
        <label className='audit_to-date_label' for="to-date">To</label>
        <input className='audit_to-date_input' type='date' name='to-date' id='to-date' required ></input>
        <br></br>
        <br></br>
        <button type='button' className='apply-filterbtn'>Apply Filter</button>
        <br></br>
        <table className='audit-table'>
            <tr className='audit-table_header'>
                <th>Mail ID</th>
                <th>User Login</th>
                <th>Actions</th>
            </tr>
            <tr>
                
                <td>sample01@gmail.com</td>
                <td>Company Admin</td>
                <td>Company created on (12/11/2023)</td>
            </tr>
            <tr>
                <td>sample02@gmail.com</td>
                <td>Company Admin</td>
                <td>Company created on (12/11/2023)</td>
            </tr>
            <tr>
                <td>sample03@gmail.com</td>
                <td>Company Admin</td>
                <td>Company created on (12/11/2023)</td>
            </tr>

        </table>


    </div>
  );
};

export default App;