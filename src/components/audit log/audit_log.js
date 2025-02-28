import React from 'react';
import './audit_log.css';


const App = () => {
  return (
    <div className='auditpage'>
        <h1 className='audit-h1'><center>Audit Log</center></h1>
        <label className="audit-mail-id_label" for="mail-id">Mail ID</label>
        <input className="audit-mail-id_input" type='text' name='mail-id' id='mail-id' required placeholder='Enter Mail ID'></input>
        <label className="audit-actions_label" for="actions">Actions</label>
        <input className="audit-actions_input" type='text' name='actions' id='actions' required placeholder='Enter Actions'></input>
        <label className="audit-from-date_label" for="from-date">From</label>
        <input type='date' className='audit-from-date_input' name='from-date' id='from-date' required ></input>
        <br></br>
        <label className='audit-to-date_label' for="to-date">To</label>
        <input className='audit-to-date_input' type='date' name='to-date' id='to-date' required ></input>
        <br></br>
        <br></br>
        <button type='button' className='apply-filterbtn'>Apply Filter</button>
        <br></br>
        <table className='audit-table'>
            <tr className='audit-table-header'>
                <th className='audit-table-th'>Mail ID</th>
                <th className='audit-table-th'>User Login</th>
                <th className='audit-table-th'>Actions</th>
            </tr>
        </table>
    </div>
  );
};

export default App;